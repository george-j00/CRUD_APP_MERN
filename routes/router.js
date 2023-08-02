const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const validateAdmin = require('../middlewares/validateAdmin');
const Admin = require('../models/adminSchema');
const User = require('../models/signupSchema');
const { ObjectId } = require('mongodb');


//home router 
router.get('/', validate, (req, res) => {
    const user = req.session.username;
    res.render('pages/index', { user });
});
 
//admin dashboard router 
router.get('/dashboard/admin',validateAdmin, async (req, res) => {
    
    const usersData = await User.find({},{_id:1 , username:1 , email:1,password:1});
//    const usersData = data.username
    res.render('pages/dashboard' , {usersData});
}); 

//login router
router.get('/login', (req, res) => {
    res.render('pages/login');
});
 
//login router for post method 
router.post("/login", async (req, res) => {
  
    const { username , password } = req.body;
    try {
        const user = await User.findOne({username})

         if (user.username && user.password && user.password === password) {
            req.session.loggedIn = true;
            req.session.username = username;
            req.session.isValid = true;
            res.redirect('/');
        }else{
            const error = 'Invalid username or password';
            res.render('pages/login', { error });
        }
       
    } catch (err) {
        const error = 'Invalid username or password';
        res.render('pages/login', { error });
    }
});
  
//logout router
router.get('/logout' ,(req,res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    })
})

//signUp router 
router.get('/signup', (req, res) => {
    res.render('pages/signup');
});

//signup router post method
router.post('/signup' ,async (req,res) => {
   const {username ,email ,  password , confirmPassword} = req.body;
   if (password === confirmPassword && username && isValid(email)) {
        
    try {
        // Create a new user
        const user = new User({
          username,
          email,
          password
        }); 
        // Save the user to the database
        await user.save();
        // Send a success response
       console.log('successfully added data');
       res.redirect('/login');
 
      } catch (err) {
        const error =  err.code === 11000 && 'email already in use' 
        res.render('pages/signup', { error });
     }
    } 
    else{ 
        const error = 'invalid credentials.';
        res.render('pages/signup', { error });
    }

});

//adming router
router.get('/admin', (req, res) => {
    res.render('pages/admin-login');
});

router.post('/admin/addproduct', (req, res) => {
  const data = req.body;
  res.send(data);
});

// adming router post
router.post("/admin", async (req, res) => {

    const { adminId, adminPassword } = req.body;
  console.log(adminId, adminPassword);
    try {

     const admin = await Admin.findOne({adminId})

      if ( admin.adminId === adminId && adminPassword === admin.adminPassword) {
            req.session.loggedIn = true;
            req.session.adminId = adminId;
            res.redirect('/dashboard/admin');
      } else {
        const error = 'Invalid username or password111';
        res.render('pages/admin-login', { error });
      }
    } catch (err) {
      const error = 'Invalid username or passwordcatch';
      res.render('pages/admin-login', { error });
    }
  }); 
 
  //user creation by admin
  router.post("/createUser", async (req,res) => {
    const {username ,email ,  password} = req.body;


    console.log(username , email , password);
    try {
        // Create a new user
        const user = new User({
          username,
          email,
          password 
        });
        // Save the user to the database
        await user.save();
        // Send a success response
       console.log('successfully added data');
       const successMessage = 'User created successfully!';

    res.redirect('/dashboard/admin');

      } catch (err) {
        const error =  err.code === 11000 ? 'email already in use' : 'Cannot create user'; 
       console.log(error);
       return res.status(500).send('Error while creating user');
     }


  })
 
  router.get('/edituser/:userId', async (req, res) => {

    const userId = req.params.userId;
    try {
      const user = await User.findById(userId);
      res.json(user); // Respond with JSON containing the user data
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error fetching user data.' });
    } 
  });   

  router.post("/editUser", async (req,res) => {
    const {username,email,password,currentUser} = req.body
  
    try {
      // Remove leading and trailing spaces from the currentUser value
      // const cleanedCurrentUser = currentUser.trim();
    
      await User.updateOne(
        { _id: currentUser }, 
        { username: username, email: email, password: password }
      );
      console.log('Data updated successfully.');
    } catch (error) {
      console.log('Error while updating:', error);
    }
    res.redirect('/dashboard/admin');
  }) 

  
  router.post("/deleteUser/:userId", async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).send('User not found'); // Return an error if the user is not found
      }
  
      // If the user is successfully deleted, redirect to '/dashboard/admin'
      // res.redirect('/dashboard/admin');
      res.send('successsssss');
  
    } catch (error) {
      console.log('Error while deleting user:', error);
      res.status(500).send('Error while deleting user');
    } 
  });

//search router 
router.get('/search', async (req, res) => {

  const searchTerm = req.query.term;

  try {
    // Query MongoDB for users matching the search term (case-insensitive)
    const users = await User.find({ username: { $regex: searchTerm, $options: 'i' } });

    // Return the search results as JSON response
    res.json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});

router.get('/sort', async (req, res) => {
  try {
    // Query MongoDB for users matching the search term (case-insensitive)
    const users = await User.find().sort({username: 1});

    // Return the search results as JSON response
    res.json(users);
  } catch (error) {
    console.error('Error sorting : ', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});


 
  //email regex  
function isValid(email){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

module.exports = router;
