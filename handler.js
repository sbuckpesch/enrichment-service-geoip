const AWS = require('aws-sdk');

exports.index = async (event) => {
  // Validate the input
  try {
    if (typeof event.context.ip !== 'undefined') {
      throw new Error('IP address not available in event.context');
    }
    const geoip = require('geoip-lite');
    const geo   = geoip.lookup(event.context.ip);
    if (geo) {
      event.context.location           = {};
      event.context.location.city      = geo.city;
      event.context.location.country   = geo.country;
      event.context.location.latitude  = geo.ll[0];
      event.context.location.longitude = geo.ll[1];
      event.context.location.ll        = [geo.ll[1], geo.ll[0]];
    }
    return event;
  } catch (err) {
    // Global error handling
    console.error(`Error processing aggregation: ${err}`);
    return {
      statusCode : 500,
      body       : JSON.stringify({
        message : `Error processing aggregations: ${err}`,
      }),
    };
  }
};
