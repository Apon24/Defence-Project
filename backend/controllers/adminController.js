import User from '../models/User.js';
import QuizAttempt from '../models/QuizAttempt.js';
import BlogPost from '../models/BlogPost.js';
import DailyChallenge from '../models/DailyChallenge.js';
import CommunityPost from '../models/CommunityPost.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
export const getStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const [
      totalUsers,
      totalQuizAttempts,
      totalBlogPosts,
      totalChallenges,
      activeCommunityPosts,
    ] = await Promise.all([
      User.countDocuments(),
      QuizAttempt.countDocuments(),
      BlogPost.countDocuments(),
      DailyChallenge.countDocuments(),
      CommunityPost.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalQuizAttempts,
        totalBlogPosts,
        totalChallenges,
        activeCommunityPosts,
      },
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin stats',
    });
  }
};

// @desc    Get paginated list of users
// @route   GET /api/admin/users
// @access  Admin only
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('email fullName role avatarUrl createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error getting users list:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users list',
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin only
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Allowed values are user, admin',
      });
    }

    // Prevent an admin from changing their own role
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('email fullName role avatarUrl createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
    });
  }
};

