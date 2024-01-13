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
router.post('/user/:id/wishlist', isLoggedIn, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const user = req.user;

        user.wishlist.push(product);

        await user.save();
        


        req.flash('success', 'Added to wishlist successfully');
        res.redirect(`/user/${req.user._id}/wishlist`);
    } catch (e) {
        req.flash('error', 'Unable to add to wishlist at this moment');
        res.redirect('/error'); 
    }
});


module.exports = router;
