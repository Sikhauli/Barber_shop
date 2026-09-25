const express=require('express');const r=express.Router();const c=require('../controllers/public');const a=require('../controllers/auth');const {optionalAuth,auth}=require('../middleware/auth');
r.get('/health',(_q,s)=>s.json({ok:true,service:'iron-oak-api',time:new Date().toISOString()}));
r.get('/services',c.getServices);r.get('/barbers',c.getBarbers);r.get('/hours',c.getHours);
r.post('/bookings',optionalAuth,c.create);r.get('/bookings/:ref',c.find);r.get('/bookings/me/all',auth,c.mine);
r.post('/contact',c.contact);
r.post('/auth/register',a.register);r.post('/auth/login',a.login);
module.exports=r;
