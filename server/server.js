var express = require('express');
var app = module.exports.app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config');
var io = require('socket.io')(server);
var db = require('mongojs').connect('sockrage');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

//connect to mongodb

mongoose.connect('mongodb://localhost/sockrage', function(err) {
  if (err) { throw err; }
});

//To allow use ObjectId or other any type of _id
var objectId = function (_id) {
    if (_id.length === 24 && parseInt(db.ObjectId(_id).getTimestamp().toISOString().slice(0,4), 10) >= 2010) {
        return db.ObjectId(_id);
    } 
    return _id;
}


var projectsSchema = new mongoose.Schema({
    project_name : String,
    project_description : String,
    created_at : String
});

var projectsModel = mongoose.model('projects', projectsSchema);


var referencesSchema = new mongoose.Schema({
    reference_name : { type: String, index: { unique: true }},
    reference_description : String,
    created_at : String,
    project_id : String,
    project_identifier : String
});

var referencesModel = mongoose.model('references', referencesSchema);


var historySchema = new mongoose.Schema({
    reference_name : String,
    action : String,
    type : String,
    created_at : String
});

var historyModel = mongoose.model('historylogs', historySchema);


/*
  HEADER MIDDLEWARE
*/
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-type, Content-Range, Content-Disposition, Content-Description');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    next();
});


var addToHistory = function(reference_name, action, type) {

    var history = new historyModel({
        reference_name : reference_name,
        action : action,
        type : type,
        created_at : new Date()
    });

    //now create reference
    history.save(function(err) {

        if (err) {console.log(err)}

        console.log("add to history : " + reference_name + " " + action + " " + type);

    });

}


//Function callback
var fn = function (req, res) {
    res.contentType('application/json');
    var fn = function (err, doc) { 
        if (err) { 
            if (err.message) {
                doc = {error : err.message} 
            } else {
                doc = {error : JSON.stringify(err)} 
            }
        }
        if (typeof doc === "number" || req.params.cmd === "distinct") { doc = {ok : doc}; } 
        res.send(doc); 
    };
    return fn;
};

var createReferenceIfNotExists = function(ref_value) {

    referencesModel.findOne({reference_name: ref_value}, function(err, reference) { 

        if (err) { throw err; }

        if (reference == null) {

            var reference = new referencesModel({
                reference_name : ref_value,
                reference_description : "Reference with no project assigned.",
                created_at : new Date(),
                project_id : -1,
                project_identifier : "No project"
            });

            //now create reference
            reference.save(function(err) {

                console.log("add a reference : " + ref_value);

            });    

        }
        
    });

}


/* Routes */

// Query
app.route('/:collection').get(function(req, res) { 
    var item, sort = {}, qw = {};
    for (item in req.query) {
        req.query[item] = (typeof +req.query[item] === 'number' && isFinite(req.query[item])) 
            ? parseFloat(req.query[item],10) 
            : req.query[item];
        if (item != 'limit' && item != 'skip' && item != 'sort' && item != 'order' && req.query[item] != "undefined" && req.query[item]) {
            qw[item] = req.query[item]; 
        }
    }  
    if (req.query.sort) { sort[req.query.sort] = (req.query.order === 'desc' || req.query.order === -1) ? -1 : 1; }
    db.collection(req.params.collection).find(qw).sort(sort).skip(req.query.skip).limit(req.query.limit).toArray(fn(req, res));
});

// Read 
app.route('/:collection/:id').get(function(req, res) {
    db.collection(req.params.collection).findOne({_id:objectId(req.params.id)}, fn(req, res));
});

// Save 
app.route('/:collection').post(function(req, res) {
    if (req.body._id) { req.body._id = objectId(req.body._id);}
    db.collection(req.params.collection).save(req.body, {safe:true}, fn(req, res));
});

// Update
app.route('/:collection/:id').put(function(req, res) {

    db.collection(req.params.collection).update({_id:objectId(req.params.id)}, req.body, {multi:false}, fn(req, res));
});

