"use strict";

var config = require('config'),
    request = require('request'),
    debug = require('debug')('weather:log'),
    error = require('debug')('weather:error'),
    base = config.get('api.url');

/* GET weather listing. */

exports.today = function (req, res, next) {
    var params = req.params;

    if (!params.city) {
        next(new Error('missing param city'));
    } else {
        request({

            url: base + '/weather',
            method: 'GET',
            headers: { "Content-type": "application/json" },
            qs: { 'q': params.city }

        }, function (err, response, body) {

            if (err) {

                error(err);
                next(err);

            } else if (response.statusCode !== 200) {

                debug(err);
                next(body);

            } else {

                var data = JSON.parse(body);

                if (data.cod === '404') {
                    next(new Error('city not found'));
                } else {
                    res.send({
                        success: true,
                        data: data
                    });
                }
            }
        });
    }
};

