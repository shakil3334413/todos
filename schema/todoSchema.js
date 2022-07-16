const mongoose=require('mongoose');

const todoSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:true,
    },
    status:{
        type:String,
        enum:["active","inactive"],
    },
    date:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
});


// Instance Method 
todoSchema.methods={
    findActiveList:function(){
        return mongoose.model("Todo").find({status:"inactive"});
    },
    findwithCallbackActiveList:function(cb){
        return mongoose.model("Todo").find({status:"inactive"},cb);
    }
},

//statis method 

todoSchema.statics={
    findbykeyword:function(){
        return this.find({title:/ti/i});
    }
}

//query helper method 

todoSchema.query={
    findbyquery:function(language){
        return this.find({title:new RegExp(language,"i")});
    }
}

module.exports=todoSchema;