// Delete
app.route('/:collection/:id').delete(function(req, res) {
    db.collection(req.params.collection).remove({_id:objectId(req.params.id)}, {safe:true}, fn(req, res));
});

//websockets

io.on('connection', function (socket) {

  socket.on('reference-listening', function (data) {

    createReferenceIfNotExists(data.reference);
    addToHistory(data.reference, data.operation, "websocket");

    if (data.operation == "create") {

        if (data._id) { data._id = objectId(data._id);}
        db.collection(data.reference).save(data.datas, {safe:true}, function(err, docs) {

            if (!err) {

                if (docs == null) {docs = {}};

                socket.emit(data.reference, { operation : data.operation, objects : docs });
                socket.broadcast.emit(data.reference, { operation : data.operation, objects : docs });

            }

        });
    }
    else if (data.operation == "getAll") {

        db.collection(data.reference).find().sort({}, function(err, docs) {

            docs.reverse();

            if (!err) {

                if (docs == null) {docs = {}};

                socket.emit(data.reference, { operation : data.operation, objects : docs });
                socket.broadcast.emit(data.reference, { operation : data.operation, objects : docs });
            }

        });
    }
    else if (data.operation == "getById") {
        db.collection(data.reference).findOne({_id:objectId(data._id)}, function(err, docs) {

            if (!err) {

                if (docs == null) {docs = {}};

                socket.emit(data.reference, { operation : data.operation, objects : docs });
                socket.broadcast.emit(data.reference, { operation : data.operation, objects : docs });

            }

        });
    }
    else if (data.operation == "update") {

        db.collection(data.reference).update({_id:objectId(data._id)}, data.datas, {multi:false}, function(err, docs) {

            if (!err) {

                if (docs == null) {docs = {}};

                socket.emit(data.reference, { operation : data.operation, objects : docs });
                socket.broadcast.emit(data.reference, { operation : data.operation, objects : docs });

            }

        });

    }
    else if (data.operation == "delete") {

        db.collection(data.reference).remove({_id:objectId(data._id)}, {safe:true}, function(err, docs) {

            if (!err) {

                if (docs == null) {docs = {}};

                socket.emit(data.reference, { operation : data.operation, objects : docs });
                socket.broadcast.emit(data.reference, { operation : data.operation, objects : docs });

            }

        });

    }

  });

});


//Adding a project

app.route('/internal/api/projects').post(function(req, res, next) {

    var project = new projectsModel({
        project_name : req.body.project_name,
        project_description : req.body.project_description,
        created_at : new Date()
    });

    if (!/^[a-zA-Z-]+$/.test(project.project_name) || project.project_name == null || project.project_name.length == 0) {

        res.json({ message : 'project.name.format.error' });
    }
    else {

        project.save(function(err) {
            if (err)
                res.send(err);

            console.log("add a project : " + req.body.project_name);

            res.json({ message : 'success' });
        });

    }

});


//Getting all projects

app.route('/internal/api/projects').get(function(req, res, next) {

    var query = projectsModel.find(null);

    query.exec(function (err, projects) {
      if (err) { throw err; }

      console.log("getting all projects");

      res.json(projects);

    });

});


//Getting a project

app.route('/internal/api/projects/:project_id').get(function(req, res, next) {

    console.log("trying to get project : " + req.params.project_id);

    projectsModel.findOne({_id: req.params.project_id}, function(err, project) { 

        if (err) { throw err; }

        res.json(project);
    });

});


//Deleting a project

app.route('/internal/api/projects/:project_id').delete(function(req, res, next) {

    projectsModel.remove({_id : req.params.project_id}, function() {

        console.log("removed project");

        res.json({ message : 'success' });
    });
});


//Updating a project

