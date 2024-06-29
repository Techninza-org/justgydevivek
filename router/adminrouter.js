const router = require('express').Router();

const {createUser,createVendor,deleteVendorById,fetchAllServices,fetchAllUsers, fetchAllVendors, fetchAllBookedServices
    ,fetchAllAddresses,fetchAllKycs,fetchKycByVendorId,deleteUserById,fetchVendorById, addCatergory,
    approveKycByVendorId,rejectKycByVendorId,editUserById,editVendorById, fetchAllServicesByVendorEmail,
     fetchServiceById, fetchUserById, createFAQ, getAllUsers, getAllVendors} = require('../contoller/admincontroller');

//create
router.post('/createUser',createUser);
router.post('/createVendor',createVendor);
router.post('/createFAQ',createFAQ);

//delete by Id
router.delete('/deleteVendorById/:id',deleteVendorById);
router.delete('/deleteUserById/:id',deleteUserById);

//fetch All
router.get('/fetchAllServices',fetchAllServices);
router.get('/fetchAllUsers',fetchAllUsers);
router.get('/fetchAllVendors',fetchAllVendors);
router.get('/fetchAllBookedServices',fetchAllBookedServices);
router.get('/fetchAllAddresses',fetchAllAddresses);
router.get('/fetchAllKycs',fetchAllKycs);
router.get('/fetchAllServicesByVendorEmail/:email',fetchAllServicesByVendorEmail);

router.get('/getAllUsers',getAllUsers); //new first
router.get('/getAllVendors',getAllVendors); //new first

//fetch by Id
router.get('/fetchKycByVendorId/:id',fetchKycByVendorId);
router.get('/fetchVendorById/:id',fetchVendorById);
router.get('/fetchServiceById/:id',fetchServiceById);
router.get('/fetchUserById/:id',fetchUserById);

//add
router.post('/addCatergory',addCatergory);

//kyc
router.patch('/completeKycByVendorId/:id',approveKycByVendorId);
router.patch('/rejectKycByVendorId/:id',rejectKycByVendorId);

//edit by Id
router.patch('/editUserById/:id',editUserById);
router.patch('/editVendorById/:id',editVendorById);

module.exports=router;