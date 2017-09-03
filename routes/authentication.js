const User= require('../models/user');
const jwt= require('jsonwebtoken');
const config= require('../config/database');
const multer = require('multer');
const cloudinary= require('cloudinary'); 


function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

cloudinary.config({ 
  cloud_name: 'bloggy', 
  api_key: '875955353984588', 
  api_secret: '-kA6iCZExG5A1HVPDBER3saoKJg' 
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/src/assets/img/profile');
  },
  filename: function (req, file, cb) {
  	User.findOne({_id:req.decoded.userId},(err,user)=>{
  		if(err){
  			res.json({success:false,message:err});
  		}
  		else{
  			if(!user){
  				res.json({success:false,message:"User not found"});
  			}
  			else{
  				cb(null, "profile" + user.username +makeid());
  			}
  		}
  		
  	});
    
  }
});
var upload = multer({ storage:storage}).single('file');

module.exports= (router)=>{

	router.post('/register',(req,res)=>{
		
		if (!req.body.email) {
			res.json({success:false,message: 'You must provide an e-mail'});
		}
		else{
			if (!req.body.username) {
				res.json({success:false,message:'You must provide a username'});
			}
			else{
				if(!req.body.password){
					res.json({success:false,message:'You must provide a password'});
				}
				else{
					let user= new User({
						email: req.body.email.toLowerCase(),
						username: req.body.username.toLowerCase(),
						password: req.body.password,
					});

					user.save((err)=>{
						if (err) {
							if (err.code === 11000) {
								res.json({success:false,message:'Username or e-mail already exists'});
							}else{
								if (err.errors) {
									if (err.errors.email) {
										res.json({success:false, message:err.errors.email.message});
									}
									else{
										if (err.errors.username) {
											res.json({success:false,message:err.errors.username.message});
										}
										else{
											if (err.errors.password) {
												res.json({success:false,message:err.errors.password.message});
											}
											else{
												res.json({ success:false,message:err});
											}
										}
									}
								}else{
									res.json({success:false,message:'Could not save user :', err});
								}
							}
						}
						else{
							res.json({success:true,message:'Account registered'})
						}
					});
				}
			}
			
		}
	});

	router.get('/checkEmail/:email',(req,res)=>{
		if (!req.params.email) {
			res.json({success:false, message:'E-mail was not provided'});
		}
		else{
			User.findOne({email:req.params.email},(err,user)=>{
				if (err) {
					res.json({success:false,message:err});
				}
				else{
					if(user){
						res.json({success:false,message:"E-mail already taken"});
					}
					else{
						res.json({success:true,message:"E-mail is avalaible"});
					}
				}
			});
		}
	});

	router.get('/checkUsername/:username',(req,res)=>{
		if (!req.params.username) {
			res.json({success:false, message:'Username was not provided'});
		}
		else{
			User.findOne({username:req.params.username},(err,user)=>{
				if (err) {
					res.json({success:false,message:err});
				}
				else{
					if(user){
						res.json({success:false,message:"Username already taken"});
					}
					else{
						res.json({success:true,message:"Username is avalaible"});
					}
				}
			});
		}
	});

	router.post('/login',(req,res)=>{
		if (!req.body.username) {
			res.json({success:false,message:"No username was provided"});
		}
		else{
			if (!req.body.password) {
				res.json({success:false,message:"No password was provided"});
			}
			else{
				User.findOne({username:req.body.username.toLowerCase()},(err,user)=>{
					if (err) {
						res.json({success:false,message:err});
					}
					else{
						if(!user){
							res.json({success:false,message:"Username was not found"});
						}
						else{
							const validPassword = user.comparePassword(req.body.password);
							if (!validPassword) {
								res.json({success:false,message:'Password invalid'});
							}
							else{
								const token=jwt.sign({
									userId: user._id
								},config.secret, {expiresIn: '24h'});
								res.json({success:true,message:'Success', token:token, user: {username:user.username}});
							}
						}
					}
				});
			}
		}
	});

	/* ============
	Middleware that intercept the token sent in the headers
	every route coming after this one are going to execute this middleware
	Disable it when testing routes.
	============= */
	router.use((req,res,next)=>{
		const token=req.headers['authorization'];
		if(!token){
			res.json({success:false, message:"No token provided"});
		}
		else{
			jwt.verify(token, config.secret, (err,decoded)=>{
				if(err){
					res.json({success:false,message:"Token invalid: " + err});
				}
				else{
					req.decoded=decoded;
					next();
				}
			});
		}
	});

	router.get('/profile',(req,res)=>{
		User.findOne({ _id:req.decoded.userId},(err,user)=>{
			if(err){
				res.json({success:false,message:err});
			}
			else{
				if (!user) {
					res.json({success:false,message:"User not found"});
				}
				else{
					res.json({success:true,user:user});
				}
			}
		});
	});

	router.get('/publicProfile/:username',(req,res)=>{
		if(!req.params.username){
			res.json({success:false,message:"No username was provided"});
		}
		else{
			User.findOne({username:req.params.username}).select('username email').exec((err,user)=>{
				if(err){
					res.json({success:false,message:"Something went wrong: " + err});
				}
				else{
					if(!user){
						res.json({success:false,message:"User not found"});
					}
					else{
						res.json({success:true,user:user});
					}
				}
			});
		}
	});

	//edit-profile routes

	router.put('/editProfile',(req,res)=>{	
		User.findByIdAndUpdate(req.decoded.userId,{$set:{bio:req.body.bio, location:req.body.location, gender:req.body.gender, birthday:req.body.birthday}},{new:true},function(err,user){
			if(err){
				res.json({success:false,message:"Something went wrong: "+err});
			}
			else{
				if(!user){
					res.json({success:false,message:"User not found"});
				}
				else{
					res.json({success:true,message:'Account updated !'});
				}
			}
		});				
	});	

	router.post('/edit-photo', upload,function (req,res){
		console.log(req.file);
	  if (!req.file) {
	    res.json({success:false,message:"No file was provided"});
	  }
	  else{
	  	User.findOne({_id:req.decoded.userId},(err,user)=>{
	  		if(err){
	  			res.json({success:false,message:'Something went wrong: '+err});
	  		}
	  		else{
	  			if (!user) {
	  				res.json({success:false,message:'User not found'});
	  			}
	  			else{
	  				// console.log(req.headers);
	  				// delete req.headers['cookie'];
	  				// console.log(req.headers);
	  				
	  				// user.img=req.file.filename;
	  				// user.save({ validateBeforeSave: false },(err)=>{
	  				// 	if(err){
	  				// 		res.json({success:false,message:'Something went wrong: '+err});
	  				// 	}
	  				// 	else{
	  				// 		res.json({success:true,file:req.file});
	  				// 	}
	  				// });
	  				cloudinary.v2.uploader.upload(req.file.path,function(error,result){
	  					if(error){
	  						console.log('erreur');
	  					}
	  					else{
	  						user.img=result.url;
	  					user.save({validateBeforeSave:false},(err)=>{
	  						if(err){
	  							res.json({success:false,message:'Something went wrong: '+err});
	  						}
	  						else{
	  							res.json({success:true,message:'Image saved', fileURL:result.url});
	  						}
	  					});
	  					}
	  					
	  				});
	  			}
	  		}
	  	});
	  }
	});

	

	return router;
};