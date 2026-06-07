const AuditLog = require('../models/AuditLog');

/**
 * Audit Log Controller
 * Handles audit log retrieval and analysis
 */

/**
 * Get user audit logs (own logs)
 */
exports.getUserLogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const action = req.query.action;

    const filter = { userId };
    if (action) filter.action = action;

    const logs = await AuditLog.find(filter)
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
    console.error('Get user logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching logs'
    });
  }
};

/**
 * Get audit log statistics
 */
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Get statistics
    const stats = await AuditLog.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    // Get risk distribution
    const riskStats = await AuditLog.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: startDate },
          riskClassification: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$riskClassification',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats,
        riskStats,
        period: `Last ${days} days`
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};
