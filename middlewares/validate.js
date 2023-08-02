
function validate (req,res,next) {
    if (req.session.loggedIn && req.session.isValid) {
        next();
    }else{
        res.redirect('/login');
    }
}

module.exports =  validate;