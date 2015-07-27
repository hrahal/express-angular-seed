"use strict";
/*global app*/

app.controller('LoginCtrl', [
    '$scope',
    '$http',
    function ($scope, $http) {

        //proof of concept
        $http.post('/users/sign_in',
            { user: { email: "heat@test.test", password: "testtesttest" } })
            .success(function (data, status, headers) {
                $http.get('/groups', { 
                    headers: {
                        Authorization:  headers().authorization 
                    }
                }).success(function (data) {
                    console.log(data);
                }).error(function (err) {
                    console.log(err);
                });
            }).error(function (err) {
                console.log(err);
            });
    }]);
