const mongoose=require('mongoose');
const bookingSchema=new mongoose.Schema({
 reference:{type:String,unique:true,index:true,required:true},
 customerName:{type:String,required:true,trim:true,maxlength:60},
 customerEmail:{type:String,required:true,lowercase:true,trim:true,index:true},
 customerPhone:{type:String,required:true,trim:true},
 serviceId:{type:String,required:true,index:true},
 barberId:{type:String,default:null,index:true},
 bookingDate:{type:String,required:true,index:true},
 startTime:{type:String,required:true},
 endTime:{type:String,required:true},
 notes:{type:String,default:'',maxlength:500},
 consent:{type:Boolean,required:true},
 status:{type:String,enum:['confirmed','cancelled','completed','no_show'],default:'confirmed',index:true},
 userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null,index:true}
},{timestamps:true});
bookingSchema.index({bookingDate:1,barberId:1,startTime:1,status:1});
module.exports=mongoose.model('Booking',bookingSchema);
