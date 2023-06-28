require('express-async-errors');
const express = require('express');
const app = express();
const winston = require("winston");
require("./startup/validation")();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);


// Environment variables and this helps to set the port dynamically....
const port = process.env.PORT || 5008;

const server = app.listen(port, () => {
    winston.info(`SERVER RUNNING and LISTENING ON PORT ${ port }..........`);
});

module.exports = server;


