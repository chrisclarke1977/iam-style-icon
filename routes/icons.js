var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('icondb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'icondb' database");
        db.collection('icons', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'icons' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving icon: ' + id);
    db.collection('icons', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('icons', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addIcon = function(req, res) {
    var icon = req.body;
    console.log('Adding icon: ' + JSON.stringify(icon));
    db.collection('icons', function(err, collection) {
        collection.insert(icon, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateIcon = function(req, res) {
    var id = req.params.id;
    var icon = req.body;
    delete icon._id;
    console.log('Updating icon: ' + id);
    console.log(JSON.stringify(icon));
    db.collection('icons', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, icon, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating icon: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(icon);
            }
        });
    });
}

exports.deleteIcon = function(req, res) {
    var id = req.params.id;
    console.log('Deleting icon: ' + id);
    db.collection('icons', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var icons = [
    {

        name: "MODEL",
        price: 15.00,
        stock: 30,
        description: "The best model in town",
        picture: "saint_cosme.jpg"
    }];

    db.collection('icons', function(err, collection) {
        collection.insert(icons, {safe:true}, function(err, result) {});
    });

};
