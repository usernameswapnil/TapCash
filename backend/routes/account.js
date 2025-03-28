const express=require("express");
const router=express.Router();
const { Account } = require("../db");
const { authMiddleware } = require('../middleware');
router.get("/balance",authMiddleware,async function(req,res){
    const account=await Account.findOne({
        userId:req.userId
    })
    res.json({
        balance: account.balance
    })
})
module.exports=router;

