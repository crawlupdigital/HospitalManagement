const { Event, sequelize } = require('../models');

// Fetch aggregated analytics data for the Visual Query builder / Insights dashboard
exports.getInsights = async (req, res, next) => {
  try {
    const { from, to, feature_module, event_type } = req.query;

    const where = {};
    if (from && to) {
        where.created_at = {
            [require('sequelize').Op.between]: [new Date(from), new Date(to)]
        };
    }
    if (feature_module) where.feature_module = feature_module;
    if (event_type) where.event_type = event_type;

    // Daily active usage trend
    const trend = await Event.findAll({
        where,
        attributes: [
            [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: [sequelize.fn('DATE', sequelize.col('created_at'))],
        order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
    });

    // Top features usage
    const topFeatures = await Event.findAll({
        where,
        attributes: [
            'feature_module',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['feature_module'],
        order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
        limit: 10
    });

    res.status(200).json({
        success: true,
        data: {
            trend,
            topFeatures
        }
    });

  } catch (error) {
    next(error);
  }
};
