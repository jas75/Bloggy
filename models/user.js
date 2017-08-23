const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const Schema= mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

/* =====
 CHECKERS
======== */
let emailLengthChecker= (email)=>{
	if (!email) {
		return false;
	}
	else{
		if (email.length < 5 || email.length > 40) {
			return false;
		}
		else{
			return true;
		}
	}
};

let validEmailChecker = (email)=>{
	if (!email) {
		return false;
	}
	else{
		const regExp= new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return regExp.test(email);
	}
};

let usernameLengthChecker= (username)=>{
	if(!username){
		return false;
	}
	else{
		if (username.length < 5 || username.length > 30) {
			return false;
		}
		else{
			return true;
		}
	}
};

let validUsername = (username)=>{
	if(!username){
		return false;
	}
	else{
		const regExp= new RegExp(/^[a-zA-z0-9]+$/);
		return regExp.test(username);
	}
};

let passwordLengthChecker = (password)=>{
	if (!password) {
		return false;
	}
	else{
		if(password.length<5 || password.length>40){
			return false;
		}
		else{
			return true;
		}
	}
};

let validPassword = (password)=>{
	if (!password) {
		return false;
	}
	else{
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		return regExp.test(password);
	}
};


 /* =======
  VALIDATORS
 ========= */
const emailValidators= [
	{
		validator: emailLengthChecker,
		message:"Email must be at least 5 characters but no more than 40"
	 },
	{
		validator:validEmailChecker, message: 'Must be a valid e-mail'
	}
];

const usernameValidators = [
	{
		validator: usernameLengthChecker,
		message :'Username must be at least 5 characters but no more than 30'
	},
	{
		validator: validUsername,
		message:'Username must not have any special characters'
	}
];

const passwordValidators = [
	{
		validator: passwordLengthChecker,
		message: 'Password must be at least 5 characters but no more than 40'
	},
	{
		validator:validPassword,
		message: 'Must have at least one uppercase, lowercase, special character, and number'
	}
];


/* ========
Schema for user
========= */
const userSchema=new Schema({
	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
	username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
	password: { type: String, required: true,validate: passwordValidators},
	bio: { type:String,default:null},
	location: {type:String, default:null},
	gender: {type:String,default:null},
	birthday: { type:Date,default:null}
});


// Middleware that encrypte password 
userSchema.pre('save', function(next){
	if(!this.isModified('password'))
	return next();

	bcrypt.hash(this.password, null, null, (err,hash)=>{
		if(err) return next(err);
		this.password=hash;
		next();
	});
});

// userSchema.pre('validate',function(next){
// 	if(this.bio===null || this.location===null || this.gender=null || this.birthday===null){
// 		return next();
// 	}
// 	else{

// 	}
// })

// userSchema.pre('validate',function(next){
// 	if(this.bio === null || this.location===null || this.gender===null || this.birthday===null){
// 		next();
// 	}
// });

// Return true or false depending the matching passwords for the login part
userSchema.methods.comparePassword= function(password){
	return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User',userSchema);