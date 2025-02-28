const router = require('express').Router();
const User = require('../models/user');
const { authenticationToken } = require('./userAuth');

//  Add Book to Favourites
router.put('/add-book-to-favourite', authenticationToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    //  Validate required fields
    if (!id || !bookid) {
      return res.status(400).json({ status: 'error', message: 'User ID and Book ID are required.' });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (userData.favourites.includes(bookid)) {
      return res.status(200).json({ status: 'success', message: 'Book is already in favourites' });
    }

    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

    return res.status(200).json({ status: 'success', message: 'Book added to favourites' });

  } catch (error) {
    console.error("Error in Add to Favourites:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

// Remove Book from Favourites
router.put('/remove-book-from-favourite', authenticationToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    //  Validate required fields
    if (!id || !bookid) {
      return res.status(400).json({ status: 'error', message: 'User ID and Book ID are required.' });
    }

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    if (!userData.favourites.includes(bookid)) {
      return res.status(400).json({ status: 'error', message: 'Book is not in favourites' });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    return res.status(200).json({ status: 'success', message: 'Book removed from favourites' });

  } catch (error) {
    console.error("Error in Remove from Favourites:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

// Get Favourite Books of a User
router.get('/get-favourite-book', authenticationToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(400).json({ status: 'error', message: 'User ID is required.' });
    }

    const userData = await User.findById(id).populate('favourites');
    if (!userData) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const favouriteBooks = userData.favourites;

    return res.json({
      status: 'success',  
      data: favouriteBooks,
    });

  } catch (error) {
    console.error("Error in Get Favourite Books:", error);
    res.status(500).json({ status: 'error', message: 'An error occurred', error: error.message });
  }
});

//  Correct module export
module.exports = router;
