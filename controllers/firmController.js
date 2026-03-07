const Firm=require('../models/Firm');
const Vendor=require('../models/Vendor');
const multer = require('multer');
const path=require('path');


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});
const upload=multer({storage:storage});


const addFirm= async(req,res)=>{
   try{
          const {firmName, area,category,region,offer}= req.body;

    const image=req.file? req.file.filename : undefined;
    const vendor=await  Vendor.findById(req.vendorId);
   if(!vendor){
    return res.status(404).json({error:"vendor not found"})
   }
    const firm =new Firm({
        firmName,area,category , region ,offer ,image,vendor:vendor._id
    })
    const savedfirm=await firm.save();
    vendor.firm.push(savedfirm);

    await vendor.save();
    return res.status(200).json({message:"added firm successfully"});
   }catch(error){
    console.log(error);
    return res.status(500).json("invalid and sever issu in the firm controller")

   }

}

const deleteFirmById = async (req,res)=>{
    try{
       const firmId=req.params.firmId;
      
              const deletedFirm=await Firm.findByIdAndDelete(firmId);
            if(!deletedFirm){
            return  res.status(404).json({error:"the firm u want to delete is not found"});
      
            }
            res.status(200).json({message:"the product u wnat to delete is deleted "});
      
    }catch(error){
          console.error(error);
        res.status(500).json({error:"internal server issu in the firmController.js in deleteFirmById"})

    }
}
module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
