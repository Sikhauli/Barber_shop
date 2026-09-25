const Booking=require('../models/Booking');
const {services,barbers,openingHours}=require('../config/data');
const {minutes,time,validDate,reference}=require('../utils/http');
function service(id){return services.find(x=>x.id===id)}
function barber(id){return id?barbers.find(x=>x.id===id):null}
function dayHours(date){const d=new Date(`${date}T12:00:00`);return openingHours[d.toLocaleDateString('en-US',{weekday:'long',timeZone:'Africa/Johannesburg'})]}
async function createBooking(input,userId=null){
 const {customerName,customerEmail,customerPhone,serviceId,barberId=null,bookingDate,startTime,notes='',consent}=input;
 if(!validDate(bookingDate)) throw Object.assign(new Error('Invalid booking date'),{status:400});
 if(new Date(`${bookingDate}T00:00:00`) < new Date(new Date().toISOString().slice(0,10)+'T00:00:00')) throw Object.assign(new Error('Booking date cannot be in the past'),{status:400});
 const svc=service(serviceId); if(!svc) throw Object.assign(new Error('Invalid service'),{status:400});
 if(barberId && !barber(barberId)) throw Object.assign(new Error('Invalid barber'),{status:400});
 if(consent!==true) throw Object.assign(new Error('Consent is required'),{status:400});
 const [open,close]=dayHours(bookingDate)||[]; if(!open) throw Object.assign(new Error('The shop is closed on this date'),{status:400});
 const start=minutes(startTime), end=start+svc.duration;
 if(start<minutes(open)||end>minutes(close)) throw Object.assign(new Error('Selected time is outside opening hours'),{status:400});
 const conflictQuery={bookingDate,status:{$in:['confirmed']},startTime:{$lt:time(end)},endTime:{$gt:startTime}};
 if(barberId) conflictQuery.barberId=barberId; else conflictQuery.barberId=null;
 const conflict=await Booking.findOne(conflictQuery).lean();
 if(conflict) throw Object.assign(new Error('That time is no longer available. Please choose another time.'),{status:409});
 // For "any available", only reject when every barber is booked for the interval.
 if(!barberId){const busy=await Booking.find({bookingDate,status:'confirmed',startTime:{$lt:time(end)},endTime:{$gt:startTime}}).lean();if(busy.length>=barbers.length) throw Object.assign(new Error('No barber is available at that time'),{status:409});}
 const assigned=barberId || null;
 const b=new Booking({reference:reference(),customerName,customerEmail,customerPhone,serviceId,barberId:assigned,bookingDate,startTime,endTime:time(end),notes,consent,userId});
 await b.save();
 return b;
}
function serialize(b){const svc=service(b.serviceId), br=barber(b.barberId);return {reference:b.reference,serviceId:b.serviceId,service:svc,barberId:b.barberId,barber:br,date:b.bookingDate,startTime:b.startTime,endTime:b.endTime,status:b.status,customer:{name:b.customerName,email:b.customerEmail,phone:b.customerPhone,notes:b.notes}}}
module.exports={createBooking,serialize};
