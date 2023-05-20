const epxress = require("express");
const router = epxress.Router();

const { sellProduct, updateApprove, updateReject, getProducts, updateMarkAsSold } = require('../controllers/sellProduct');
const { getAllProducts, getProductCategorywise, getProductStatewise, getProductCitywise, searchProducts, getProductById, getProductUser } = require('../controllers/product');
const authentication = require('../middleware/authentication');


router.route("/sellProduct").post(authentication, sellProduct);
router.route("/adminApproved").patch(updateApprove);
router.route("/adminRejected").patch(updateReject);
router.route("/updateMarkAsSold").patch(updateMarkAsSold);
router.route("/getAllProducts").get(getAllProducts);
router.route("/getProductById/:productId").get(getProductById);
router.route("/getProductCategorywise/:category").get(getProductCategorywise);
router.route("/getProductStatewise/:state").get(getProductStatewise);
router.route("/getProductCitywise/:city").get(getProductCitywise);
router.route("/getProductUser/:userId").get(authentication, getProductUser)



router.route('/search').get(searchProducts);

module.exports = router;

