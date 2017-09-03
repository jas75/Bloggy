const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const Schema= mongoose.Schema;

/* =====
 CHECKERS
======== */

let bodyLengthChecker= (body)=>{
	if(!body){
		return false;
	}
	else{
		if (body.length < 1 || body.length > 500) {
			return false;
		}
		else{
			return true;
		}
	}
};

let commentLengthChecker=(comment)=>{
	if (!comment[0]){
		return false;
	}
	else{
		if (comment[0].length< 1 || comment[0].length > 300) {
			return false;
		}
		else{
			return true;
		}
	}
};

 /* =======
  VALIDATORS
 ========= */
const bodyValidators= [
	{
		validator: bodyLengthChecker,
		message:"Body must be more than 1 character but no more than 500"
	 }
];

const commentValidators = [
	{
		validator: commentLengthChecker,
		message :'Comments may not exceed 300 characters'
	}
];


/* ========
Schema for post
========= */
const postSchema= new Schema({
	body:{ type: String, required:true, validate:bodyValidators},
	createdBy: { type: String},
	picCreatedBy: { type:String},
	to: {type:String, default:null },
	createdAt: { type:Date, default:Date.now()},
	likes: { type:Number,default:0},
	likedBy: { type:Array},
	dislikes: { type:Number, default:0},
	dislikedBy: { type:Array},
	comments: [
		{
			comment: { type: String, validate: commentValidators},
			commentator: { type: String},
			commentatorPic: {type:String}
		}
	]
});



module.exports = mongoose.model('Post',postSchema);