require('dotenv/config');
const express = require('express');
const app = express();
const PORT = 5000 || process.env.PORT;
const { hashSync, compareSync } = require('bcrypt');
const {UserModel, TodoModel} = require('./config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport')
const cors = require('cors');

const {connectDB } = require('./config/database')

const bodyParser = require("body-parser");


require('./config/passport')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(cors({
    origin:["http://localhost:3000"],
})
)
app.use(cors());


app.get('/',(req,res)=> {
    res.send("hello")
})
app.post('/signup',(req,res) => {
    UserModel.findOne({email:req.body.email}).then(exists => {
        if(exists){
            return res.status(400).json({error:"user already exists"})
        }
        const user = new UserModel({
            username : req.body.username,
            email : req.body.email,
            password:hashSync(req.body.password,10)
        })
        user.save().then((user => {
            res.send({
                success:true,
                message:"User created successfully",
                user : {
                    id:user._id,
                    username : user.username
                }
            })
        })).catch(err => {
            res.send({
                success:false,
                message:"Something went wrong",
                error : err
            })
        })
    }).catch(err => {
        console.log(err)
    })
    
})

app.post('/signin',(req,res) => {
    UserModel.findOne({email : req.body.email}).then(user => {
        if(!user){
            return res.status(401).send({
                success : false,
                message : "Could not found the user"
            })
        }
        if(!compareSync(req.body.password,user.password)){
            return res.status(401).send({
                success : false,
                message : "Could not verify the user"
            })
        }

        const payload = {
            username : user.username,
            id: user._id
        }
        const token = jwt.sign(payload,"secret random key",{expiresIn : "1d"});

        return res.status(200).send({
            success : true,
            message : "Logged successfully",
            user:payload,
            token : "Bearer "+token
        })
    })
})

app.get('/protected',passport.authenticate('jwt',{session:false}),(req,res) => {
    return res.status(200).send({
        success:true,
        user : {
            id : req.user._id,
            username : req.user.username
        }
    })
})

app.post("/addtodos",(req,res) => {
    const todo = new TodoModel({
        username : req.body.username,
        todoData : req.body.todoData,
        time : req.body.time,
        email : req.body.email,
        targetDate: new Date() || req.body.date
    })
    todo.save().then(todo => {
        UserModel.updateOne({_id:req.body.userid},{$inc : {todos:1}}).then(todos => {
            res.send({
                update:true,
                message1:"Todo added successfully",
                message2:"Todo count updated successfully",
            })
        }).catch(err => {
            res.send({
                update:false,
                message:"Note count not updated"
            })
        })
    }).catch(err => {
        res.send({
            success : false,
            message : "todo not added"
        })
    })
})


app.post('/todos',(req,res) => {
    TodoModel.find({username:req.body.username}).then(todos => {
        res.send({
            success:true,
            todos : todos,
        })
    }).catch(err => {
        res.send({
            success:false,
            message:"todos not fetched properly"
        })
    })
})

app.post('/marktodo',(req,res)=> {
    TodoModel.updateOne({_id:req.body.id},{$set : {completed:true}}).then(todo => {
        UserModel.updateOne({_id:req.body.userid},{$inc : {todosCompleted:1}}).then(todos => {
            res.send({
                update:true,
                message1:"Todo added successfully",
                message2:"CompletedTodo count updated successfully",
            })
        }).catch(err => {
            res.send({
                update:false,
                message:"CompletedTodo count not updated"
            })
        })
    }).catch(err => {
        res.send({
            update:false,
            message:"todo not updated"
        })
    })
})

app.post("/updatetodo",(req,res) => {
    todoid = req.body.todoid;
    data = req.body.todoData
    date = new Date(req.body.date);
    time = req.body.time;
    expired=false;
    if(new Date(date.getFullYear(),date.getMonth(),date.getDate(),time.slice(0,2),time.slice(3,5)).getTime() <= new Date().getTime()){
        expired = true
    }
    TodoModel.updateOne({_id:todoid},{$set : {date:date,time:time,todoData:data,expired:expired}}).then(todo => {
        res.send({
            update:true,
            message:"todo updated successfuly"
        })
    }).catch(err => {
        res.send({
            update:false,
            message:"todo not updated!",
            error:err
        })
    })

})


app.post('/deletetodo',(req,res)=>{
    TodoModel.deleteOne({_id:req.body.id}).then(todo => {
        res.send({
            delete:true,
            message:"Todo deleted successfully",
        })
    }).catch(err => {
        res.send({
            delete:false,
            message:"Cannot delete todo"
        })
    })
})

app.post('/deletenote',(req,res) => {
    NoteModel.deleteOne({_id:req.body.id}).then(todo => {
        res.send({
            delete:true,
            message:"Note deleted successfully"
        })
    }).catch(err => {
        res.send({
            delete:false,
            message:"Cannot delete Note"
        })
    })
})

app.post('/analatics',(req,res) => {
    UserModel.findOne({_id:req.body.id}).then(user => {
        res.send({
            success:true,
            message:"User found",
            userdata:{
                username:user.username,
                email:user.email,
                notes:user.notes,
                todos:user.todos,
                completedTodos:user.todosCompleted
            }
        })
    }).catch(err => {
        res.send({
            success:false,
            message:"User not found"
        })
    })
})


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening at port ${PORT}`);
    })
})
