const router = require('express').Router();

const {getAll,updateuser,deleteuser} = require('../contoller/usercontroller');

router.get('/getalldetails',getAll);
router.patch('/update',updateuser);
router.delete('/delete',deleteuser);

module.exports=router;