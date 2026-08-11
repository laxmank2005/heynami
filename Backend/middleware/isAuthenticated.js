import jwt from "jsonwebtoken";


const isauthenticated = async (req,res,next) =>{
    try{
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) {
            return res.status(401).json({message:"User Not Unauthorized"});
        };
        const decode = await jwt.verify(token,process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({message:"Invalid Token"});
        };

        req.id = decode.userId;

        next();
    }
    catch(err){ 
        console.log(err);
        return res.status(401).json({message: "Invalid or Expired Token"});
    }
};
export default isauthenticated;