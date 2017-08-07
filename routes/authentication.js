const User= require('../models/user');

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
						password: req.body.password
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
					res.json({success:false,message:"probleme"});
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
								res.json({success:true,message:'Success'});
							}
						}
					}
				});
			}
		}
	});
	return router;
};