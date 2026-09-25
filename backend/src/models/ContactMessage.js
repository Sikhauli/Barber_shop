const mongoose=require('mongoose');
const schema=new mongoose.Schema({name:{type:String,required:true,maxlength:60},email:{type:String,required:true,lowercase:true},message:{type:String,required:true,maxlength:1000},status:{type:String,enum:['new','read','replied'],default:'new'}},{timestamps:true});
module.exports=mongoose.model('ContactMessage',schema);
