const express=require('express');
const mongose=require('mongoose');
const jwt = require('jsonwebtoken');
const route=express.Router();
const userSchema=require('../schema/userSchema');
const User=new mongose.model("User",userSchema);
const bcrypt = require('bcrypt');
const saltRounds = 10;


route.post('/singup',async(req,res)=>{

    try{
        const hashpassword=await bcrypt.hash(req.body.password,saltRounds);
        const newUser=new User({
            name:req.body.name,
            username:req.body.username,
            password:hashpassword,
        });
        await newUser.save();
        res.status(200).json({
            success:"Sing Up  SuccessFully",
        });
    }catch{
        res.status(500).json({
            error:"Sing Up Fail!",
        });
    }
});

route.post('/login',async(req,res)=>{
   try{
    const user=await User.find({username:req.body.username});
    if(user && user.length > 0){
        const isValidPassword=await bcrypt.compare(req.body.password,user[0].password);
        if(isValidPassword){
            var token = jwt.sign({
                username:user[0].username,
                name:user[0].name,
                user_id:user[0]._id,
                status:user[0].status,

             },process.env.JWT_SECRET,{ expiresIn: '2h' });
             res.status(200).json({
                "access_token":token,
                "message":"Login Success Fully"
             })
        }else{
            res.status(500).json({
                "error":'Authentication Fail!'
            })
        }
    }else{
        res.status(500).json({
            "error":'Authentication Fail!'
        })
    }
   }catch{
        res.status(500).json({
            "error":'Authentication Fail!'
        })
   }

})

//get user todos

route.get('/usertodos',async(req,res)=>{
    try{

        const user=await User.find({}).populate("todos");
        res.status(500).json({
            data:user
        })
    }catch{
        res.status(500).json({
            "error":'Server Side Problem!'
        })
    }
})

module.exports=route;