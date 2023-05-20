const express = require('express');
const router = express.Router();
const { addToWishList, deleteFromWishlist, getAllWishlist, isProductWishlisted } = require('../controllers/wishlist');

router.route('/addtowishlist').post(addToWishList);
router.route('/getallwishlist/:userId').get(getAllWishlist)
router.route('/deletefromwishlist/:userId/:productId').patch(deleteFromWishlist);
router.route('/isProductWishlisted/:userId/:productId').get(isProductWishlisted);



module.exports = router; 