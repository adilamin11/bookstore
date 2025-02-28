const router = require("express").Router();
const { authenticationToken } = require("./userAuth");
const Book = require("../models/book"); // ✅ Fixed model import
const Order = require("../models/order"); // ✅ Fixed model import
const User = require("../models/user"); // ✅ Fixed model import

// Place Order
router.post("/place-order", authenticationToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, books: [orderData._id] }); // ✅ Fixed books array
      const orderDataFromDb = await newOrder.save();

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.json({
      status: "success",
      message: "Order placed successfully",
    });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
});

// Get Order History of a User
router.get("/get-order-history", authenticationToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "books" }, // ✅ Fixed book -> books
    });

    if (!userData) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    const orderData = userData.orders.reverse();

    return res.json({
      status: "success",
      data: orderData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
});

// Get All Orders (Admin)
router.get("/get-all-orders", authenticationToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: "books" }) // ✅ Fixed book -> books
      .populate({ path: "user" })
      .sort({ createdAt: -1 });

    return res.json({
      status: "success",
      data: orders,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
});

// Update Order Status (Admin)
router.put("/update-status/:id", authenticationToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "success",
      message: "Order status updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
});

module.exports = router;
