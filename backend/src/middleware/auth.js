const jwt=require('jsonwebtoken');
function optionalAuth(req,_res,next){const h=req.headers.authorization;if(h?.startsWith('Bearer ')){try{req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET)}catch{}}next()}
function auth(req,res,next){optionalAuth(req,res,()=>{if(!req.user)return res.status(401).json({message:'Authentication required'});next()})}
function admin(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required'});next()}
module.exports={optionalAuth,auth,admin};
