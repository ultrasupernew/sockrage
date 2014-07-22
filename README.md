##What is SockRage ?

SockRage is a real-time websocket server written in Javascript using NodeJS.
Sockrage provides real-time CRUD web services accessible from the Sockrage Javascript client library.

##Setting up server

- Install NodeJS and NPM
- Download Sockrage
- Edit config.js and set up your super admin password and running port
- Run npm init in sudo mode
- Run server with command "node server.js"
- Open your web browser and go on http://"your server address":"your choosen port"
- Create a project and assign references to this project. 

#####A reference is like a table in the database where you can push and retreive data. After your created this reference, you'll have to assign it to the SockRage javascript object (see below)

##Client side

Simply add socket.io library and SockRage library in your HTML :

	<script type="text/javascript" src="/js/socket.io.js"></script>
	<script type="text/javascript" src="/js/sockrage.js"></script>

Create an instance of SockRage, and provide a reference you created in the Backend :
```javascript
var sockRage = new SockRage(<your sockrage server address>, <your target reference>);
```

######Now listen for data changes :

- Listen for data changes
```javascript
	sockRage.on(function(data) {
		//use data for whatever
	});
```
You can now use this instance to push / retreive data.

- Push data :
```javascript
	sockRage.set({hello : "world"});
```
- Getting data
```javascript
	sockRage.get(<reference>);
```
- List all data
```javascript
	sockRage.list();
```
- Update data
```javascript
	sockRage.update(<reference>, {hello : "bye"});
```
- Delete data
```javascript
	sockRage.delete(<reference>);
```



