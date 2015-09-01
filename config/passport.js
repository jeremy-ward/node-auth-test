//config/passport.js

//load all the things required
var LocalStrategy=require("passport-local").Strategy;

//load up the user model
var User = require("../app/models/user");

//expose this function to our app
module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    //used to serialize the user for the session
    passport.serializeUser(function(user, done){
       done(null, user.id); 
    });
    
    //used to deserialize the user
    passport.deserializeUser(function(id,done){
        User.findById(id, function(err,user){
            done(err,user);
        });
    });
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-signup',new LocalStrategy({
        //by default local strategy uses username and password, we will override it
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true //allows us to pass the entire request to the callback
    },
    function(req, email, password, done){
        //asynchronous
        //User.findOne will not fire unless data is sent back
        process.nextTick(function(){
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists 
            User.findOne({'local.email':email},function(err, user){
               //if errors return them
               if(err){
                   return done(err);
               }
               
               //check to see if there's already a user with that email
               if(user){
                   return done(null, false, req.flash('signupMessage', 'That email is already taken'));
               }
               else{
                   //if there is no user with that email
                   //create user
                   var newUser = new User();
                   
                   //set the User's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    
                    //save the user
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null, newUser);
                    });
               }
            });
        });
    }
        ));
        
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-login',new LocalStrategy({
        //by default local strategy uses username and password, we will override it
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true //allows us to pass the entire request to the callback
    },
    function(req, email, password, done){ // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({'local.email':email},function(err,user){
            if(err)
                return done(err);
            
            //if no user is found return the message
            if(!user)
                return done(null, false, req.flash('loginMessage','No User found'));
            //if user found but password wrong
            if(!user.validPassword(password))
                return done(null, false, req.flash('loginMessage','Ouch. That is not your password'));
            //all is well return the user
            return done(null, user);
        });
        
    }
    ));
};