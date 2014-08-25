/**
 * SOCKRAGE JAVASCRIPT LIBRARY
 * @param _uri
 * @param _reference
 * @constructor
 */
function SockRage(_uri, _reference) {

    this.uri = _uri;
    this.reference = _reference;
    this.socket = io(_uri);

    /**
     * SET DATA TO SERVER
     * @param data
     */
    this.set = function(data) {

        var dataEntity = {
            operation : "create",
            reference : this.reference,
            datas : data
        };

        this.socket.emit('reference-listening', dataEntity);
    }

    /**
     * GET DATA BY ID FROM SERVER & REF
     * @param _id
     */
    this.get = function(_id) {

        var dataEntity = {
            _id : _id,
            operation : "getById",
            reference : this.reference
        }

        this.socket.emit('reference-listening', dataEntity);

    }

    /**
     * GET ALL DATA FROM SERVER & REF
     */
    this.list = function() {

        var dataEntity = {
            operation : "getAll",
            reference : this.reference
        }

        this.socket.emit('reference-listening', dataEntity);
    }

    /**
     * REMOVE DATA ON REF BY ID
     * @param _id
     */
    this.delete = function(_id) {

        var dataEntity = {
            _id : _id,
            operation : "delete",
            reference : this.reference
        }

        this.socket.emit('reference-listening', dataEntity);
    }

    /**
     * UPDATE DATA ON REF BY ID
     * @param _id
     * @param data
     */
    this.update = function(_id, data) {

        var dataEntity = {
            _id : _id,
            operation : "update",
            reference : this.reference,
            datas : data
        };

        this.socket.emit('reference-listening', dataEntity);
    }

    /**
     * SOCKET.IO LISTENER
     * @param listenFor
     * @param callback
     */
    this.on = function(listenFor, callback) {

        this.socket.on(this.reference, function(data) {

            if (listenFor == data.operation) {

                callback(data.objects);

            }

        });

    }

    /**
     * SOCKET.IO LISTENER
     * @param callback
     */
    this.listen = function(callback) {

        this.socket.on(this.reference, callback);

    }

}