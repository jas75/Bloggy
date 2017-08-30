const express= require('express');
const app = express();
const router=express.Router();
const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
const config=require('./config/database');
const path=require('path');
const authentication = require('./routes/authentication')(router);
const posts = require('./routes/posts')(router);
const bodyParser=require('body-parser');
const cors=require('cors');
const utile= require('util');

const port = process.env.PORT || 8080;



mongoose.connect(config.uri, (err) => {
  // Check if database was able to connect
  if (err) {
    console.log('Could NOT connect to database: ', err); // Return error message
  } else {
    console.log('Connected to database: ' + config.db); // Return success message
  }
});


/* =====================
  Express Middlewares
===================== */
app.use(cors({
	origin:'http://localhost:4200',
  credentials:true
}));
// Place before the routes
app.use(bodyParser.urlencoded({ extended: false,limit:'50mb',parameterLimit: 1000000}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);
app.use('/posts',posts);

/* =======
  Upload file system
  =========== */




/* =======
  Routes
  =========== */

app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname+'/public/index.html'));
});


// Allows all angular route, for refreshing page
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen (port,()=>{
	console.log('Listening on ' + port);
})