const router = require('express').Router();

const {getAll, addtocart, bookAllServicesInCart, detelteServiceFromCart, getCartServicesFromCurrentUser,
     updateQuantityOfServiceInCart,updateuser,deleteuser,getallservices, bookservice, myorders, setname,
    userhome, addaddress, getbycatergory, provideRating, getall, uploadimage} = require('../contoller/usercontroller');

const {generateuserotp,resenduserotp,verifyuserotp} = require('../contoller/testotp');


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
router.post('/provideRating',provideRating);
router.get('/getall',getall);
router.patch('/uploadimage',uploadimage);

router.get('/generateotp',generateuserotp);
router.post('/verifyotp',verifyuserotp);
router.get('/resendotp',resenduserotp);

router.post('/addtocart',addtocart);
router.post('/bookAllServicesInCart',bookAllServicesInCart);
router.delete('/detelteServiceFromCart',detelteServiceFromCart);
router.get('/getCartServicesFromCurrentUser',getCartServicesFromCurrentUser);
router.patch('/updateQuantityOfServiceInCart',updateQuantityOfServiceInCart);


module.exports=router;