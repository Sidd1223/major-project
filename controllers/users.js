const User = require("../models/user");





module.exports.renderSignupForm = (req, res) => {
    res.render("Users/signup.ejs");
};
// Signup 
module.exports.Signup = async(req, res, next) => {
    let { email, username, password } = req.body;
    try {
        let user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if(err) {
                return next(err);
            }
             req.flash("success", "Welcome to Wanderlust!");
             res.redirect("/listings");
        });
       
        } catch(e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
   
};

// LoginForm
module.exports.renderLoginForm = (req, res) => {
    res.render("Users/login.ejs");
};

// Login
module.exports.Login = async(req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
   
}; 

// Logout
module.exports.Logout = (req, res, next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
};