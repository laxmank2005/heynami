import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try{
        const { fullName, username, password, confirmPassword, gender}= req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({message:"All fields are required"});
    }
    if (password !== confirmPassword) {
        return res.status(400).json({message:"Password and confirm password should be same"});
    }
    const user = await  User.findOne({username});
    if (user){
        return res.status(400).json({message:"username already exist try different"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //Profile photo generation based on gender and username api
        const maleProfilePhoto = `https://avatarapi.runflare.run/public/boy=${username}`;

        const femaleProfilePhoto = `https://avatarapi.runflare.run/public/girl=${username}`;
    
        await User.create({
        fullName,
        username,
        password:hashedPassword,
        profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
        gender
    })
    return res.status(201).json({
    message: "User registered successfully"
});
    
      
}
    catch(error){
        console.error( error);
        return res.status(500).json({
        message: "Internal Server Error"
    });
    }
}