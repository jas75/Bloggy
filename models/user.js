const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const Schema= mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

/*
* CHECKERS
*/
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

 /*
 * VALIDATORS
 */
const emailValidators= [
	{
		validator: emailLengthChecker,
		message:"Email must be at least 5 characters but no more than 40"
	 },
	{
		validator:validEmailChecker, message: 'Must be a valid e-mail'
	}
];

const userSchema=new Schema({
	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
	username: { type: String, required: true, unique: true, lowercase: true},
	password: { type: String, required: true}
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

// Return true or false depending the matching passwords for the login part
userSchema.methods.comparePassword= (password)=>{
	return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User',userSchema);