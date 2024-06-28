const router = require('express').Router();

const multer = require('multer');

const {kyc,completed, liveOrders,addservicebyvendor,allservices, uploadprofilephoto,
     updatevendor,getAll, deletevendor, acceptorder, rejectorder, orderrequests, totalorders,
      getallratings, updatemobileemail,updatediscount,getkycStatus, addaddress,getaddress,
       makeinactive,updateaddress,getcatergory, makeactive, getliveservices} = require('../contoller/vendorcontroller');
const {generateotp, resendotp, verifyotp}=require('../contoller/testotp');

router.post('/addservice', addservicebyvendor);
router.post('/addaddress',addaddress);
router.get('/allservices',allservices);
router.patch('/update',updatevendor);
router.get('/allvendorsdetails',getAll);
router.delete('/delete',deletevendor);
router.patch('/acceptorder',acceptorder);
router.patch('/rejectorder',rejectorder);
router.get('/orderrequests',orderrequests);
router.get('/totalorders',totalorders);
router.get('/getallratings',getallratings);
router.get('/getaddress',getaddress);

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

router.patch('/makeinactive',makeinactive);
router.patch('/makeactive',makeactive);

router.patch('/updateaddress',updateaddress);
router.get('/getcatergory',getcatergory);
router.get('/getliveservices',getliveservices);
module.exports=router;