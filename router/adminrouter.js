const router = require('express').Router();

const {createUser,createVendor,deleteVendorById,fetchAllServices,fetchAllUsers, fetchAllVendors, fetchAllBookedServices
    ,fetchAllAddresses,fetchAllKycs,fetchKycByVendorId,deleteUserById,fetchVendorById} = require('../contoller/admincontroller');

//create
router.post('/createUser',createUser);
router.post('/createVendor',createVendor);

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

//fetch by Id
router.get('/fetchKycByVendorId/:id',fetchKycByVendorId);
router.get('/fetchVendorById/:id',fetchVendorById);

module.exports=router;