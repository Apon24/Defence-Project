import BlogPost from '../models/BlogPost.js';
import { fetchLatestBlogPosts } from '../services/fetchBlogPosts.js';

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Private
export const getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .sort({ publishedAt: -1 });

    // Transform MongoDB _id to id for frontend compatibility
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author,
      publishedAt: post.publishedAt,
      sourceUrl: post.sourceUrl,
      sourceName: post.sourceName,
      isExternal: post.isExternal,
      excerpt: post.excerpt
    }));

    res.json({
      success: true,
      count: transformedPosts.length,
      data: transformedPosts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Private
export const getBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Transform MongoDB _id to id for frontend compatibility
    const transformedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author,
      publishedAt: post.publishedAt,
      sourceUrl: post.sourceUrl,
      sourceName: post.sourceName,
      isExternal: post.isExternal,
      excerpt: post.excerpt
    };

    res.json({
      success: true,
      data: transformedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = async (req, res, next) => {
  try {
    const { title, content, imageUrl, author } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      imageUrl,
      author
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch blog posts from online sources
// @route   POST /api/blog/fetch
// @access  Private/Admin
export const fetchBlogPosts = async (req, res, next) => {
  try {
    const result = await fetchLatestBlogPosts();
    
    res.json({
      success: true,
      message: `Successfully imported ${result.imported} blog posts`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

