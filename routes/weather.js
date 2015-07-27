"use strict";

var config = require('config'),
    mongoose = require('mongoose'),
    mode = require('../mongoDB/schema'),
    cityCount = mongoose.model('cityCount'),
    request = require('request'),
    logger = require('winston'),
    debug = require('debug')('weather'),
    base = config.get('api.url');

/* GET weather listing. */
var trace = function (err) {
    debug(err);
    logger.err(err);
};

exports.today = function (req, res, next) {
    var params = req.query;

    if (!params.city) {
        trace("missing city param");
        res.send({
            err: "missing city param"
        });
    } else {
        request({

            url: base + '/weather',
            method: 'GET',
            headers: { "Content-type": "application/json" },
            qs: { 'q': params.city }

        }, function (err, response, body) {

            if (err) {

                trace(err);
                res.send(err);

            } else if (response.statusCode !== 200) {

                trace(err);
                res.send(body);

            } else {

                var data = JSON.parse(body),
                    conditions = {
                        city: params.city
                    },
                    update = {
                        $inc: {
                            count: 1
                        }
                    },
                    options = {
                        upsert : true
                    };

                cityCount.update(conditions, update, options, function (err, doc) {

                    if (err) {
                        trace(err);
                    }

                    debug(doc);
                    res.send({
                        success: true,
                        data: data
                    });
                });
            }
        });
    }
};
