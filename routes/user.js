// const router = require('express').Router()
// const user = require('../models/user')
// //SIGN up
// router.post('/sign-up', async (req, res) => {
//   try {
//     const { username, email, password, address } = req.body

//     //check username length
//     if (username.length <= 5) {
//       return res
//         .status(400)
//         .json({ message: 'username length should be greater than 3' })
//     }
//     //check  if  user already exists
//     const existuser = await user.findone({ username: username })
//     if (existuser) {
//       return res.status(400).json({ message: 'username already exists' })
//     }
  

//  //check if email already exists
//  const existemail = await user.findone({ email: email });
//  if (existemail) {
//    return res.status(400).json({ message: 'email already exists' })
//  }
//  //check password length
//  if(password.length <=5){
//     return res.status(400).json({message:"password length shuold be gresther 5"})
//  }
//  //
//  const newuser = new user({username:username,email:email,password:password,address:address});
//  await newuser.save();
//  return res.status(200).json({message:"sign sucessfully"});

// } catch (error) {
//  res.status(500).json({ message: 'server mai error hai' });
// }
// });
// module.exports = router


const router = require('express').Router();
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken')
const { authenticationToken} = require("./userAuth")

// SIGN UP
router.post('/sign-up', async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    // Validate input
    if (!username || !email || !password || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check username length
    if (username.length <= 5) {
      return res.status(400).json({ message: 'Username length should be greater than 5' });
    }

    // Check if user already exists
    const existuser = await user.findOne({ username });
    if (existuser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existemail = await user.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check password length
    if (password.length <= 5) {
      return res.status(400).json({ message: 'Password length should be greater than 5' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newuser = new user({
      username,
      email,
      password: hashedPassword,
      address,
    });

    await newuser.save();
    return res.status(201).json({ message: 'Sign-up successful' });

  } catch (error) {
    console.error('Error during sign-up:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
});
//Sign in
router.post('/sign-in', async (req, res) => {
  const {username,password}= req.body;
  const existinguser = await  user.findOne({ username });
  if(!existinguser)
  {
    res.status(400).json({ message: 'Invalid credentails' });
  }
  await bcrypt.compare(password,existinguser.password,(err,data)=>{
    if(data)
    {
      const authClaims = [
        {name:existinguser.username},{role:existinguser.role}
      ]
      const token = jwt.sign({authClaims},"bookstore121",{
        expiresIn:"30d",
      })
      res.status(200).json({ id:existinguser._id,role:existinguser.role ,token:token});
    }else{
      res.status(400).json({ message: 'Invalid credentails' });
    }
  })

  try{
  } catch (error) {
    console.error('Error during sign in:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal server error' });
  }
});

//get user info
router.get("/get-user-information",authenticationToken,async (req,res)=>{
  try {
    const {id}=req.headers;
    const data = await user.findById(id).select('-password');
    return res.status(200).json(data);

  } catch (error) {
    res.status(500).json({message:"internal serever error"})
    
    
  }
});

// update address
router.put("/update-address",authenticationToken,async(req,res)=>{
  try {
    const {id}=req.headers;
    const {address} = req.body;
    await user.findByIdAndUpdate(id,{address:address})
    return res.status(200).json({message:"address updated sucessfully"})
    
  } catch (error) {
    res.status(500).json({message:"internal serever error"})
    
  }
})


module.exports = router;
