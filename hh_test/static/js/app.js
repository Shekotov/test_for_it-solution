app = angular.module('app', ['ui.bootstrap', 'ngResource', 'ui.router']);

app.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = "csrftoken";
    $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
});

app.config(function($stateProvider, $urlRouterProvider){


    //$urlRouterProvider.otherwise("/");

    $stateProvider
        .state('task', {
            url: "/",
            templateUrl: "/static/partials/task.html"
        })

        .state('user', {
            url: '/user',
            templateUrl: "static/partials/users.html",
            controller: ['$scope', '$http',
                function( $scope,   $http) {

                    $scope.users = [];
                    $http.get('/api/v1/user/').success(function(data) {
                        $scope.users = data.objects;
                    }).error(function(data, status, headers, config) {
                            if(status==401){
                                window.location = '/admin'
                            }
                    })
                }
            ]
        })

        .state('user.view', {
            url: '/:userId',
            views: {
                '': {
                    templateUrl: "static/partials/users.view.html",
                    controller: ['$scope', '$http', '$stateParams',
                        function( $scope,   $http,   $stateParams) {

//                    $scope.users = [];
//                    $http.get('/api/v1/user/').success(function(data) {
//                        $scope.users = data.objects;
//                    })

                            $scope.selectedUser = {};
                            $http.get('/api/v1/user/'+$stateParams.userId+'/').success(function(data) {
                                $scope.selectedUser = data;
                            }).error(function(data, status, headers, config) {
                            if(status==401){
                                window.location = '/admin'
                            }
                    })
                        }
                    ]
                }
            }
        })
        // Вид для просмотра списка всех автомобилей.
        .state('auto_model', {
            url: '/auto_model',
            templateUrl: "static/partials/auto_models.html",
            controller: ['$scope', '$http',
                function( $scope,   $http) {
                    $scope.auto_models = [];
                    
                    // Получить все автомобили.
                    $scope.updateAll = function() {
                        $http.get('/api/v1/auto_model/').success(function(data, status, headers, config) {
                            $scope.auto_models = data.objects;
                        }).error(function(data, status, headers, config) {
                            if(status==401){
                                window.location = '/admin'
                            }
                        })
                    };

                    $scope.updateAll()
                }
            ]
        })
        // Вид для просмотра выбранного автомобиля.
        .state('auto_model.view', {
            url: '/:auto_modelId',
            views: {
                '': {
                    templateUrl: "static/partials/auto_model.view.html",
                    controller: ['$state', '$scope', '$http', '$stateParams',
                        function($state, $scope,   $http,   $stateParams) {
                            $scope.selectedAutoModel = {};

                            $http.get('/api/v1/auto_model/'+$stateParams.auto_modelId+'/').success(function(data, status, headers, config) {
                                $scope.selectedAutoModel = data;
                            }).error(function(data, status, headers, config) {
                                if(status==401){
                                    window.location = '/admin'
                                }
                            });

                            // Удалить выбранный автомобиль.
                            $scope.delete = function() {
                                if (!confirm("Вы уверены?")) return;

                                $http.delete('/api/v1/auto_model/'+$scope.selectedAutoModel.id+'/').success(function(data, status, headers, config) {
                                    $state.go('auto_model');
                                    $scope.updateAll();
                                }).error(function(data, status, headers, config) {
                                    if(status==401){
                                        window.location = '/admin'
                                    }
                                });
                            };
                        }
                    ]
                }
            }
        })
        // Вид для добавление нового автомобиля.
        .state('auto_model.add', {
            views: {
                '': {
                    templateUrl: "static/partials/auto_model.add.html",
                    controller: ['$state', '$scope', '$http', '$stateParams',
                        function($state, $scope,   $http,   $stateParams) {
                            $scope.auto_model = {}
                            
                            // Добавить новый автомобиль.
                            $scope.submit = function() {
                                var data = JSON.stringify($scope.auto_model);

                                $http.post('/api/v1/auto_model/', data).success(function(data, status, headers, config){
                                    $state.go('auto_model');
                                    $scope.updateAll();
                                }).error(function(data, status, headers, config){
                                    if(status==401){
                                        window.location = '/admin'
                                    }
                                });
                            }
                        }
                    ]
                }
            }
        })
        
        // Вид для редактирования автомобиля.
        .state('auto_model.edit', {
            url: '/:auto_modelId',
            views: {
                '': {
                    templateUrl: "static/partials/auto_model.edit.html",
                    controller: ['$state', '$scope', '$http', '$stateParams',
                        function($state, $scope,   $http,   $stateParams) {
                            $scope.selectedAutoModel = {};
                            
                            $http.get('/api/v1/auto_model/'+$stateParams.auto_modelId+'/').success(function(data, status, headers, config) {
                                $scope.selectedAutoModel = data;
                            }).error(function(data, status, headers, config) {
                                if(status==401){
                                    window.location = '/admin'
                                }
                            });
                            
                            // Отменить изменения.
                            $scope.cancel = function() {
                                $state.go('auto_model');
                            }
                            
                            // Сохранить изменения.
                            $scope.save = function() {
                                var data = JSON.stringify($scope.selectedAutoModel);

                                $http.put('/api/v1/auto_model/'+$scope.selectedAutoModel.id+'/', data).success(function(data, status, headers, config) {
                                    $state.go('auto_model');
                                    $scope.updateAll();
                                }).error(function(data, status, headers, config) {
                                    if(status==401){
                                        window.location = '/admin'
                                    }
                                });
                            };
                        }
                    ]
                }
            }
        })
});

app.run(['$rootScope', function($rootScope) {

}]);
