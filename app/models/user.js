//==app/models/users.js
//load what we need to make it work
    var mongoose=require("mongoose");
    var bcrypt = require("bcrypt-nodejs");

//define the mongoDB schema
    var userSchema = mongoose.Schema({
       local:{
           email : String,
           password : String
       } 
    });
    
//methods
    //generating the password hash
    userSchema.methods.generateHash = function(password){
        return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
    }
    
    //checking if password is valid
    userSchema.methods.validPassword=function(password){
        return bcrypt.compareSync(password, this.local.password);
    }

//create model for users and expose it to our app
module.exports  = mongoose.model('User', userSchema);