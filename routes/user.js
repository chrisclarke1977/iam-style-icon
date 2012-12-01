var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('userdb', server);

db.open(function (err, db) {
    if (!err) {
        console.log("Connected to 'userdb' database");
        db.collection('users', {safe:true}, function (err, collection) {
            if (err) {
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findOne = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function (err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function (err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function (req, res) {
    db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, items) {
            /* for(i in items)
             { // TODO: Use to control visibility
             items[i].password = "Hidden";
             items[i].type = "user";
             } */
            res.send(items);
        });
    });
};

exports.create = function (req, res) {
    var user = req.body;
    console.log('Adding user: ' + JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.insert(user, {safe:true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.update = function (req, res) {
    var id = req.params.id;
    var user = req.body;
    delete user._id;
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function (err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.destroy = function (req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function (err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function (err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

var decrypt = function (inStr, matchStr) {

    // TODO: from un and pw get if valid
    ret = true; // Should be false

    if (inStr == matchStr) {
        ret = true;
    }

    return ret;

}

exports.login = function (req, res) {
    var data = req.headers['authorization'];
    var username = req.auth.username;
    var password = req.auth.password;

    /*
     console.log('Req User: '+user);


     for (var i in req.headers){
     console.log('H: '+i+' Head: '+req.headers[i]);
     }
     for (var i in req.body){
     console.log('B: '+i+' Head: '+req.body[i]);
     }
     for (var i in req.query){
     console.log('q: '+i+' Head: '+req.query[i]);
     }
     for (i in req){
     console.log('R: '+i+' Head: '+req[i]);
     }
     for (i in req.auth)
     {
     console.log('A: '+i+' Head: '+req.auth[i]);
     }
     */

    /*  Debug entries
     var i=0;
     for(var item in req.headers) {
     i++;
     console.log(i+' item: ' +item + ": " + req.headers[item]);
     if (item == 'authorization'){
     console.log('FIREWORKS!')
     }
     }
     /*
     */

    console.log('input: ' + data + ' attempt Login');
    db.collection('users', function (err, collection) {
        collection.find().toArray(function (err, items) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                for (i in items) {
                    // TODO: check username and password
                    // Compare Crypto ( name : password) to input
                    var inString = items[i].username + ':' + items[i].password;

                    // var checkString = "Basic "+Crypto.util.bytesToBase64(Crypto.charenc.Binary.stringToBytes(inString));
                    // console.log(data+' : '+ checkString);

                    /*if (decrypt(inString,data))
                     {
                     id = items[i]._id;
                     console.log('Found '+id);
                     break;
                     }
                     */

                    // console.log ('Login for User: '+i+' item name:'+items[i].username +' request name: '+ req.body.username);


                    if (items[i].username === username) {

                        res.send(items[i]);
                        console.log('Login for User: ' + i + ' item name:' + items[i].username + ' request name: ' + req.body.username);
                        return;
                    }

                    if (typeof(id) !== 'undefined') {
                        // TODO: fix now always sends back first user
                        if (items[i].username === username) {

                            res.send(items[i]);
                            console.log('Login for User: ' + i + ' item name:' + items[i].username + ' request name: ' + req.auth.username);
                            return;
                        }
                    }
                }

                res.send('Not found');
            }
        });
    });
}

exports.reset = function (res, req) {
    var id = req.params.id;
    var user = req.body;
    delete user._id;
    console.log('Reset user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function (err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, user, {safe:true}, function (err, result) {
            if (err) {
                console.log('Error resetting user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}


exports.populate = function () {
    populateDB();
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function () {

    var users = [
        {
            "username":"j",
            "timestamp":"Thu Nov 01 2012 12:15:11 GMT+0000 (GMT)",
            "capabilities":{
                "view":"true",
                "list":"true",
                "edit":"true",
                "create":"true",
                "destroy":"true"
            }
        },
        {
            "username":"q",
            "timestamp":"Thu Nov 01 2012 13:54:34 GMT+0000 (GMT)",
            "capabilities":{
                "view":"true",
                "list":"true",
                "edit":"true",
                "create":"false",
                "destroy":"true"
            }
        },
        {
            "username":"k",
            "timestamp":"Thu Nov 01 2012 09:10:04 GMT+0000 (GMT)",
            "capabilities":{
                "view":"true",
                "list":"true",
                "edit":"false",
                "create":"true",
                "destroy":"true"
            }
        },
        {
            "username":"matt",
            "timestamp":"Wed Oct 31 2012 16:55:14 GMT+0000 (GMT)",
            "capabilities":{
                "view":"true",
                "list":"true",
                "edit":"true",
                "create":"true",
                "destroy":"true"
            }
        },
        {
            "username":"m",
            "timestamp":"Thu Nov 01 2012 10:28:26 GMT+0000 (GMT)",
            "capabilities":{
                "view":"true",
                "list":"true",
                "edit":"true",
                "create":"true",
                "destroy":"false"
            }
        }
    ];

    db.collection('users', function (err, collection) {
        collection.insert(users, {safe:true}, function (err, result) {
        });
    });

};
