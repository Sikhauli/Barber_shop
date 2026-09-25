const {z}=require('zod');const bcrypt=require('bcryptjs');const jwt=require('jsonwebtoken');const User=require('../models/User');
const schema=z.object({name:z.string().trim().min(2).max(80),email:z.string().email(),password:z.string().min(8).max(128)});
function token(u){return jwt.sign({_id:u._id.toString(),email:u.email,role:u.role},process.env.JWT_SECRET,{expiresIn:'7d'})}
async function register(req,res){const d=schema.parse(req.body);if(await User.findOne({email:d.email.toLowerCase()}))return res.status(409).json({message:'Email is already registered'});const u=await User.create({name:d.name,email:d.email,passwordHash:await bcrypt.hash(d.password,12)});res.status(201).json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})}
async function login(req,res){const d=z.object({email:z.string().email(),password:z.string()}).parse(req.body);const u=await User.findOne({email:d.email.toLowerCase()});if(!u||!(await bcrypt.compare(d.password,u.passwordHash)))return res.status(401).json({message:'Invalid email or password'});res.json({token:token(u),user:{id:u._id,name:u.name,email:u.email,role:u.role}})}
module.exports={register,login};
