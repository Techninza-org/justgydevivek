const router = require('express').Router();

const {getAll,updateuser,deleteuser,getallservices, bookservice, myorders, setname, userhome, addaddress} = require('../contoller/usercontroller');

router.get('/getalldetails',getAll);
router.patch('/update',updateuser);
router.delete('/delete',deleteuser);
router.post('/getallservices',getallservices);
router.post('/bookservice',bookservice);
router.get('/myorder',myorders);
router.patch('/setname',setname);
router.get('/home',userhome);
router.post('/addaddress',addaddress);

module.exports=router;