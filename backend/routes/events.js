const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');

const router = express.Router();

function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'No token provided'});
  const token = authHeader.split(' ')[1];
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  }catch(err){
    return res.status(401).json({error:'Invalid or expired token'});
  }
}

router.use(auth);

router.get('/', async (req,res)=>{
  try {
    const filter = {userId: req.userId};
    const status = req.query.status;
    if(status) filter.status = status;
    const events = await Event.find(filter).sort({date:1});
    res.json(events || []);
  } catch(err) {
    console.error(err);
    res.status(500).json({error:'Error fetching events'});
  }
});

router.post('/', async (req,res)=>{
  try{
    const {title, date, image} = req.body;
    
    // Validation
    if(!title || !date) return res.status(400).json({error:'Title and date are required'});
    if(title.trim().length === 0) return res.status(400).json({error:'Title cannot be empty'});
    
    const eventDate = new Date(date);
    if(isNaN(eventDate.getTime())) return res.status(400).json({error:'Invalid date format'});
    
    const ev = new Event({
      userId: req.userId, 
      title: title.trim(), 
      date: eventDate, 
      image: image && image.trim() ? image.trim() : null
    });
    await ev.save();
    res.json(ev);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Error creating event'});
  }
});

router.put('/:id', async (req,res)=>{
  try{
    const {title, date, status, image} = req.body;
    
    // Validation
    if(title !== undefined && title.trim().length === 0) return res.status(400).json({error:'Title cannot be empty'});
    if(date !== undefined) {
      const eventDate = new Date(date);
      if(isNaN(eventDate.getTime())) return res.status(400).json({error:'Invalid date format'});
    }
    if(status !== undefined && !['Upcoming', 'Completed'].includes(status)) return res.status(400).json({error:'Invalid status'});
    
    const updateData = {};
    if(title !== undefined) updateData.title = title.trim();
    if(date !== undefined) updateData.date = new Date(date);
    if(status !== undefined) updateData.status = status;
    if(image !== undefined) updateData.image = image && image.trim() ? image.trim() : null;
    
    const ev = await Event.findOneAndUpdate(
      {_id:req.params.id, userId:req.userId}, 
      updateData, 
      {new:true}
    );
    if(!ev) return res.status(404).json({error:'Event not found'});
    res.json(ev);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Error updating event'});
  }
});

router.delete('/:id', async (req,res)=>{
  try{
    const ev = await Event.findOneAndDelete({_id:req.params.id, userId:req.userId});
    if(!ev) return res.status(404).json({error:'Event not found'});
    res.json({ok:true, message: 'Event deleted successfully'});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Error deleting event'});
  }
});

module.exports = router;
