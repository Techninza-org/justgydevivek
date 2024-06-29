const router = require('express').Router();

const {getAll, addtocart, bookAllServicesInCart, detelteServiceFromCart, getCartServicesFromCurrentUser,
     updateQuantityOfServiceInCart,updateuser,deleteuser,getallservices, bookservice, myorders, setname,
    userhome, addaddress, getbycatergory, provideRating, getall, uploadimage, updateMobileAndEmail, cancelBookedService,
addServiceToWishlist, deleteServiceFromWishlist, getAllServicesInWishlist,moveServiceFromWishlistToCart,
 getAllRatingsGivenByUser, getAllCategoriesWithIcon,getServiceByServiceId,addCoinsToUser,updateUser,
  getAllAddress,getAllRatingByServiceIdAndVendorId, getBookedServiceWithHighestQuantity,
  getBookedServiceWithHighestQuantityInLastWeek, getAllFaqs, getTop5MostBookedServicesInLastWeek, getAboutUs} = require('../contoller/usercontroller');

const {generateuserotp,resenduserotp,verifyuserotp} = require('../contoller/testotp');


router.get('/getalldetails',getAll);
router.patch('/updatePassword',updateuser);
router.patch('/update',updateUser);
router.delete('/delete',deleteuser);
router.post('/getallservices',getallservices);  //by catergory
router.post('/bookservice',bookservice);
router.get('/myorder',myorders);// get all booked services
router.patch('/setname',setname);
router.get('/home',userhome);
router.post('/addaddress',addaddress);
router.post('/getbycatergory',getbycatergory); //get all services with rating and catergory
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

router.patch('/updateMobileAndEmail',updateMobileAndEmail);
router.patch('/cancelBookedService',cancelBookedService);

router.post('/addServiceToWishlist',addServiceToWishlist);
router.delete('/deleteServiceFromWishlist',deleteServiceFromWishlist);
router.get('/getAllServicesInWishlist',getAllServicesInWishlist);
router.post('/moveToCart',moveServiceFromWishlistToCart);

router.get('/getAllRatingsGivenByUser',getAllRatingsGivenByUser);
router.get('/getAllCategoriesWithNoOfServices',getAllCategoriesWithIcon);
router.post('/getServiceByServiceId',getServiceByServiceId);

router.post('/addCoinsToUser',addCoinsToUser);
router.get('/getAllAddress',getAllAddress);
router.post('/getAllRatingByServiceIdAndVendorId',getAllRatingByServiceIdAndVendorId);
router.get('/trendingBookedService',getBookedServiceWithHighestQuantity);
router.get('/trendingBookedServiceInLastWeek',getBookedServiceWithHighestQuantityInLastWeek);

router.get('/getAllFaqs',getAllFaqs);

router.get('/getTopTrendingServices',getTop5MostBookedServicesInLastWeek);

router.get('/getAboutUs',getAboutUs);


module.exports=router;