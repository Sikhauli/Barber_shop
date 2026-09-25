import type { Barber, Service } from "./types";

export const services: Service[] = [
  { id:"classic",   name:"Classic Cut",     category:"Haircuts", description:"Scissor-led shape, neck cleanup and a warm finish.", duration:45, price:320 },
  { id:"fade",      name:"Skin Fade",       category:"Fades",    description:"Precision fade blended into your chosen length.",   duration:50, price:360 },
  { id:"beard",     name:"Beard Sculpt",    category:"Beard",    description:"Line, shape, hot towel and conditioning finish.",   duration:30, price:240 },
  { id:"combo",     name:"Cut + Beard",     category:"Packages", description:"Signature cut paired with a full beard sculpt.",    duration:70, price:520 },
  { id:"executive", name:"Executive Reset", category:"Packages", description:"Cut, beard, hot towel and scalp massage.",          duration:90, price:680 },
  { id:"young-oak", name:"Young Oak",       category:"Kids",     description:"Patient, polished cuts for guests under 12.",       duration:35, price:230 },
];

export const barbers: Barber[] = [
  { id:"miles", name:"Miles Khumalo",  role:"Master Barber",  specialties:["Skin fades","Scissor work"] },
  { id:"noah",  name:"Noah Jacobs",    role:"Senior Barber",  specialties:["Classic cuts","Tapers"] },
  { id:"zin",   name:"Zinhle Mokoena", role:"Grooming Lead",  specialties:["Beards","Packages"] },
];

export const openingHours = [
  ["Monday","09:00–19:00"],["Tuesday","09:00–19:00"],["Wednesday","09:00–19:00"],
  ["Thursday","09:00–19:00"],["Friday","09:00–20:00"],["Saturday","09:00–17:00"],["Sunday","Closed"],
] as const;