const productControllers=require('../controllers/productController');
const express=require("express");

const router=express.Router();

router.post('/add-product/:firmId',productControllers.addProducts);



router.get('/:firmId/products',productControllers.getProductByFirm);

router.delete('/:productId',productControllers.deleteProductById);


module.exports = router;