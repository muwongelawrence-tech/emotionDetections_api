const winston = require("winston");

module.exports = function (err, req, res, next) {
  winston.log("error", err.message);
  res
    .status(500)
    .send(
      ` ${err.message} : Something Failed due to failure to provide one of the required fields...`
    );
};
