(function (angular) {
    'use strict';
    var app = angular.module('app', [
        'TodoListModule',
        'TodoList.services',
        'Task.modules',
        'ngMaterial',
        'ngMessages',
        'ngAnimate'
    ]);

    app.controller('AppController',  function ($scope, TodoListService) {
     
    })
   
})(window.angular);