angular.module('Task.modules', [
    'EditTask.modules',
])
    .controller('TaskController', function ($scope, TodoListService, $mdDialog, $mdToast) {

        $scope.editDialog = (task, onEditTaskSuccess) => {
            $mdDialog.show({
                scope: $scope,        // use parent scope in template
                preserveScope: true, 
                templateUrl: './components/modals/edit-task.html',
                locals: {task, onEditTaskSuccess},
                controller: function TaskEditController($scope, task) {
                    $scope.taskCopy = _.cloneDeep(task);
                    $scope.tagCopy = '';
                    $scope.showFullScreenSpinner = false;

                    $scope.addTag = () => {
                        $scope.taskCopy.tags.push($scope.tagCopy);
                        $scope.tagCopy = '';
                    }

                    $scope.saveTask = () => {
                        $scope.showFullScreenSpinner = true;
                        TodoListService
                            .updatePartialTask($scope.taskCopy)
                            .then(response => {
                                $scope.showCustomToast(response.data.message);
                                $scope.showFullScreenSpinner = false;
                                $scope.onEditTaskSuccess();
                                $scope.closeDialog()
                            })
                            .catch(error => {
                                $scope.showFullScreenSpinner = false;
                            })
                    }

                    $scope.removeTagCopy = (tagIndex) => {
                        _.remove($scope.taskCopy.tags, (tag, index) => {
                            return tagIndex == index;
                        })
                    }

                    $scope.closeDialog = () => {
                        $mdDialog.hide()
                    }

                },
            });

        };

        $scope.showCustomToast = (message) => {
            $mdToast.show({
                hideDelay: 3000,
                position: 'bottom',
                controller: function ToastCtrl($mdToast, $mdDialog, $document, $scope) {
                    var ctrl = this;
                    var isDlgOpen;
                    ctrl.closeToast = function () {
                        $mdToast.hide()
                    };
                },
                controllerAs: 'ctrl',
                bindToController: true,
                locals: { toastMessage: message },
                templateUrl: './components/toast/toast.html'
            })
        }

        $scope.deleteTask = (idtask) => {
            $scope.deleteTaskCb(idtask)
        }
    })
    .directive('taskComponent', function () {
        return {
            restrict: 'E',
            templateUrl: './components/task/task.html',
            scope: {
                task: '=',
                deleteTaskCb: '&',
                onEditTaskSuccess: '&'
            },
        }
    })
