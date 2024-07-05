const router = require('express').Router();

const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const postRoutes = require('./postRoutes');
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/post',postRoutes);

module.exports = router;