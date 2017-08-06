const mongoose=require('mongoose');
mongoose.Promise = global.Promise;
const Schema= mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema=new Schema({
	email: { type: String, required: true, unique: true, lowercase: true},
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