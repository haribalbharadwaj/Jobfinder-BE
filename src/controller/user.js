const User = require('../model/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const getUser = async(req,res)=>{
    try{
        const users = await User.find()
        res.json({
            status:"SUCCESS",
            data:users
        })
    }catch(error){
        res.status(500).json({
            status:"Failed",
            message:"Something went wrong"
        })
    }
}

const signUpUser = async(req,res)=>{
    try{
        const {name,email,mobile,password} = req.body;
        const existingUser = await User.findOne({email:email});

        if(existingUser){
            return res.status(400).json({
                message:'User already exists,please login or use other email address'
            })
        }else{
        const encryptedPassword = await bcrypt.hash(password,10)
        await User.create({
            name,
            email,
            mobile,
            password:encryptedPassword
        })
        res.json({
            status:"SUCCESS",
            message:"User sign up successfully"
        })
    }}catch(error){
        res.status(500).json({
            status:"Failed",
            message:"Something went wrong"
        })
    }
}

const loginUser = async(req,res,next)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await User.findOne({email:email});

        if(existingUser){
            const passwordCorrect = await bcrypt.compare(password,existingUser.password);
            if(passwordCorrect){
                const token = jwt.sign({userID:existingUser._id},'secret',{expiresIn:'1h'});
                return res.status(200).json({
                    message:'Login successful',
                    email:existingUser.email,
                    token
                })
            }else{
                res.status(400).json({
                    message:'Invalid credentials',
                })
            }
        }else{
            res.status(400).json({
                message:'User not found',
            });
        }
    }catch(error){
        next("Error logging in", error);
    }
}

module.exports={
    getUser,
    signUpUser,
    loginUser
}