const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try{
    const {email, password} = req.body;
    
    // Validation
    if(!email || !password) return res.status(400).json({error:'Email and password are required'});
    if(password.length < 6) return res.status(400).json({error:'Password must be at least 6 characters'});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Invalid email format'});
    
    const existing = await User.findOne({email: email.toLowerCase()});
    if(existing) return res.status(400).json({error:'Email already registered'});
    
    const hash = await bcrypt.hash(password, 10);
    const user = new User({email: email.toLowerCase(), passwordHash: hash});
    await user.save();
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({token, email: user.email});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error during signup'});
  }
});

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    
    // Validation
    if(!email || !password) return res.status(400).json({error:'Email and password are required'});
    
    const user = await User.findOne({email: email.toLowerCase()});
    if(!user) return res.status(401).json({error:'Invalid email or password'});
    
    const ok = await bcrypt.compare(password, user.passwordHash);
    if(!ok) return res.status(401).json({error:'Invalid email or password'});
    
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({token, email: user.email});
  }catch(err){
    console.error(err);
    res.status(500).json({error:'Server error during login'});
  }
});

module.exports = router;
