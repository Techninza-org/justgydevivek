const router = require('express').Router();

const {signup,vendorsignup,login,vendorlogin,adminlogin, adminsignup} = require('../contoller/authcontroller');

//signup
router.post('/vendorsignup',vendorsignup);
router.post('/usersignup',signup);
router.post('/adminsignup',adminsignup);

//login
router.post('/vendorlogin',vendorlogin);
router.post('/userlogin',login);
router.post('/adminlogin',adminlogin);

module.exports=router;