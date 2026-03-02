const vendorControllers=require('../controllers/vendorController');
const express=require("express");

const router = express.Router();
router.post('/register',vendorControllers.vendorRegister);
router.post('/login',vendorControllers.vendorLogin);

router.get('/all-vendors',vendorControllers.getAllVendors);
router.get('/single-vendor/:id',vendorControllers.getVendorById);
module.exports =router; 