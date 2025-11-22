require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const pushRoutes = require('./routes/push');
const startCron = require('./cron');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventsRoutes);
app.use('/push', pushRoutes);

const PORT = process.env.PORT || 4000;

async function start(){
  const mongo = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_reminder';
  await mongoose.connect(mongo, {useNewUrlParser:true, useUnifiedTopology:true});
  console.log('Connected to MongoDB');
  app.listen(PORT, ()=> console.log('Server listening on', PORT));
  startCron();
}

start().catch(err=>{
  console.error('Startup error', err);
});
