
angular.module('TodoList.services', [
    'Constants.services'
])
    .factory('TodoListService', function ($http, API_URL) {

        const END_POINT = API_URL;
        const todoListService = {};

        todoListService.getTodoList = () => {
            return $http.get(`${END_POINT}/tasks`);
        }

        todoListService.deleteTask = (idTask) => {
            return $http.delete(`${END_POINT}/task/${idTask}`);
        }

        todoListService.addTask = (task) => {
            return $http.post(`${END_POINT}/task`, task);
        }

        todoListService.updatePartialTask = (task) => {
            return $http.put(`${END_POINT}/task/${task._id}`, task);
        }

        return todoListService;
    });
