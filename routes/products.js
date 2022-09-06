const express = require('express');
const router = express.Router();
const products = require('../controllers/products');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Product = require('../models/product');

router.route('/')
    .get(catchAsync(products.index))
    .post(isLoggedIn, upload.array('image'), validateProduct, catchAsync(products.createProduct))


router.get('/new', isLoggedIn, products.renderNewForm)

router.route('/:id')
    .get(catchAsync(products.showProduct))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateProduct, catchAsync(products.updateProduct))
    .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProduct));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(products.renderEditForm))



module.exports = router;