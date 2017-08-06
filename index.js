const express= require('express');
const app = express();
const router=express.Router();
const mongoose = require('mongoose'); 
mongoose.Promise = global.Promise;
const config=require('./config/database');
const path=require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser=require('body-parser');



mongoose.connect(config.uri, (err) => {
  // Check if database was able to connect
  if (err) {
    console.log('Could NOT connect to database: ', err); // Return error message
  } else {
    console.log('Connected to database: ' + config.db); // Return success message
  }
});

/*
* Express Middlewares
*/
// Place before the routes
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/authentication', authentication);

app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen (8080,()=>{
	console.log('Listening on port 8080');
})