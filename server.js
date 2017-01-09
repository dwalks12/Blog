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
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'public');

//Point to static assets

app.use(express.static(publicPath));

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
var DATABASE_URL = process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://Dawson:Pokemon1@ds127938.mlab.com:27938/heroku_bj9c2mnh';

mongodb.MongoClient.connect(DATABASE_URL, function (err, database) {
  if(err) {
    console.log(err);
    process.exit(1);
  }

  db = database;
  //important to catch any errors from proxy or server will crash

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
  res.status(code || 500).json({'error': message});
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

app.post('/login', function(req, res) {
  var loginCredentials = req.body;
  db.collection(LOGIN_COLLECTION).findOne({loginId: '1'}, function(err, results) {
    if(err) {
      handleError(res, err.message, 'Database Error');
    } else {
      // console.log(results, results.username, results.password, req.body, req.body.password, req.body.username);
      if(results && results.username === req.body.username && results.password === req.body.password) {
        // console.log('success');
        res.status(201).json({'success': true});
      } else {
        handleError(res, 'Incorrect Login Credentials');
      }
    }
  });

});
app.post('/images', function(req, res) {
  var newImage = req.body;
  newImage.createdAt = new Date();
  if(!(req.body.createdBy)) {
    handleError(res, 'Invalid user input', 'Must provide a createdBy name.'+req.body[0], 400);
  }
  console.log(req.body);
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
