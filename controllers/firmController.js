const Firm=require('../models/Firm');
const Vendor=require('../models/Vendor');
const multer = require('multer');
const path=require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, uploadsDir);
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

      if(vendor.firm && vendor.firm.length > 0){
        const existingFirmCount = await Firm.countDocuments({ _id: { $in: vendor.firm } });
        if(existingFirmCount > 0){
            return res.status(400).json({message:"vendor can have only one firm"})
        }
        // Auto-clean stale firm references if firm documents were already deleted.
        vendor.firm = [];
        await vendor.save();
    }
    const firm =new Firm({
        firmName,area,category , region ,offer ,image,vendor:vendor._id
    })
    const savedfirm=await firm.save();

    const firmId=savedfirm._id;
    vendor.firm.push(savedfirm);

    await vendor.save();

    return res.status(200).json({message:"added firm successfully",firmId});

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
            await Vendor.updateMany(
                { firm: firmId },
                { $pull: { firm: firmId } }
            );
            res.status(200).json({message:"the product u wnat to delete is deleted "});
      
    }catch(error){
          console.error(error);
        res.status(500).json({error:"internal server issu in the firmController.js in deleteFirmById"})

    }
}
module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
