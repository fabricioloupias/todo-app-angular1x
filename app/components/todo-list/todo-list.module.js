angular.module('TodoListModule', [
    'SpinnerFullScreen.modules',
    'Spinner.modules'
]).
    controller('TodoListController', function ($scope, TodoListService, $mdToast) {
        $scope.todoList = [];
        $scope.task = {};
        $scope.tagsAdded = [];
        $scope.titleTask = '';
        $scope.tag = '';
        $scope.showFullScreenSpinner = false;
        $scope.showSpinner = false;
        $scope.filterByDate = false;
        $scope.filterByTitle = true;
        $scope.lastOrderClicked = '';

        var isDlgOpen;

        $scope.addTask = () => {
            $scope.showFullScreenSpinner = true;
            if (!$scope.titleTask)
                return
            task = {
                title: $scope.titleTask,
                tags: $scope.tagsAdded
            }
            TodoListService
                .addTask(task)
                .then(response => {
                    $scope.showCustomToast(response.data.message);
                    $scope.closeModal();
                    $scope.showFullScreenSpinner = false;
                    $scope.clearForm();
                    $scope.fetchTasks();
                })
                .catch(err => {
                    $scope.showFullScreenSpinner = false;
                })
        }

        $scope.fetchTasks = () => {
            $scope.showSpinner = true;
            TodoListService
                .getTodoList()
                .then(response => {
                    $scope.showSpinner = false;
                    $scope.todoList = response.data;
                    if($scope.lastOrderClicked != ''){
                        $scope.executeOrder();
                    }
                })
                .catch(error => {
                    $scope.showSpinner = false;
                })
        }

        $scope.updatePartialTask = (idTask, task) => {
            TodoListService
                .updatePartialTask(idTask, task)
                .then(response => {
                    $scope.showCustomToast(response.data.message)
                    $scope.clearForm();
                })
                .catch(err => {

                })
        }

        $scope.addTag = () => {
            $scope.tagsAdded.push($scope.tag);
            $scope.tag = '';
        }

        $scope.removeTag = (tagIndex) => {
            _.remove($scope.tagsAdded, (tag, index) => {
                return tagIndex == index;
            })
        }

        $scope.handleDeleteTask = (idTask) => {
            $scope.showFullScreenSpinner = true;
            TodoListService
                .deleteTask(idTask)
                .then((response) => {
                    $scope.showCustomToast(response.data.message, response.data.taskDeleted, true)
                    $scope.showFullScreenSpinner = false;
                    $scope.fetchTasks()
                })
                .catch(err => {
                    $scope.showFullScreenSpinner = false;
                })
        }

        $scope.handleEditTaskSuccess = () => {
            $scope.fetchTasks();
        }
        $scope.clearForm = () => {
            $scope.titleTask = '';
            $scope.tagsAdded = [];
        }

        $scope.closeModal = () => {
            $('#addNewTaskModal').modal('hide');
        }

        $scope.undoActionDelete = (task) => {
           $scope.titleTask = task.title;
           $scope.tagsAdded = task.tags;
           $scope.addTask();
        }

        $scope.showCustomToast = (message, task = null, isDeleteAction = false) => {
            $mdToast.show({
                hideDelay: 3000,
                position: 'bottom',
                scope: $scope,
                preserveScope: true,
                controller: function ToastCtrl($mdToast, $mdDialog, $document, $scope) {
                    var ctrl = this;
                    ctrl.keyListenerConfigured = false;
                    ctrl.isDeleteAction = isDeleteAction;

                    ctrl.closeToast = function () {
                        $mdToast.hide()
                    };
                    ctrl.undo = function () {
                        $scope.undoActionDelete(task)
                    };
                },
                controllerAs: 'ctrl',
                bindToController: true,
                locals: { toastMessage: message },
                templateUrl: './components/toast/toast.html'
            })
        }

        $scope.orderByDate = (typeFilter) => {
            $scope.lastOrderClicked = 'createdAt';
            $scope.filterByDate = typeFilter;
            let typeFilterText = typeFilter ? 'desc' : 'asc';
            $scope.todoList = _.orderBy($scope.todoList, ['createdAt'], [typeFilterText])
        }

        $scope.orderByTitle = (typeFilter) => {
            $scope.lastOrderClicked = 'title';
            $scope.filterByTitle = typeFilter;
            let typeFilterText = typeFilter ? 'desc' : 'asc';
            $scope.todoList = _.orderBy($scope.todoList, ['title'], [typeFilterText])
        }
    
        $scope.executeOrder = () => {
            switch ($scope.lastOrderClicked) {
                case 'createdAt':
                    $scope.orderByDate($scope.filterByDate);
                    break;
                case 'title':
                    $scope.orderByTitle($scope.filterByTitle);
                default:
                    break;
            }
        }
        $scope.fetchTasks();

    })
    .directive('todoListComponent', function () {
        return {
            restrict: 'E',
            templateUrl: './components/todo-list/todo-list.html',
        }
    })