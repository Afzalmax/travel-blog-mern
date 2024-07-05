const router = require('express').Router();
const adminController = require('../controllers/adminController');

const adminMiddleware = require('../middleware/Adminmiddleware');

router.post("/register",adminController.createAdmin);
router.post("/login",adminController.loginAdmin);
router.get("/getadmin",adminMiddleware,adminController.getAdmin);
module.exports =  router ;