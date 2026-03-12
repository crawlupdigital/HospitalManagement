const { emitDashboardUpdate } = require('../utils/emitDashboardUpdate');

const socketEmitter = (eventType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = function (data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Emit dashboard stats update
        emitDashboardUpdate().catch(console.error);

        // Emit specific event
        try {
          const { getIo } = require('../config/socket');
          const io = getIo();
          io.emit(eventType, data?.data || data);
        } catch (e) {
          console.error('socketEmitter specific event error:', e.message);
        }
      }
      return originalJson(data);
    };

    next();
  };
};

module.exports = socketEmitter;
