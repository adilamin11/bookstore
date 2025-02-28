const router = require('express').Router();
const User = require('../models/user');
const { authenticationToken } = require('./userAuth');

// Add to Cart
router.put('/add-to-cart', authenticationToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({status:"success",message:"book is already in cart" });
    }
    
   
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

    return res.json({
      status: 'success',  // Fixed typo
      message: 'Book added to cart successfully!',
    });

  } catch (error) {
    console.error("Error in Add to Cart:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

// Remove from Cart
router.put('/remove-from-cart/:bookid', authenticationToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const { id } = req.headers;

    //  Validate required fields
    
    await User.findByIdAndUpdate(id, { $pull: { cart: bookid }, });

    return res.json({
      message: 'Book removed from cart successfully!',
    });

  } catch (error) {
    console.error("Error in Remove from Cart:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

//  Get User Cart
router.get('/get-user-cart', authenticationToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'User ID is required.' });
    }

    const userData = await User.findById(id).populate('cart');
    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const cart = userData.cart.reverse();
    
    return res.json({
      status: 'success',
      data: cart,
    });

  } catch (error) {
    console.error("Error in Get User Cart:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});


module.exports = router;
