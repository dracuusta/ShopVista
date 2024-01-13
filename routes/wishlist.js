const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');

// Display user's wishlist
router.get('/user/:userId/wishlist', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('wishlist');
        res.render('wishlist/showWishList', { userWishlist: user.wishlist });
    } catch (e) {
        req.flash('error', 'Unable to view wishlist');
        res.render('error');
    }
});
// Add a product to the user's wishlist
router.post('/user/:userId/wishlist/add/:productId', isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        const user = await User.findById(req.params.userId);

        if (!product || !user) {
            req.flash('error', 'Product or user not found');
            return res.redirect('/error'); // Handle the error accordingly
        }

        // Check if the product is already in the wishlist
        if (user.wishlist.includes(product._id)) {
            req.flash('error', 'Product is already in your wishlist');
            return res.redirect(`/user/${req.params.userId}/wishlist`);
        }

        user.wishlist.push(product);
        await user.save();
        req.flash('success', 'Added to wishlist successfully');
        res.redirect(`/user/${req.params.userId}/wishlist`);
    } catch (e) {
        req.flash('error', 'Unable to add to wishlist at this moment');
        res.redirect('/error'); // Handle the error accordingly
    }
});


module.exports = router;
