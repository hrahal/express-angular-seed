"use strict";

var weather = require('./weather');

module.exports = function (app) {

    app.get('/weather', weather.today);

};
