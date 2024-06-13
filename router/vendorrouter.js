const router = require('express').Router();

const {addservicebyvendor,allservices, updatevendor,getAll, deletevendor} = require('../contoller/vendorcontroller');

router.post('/addservice',addservicebyvendor);
router.get('/allservices',allservices);
router.patch('/update',updatevendor);
router.get('/allvendorsdetails',getAll);
router.delete('/delete',deletevendor);

module.exports=router;