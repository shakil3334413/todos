const express=require('express');
const mongose=require('mongoose');
const router=express.Router();
const todoSchema=require('../schema/todoSchema');
const userSchema=require('../schema/userSchema');
const User=new mongose.model("User",userSchema);
const Todo=new mongose.model("Todo",todoSchema);
const checkLogin=require('../middleware/checkLogin')
//Instance Method query
//get active todo list
router.get('/active',async(req,res)=>{
    const todo=new Todo();
    const data=await todo.findActiveList();
    try{
        res.status(200).json({
            data,
        })
    }catch{
        res.status(500).json({
            error:'Server Error'
        })
    }
})
//get active todo list with call back function
router.get('/active-callback',async(req,res)=>{
    const todo=new Todo();
    todo.findwithCallbackActiveList((err,data)=>{
        res.status(200).json({
            data,
        })
    });
})

//Statics method 
router.get('/serach-key',async(req,res)=>{
    const data=await Todo.findbykeyword();
    res.status(200).json({
        data,
    })
})

//query helper  method 
router.get('/serach-query',async(req,res)=>{
    const data=await Todo.find().findbyquery("title");
    res.status(200).json({
        data,
    })
})


//Get all the todos
router.get('/',checkLogin,async(req,res)=>{
    // await Todo.find({},(err,data)=>{
    //     if(err){
    //         res.status(500).json({
    //             error:"There was server side problem",
    //         });
    //     }else{
    //         res.status(200).json({
    //             result:data,
    //         });
    //     }
    // });

    await Todo.find({})
        .populate("user","name username status -_id")
        .select({
            _id:0,
            _v:0,
            _date:0,
        })
        .limit(10)
        .exec((err,data)=>{
            if(err){
                res.status(500).json({
                    error:"There was server side problem",
                });
            }else{
                res.status(200).json({
                    result:data,
                });
            } 
        })
});

//Get one todos  todos
router.get('/:id',async(req,res)=>{
    await Todo.find({_id:req.params.id},(err,data)=>{
        if(err){
            res.status(500).json({
                error:"There was server side problem",
            });
        }else{
            res.status(200).json({
                result:data,
            });
        }
    });
});
//post  the todos
router.post('/',checkLogin, async(req,res)=>{

    const newtodo=new Todo({
        ...req.body,
        user:req.user_id
    })
    try{
       const todo= await newtodo.save();
        await User.updateOne({
            _id:req.user_id
        },{
            $push:{
                todos:todo._id
            }
        })
        res.status(200).json({
            success:"Todo Insert SuccessFully",
        });
    }catch{
        res.status(500).json({
            error:"There was server side problem",
        });
    }
    // const newtodo=new Todo(req.body);
    // await newtodo.save((err)=>{
    //     if(err){
    //         res.status(500).json({
    //             error:"There was server side problem",
    //         });
    //     }else{
    //         res.status(200).json({
    //             success:"Todo Insert SuccessFully",
    //         });
    //     }
    // });
});

//post  the todos
router.post('/all',async(req,res)=>{

    await Todo.insertMany(req.body,(err)=>{
        if(err){
            res.status(500).json({
                error:'There was server error'
            });
        }else{
            res.status(200).json({
                success:'Data Insert Success'
            });
        }
    })
});

//update  the todos
router.put('/:id',async(req,res)=>{
   const result= await Todo.findByIdAndUpdate(
        {_id:req.params.id},
        { $set: req.body },
        {
            new:true,
            useFindAndModify:false
        },
     (err)=>{
        if(err){
            res.status(500).json({
                error:'There was server error'
            });
        }else{
            res.status(200).json({
                success:'Data Insert Success'
            });
        }
     }  
    );
});

//delete  the todos
router.delete('/:id',async(req,res)=>{
    await Todo.deleteOne({_id:req.params.id},(err,data)=>{
        if(err){
            res.status(500).json({
                error:"There was server side problem",
            });
        }else{
            res.status(200).json({
                success:"Delete Success Fully",
            });
        }
    });
});

module.exports=router; 