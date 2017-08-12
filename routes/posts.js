const Post = require('../models/post');
const jwt= require('jsonwebtoken');
const config= require('../config/database');
module.exports= (router)=>{

	router.post('/newPost',(req,res)=>{
		if (!req.body.body) {
			res.json({success:false,message:"Body is required"});
		}
		else{
			if (!req.body.createdBy) {
				res.json({success:false,message:"Creator is required"});
			}
			else{
				const post= new Post({
					body: req.body.body,
					createdBy:req.body.createdBy
				});

				post.save((err)=>{
					if (err) {
						if (err.errors) {
							if(err.errors.body){
								res.json({success:false,message:err.errors.body.message});
							}
							else{
								res.json({success:false,message: err.errmsg});
							}
						}
						else{
							res.json({success:false,message:err});
						}
					}
					else{
						res.json({success:true,message:"Post saved !"});
					}
				});
			}
		}
	});

	router.get('/allPosts',(req,res)=>{
		Post.find({},(err,posts)=>{
			if(err){
				res.json({success:false,message:err});
			}
			else{
				if (!posts) {
					res.json({success:false,message:"No posts found"});
				}
				else{
					res.json({success:true,posts:posts});
				}
			}
		}).sort({'_id':-1}); // the latest comes first
	});
	return router;
};