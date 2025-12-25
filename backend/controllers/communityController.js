import CommunityPost from "../models/CommunityPost.js";
import PostComment from "../models/PostComment.js";
import User from "../models/User.js";

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const posts = await CommunityPost.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    // Get comment counts for all posts
    const postIds = posts.map((post) => post._id);
    const commentCounts = await PostComment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: "$postId", count: { $sum: 1 } } },
    ]);

    // Create a map of postId -> comment count
    const commentCountMap = {};
    commentCounts.forEach((item) => {
      commentCountMap[item._id.toString()] = item.count;
    });

    // Transform to match frontend expectations
    const transformedPosts = posts.map((post) => ({
      id: post._id,
      content: post.content,
      likes: post.likes,
      likedBy: post.likedBy || [],
      commentCount: commentCountMap[post._id.toString()] || 0,
      created_at: post.createdAt,
      user_id: post.userId._id,
      profiles: {
        full_name: post.userId.fullName,
        email: post.userId.email,
      },
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    const post = await CommunityPost.create({
      userId: req.user._id,
      content,
    });

    const populatedPost = await CommunityPost.findById(post._id).populate(
      "userId",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      data: {
        id: populatedPost._id,
        content: populatedPost.content,
        likes: populatedPost.likes,
        created_at: populatedPost.createdAt,
        user_id: populatedPost.userId._id,
        profiles: {
          full_name: populatedPost.userId.fullName,
          email: populatedPost.userId.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like post
// @route   PUT /api/community/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id;
    const hasLiked = post.likedBy && post.likedBy.includes(userId);

    let updatedPost;
    if (hasLiked) {
      // Unlike - remove user from likedBy and decrement likes
      updatedPost = await CommunityPost.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likedBy: userId },
          $inc: { likes: -1 },
        },
        { new: true }
      ).populate("userId", "fullName email");
    } else {
      // Like - add user to likedBy and increment likes
      updatedPost = await CommunityPost.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likedBy: userId },
          $inc: { likes: 1 },
        },
        { new: true }
      ).populate("userId", "fullName email");
    }

    res.json({
      success: true,
      liked: !hasLiked,
      data: {
        id: updatedPost._id,
        content: updatedPost.content,
        likes: updatedPost.likes,
        likedBy: updatedPost.likedBy || [],
        created_at: updatedPost.createdAt,
        user_id: updatedPost.userId._id,
        profiles: {
          full_name: updatedPost.userId.fullName,
          email: updatedPost.userId.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/community/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Allow deletion if user owns the post OR is an admin
    if (
      post.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    await PostComment.deleteMany({ postId: req.params.id });

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post (with nested structure)
// @route   GET /api/community/posts/:id/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const comments = await PostComment.find({ postId: req.params.id })
      .populate("userId", "fullName email")
      .sort({ createdAt: 1 });

    // Build nested comment structure
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment._id.toString(), {
        ...comment.toObject(),
        replies: [],
      });
    });

    // Second pass: build hierarchy
    comments.forEach((comment) => {
      const commentObj = commentMap.get(comment._id.toString());
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString());
        if (parent) {
          parent.replies.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    // Sort root comments by newest first
    rootComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      count: comments.length,
      data: rootComments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/community/posts/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content, parentId } = req.body;

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Determine level based on parent
    let level = 1;
    if (parentId) {
      const parentComment = await PostComment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
      // Max level is 3
      level = Math.min(parentComment.level + 1, 3);
    }

    const comment = await PostComment.create({
      postId: req.params.id,
      userId: req.user._id,
      content,
      parentId: parentId || null,
      level,
    });

    const populatedComment = await PostComment.findById(comment._id).populate(
      "userId",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      data: {
        ...populatedComment.toObject(),
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a comment
// @route   PUT /api/community/comments/:commentId/like
// @access  Private
export const likeComment = async (req, res, next) => {
  try {
    const comment = await PostComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id;
    const hasLiked = comment.likedBy && comment.likedBy.includes(userId);

    let updatedComment;
    if (hasLiked) {
      updatedComment = await PostComment.findByIdAndUpdate(
        req.params.commentId,
        {
          $pull: { likedBy: userId },
          $inc: { likes: -1 },
        },
        { new: true }
      ).populate("userId", "fullName email");
    } else {
      updatedComment = await PostComment.findByIdAndUpdate(
        req.params.commentId,
        {
          $addToSet: { likedBy: userId },
          $inc: { likes: 1 },
        },
        { new: true }
      ).populate("userId", "fullName email");
    }

    res.json({
      success: true,
      liked: !hasLiked,
      data: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/community/comments/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await PostComment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Allow deletion if user owns the comment OR is an admin
    if (
      comment.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete the comment and all its replies
    await PostComment.deleteMany({
      $or: [{ _id: req.params.commentId }, { parentId: req.params.commentId }],
    });

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
