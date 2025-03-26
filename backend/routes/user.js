const express=require("express");
const router=express.Router();
const zod=require("zod");
const jwt=require("jsonwebtoken");
const { User } = require("../db");
const { JWT_SECRET } = require("../config");
//signup and signin routes
const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
router.post("/signup",async function(req,res){
    const body=req.body;
    const {success}=signupSchema.safeParse(req.body); //chatgpt it to understand (in simple terms)
    if(!success){
        return res.status(411).json({
            message:"Email already taken/Incorect inputs"
        })
    }
    const existingUser=User.findOne({ //This stops the duplicate user from being created.
        username:body.username
    })
    if(existingUser._id){ 
        return res.json({
            message:"Email already taken/Incorect inputs"
        })
    }

    const dbUser=await User.create({
        username:body.username,
        password:body.password,
        firstName:body.firstName,
        lastName:body.lastName,
    });
    const  token=jwt.sign({
        userId:dbUser._id
    },JWT_SECRET)
    res.json({
        message:"User created successfully",
        token:token
    })
})

const signinSchema=zod.object({
    username: zod.string().email(),
	password: zod.string()
})
router.post("/signin",async function(req,res){
    
    const {success}=signinSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user=await User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    if(user){
        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET);
        res.json({
            token:token
        })
        return;
    }
    res.status(411).json({
        message: "Error while logging in"
    })
})




module.exports=router;
