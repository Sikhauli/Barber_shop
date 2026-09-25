function asyncHandler(fn){return(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next)}
function minutes(t){const [h,m]=t.split(':').map(Number);return h*60+m}
function time(m){return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`}
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(`${s}T00:00:00`))}
function reference(){return `IO-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}-${Math.random().toString(36).slice(2,5).toUpperCase()}`}
module.exports={asyncHandler,minutes,time,validDate,reference};
