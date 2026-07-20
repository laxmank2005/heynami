import { User } from "../models/userMOdel";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try{
        const { fullName, username, password, confirmPassworrd, gender}= req.body;
        if (!fullName || !username || !password || !confirmPassworrd || !gender) {
            return res.status(400).json({message:"All fields are required"});
    }
    if (password !== confirmPassworrd) {
        return res.status(400).json({message:"Password and confirm password should be same"});
    }
    const user = await  User.findOne({username});
    if (user){
        return res.status(400).jsson({message:"username already exist try different"});
    }
    const hashedPasword = await bcrypt.hash(password, 10);

    //Profile photo generation based on gender and username api
        const maleProfilePhoto = `https://avatarapi.runflare.run/public/boy=${username}`;

        const femaleProfilePhoto = `https://avatarapi.runflare.run/public/girl=${username}`;
    
        await User.create({
        fullName,
        username,
        password:hashedPasword,
        profilePhoto: gender === male ? maleProfilePhoto : femaleProfilePhoto,
        gender
    })
      
}
    catch(error){
        console.log( error);
    }
}