// Mock EventTracker for now until Analytics Models are ready
// Real implementation will log to `events` table
const trackEvent = async (data) => {
  try {
    // console.log(`[ANALYTICS EVENT] ${data.category} - ${data.event_type} - ${data.action}`);
    // await Event.create(data);
  } catch (e) {
    console.error('Failed to log analytics event', e);
  }
};

// eventCapture.middleware.js — Auto-captures all API mutations
const eventCapture = () => {
    return async (req, res, next) => {
        const originalJson = res.json.bind(res);
        let oldValues = null;

        // Determine Entity
        let entityType = req.baseUrl.split('/').pop() || 'unknown';

        // For UPDATE/DELETE, we'd normally fetch current state BEFORE the change here if we had the model mapping
        // if (['PUT','PATCH','DELETE'].includes(req.method) && req.params.id) { ... }

        res.json = (data) => {
            // After response, log the event asynchronously
            setImmediate(async () => {
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    await trackEvent({
                        category: 'data_change',
                        event_type: req.method,
                        user_id: req.user?.id || null,
                        user_role: req.user?.role || 'system',
                        entity_type: entityType,
                        entity_id: req.params.id || (data && data.data && data.data.id) || null,
                        action: `Executed ${req.method} on ${entityType}`,
                        old_values: oldValues,
                        new_values: data?.data || req.body,
                        ip_address: req.ip,
                        user_agent: req.headers['user-agent'],
                        page_path: req.headers['x-page-path'] || 'api',
                    });
                }
            });
            return originalJson(data);
        };
        next();
    };
};

module.exports = { eventCapture, trackEvent };
