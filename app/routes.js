//==app/routes.js
module.exports=function(app,passport){
    //===Homepage with login link
    app.get("/",function(req,res){
        res.render('index.ejs');
    });
    
    //===Login page
    app.get("/login", function(req,res){
        //render page and pass any flash data if exists.
        res.render('login.ejs', {message: req.flash('loginMessage') });
    });
    
    //process the login form
    app.post("/login", passport.authenticate('local-login',{
        successRedirect:'/profile', //redirect to the secure profile section
        failureRedirect:'/login', //redirect to the login page if there is an error
        failureFlash: true  //allow flash messages
    }));
    
    //===Sign-up page
    app.get('/signup', function(req,res){
        //render signup page and pass any flash data if exists
        res.render('signup.ejs',{message: req.flash("signupMessage") });
    });
    
    //process the sign-up form
    app.post("/signup",passport.authenticate('local-signup',{
        successRedirect:'/profile', //redirect to the secure profile section
        failureRedirect:'/signup', //redirect to the signup page if there is an error
        failureFlash: true  //allow flash messages
    }));
    
    //===Profile page
    app.get("/profile",isLoggedIn,function(req,res){
        res.render('profile.ejs',{
           user:req.user //get a user out of the session and pass the template 
        });
    });
    
    //===Logout
    app.get('/logout',function(req,res){
       req.logout();
       res.redirect('/');
    });
    
    //===route middleware to ensure user is logged in
    function isLoggedIn(req,res,next){
        //if user is authenticated in the session, carry on
        if(req.isAuthenticated()){
            return next();
        }
        //if they are not redirect to main page
        res.redirect('/');
    }
}