const mongoose=require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://Admin69:swapnilhero123@cluster1-shard-00-00.rpirq.mongodb.net:27017,cluster1-shard-00-01.rpirq.mongodb.net:27017,cluster1-shard-00-02.rpirq.mongodb.net:27017/?replicaSet=atlas-tmwehx-shard-0&ssl=true&authSource=admin");
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
connectDB();
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
const User=mongoose.model("User",userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports={
    User,
    Account
}
