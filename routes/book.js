// const router = require('express').Router()
// // const bcrypt = require('bcryptjs');
// const user = require('../models/user')
// const jwt = require('jsonwebtoken')
// const Book = require('../models/book')
// const { authenticationToken } = require('./userAuth')

// //admin book...admin
// router.post('/add-book', authenticationToken, async (req, res) => {
//   try {
//     const { id } = req.headers
//     const user = await user.findById(id);
//     if (user.role !== 'admin') {
//       return res
//         .status(400)
//         .json({ message: 'you cant acess to perform admin work' })
//     }
//     const book = new Book({
//       url: req.body.url,
//       title: req.body.title,
//       author: req.body.author,
//       price: req.body.price,
//       desc: req.body.desc,
//       language: req.body.language,
//     })
//     await book.save();
//     res.status(200).json({ message: 'book added sucessfully' })
//   } catch (error) {
//    // res.status(500).json({ message: 'internal serever error' })
//     res.status(500).json({ message: 'Internal server error', error: error.message });

//   }
// })
// module.exports = router

// CHAT gpt
const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Book = require('../models/book');
const { authenticationToken } = require('./userAuth');

// ✅ Admin route: Add book
router.post('/add-book', authenticationToken, async (req, res) => {
  try {
    const { id } = req.headers; // Extract user ID from headers (Not recommended)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const fetchedUser = await User.findById(id);
    if (!fetchedUser) return res.status(404).json({ message: 'User not found' });
    if (fetchedUser.role !== 'admin') return res.status(403).json({ message: 'Access denied: Admins only' });

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();
    res.status(200).json({ message: 'Book added successfully', data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

//  Update book (Fixed: Get ID from req.params)
router.put('/update-book/:id', authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;
    

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

// ✅ Delete book (Fixed: Get ID from req.params)
router.delete('/delete-book/:id', authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

// ✅ Get all books
router.get('/get-all-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json({ status: 'success', data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

// ✅ Get recently added books (latest 4)
router.get('/get-recent-books', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({ status: 'success', data: books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

// ✅ Get book by ID
router.get('/get-book-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ status: 'success', data: book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred', error: error.message });
  }
});

module.exports = router;
