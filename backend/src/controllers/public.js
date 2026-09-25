const {z}=require('zod');
const ContactMessage=require('../models/ContactMessage');
const Booking=require('../models/Booking');
const {services,barbers,openingHours}=require('../config/data');
const {createBooking,serialize}=require('../services/bookingService');
const bookingSchema=z.object({customerName:z.string().trim().min(2).max(60),customerEmail:z.string().email().max(120),customerPhone:z.string().regex(/^[+0-9 ()-]{7,25}$/),serviceId:z.string(),barberId:z.string().optional().nullable(),bookingDate:z.string(),startTime:z.string().regex(/^\d{2}:\d{2}$/),notes:z.string().max(500).optional(),consent:z.literal(true)});
const contactSchema=z.object({name:z.string().trim().min(2).max(60),email:z.string().email().max(120),message:z.string().trim().min(1).max(1000)});
async function getServices(req,res){res.json(services)}
async function getBarbers(req,res){res.json(barbers)}
async function getHours(req,res){res.json(openingHours)}
async function create(req,res){const data=bookingSchema.parse(req.body);const b=await createBooking(data,req.user?._id);res.status(201).json(serialize(b))}
async function find(req,res){const b=await Booking.findOne({reference:req.params.ref});if(!b)return res.status(404).json({message:'Booking not found'});res.json(serialize(b))}
async function mine(req,res){const rows=await Booking.find({userId:req.user._id}).sort({bookingDate:1,startTime:1});res.json(rows.map(serialize))}
async function contact(req,res){const data=contactSchema.parse(req.body);await ContactMessage.create(data);res.status(201).json({message:'Message received'})}
module.exports={getServices,getBarbers,getHours,create,find,mine,contact};
