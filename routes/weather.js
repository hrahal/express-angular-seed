"use strict";

var config = require('config'),
    request = require('request'),
    logger = require('winston'),
    debug = require('debug')('weather'),
    base = config.get('api.url');

/* GET weather listing. */

exports.today = function (req, res, next) {
    var params = req.query;

    if (!params.city) {
        debug("missing city param");
        console.log("missing city param");
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
                logger.error(err);
                res.send(err);
            } else if (response.statusCode !== 200) {
                logger.error(err);
                res.send(body);
            } else {
                var data = JSON.parse(body);

                res.send({
                    success: true,
                    data: data
                });
            }
        });
    }
};
