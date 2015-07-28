"use strict";

var config = require('config'),
    mongoose = require('mongoose'),
    cityCount = mongoose.model('cityCount'),
    request = require('request'),
    logger = require('winston'),
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

                var data = JSON.parse(body),
                    query,
                    update,
                    options;

                if (data.cod === '404') {
                    next(new Error('city not found'));
                } else {

                    query = {
                        city: params.city
                    };
                    update = {
                        $inc: {
                            count: 1
                        }
                    };
                    options = {
                        upsert : true
                    };

                    cityCount.update(query, update, options, function (err) {

                        if (err) {
                            error(err);
                        }

                        res.send({
                            success: true,
                            data: data
                        });
                    });
                }
            }
        });
    }
};


exports.count = function (req, res, next) {
    var params = req.params,
        query;

    if (!params.city) {
        next(new Error('missing param city'));
    } else {
        query = {
            city : params.city
        };
        cityCount.findOne(query, function (err, data) {

            if (err) {
                error(err);
            } else if (!data) {
                next(new Error('city not availabe'));
            } else {

                var doc = {
                    city: data.city,
                    count: data.count
                };

                res.send({
                    success: true,
                    data: doc
                });
            }
        });
    }
};
