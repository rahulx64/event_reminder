const express = require('express');
const webpush = require('web-push');
const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');

const router = express.Router();

function auth(req,res,next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error:'No token'});
  const token = authHeader.split(' ')[1];
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  }catch(err){
    return res.status(401).json({error:'Invalid token'});
  }
}

// set VAPID keys
if(process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE){
  webpush.setVapidDetails('mailto:dev@example.com', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
}

router.post('/subscribe', auth, async (req,res)=>{
  try{
    const sub = req.body;
    // save to DB
    await Subscription.findOneAndUpdate({endpoint: sub.endpoint}, sub, {upsert:true, new:true});
    res.json({ok:true});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

router.post('/send', auth, async (req,res)=>{
  try{
    const payload = req.body.payload || {title:'Reminder', body:'Event reminder'};
    const subs = await Subscription.find({});
    const results = [];
    for(const s of subs){
      try{
        await webpush.sendNotification(s, JSON.stringify(payload));
        results.push({endpoint:s.endpoint, ok:true});
      }catch(e){
        results.push({endpoint:s.endpoint, ok:false});
      }
    }
    res.json(results);
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

module.exports = router;