app.route('/internal/api/projects/:project_id').put(function(req, res, next) {

    if (!/^[a-zA-Z-]+$/.test(req.body.project_name) || req.body.project_name == null || req.body.project_name.length == 0) {

        res.json({ message : 'project.name.format.error' });
    }
    else {

        projectsModel.findOne({ _id: req.params.project_id }, function (err, model) {

            if (err) { throw err; }

            console.log(req.params.project_name);

            model.project_name = req.body.project_name;
            model.project_description = req.body.project_description;

            model.save();

            res.json({ message : 'success' });
        })

    }
});


//Adding a reference

app.route('/internal/api/references').post(function(req, res, next) {

    console.log("adding a reference for project_id : " + req.body.project_id);

    var reference = new referencesModel({
        reference_name : req.body.reference_name,
        reference_description : req.body.reference_description,
        created_at : new Date(),
        project_id : req.body.project_id,
        project_identifier : req.body.project_identifier
    });

    if (!/^[a-zA-Z-]+$/.test(reference.reference_name) || reference.reference_name == null || reference.reference_name.length == 0) {

        res.json({ message : 'reference.name.format.error' });
    }
    else {

        reference.save(function(err) {

            if (err) res.send(err);

            console.log("add a reference : " + req.body.reference_name);

            res.json({ message : 'success' });
        });

    }

});


//Getting reference by id and action

app.route('/internal/api/references/:the_id/:action').get(function(req, res, next) {

    console.log("trying to get reference : " + req.params.the_id + " for action = " + req.params.action);

    if (req.params.action == "getById" || req.params.action == "") {

        referencesModel.findOne({_id: req.params.the_id}, function(err, reference) { 

            if (err) { throw err; }

            res.json(reference);
        });

    }
    else if(req.params.action == "getByProjectId") {

        referencesModel.find({project_id: req.params.the_id}, function(err, references) { 

            if (err) { throw err; }

            res.json(references);
        });

    }

});

//Getting reference by id

app.route('/internal/api/references/:reference_id').get(function(req, res, next) {

    referencesModel.findOne({_id: req.params.reference_id}, function(err, reference) { 

        if (err) { throw err; }

        res.json(reference);
    });

});

//getting all references

app.route('/internal/api/references').get(function(req, res, next) {

    var query = referencesModel.find(null);

    query.exec(function (err, references) {
      if (err) { throw err; }

      console.log("getting all references");

      res.json(references);

    });

});

//Deleting a reference

app.route('/internal/api/references/:reference_id').delete(function(req, res, next) {

    referencesModel.remove({_id : req.params.reference_id}, function() {

        console.log("removed reference");

        console.log(app.route.get);

        res.json({ message : 'success' });
    });

});

//Updating a reference

app.route('/internal/api/references/:reference_id').put(function(req, res, next) {

    if (!/^[a-zA-Z-]+$/.test(req.body.reference_name) || req.body.reference_name == null || req.body.reference_name.length == 0) {

        res.json({ message : 'reference.name.format.error' });
    }
    else {

        referencesModel.findOne({ _id: req.params.reference_id }, function (err, model) {

            if (err) { throw err; }

            console.log("trying to update " + req.params.reference_id);

            model.reference_name = req.body.reference_name;
            model.reference_description = req.body.reference_description;

            model.save();

            res.json({ message : 'success' });
        })

    }
});


//getting configuration

app.route('/internal/api/configuration').get(function(req, res, next) {

    res.json(config.configObject);
});


//getting all history

app.route('/internal/api/historylogs').get(function(req, res, next) {

    var query = historyModel.find(null);

    query.exec(function (err, historylogs) {
      if (err) { throw err; }

      console.log("getting all historylogs");

      res.json(historylogs);

    });

});

//getting history of a given reference

app.route('/internal/api/historylogs/byReferenceName/:reference_name').get(function(req, res, next) {

    var query = historyModel.find(null);
    query.where("reference_name").equals(req.params.reference_name);

    query.exec(function (err, historylogs) {
      if (err) { throw err; }

        console.log(historylogs);

        res.json(historylogs);

    });

});



server.listen(config.configObject.server_port, function() {
    console.log("Listening on " + config.configObject.server_port);
});