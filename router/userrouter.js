const router = require('express').Router();

const {getAll,updateuser,deleteuser,getallservices, bookservice, myorders, setname, userhome, addaddress, getbycatergory} = require('../contoller/usercontroller');

router.get('/getalldetails',getAll);
router.patch('/updatePassword',updateuser);
router.delete('/delete',deleteuser);
router.post('/getallservices',getallservices);
router.post('/bookservice',bookservice);
router.get('/myorder',myorders);
router.patch('/setname',setname);
router.get('/home',userhome);
router.post('/addaddress',addaddress);
router.post('/getbycatergory',getbycatergory);

module.exports=router;