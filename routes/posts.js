 const Post = require('../models/post');
const User= require('../models/user');
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

	router.get('/singlePost/:id',(req,res)=>{

		if (!req.params.id) {
			res.json({success:false,message:"No id provided"});
		}
		else{
			Post.findOne({_id:req.params.id},(err,post)=>{
				if(err){
					res.json({success:false,message: "Not a valid blog id"});
				}
				else{
					if (!post) {
						res.json({success:false,message:"Post not found"});
					}
					else{
						User.findOne({_id: req.decoded.userId},(err,user)=>{
							if(err) {
								res.json({success:false, message:err});
							}
							else{
								if (!user) {
									res.json({success:false,message:"Unable to authenticate"});
								}
								else{
									if (user.username !== post.createdBy) {
										res.json({success:false,message:"You're not authorized to edit this post "});
									}
									else{
										res.json({success:true,post:post});
									}
								}
							}
						});
					}
				}
			});
		}	
	});

	router.put('/updatePost',(req,res)=>{
		if(!req.body._id){
			res.json({success:false,message:"No blog id was provided"});
		}
		else{
			Post.findOne({_id: req.body._id},(err,post)=>{ // we get (post) the post want to update
				if (err) {
					res.json({success:false,message: "Not a valid blog id"});
				}
				else{
					if (!post) {
						res.json({success:true,message:"Blog id was not found"});
					}
					else {
						User.findOne({_id: req.decoded.userId},(err,user)=>{ // then we search for the user currently loggedin
							if(err) {
								res.json({success:false,message:err});
							}
							else {
								if (!user){
									res.json({success:false,message:"Unable to authenticate user"});
								}
								else{
									if(user.username!== post.createdBy){ // we compare the user loggedin with the user who wrote the post
										res.json({success:false,message:"You are not authorized to edit this blog post"});
									}
									else{
										post.body= req.body.body;
										post.save((err)=>{
											if (err) {
												res.json({success:false,message:err});
											}
											else{
												res.json({success:true,message:"Post updated !"});
											}
										});
									}
								}
							}
						});
					}
				}
			});
		}
	});

	router.delete('/deletePost/:id',(req,res)=>{
		if(!req.params.id){
			res.json({success:false,message:"No id provided"});
		}
		else{
			Post.findOne({_id: req.params.id},(err,post)=>{
				if (err) {
					res.json({success:false,message:"Invalid id"});
				}
				else{
					if (!post) {
						res.json({success:false,message: 'Post was not found'});
					}
					else{
						User.findOne({_id: req.decoded.userId},(err,user)=>{
							if (err) {
								res.json({success:false,message:err});
							}
							else{
								if (!user) {
									res.json({success:false,message:"Unable to authenticate"});
								}
								else{
									if (user.username!==post.createdBy) {
										res.json({success:false,message:"You're not authorized to delete this post"});
									}
									else{
										post.remove((err)=>{
											if(err){
												res.json({success:false,message: err});
											}
											else{
												res.json({success:true,message:"Post deleted !"});
											}
										});
									}
								}
							}
						});
					}
				}
			});
		}
	});

	router.put('/likePost',(req,res)=>{
		if(!req.body.id){
			res.json({success:false,message:"No id was provided"});
		}
		else{
			Post.findOne({_id:req.body.id},(err,post)=>{
				if(err){
					res.json({success:false,message:"Invalid blog id"});
				}
				else{
					if (!post) {
						res.json({success:false,message:"That post was not found"});
					}
				}
			});
		}
	});
	return router;
};