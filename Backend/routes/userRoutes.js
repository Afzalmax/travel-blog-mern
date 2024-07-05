const router = require('express').Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/Authmiddleware');

router.post("/register",userController.createUser);
router.post("/login",userController.loginUser);
router.get("/getuser",authMiddleware,userController.getUser);
router.get("/profile",authMiddleware,userController.getProfile);
module.exports =  router ;