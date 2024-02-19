const {v4:uuidv4}=require("uuid");
const User=require("../model/user");
const {setUser}=require("../service/auth");

async function handleUserSignup(req,res){
 const {name,email,password}=req.body;
 await User.create({
    name,
    email,
    password,

 });
 return res.render("home");
 //return res.redirect("/");
}

async function handleUserLogin(req,res){
    const {email,password}=req.body;
    const user=await User.findOne({email,password});
    if(!user)
    return res.render("login",{
    error:"Invalid UserName or Password"
});
// return res.redirect("/user");
// return res.render("/url");

const sessionId=uuidv4();
setUser(sessionId,user);
res.cookie("uid",sessionId);
return res.redirect("/url");
}

module.exports={
    handleUserSignup,
    handleUserLogin,
};