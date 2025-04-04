const express=require("express");
const router=express.Router();
const zod=require("zod");
const jwt=require("jsonwebtoken");
const { User,Account } = require("../db");
const { JWT_SECRET } = require("../config");
const {authMiddleware}=require("./middleware");
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
    const existingUser=await User.findOne({ //This stops the duplicate user from being created.
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
	const userId=dbUser._id;
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })	
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
const updateBody=zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
router.put("/",authMiddleware,async function(req,res){
    const {success}=updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({_id:req.userId},req.body);
    res.json({
        message: "Updated successfully"
    })

})
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})



module.exports=router;
