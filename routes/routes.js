"use strict";

var weather = require('./weather');

module.exports = function (router) {

    //stick to rest api conventions
    router.get('/weather/:city', weather.today);

};
