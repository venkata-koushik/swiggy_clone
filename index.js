const express =require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const vendorRoutes=require("./routes/vendorRoutes");
const bodyParser=require("body-parser");
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const cors=require("cors");
const path = require('path');

dotenv.config();    
const app=express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://swiggy-clone-frontend-rmrevgmwh-venkata-koushiks-projects.vercel.app",
    ],
}));

const PORT=process.env.PORT || 4000;
const HOST = "0.0.0.0";
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("monogdb connected succesfull")})
.catch((error)=>{console.log(error)})

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/product',productRoutes);
app.use('/firm',firmRoutes);
app.use('/uploads',express.static(path.join(__dirname, 'uploads')));

app.get("/",(req,res)=>{
    res.status(200).json({message:"API is running"});
});

app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"});
});

app.listen(PORT, HOST, ()=>{
    console.log(`this is running in the ${PORT}`)
})
