const mongoose = require('mongoose');
require('dotenv/config');
// mongoose.connect('mongodb://localhost:27017/smartnotes');

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.APP_DATABASE);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

// mongoose.connect(process.env.APP_DATABASE).then(db => console.log("database connected")).catch(err => console.log("Databse connection failed"));
const userSchema = mongoose.Schema({
    username : String,
    email : String,
    password : String,
    notes : {
        type:Number,
        default:0
    },
    todos : {
        type:Number,
        default:0
    },
    todosCompleted : {
        type:Number,
        default:0
    },
    date : {
        type:Date,
        default : Date.now
    }
});

const todoSchema = mongoose.Schema({
    username : String,
    todoData : String,
    time : String,
    email : String,
    completed:{
        type:Boolean,
        default:false
    },
    expired:{
        type:Boolean,
        default:false
    },
    targetDate:{
        type:Date,
        default:Date.now
    },
    date : {
        type:Date,
        default:Date.now
    }
})

const UserModel = mongoose.model("User",userSchema);
const TodoModel = mongoose.model("Todo",todoSchema);

module.exports = {UserModel,TodoModel,connectDB};

// {
//     "username" : "Revanth",
//     "email" : "revanth@gamail.com",
//     "password" : 1234
// }