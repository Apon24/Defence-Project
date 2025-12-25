import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { communityApi } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Send,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Award,
  Leaf,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Reply,
  Trash2,
} from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  parentId?: string | null;
  level: number;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  replies?: Comment[];
}

interface CommunityPost {
  id: string;
  content: string;
  likes: number;
  likedBy?: string[];
  commentCount?: number;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

// CommentItem component for recursive rendering
interface CommentItemProps {
  comment: Comment;
  postId: string;
  level: number;
  user: { id: string; fullName?: string } | null;
  language: string;
  likedComments: Set<string>;
  replyingTo: string | null;
  replyInputs: Record<string, string>;
  postingComment: Set<string>;
  setReplyingTo: (id: string | null) => void;
  setReplyInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  addComment: (postId: string, parentId?: string) => Promise<void>;
  likeComment: (postId: string, commentId: string) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  formatDate: (date: string) => string;
  getInitials: (name: string) => string;
  getRandomGradient: (id: string) => string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  postId,
  level,
  user,
  language,
  likedComments,
  replyingTo,
  replyInputs,
  postingComment,
  setReplyingTo,
  setReplyInputs,
  addComment,
  likeComment,
  deleteComment,
  formatDate,
  getInitials,
  getRandomGradient,
}) => {
  const marginLeft = level > 1 ? `${(level - 1) * 24}px` : "0";
  const canReply = level < 3;
  const isOwner = user?.id === comment.userId._id;

  return (
    <div style={{ marginLeft }} className="mt-3 first:mt-0">
      <div
        className={`p-3 rounded-xl ${
          level === 1
            ? "bg-white dark:bg-gray-800"
            : "bg-gray-100 dark:bg-gray-700/50"
        }`}>
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRandomGradient(
              comment.userId._id
            )} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {getInitials(comment.userId.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800 dark:text-white text-sm">
                {comment.userId.fullName}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(comment.createdAt)}
              </span>
              {level > 1 && (
                <span className="text-xs text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                  {language === "bn" ? `স্তর ${level}` : `Level ${level}`}
                </span>
              )}
            </div>
            <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
              {comment.content}
            </p>

            {/* Comment Actions */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => likeComment(postId, comment._id)}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  likedComments.has(comment._id)
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}>
                <Heart
                  className={`h-3.5 w-3.5 ${
                    likedComments.has(comment._id) ? "fill-current" : ""
                  }`}
                />
                <span>{comment.likes || 0}</span>
              </button>

              {canReply && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment._id ? null : comment._id
                    )
                  }
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-500 transition-colors">
                  <Reply className="h-3.5 w-3.5" />
                  <span>{language === "bn" ? "উত্তর" : "Reply"}</span>
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => deleteComment(postId, comment._id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Reply Input */}
            {replyingTo === comment._id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyInputs[comment._id] || ""}
                  onChange={(e) =>
                    setReplyInputs((prev) => ({
                      ...prev,
                      [comment._id]: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addComment(postId, comment._id);
                    }
                  }}
                  placeholder={
                    language === "bn" ? "উত্তর লিখুন..." : "Write a reply..."
                  }
                  className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white text-xs"
                  autoFocus
                />
                <button
                  onClick={() => addComment(postId, comment._id)}
                  disabled={
                    !replyInputs[comment._id]?.trim() ||
                    postingComment.has(comment._id)
                  }
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs">
                  {postingComment.has(comment._id) ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-2 py-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs">
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l-2 border-green-200 dark:border-green-800 ml-4 pl-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              level={level + 1}
              user={user}
              language={language}
              likedComments={likedComments}
              replyingTo={replyingTo}
              replyInputs={replyInputs}
              postingComment={postingComment}
              setReplyingTo={setReplyingTo}
              setReplyInputs={setReplyInputs}
              addComment={addComment}
              likeComment={likeComment}
              deleteComment={deleteComment}
              formatDate={formatDate}
              getInitials={getInitials}
              getRandomGradient={getRandomGradient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Community = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Comments state
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set()
  );
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loadingComments, setLoadingComments] = useState<Set<string>>(
    new Set()
  );
  const [postingComment, setPostingComment] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadPosts();
  }, [user, navigate]);

  const loadPosts = async () => {
    try {
      const response = await communityApi.getPosts();
      const postsData = response.data || [];
      setPosts(postsData);

      // Set liked posts from database
      if (user?.id) {
        const userLikedPosts = new Set<string>(
          postsData
            .filter((post: CommunityPost) => post.likedBy?.includes(user.id))
            .map((post: CommunityPost) => post.id)
        );
        setLikedPosts(userLikedPosts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim() || !user || posting) return;

    setPosting(true);
    try {
      await communityApi.createPost(newPost);
      setNewPost("");
      loadPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setPosting(false);
    }
  };

  const likePost = async (postId: string) => {
    try {
      const response = await communityApi.likePost(postId);
      const { liked, data } = response;

      // Update local state based on server response
      const newLikedPosts = new Set(likedPosts);
      if (liked) {
        newLikedPosts.add(postId);
      } else {
        newLikedPosts.delete(postId);
      }
      setLikedPosts(newLikedPosts);

      // Update post with new data from server
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, likes: data.likes, likedBy: data.likedBy }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = async (postId: string) => {
    const newExpanded = new Set(expandedComments);

    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      // Load comments if not already loaded
      if (!postComments[postId]) {
        await loadComments(postId);
      }
    }

    setExpandedComments(newExpanded);
  };

  const loadComments = async (postId: string) => {
    const newLoading = new Set(loadingComments);
    newLoading.add(postId);
    setLoadingComments(newLoading);

    try {
      const response = await communityApi.getComments(postId);
      const comments = response.data || [];
      setPostComments((prev) => ({
        ...prev,
        [postId]: comments,
      }));

      // Set liked comments from response
      if (user?.id) {
        const collectLikedComments = (commentList: Comment[]): string[] => {
          let liked: string[] = [];
          commentList.forEach((comment) => {
            if (comment.likedBy?.includes(user.id)) {
              liked.push(comment._id);
            }
            if (comment.replies && comment.replies.length > 0) {
              liked = [...liked, ...collectLikedComments(comment.replies)];
            }
          });
          return liked;
        };
        const userLikedComments = collectLikedComments(comments);
        setLikedComments((prev) => new Set([...prev, ...userLikedComments]));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      const updatedLoading = new Set(loadingComments);
      updatedLoading.delete(postId);
      setLoadingComments(updatedLoading);
    }
  };

  const addComment = async (postId: string, parentId?: string) => {
    const inputKey = parentId || postId;
    const content = parentId
      ? replyInputs[parentId]?.trim()
      : commentInputs[postId]?.trim();
    if (!content) return;

    const newPosting = new Set(postingComment);
    newPosting.add(inputKey);
    setPostingComment(newPosting);

    try {
      const response = await communityApi.addComment(postId, content, parentId);

      if (parentId) {
        // Add reply to parent comment
        setPostComments((prev) => ({
          ...prev,
          [postId]: addReplyToComments(
            prev[postId] || [],
            parentId,
            response.data
          ),
        }));
        setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
        setReplyingTo(null);
      } else {
        // Add new root comment
        setPostComments((prev) => ({
          ...prev,
          [postId]: [response.data, ...(prev[postId] || [])],
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      }

      // Update the comment count in posts state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, commentCount: (post.commentCount || 0) + 1 }
            : post
        )
      );
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      const updatedPosting = new Set(postingComment);
      updatedPosting.delete(inputKey);
      setPostingComment(updatedPosting);
    }
  };

  const addReplyToComments = (
    comments: Comment[],
    parentId: string,
    newReply: Comment
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  const likeComment = async (postId: string, commentId: string) => {
    try {
      const response = await communityApi.likeComment(commentId);
      const { liked, data } = response;

      // Update liked comments set
      const newLikedComments = new Set(likedComments);
      if (liked) {
        newLikedComments.add(commentId);
      } else {
        newLikedComments.delete(commentId);
      }
      setLikedComments(newLikedComments);

      // Update comment in tree
      setPostComments((prev) => ({
        ...prev,
        [postId]: updateCommentInTree(prev[postId] || [], commentId, data),
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const updateCommentInTree = (
    comments: Comment[],
    commentId: string,
    updatedData: Comment
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        return {
          ...comment,
          likes: updatedData.likes,
          likedBy: updatedData.likedBy,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updatedData),
        };
      }
      return comment;
    });
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      // Count the comment and its replies before deleting
      const countToDelete = countCommentAndReplies(
        postComments[postId] || [],
        commentId
      );

      await communityApi.deleteComment(commentId);
      setPostComments((prev) => ({
        ...prev,
        [postId]: removeCommentFromTree(prev[postId] || [], commentId),
      }));

      // Update the comment count in posts state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                commentCount: Math.max(0, (post.commentCount || 0) - countToDelete),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const countCommentAndReplies = (
    comments: Comment[],
    commentId: string
  ): number => {
    for (const comment of comments) {
      if (comment._id === commentId) {
        // Count this comment + all its replies
        return 1 + getTotalCommentCount(comment.replies || []);
      }
      if (comment.replies && comment.replies.length > 0) {
        const count = countCommentAndReplies(comment.replies, commentId);
        if (count > 0) return count;
      }
    }
    return 0;
  };

  const removeCommentFromTree = (
    comments: Comment[],
    commentId: string
  ): Comment[] => {
    return comments
      .filter((comment) => comment._id !== commentId)
      .map((comment) => ({
        ...comment,
        replies: comment.replies
          ? removeCommentFromTree(comment.replies, commentId)
          : [],
      }));
  };

  const getTotalCommentCount = (comments: Comment[]): number => {
    let count = comments.length;
    comments.forEach((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        count += getTotalCommentCount(comment.replies);
      }
    });
    return count;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (language === "bn") {
      if (diffMins < 1) return "এইমাত্র";
      if (diffMins < 60) return `${diffMins} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
      if (diffDays < 7) return `${diffDays} দিন আগে`;
      return date.toLocaleDateString("bn-BD");
    }

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomGradient = (id: string) => {
    const gradients = [
      "from-green-400 to-emerald-500",
      "from-blue-400 to-cyan-500",
      "from-purple-400 to-pink-500",
      "from-orange-400 to-red-500",
      "from-teal-400 to-green-500",
      "from-indigo-400 to-purple-500",
    ];
    const index = id.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-green-600" />
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            {language === "bn"
              ? "কমিউনিটি লোড হচ্ছে..."
              : "Loading community..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Users className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("community.title")}
            </h1>
            <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto">
              {t("community.subtitle")}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{posts.length}</div>
                <div className="text-sm text-green-200">
                  {language === "bn" ? "পোস্ট" : "Posts"}
                </div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {posts.reduce((sum, p) => sum + p.likes, 0)}
                </div>
                <div className="text-sm text-green-200">
                  {language === "bn" ? "লাইক" : "Likes"}
                </div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {new Set(posts.map((p) => p.user_id)).size}
                </div>
                <div className="text-sm text-green-200">
                  {language === "bn" ? "সদস্য" : "Members"}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 -mt-8">
        {/* Create Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRandomGradient(
                user?.id || ""
              )} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
              {user?.fullName ? getInitials(user.fullName) : "?"}
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "আপনার ইকো আইডিয়া শেয়ার করুন... 🌱"
                    : "Share your eco idea... 🌱"
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-0 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white resize-none text-lg placeholder-gray-400"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Leaf className="h-4 w-4 text-green-500" />
                  <span>
                    {language === "bn"
                      ? "আপনার সবুজ ধারণা শেয়ার করুন"
                      : "Share your green ideas"}
                  </span>
                </div>
                <button
                  onClick={createPost}
                  disabled={!newPost.trim() || posting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25">
                  {posting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  <span>{language === "bn" ? "পোস্ট করুন" : "Post"}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          <AnimatePresence>
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                  {language === "bn"
                    ? "প্রথম পোস্ট করুন!"
                    : "Be the first to post!"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  {language === "bn"
                    ? "আপনার পরিবেশবান্ধব আইডিয়া শেয়ার করে কমিউনিটি শুরু করুন।"
                    : "Start the community by sharing your eco-friendly ideas and experiences."}
                </p>
              </motion.div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRandomGradient(
                            post.user_id
                          )} flex items-center justify-center text-white font-bold`}>
                          {post.profiles?.full_name
                            ? getInitials(post.profiles.full_name)
                            : "?"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-white">
                            {post.profiles?.full_name ||
                              (language === "bn"
                                ? "অজানা ব্যবহারকারী"
                                : "Anonymous")}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="mt-4 text-gray-700 dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1">
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        likedPosts.has(post.id)
                          ? "bg-red-50 dark:bg-red-900/20 text-red-500"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                      <Heart
                        className={`h-5 w-5 ${
                          likedPosts.has(post.id) ? "fill-current" : ""
                        }`}
                      />
                      <span className="font-medium">{post.likes}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                        expandedComments.has(post.id)
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-medium">
                        {postComments[post.id]
                          ? getTotalCommentCount(postComments[post.id])
                          : (post.commentCount || 0)}
                      </span>
                      {expandedComments.has(post.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {expandedComments.has(post.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        {/* Add Comment */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRandomGradient(
                                user?.id || ""
                              )} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                              {user?.fullName
                                ? getInitials(user.fullName)
                                : "?"}
                            </div>
                            <div className="flex-1 flex gap-2">
                              <input
                                type="text"
                                value={commentInputs[post.id] || ""}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    addComment(post.id);
                                  }
                                }}
                                placeholder={
                                  language === "bn"
                                    ? "একটি মন্তব্য লিখুন..."
                                    : "Write a comment..."
                                }
                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:text-white text-sm"
                              />
                              <button
                                onClick={() => addComment(post.id)}
                                disabled={
                                  !commentInputs[post.id]?.trim() ||
                                  postingComment.has(post.id)
                                }
                                className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {postingComment.has(post.id) ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Send className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className="max-h-[500px] overflow-y-auto">
                          {loadingComments.has(post.id) ? (
                            <div className="p-6 text-center text-gray-500">
                              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                          ) : postComments[post.id]?.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                              {language === "bn"
                                ? "এখনও কোনো মন্তব্য নেই। প্রথম মন্তব্য করুন!"
                                : "No comments yet. Be the first to comment!"}
                            </div>
                          ) : (
                            <div className="p-2">
                              {postComments[post.id]?.map((comment) => (
                                <CommentItem
                                  key={comment._id}
                                  comment={comment}
                                  postId={post.id}
                                  level={1}
                                  user={user}
                                  language={language}
                                  likedComments={likedComments}
                                  replyingTo={replyingTo}
                                  replyInputs={replyInputs}
                                  postingComment={postingComment}
                                  setReplyingTo={setReplyingTo}
                                  setReplyInputs={setReplyInputs}
                                  addComment={addComment}
                                  likeComment={likeComment}
                                  deleteComment={deleteComment}
                                  formatDate={formatDate}
                                  getInitials={getInitials}
                                  getRandomGradient={getRandomGradient}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">
                {language === "bn"
                  ? "🌿 কমিউনিটি নির্দেশিকা"
                  : "🌿 Community Guidelines"}
              </h3>
              <ul className="space-y-2 text-green-100">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {language === "bn"
                    ? "ইতিবাচক, কার্যকর পরিবেশবান্ধব টিপস শেয়ার করুন"
                    : "Share positive, actionable eco-friendly tips"}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {language === "bn"
                    ? "অন্যদের প্রতি সম্মান ও সহায়তা দেখান"
                    : "Be respectful and supportive of others"}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {language === "bn"
                    ? "সমস্যা নয়, সমাধানে মনোযোগ দিন"
                    : "Focus on solutions, not just problems"}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                  {language === "bn"
                    ? "আপনার টেকসই কার্যকলাপ দিয়ে অন্যদের অনুপ্রাণিত করুন"
                    : "Inspire others with your sustainable actions"}
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
