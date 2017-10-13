"use strict";
var app = angular.module("yapp", ["ui.router", "ngAnimate", "ngSanitize","ui.carousel"])
.config(["$stateProvider", "$urlRouterProvider", function(r, t) {
    t.when("/admin", "/admin/overview"), t.otherwise("/login"), r.state("base", {
        "abstract": !0,
        url: "",
        templateUrl: "pages/base.html"
    })
    .state("login", {
        url: "/login",
        parent: "base",
        cache:false,
        templateUrl: "pages/login/login.html",
        controller: "LoginCtrl"
    })
    .state("admin", {
        url: "/admin",
        parent: "base",
        cache:false,
        templateUrl: "pages/admin.html",
        controller: "DashboardCtrl"
    })
    // .state("agentes", {
    //     url: "/agentes",
    //     parent: "admin",
    //     cache:false,
    //     templateUrl: "pages/agentes/templates/agentes.html",
    //     controller: "AgentesCtrl"
    // })
}]);

var API_Path = "http://localhost/protagonbusiness/restapi/v1/index.php"

angular.module("yapp").controller("DashboardCtrl", ["$scope", "$state", function(r, t) {
    r.$state = t
}]);