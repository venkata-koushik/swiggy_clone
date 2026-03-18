const express =require("express");
const dotenv=require("dotenv");
const mongoose=require("mongoose");
const vendorRoutes=require("./routes/vendorRoutes");
const bodyParser=require("body-parser");
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const cors=require("cors");

dotenv.config();    
const app=express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://swiggy-clone-frontend-rmrevgmwh-venkata-koushiks-projects.vercel.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow server-to-server/no-origin requests and local dev + deployed frontend
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

const PORT=process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("monogdb connected succesfull")})
.catch((error)=>{console.log(error)})

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/product',productRoutes);
app.use('/firm',firmRoutes);
app.use('/uploads',express.static("uploads"));

 
app.use('/home',(req,res)=>{
    console.log(process.env.MONGO_URI);
     res.send("<h2>hello</h2>");
})

app.listen(PORT,()=>{
    console.log(`this is running in the ${PORT}`)
})
