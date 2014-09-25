##What is SockRage ?

SockRage is a real-time websocket server written in Javascript using NodeJS, based on socket.io.
Sockrage provides real-time CRUD web services accessible from the Sockrage Javascript client library.

**Sockrage provides storage to its real-time services.**

##Setting up server

- Install NodeJS and NPM
- Download / Clone Sockrage here
- Edit config.js and set up your super admin password and running port
- Run npm install in sudo mode
- Run server with command "node server.js"
- Open your web browser and go on http://"server address":"server port"
- Create a project and assign references to this project. 

#####A reference is like a table in the database where you can push and get data. After your created this reference, you'll have to assign it to the SockRage javascript object on the client side (see below)

## Sockrage behind a reverse-proxy (NGINX)

The most common setup is using Sockrage behind a reverse-proxy, like you would do for any other Node instance. The NGINX vhost file is very simple, the only trick it has is that it authorize websocket over the proxy.

```
server {
        listen   80;
        server_name sockrage.test.fr; #The server name
        location / {
                proxy_pass         http://127.0.0.1:3000/; #The address where sockrage is running

		# WebSocket support (nginx 1.4)
        	proxy_http_version 1.1;
        	proxy_set_header Upgrade $http_upgrade;
        	proxy_set_header Connection "upgrade";
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
                root   /var/www/nginx-default;
        }

}
```

Actually NGINX is the most used reverse-proxy for Node instances in terms of performances, but it should work with any other websocket supported reverse-proxy.

##Client side

### Javascript Library

######Installation :

Install via bower :

	bower install sockrage

...Or download the package there : https://github.com/alexzhxin/sockrage-js-client

Simply add socket.io library and SockRage library in your HTML :

	<script type="text/javascript" src="/js/socket.io.js"></script>
	<script type="text/javascript" src="/js/sockrage.js"></script>

Or add the minified file that contains socket.io :

	<script type="text/javascript" src="/js/sockrage.min.js"></script>

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

		console.log(data); //return an array of objects

	});

	//... ...

	sockRage.list();
```

For example with "getById" operation :

```javascript
	sockRage.on("getById", function(data) {

		console.log(data); //return a single object

	});

	//... ...

	sockRage.get("someID");
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


###### Using SockRage as a simple packet emitter :

SockRage can act as a simple packet emitter. You can broadcast objects to reference you want. Here are methods you can use to send objects over websockets :

- Emit
```javascript
	sockRage.emit('your-action-slug', {hello : "bye"});
```

- Broadcast
```javascript
	sockRage.broadcast('your-action-slug', {hello : "bye"});
```

- Emit and Broadcast
```javascript
	sockRage.broadcastAndEmit('your-action-slug', {hello : "bye"});
```

-> To listen, simply use on() function.
```javascript
    sockRage.on('your-action-slug', function() {
        //do something
    });
```

### AngularJS Library

AngularSockr is a library especially for AngularJS. It provides a synchronized array with your data on the server.
Just create an AngularSockr synchronized array, and use our functions to add, update, create or delete data on your array.

Assign your array to the Angular $scope object to inject it to the DOM.

#### Include theses libraries into your HTML page below AngularJS include.

	<script type="text/javascript" src="/js/socket.io.js"></script>
	<script type="text/javascript" src="/js/sockrage.js"></script>
	<script type="text/javascript" src="/js/angularsockr.js"></script>

Or add the minified file that contains socket.io and sockrage :

	<script type="text/javascript" src="/js/angularsockr.min.js"></script>

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

##Optimize performances

#####Disable logging system

Disabling the logging engine logging in Sockrage would improve time responses, server usage and let more storage capabilities to mongoDB.
But if you do that, the statistics tool of Sockrage located in /#/statistics in the dashboard won't work anymore.

To disable it, just set to false the parameter "enable_logging".

```
	enable_logging: false
```
