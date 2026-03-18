
const Vendor=require('../models/Vendor');
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const dotenv=require('dotenv');
dotenv.config();

const secretKey=process.env.JWT_SECRET;

const vendorRegister= async(req,res)=>{
    const {username,email,password}=req.body;
   try{
     const vendorEmail= await Vendor.findOne({email});
     if(vendorEmail){
     return res.status(400).json({ error: "Email already registered" });
      }
      const hashedPassword=await bcrypt.hash(password,10);
      const newVendor=new Vendor({
         username,
         email,
         password:hashedPassword
      })
      await newVendor.save();
      res.status(201).json({message:"vendor registered and saved"});
      console.log("registered");
   }catch(error){
      res.status(500).json({error:"internal server error"});
      console.log(error);

   }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const vendor = await Vendor.findOne({ email });

        if (!vendor || !(await bcrypt.compare(password,vendor.password))) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
     
        const token = jwt.sign(
            { vendorId: vendor._id },
           secretKey,
            { expiresIn: "7d" }
        );

        console.log("Login successful");

        const vendorId = vendor._id.toString();

        return res.status(200).json({
            message: "Login successful",
            token,
            vendorId,
            vendorID: vendorId,
            id: vendorId,
        });

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};

const getAllVendors = async(req,res)=>{
   try{
     const vendors=await Vendor.find().populate('firm');
    return  res.status(200).json({vendors});
   }catch(error){
    console.error(error);
   }
}

const getVendorById = async(req,res)=>{
   const vendorId= req.params.id;

   try{
     const vendor= await Vendor.findById(vendorId).populate('firm');
     if(!vendor){
      return res.status(400).json({error:"vendor not found"});
     }
     const vendorFirmId = vendor.firm && vendor.firm.length > 0 ? vendor.firm[0]._id : null;
     const vendorFirmName = vendor.firm && vendor.firm.length > 0 ? vendor.firm[0].firmName : null;
     return res.status(200).json({vendorId,vendorFirmId,vendorFirmName});
   }catch(error){
              console.log("Login error:", error);
        return res.status(500).json({ error: "internal server error" });


   }
}


module.exports = {vendorRegister,vendorLogin,getAllVendors,getVendorById}
