import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return res.json({ success: false, message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id){
            req.body.userId = decoded.id;
        }else{
            return res.json({ success: false, message: "Unauthorized" });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default authUser;