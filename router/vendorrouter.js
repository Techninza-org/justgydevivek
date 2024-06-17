const router = require('express').Router();

const multer = require('multer');

const {kyc,completed, liveOrders,addservicebyvendor,allservices, uploadprofilephoto, updatevendor,getAll, deletevendor, acceptorder, rejectorder, orderrequests, totalorders, getallratings} = require('../contoller/vendorcontroller');


router.post('/addservice', addservicebyvendor);
router.get('/allservices',allservices);
router.patch('/update',updatevendor);
router.get('/allvendorsdetails',getAll);
router.delete('/delete',deletevendor);
router.patch('/acceptorder',acceptorder);
router.patch('/rejectorder',rejectorder);
router.get('/orderrequests',orderrequests);
router.get('/totalorders',totalorders);
router.get('/getallratings',getallratings);

router.patch('/uploadprofilephoto',uploadprofilephoto);
router.get('/liveorders',liveOrders);
router.get('/completed',completed);
router.post('/kyc',kyc);

module.exports=router;