const Product = require('../models/product');

module.exports.index = async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products })
}

module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
}

module.exports.createProduct = async (req, res, next) => {

    const product = new Product(req.body.product);
    product.author = req.user._id;
    await product.save();
    req.flash('success', 'Successfully made a new product!');
    res.redirect(`/products/${product._id}`)
}

module.exports.showProduct = async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!product) {
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
}

module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/products/${product._id}`)
}

module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted product')
    res.redirect('/products');
}