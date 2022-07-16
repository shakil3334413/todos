const jwt = require('jsonwebtoken');
const checkLogin=(req,res,next)=>{

    const { authorization }=req.headers;

    try{
        const token=authorization.split(' ')[1];
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const {username,user_id,name,status}=decoded;
        req.username=username;
        req.user_id=user_id;
        next();
    }catch{
        next("Authorization Fail!")
    }

};


module.exports=checkLogin;