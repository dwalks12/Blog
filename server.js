var express = require('express');
var path = require('path');
var httpProxy = require('http-proxy');
var bodyParser = require('body-parser');
var proxy = httpProxy.createProxyServer();
var app = express();
var router = express.Router();
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var cors = require('cors');
var IMAGES_COLLECTION = 'images';
var LOGIN_COLLECTION = 'login';
var POSTS_COLLECTION = 'posts';
var FRONTPAGE_COLLECTION = 'frontpage';
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
//Point to static assets
var morgan = require('morgan');//logging
var jwt = require('jsonwebtoken');
var config = require('./models/database');
var mongoose = require('mongoose');

app.set('superSecret', config.secret);
// var hash = bcrypt.hash('momsblog1961', 10, null, function(err, hash) {
//             if(err) return 'error';
//             console.log('the hash is', hash);
//             return hash;
//           });
app.use(passport.initialize());
app.use(express.static(publicPath));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({credentials:true, origin:true}));

//we only want to run workflow when not in production
if(!isProduction) {
  //we require bundler because
  //its only needed in a dev environment
  var bundle = require('./server/bundle.js');
  bundle();

  // Any requests to localhost:3000/build is proxied to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
      target: 'http://localhost:8080'
    });
  });
}
var db;
var DATABASE_URL = config.database;//process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://heroku_w7jv66mf:r5mq77g1dmh4l26ognn3mrqp1v@ds159348.mlab.com:59348/heroku_w7jv66mf';
// mongoose.connect(DATABASE_URL);
mongodb.MongoClient.connect(DATABASE_URL, function (err, database) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  db = database;
});

//routes
proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function() {
  console.log('Server running on port ' + port);
});

//generic error handler
function handleError(res, reason, message, code) {
  console.log('error: ' + reason);
  res.status(code || 500).json({'error': reason});
}

app.get('/images', function(req, res) {
  db.collection(IMAGES_COLLECTION).find({}).toArray(function(err, docs) {
    if(err) {
      handleError(res, err.message, 'Failed to retrieve images');
    } else {
      res.status(200).json(docs);
    }
  });
});
app.get('/frontpage', function(req, res) {
  db.collection(FRONTPAGE_COLLECTION).find({}).toArray(function(err, docs) {
    if(err) {
      handleError(res, err.message, 'Failed to retrieve frontpage');
    } else {
      res.status(200).json(docs);
    }
  });
});
app.get('/posts', function(req, res) {
  db.collection(POSTS_COLLECTION).find().toArray(function(err, items) {
    res.status(201).json(items);
  });
});
app.post('/login', function(req, res) {
  var loginCredentials = req.body;
  var username = req.body.username;
  var password = req.body.password;
  console.log(username, password);
  //res.status(201).json({'success': true});


  db.collection(LOGIN_COLLECTION).findOne({username: req.body.username}, function(err, results) {

  if(err) {
    //return callback(null, false);
    handleError(res, 'Database Error');
  } else {
    if(!results || typeof results === "undefined") {
      //return callback(null, false);
      handleError(res, 'Incorrect Login Credentials');
    } else if(results && results.username === req.body.username) {
      if(results.password) {
        // bcrypt.hash(req.body.password, 10, null, function(err, hash) {
        //   if(err) handleError(res, 'hash error');
          bcrypt.compare(req.body.password, results.password, function(err, isMatch) {
            console.log('do passwords match? ', isMatch);
            if(err){
              handleError(res, 'Incorrect Login Credentials');
              //handleError(res, err.message, 'Database Error');
            }
            if(isMatch){
              var token = jwt.sign(results, app.get('superSecret'), {
                expiresIn: 60*60*24 // expires after 24 hours
              });
              res.status(201).json({success: true, message: 'Authentication successful', token: token});
            } else {
              handleError(res, 'Invalid password please try again');
            }
            //return callback(null, true);

          });

        // });

      } else {
        handleError(res, 'Invalid password');
      }
    } else {
      //return callback(null, false);
      handleError(res, 'Incorrect Login Credentials');
    }
  }
});
// var authenticated = passport.authenticate('basic', {session: false});
// console.log(authenticated);
});

app.get('/posts/:id', function(req, res) {
  db.collection(POSTS_COLLECTION).findOne({id: req.params.id}, function(err, results) {
    if(err) {
      handleError(res, err.message, 'Could not find Post');
    } else {
      res.status(201).json(results);
    }
  });
});
app.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if(token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided',
    });
  }
});

app.post('/post', function(req, res) {

  var newPost = req.body;
  if(!req.body) {
    handleError(res, 'Invalid parameters', '', 400);
  }
  db.collection(POSTS_COLLECTION).update({id: newPost.id}, newPost, {upsert: true}, function(err, result, upserted) {
    if(err) {
      handleError(res, err.message, 'Failed to create post');
    } else {
      //console.log(doc);
      res.status(201).json(result);
    }
  });
});

app.delete('/posts/:id', function(req, res) {
  db.collection(POSTS_COLLECTION).deleteOne({id: req.params.id}, function(err, results) {
    if(err) {
      handleError(res, err.message, 'failed to delete post');
    } else {
      res.status(204).end();
    }
  })
});

app.post('/images', function(req, res) {
  var newImage = req.body;
  newImage.createdAt = new Date();
  if(!(req.body.createdBy)) {
    handleError(res, 'Invalid user input', 'Must provide a createdBy name.'+req.body[0], 400);
  }
  db.collection(IMAGES_COLLECTION).insertOne(newImage, function(err, doc) {
    if(err) {
      handleError(res, err.message, 'Failed to create image');
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

app.delete('/images/:id', function(req, res) {
  db.collection(IMAGES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, results) {
    if(err) {
      handleError(res, err.message, "Failed to delete contact");
    } else {
      res.status(204).end();
    }
  })
});


app.post('/frontpage', function(req, res) {
  var body = req.body;
  db.collection(FRONTPAGE_COLLECTION).update({id: body.id}, body, {upsert: true}, function(err, result, upserted) {
    if(err) {
      handleError(res, err.message, 'Failed to create post');
    } else {
      //console.log(doc);
      res.status(201).json(result);
    }
  })
});
// app.get('/images:id', function(req, res) {
//
// });
//
// app.delete('/images:id', functions(req, res) {
//
// });


/*
object schema:

{
  "id": <objid>,
  "imageURL": <string>
  "imageid": <string>
  "createdAt": <string>
  "createdBy": <string>
}



*/
