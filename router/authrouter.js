const router = require('express').Router();

const {signup,vendorsignup,login,vendorlogin} = require('../contoller/authcontroller');

//signup
router.post('/vendorsignup',vendorsignup);
router.post('/usersignup',signup);

//login
router.post('/vendorlogin',vendorlogin);
router.post('/userlogin',login);

module.exports=router;