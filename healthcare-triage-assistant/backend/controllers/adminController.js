const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const SymptomReport = require('../models/SymptomReport');

/**
 * Admin Controller
 * Handles admin dashboard and analytics
 */

/**
 * Get all users (admin only)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;

    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

/**
 * Get admin dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Total users
    const totalUsers = await User.countDocuments();
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });

    // Total symptom reports
    const totalReports = await SymptomReport.countDocuments();
    const newReports = await SymptomReport.countDocuments({ createdAt: { $gte: startDate } });

    // Risk level distribution
    const riskDistribution = await SymptomReport.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Emergency cases
    const emergencyCases = await SymptomReport.countDocuments({
      riskLevel: 'emergency',
      createdAt: { $gte: startDate }
    });

    // Most common symptoms
    const commonSymptoms = await SymptomReport.aggregate([
      { $unwind: '$symptoms' },
      {
        $group: {
          _id: '$symptoms',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Audit log summary
    const auditSummary = await AuditLog.aggregate([
      {
        $match: { timestamp: { $gte: startDate } }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          new: newUsers
        },
        reports: {
          total: totalReports,
          new: newReports,
          emergencyCases
        },
        riskDistribution,
        commonSymptoms,
        auditSummary,
        period: `Last ${days} days`
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
};

/**
 * Get all audit logs (admin only)
 */
exports.getAllAuditLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const action = req.query.action;
    const riskLevel = req.query.riskLevel;

    const filter = {};
    if (action) filter.action = action;
    if (riskLevel) filter.riskClassification = riskLevel;

    const logs = await AuditLog.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await AuditLog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total
        }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs'
    });
  }
};

/**
 * Promote user to admin
 */
exports.promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User promoted to admin',
      user
    });
  } catch (error) {
    console.error('Promote user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error promoting user'
    });
  }
};
