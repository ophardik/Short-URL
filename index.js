const express=require("express");
const path=require("path");
const cookieParser=require("cookie-parser");
const{connectToMongoDB}=require("./connect");
const{restrictToLoggedinUserOnly,checkAuth}=require("./middlewares/auth")
const URL=require("./model/url");
const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const userRoute=require("./routes/user");

const app=express();
const PORT=8001;

connectToMongoDB("mongodb://127.0.0.1:27017/Project2-URL")

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);
app.use("/",checkAuth,staticRoute);

app.get("/url/:shortId",async(req,res)=>{
   const shortId=req.params.shortId;
   const entry=await URL.findOneAndUpdate(
    {
      shortId
   },
   {
    $push:{
    visitHistory:{
        timestamp:Date.now(),
    }
   },
},
);
res.redirect(entry ? entry.redirectURL : '/');
});


app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)});