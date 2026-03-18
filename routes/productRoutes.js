const productControllers=require('../controllers/productController');
const express=require("express");
const verifyToken = require('../middlewares/verifyToken');

const router=express.Router();

router.post('/add-product/:firmId',verifyToken,productControllers.addProducts);



router.get('/:firmId/products',productControllers.getProductByFirm);

router.delete('/:productId',productControllers.deleteProductById);


module.exports = router;
