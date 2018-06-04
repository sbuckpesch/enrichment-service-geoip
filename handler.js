const AWS = require('aws-sdk');
const util = require('util');

/**
 *
 * @param event
 * @return {Promise<*>}
 */
exports.index = async (event) => {
  // Log function input
  const log = require('console-log-level')({
    level : process.env.LOG_LEVEL,
  });
  log.trace(
    'Start "geoip" aggregation service: \n',
    util.inspect(event),
  );

  try {
    if (typeof event.context.ip === 'undefined') {
      throw new Error('IP address not available in event.context');
    }
    const geoip = require('geoip-lite');
    const geo = geoip.lookup(event.context.ip);
    if (geo) {
      event.context.location = {};
      event.context.location.city = geo.city;
      event.context.location.country = geo.country;
      event.context.location.latitude = geo.ll[0];
      event.context.location.longitude = geo.ll[1];
      event.context.location.ll = [geo.ll[1], geo.ll[0]];
      log.debug('Geo location added to event.context: \n', util.inspect(event.context));
    } else {
      log.debug('No Geo data available for the submitted IP.');
    }
    return event;
  } catch (err) {
    // Global error handling
    log.error(`Error processing aggregation: ${err}`);
    throw new Error(err);
  }
};
