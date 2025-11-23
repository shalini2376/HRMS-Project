// backend/src/utils/logHelper.js
const { Log } = require('../../models');

async function logAction(req, action, meta = {}) {
  try {
    await Log.create({
      organisationId: req.user.orgId,
      userId: req.user.userId,
      action,
      meta: JSON.stringify(meta),  // Convert object → string for SQLite
    });
  } catch (err) {
    console.error('LogAction error:', err);
  }
}

module.exports = { logAction };
