import jwt from "jsonwebtoken";

//Login Seller: /api/seller/login

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      // Generate JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // Set cookie with token
      res.cookie("sellerToken", token, {
        httpOnly: true, //prevent client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", //use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days(cookie expiration time)
      });
      return res.json({ success: true, message: "Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Seller isAuth: /api/seller/is-auth

export const isSellerAuth = async (req, res) => {
  try {

    return res.json({ success: true });

  } catch (error) {

    console.error(error.message);
    return res.json({ success: false, message: error.message });

  }
};

// Logout Seller: /api/seller/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
        httpOnly: true, //prevent client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", //use secure cookies in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
        });
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
    }
 }
