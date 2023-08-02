
function validateAdmin (req,res,next) {
    if (req.session.loggedIn) {
        next();
    }else{
        res.redirect('/admin');
    }
}

module.exports =  validateAdmin;