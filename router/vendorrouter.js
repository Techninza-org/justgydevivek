const router = require('express').Router();

// const multer = require('multer');
const path = require('path');
const multer = require('multer');

const {kyc,completed, liveOrders,addservicebyvendor,allservices, uploadprofilephoto, updatevendor,getAll, deletevendor, acceptorder, rejectorder, orderrequests, totalorders, getallratings} = require('../contoller/vendorcontroller');


// Configure multer to store files on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
const upload = multer({ storage: storage });

router.post('/addservice',upload.array('images', 10), addservicebyvendor);
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

module.exports=router;