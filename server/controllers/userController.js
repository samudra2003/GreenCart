import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register user: /api/user/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
     if(!name || !email || !password) {
      return res.json({ success:false, message: "Missing Details"});
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword  = await  bcrypt.hash(password, 10);
    // Create new user
    const  user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});

    // Set cookie with token
    res.cookie('token', token, { 
        httpOnly: true,  //prevent client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', //use secure cookies in production
        sameSite: process.env.NODE_ENV === 'production' ?'none':'strict' , //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days(cookie expiration time)
     });

    return res.json({ success: true, user: {email: user.email,name : user.name} });

  } catch (error) {
    console.error( error.message);
    return res.json({ success: false, message: error.message });
  }
};

//Login user: /api/user/login
export const login = async (req, res) => {
  
    try {
        const { email, password } = req.body;
        
         if(!email || !password) {
        return res.json({ success:false, message: "Email and Password are required"});
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
        return res.json({ success: false, message: "Invalid email or password"});
        }
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.json({ success: false, message: "Invalid email or password" });
        }
        // Generate JWT token
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});
    
        // Set cookie with token
        res.cookie('token', token, { 
            httpOnly: true,  //prevent client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ?'none':'strict' , //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days(cookie expiration time)
         });
    
         return res.json({ success: true, user:{email : user.email,name :  user.name} });
    
    } catch (error) {
        console.error( error.message);
        return res.json({ success: false, message: error.message });
    }

 }

 // check Auth user: /api/user/is-auth

export const isAuth = async (req, res) => {
    try {
      const userId = req.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.error( error.message);
        return res.json({ success: false, message: error.message });
    }
}

//Logout user: /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{ 
            httpOnly: true,  //prevent client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', //use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ?'none':'strict' , //CSRF protection
         });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.error( error.message);
        return res.json({ success: false, message: error.message });
    }
}



