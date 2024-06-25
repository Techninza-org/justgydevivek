const router = require('express').Router();

const multer = require('multer');

const {kyc,completed, liveOrders,addservicebyvendor,allservices, uploadprofilephoto,
     updatevendor,getAll, deletevendor, acceptorder, rejectorder, orderrequests, totalorders,
      getallratings, updatemobileemail,updatediscount,getkycStatus} = require('../contoller/vendorcontroller');
const {generateotp, resendotp, verifyotp}=require('../contoller/testotp');

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

router.patch('/uploadprofilephoto',  uploadprofilephoto);
router.get('/liveorders',liveOrders);
router.get('/completed',completed);
router.post('/kyc',kyc);
router.get('/getKycStatus',getkycStatus);

router.get('/generateotp',generateotp);
router.post('/verifyotp',verifyotp);
router.get('/resendotp',resendotp);

router.patch('/updatemobileemail',updatemobileemail);
router.patch('/updateDiscount',updatediscount);

module.exports=router;