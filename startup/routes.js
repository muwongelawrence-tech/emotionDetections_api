const root = require('../routes/home');
const cors = require('cors');
const users = require("../routes/users");
const auth = require("../routes/auth");
const items = require("../routes/items");
const error = require("../middleware/error");
const express = require('express');


module.exports =  function(app) {

    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));
    app.use('/',root);
    app.use('/api/auth/register',users);
    app.use('/api/auth/login', auth);
    app.use('/api/items',items);
  
    //Not found route....
    app.use((req , res, next ) => {
        res.status(404).send("<h1> Page  Not Found </h1>");
    });

    // logging error middleware in express...
    app.use(error);
}