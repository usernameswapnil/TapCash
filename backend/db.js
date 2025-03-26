const mongoose=require("mongoose");
mongoose.connect("mongodb://Admin69:swapnilhero123@cluster1-shard-00-00.rpirq.mongodb.net:27017,cluster1-shard-00-01.rpirq.mongodb.net:27017,cluster1-shard-00-02.rpirq.mongodb.net:27017/?replicaSet=atlas-tmwehx-shard-0&ssl=true&authSource=admin")
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30,
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
})
mongoose.model("User",userSchema);

module.exports={
    User
}