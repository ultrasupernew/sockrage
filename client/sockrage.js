function SockRage(_uri, _reference) {

	this.uri = _uri;
	this.reference = _reference;
	this.socket = io(_uri);

	this.set = function(data) {

		var dataEntity = {
		operation : "create",
		reference : this.reference,
		datas : data
		};

		this.socket.emit('reference-listening', dataEntity);
	}

	this.get = function(_id) {

	var dataEntity = {
		_id : _id,
		operation : "getById",
		reference : this.reference
	}

	this.socket.emit('reference-listening', dataEntity);

	}

	this.list = function() {

	var dataEntity = {
		operation : "getAll",
		reference : this.reference
	}

		this.socket.emit('reference-listening', dataEntity);
	}

	this.delete = function(_id) {

	var dataEntity = {
		_id : _id,
		operation : "delete",
		reference : this.reference
	}

		this.socket.emit('reference-listening', dataEntity);
	}

	this.update = function(_id, data) {

		var dataEntity = {
		_id : _id,
		operation : "update",
		reference : this.reference,
		datas : data
		};

		this.socket.emit('reference-listening', dataEntity);
	}

	this.on = function(callback) {
  		this.socket.on(this.reference, callback);
	}

}