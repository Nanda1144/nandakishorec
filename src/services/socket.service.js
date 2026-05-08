'use strict';

const { getIO } = require('../socket');
const logger = require('../utils/logger');

/**
 * SocketService — utility for broadcasting real-time events.
 */
class SocketService {
  /**
   * Emit an update event to a specific frontend room.
   * @param {string} frontendSlug - The frontend affected.
   * @param {string} type - The type of update (theme, layout, hero, etc.)
   * @param {object} data - The updated data.
   */
  emitUpdate(frontendSlug, type, data) {
    try {
      const io = getIO();
      const eventName = `${type}:update`;
      
      // Emit to the specific frontend room
      io.to(frontendSlug).emit(eventName, data);
      
      // Also emit a general notification for admins if needed
      io.emit('notification', {
        message: `Frontend "${frontendSlug}" updated: ${type}`,
        timestamp: new Date(),
      });

      logger.info(`Socket event emitted: ${eventName} for ${frontendSlug}`);
    } catch (error) {
      logger.error(`Socket emission failed: ${error.message}`);
    }
  }

  /**
   * Generic broadcast.
   */
  broadcast(event, data) {
    try {
      const io = getIO();
      io.emit(event, data);
    } catch (error) {
      logger.error(`Socket broadcast failed: ${error.message}`);
    }
  }
}

module.exports = new SocketService();
