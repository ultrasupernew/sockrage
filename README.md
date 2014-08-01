##What is SockRage ?

SockRage is a real-time websocket server written in Javascript using NodeJS.
Sockrage provides real-time CRUD web services accessible from the Sockrage Javascript client library.

##Setting up server

- Install NodeJS and NPM
- Download / Clone Sockrage here
- Edit config.js and set up your super admin password and running port
- Run npm init in sudo mode
- Run server with command "node server.js"
- Open your web browser and go on http://"server address":"server port"
- Create a project and assign references to this project. 

#####A reference is like a table in the database where you can push and get data. After your created this reference, you'll have to assign it to the SockRage javascript object on the client side (see below)

##Client side

### Javascript Library

Simply add socket.io library and SockRage library in your HTML :

	<script type="text/javascript" src="/js/socket.io.js"></script>
	<script type="text/javascript" src="/js/sockrage.js"></script>

Create an instance of SockRage, and provide a reference you created in the Backend :
```javascript
var sockRage = new SockRage(<sockrage server address>, <your target reference>);
```

######Now listen for data changes :

on(operation, callback) function permits to listen on any operation. Operation can be :

- getAll
- getById
- delete
- create
- update

```javascript
	sockRage.on(operation, function(data) {
		//use data for whatever
	});
```

For example with "getAll" operation :

```javascript
	sockRage.on("getAll", function(data) {

		for(obj in data) {

		    //print it on the DOM
		}

	});

	//... ...

	sockRage.list();
```

You can use sockRage instance to push / get data.

- Push data :
```javascript
	sockRage.set({hello : "world"});
```
- Getting data
```javascript
	sockRage.get(_id);
```
- List all data
```javascript
	sockRage.list();
```
- Update data
```javascript
	sockRage.update(_id, {hello : "bye"});
```
- Delete data
```javascript
	sockRage.delete(_id);
```


### AngularJS Library

AngularSockr is a library especially for AngularJS. It provides a synchronized array with your data on the server.
Just create an AngularSockr synchronized array, and use our functions to add, update, create or delete data on your array.

Assign your array to the Angular $scope object to inject it to the DOM.

#### Include theses libraries into your HTML page below AngularJS include.

	<script type="text/javascript" src="/js/socket.io.js"></script>
	<script type="text/javascript" src="/js/sockrage.js"></script>
	<script type="text/javascript" src="/js/angularsockr.js"></script>


#### Register your module into your controller module or anywhere else. This example is for some standard controller module :

```javascript

    var appControllers = angular.module('appControllers', ['sockRage']);

    appControllers.controller('indexController', ['$scope', '$http', '$AngularSockr',
        function ($scope, $http, $AngularSockr) {

            var ref = new SockRage("http://localhost:3000", "comments"); //Create a reference

            var sync = $AngularSockr(ref); //create a $SockRageAngular instance

            $scope.messages = sync.$asArray(); //assign sync array in a scope property

            $scope.messages.$set({message : "hello world !"}); //add data to synchronized array
            $scope.messages.$delete("someID"); //delete data to synchronized array
            $scope.messages.$update("someID", {message : "I updated this data !"}); //delete data to synchronized array

        }]
    );

```

#####Once you created your synchronized array just use theses method to update, create, delete data :

- Add data to synchronized array
```javascript
	syncArray.$set(data);
```
- Remove data from synchronized array
```javascript
	syncArray.$delete(_id);
```
- Update data of synchronized array
```javascript
	syncArray.$update(_id, newData);
```


