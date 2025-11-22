const cron = require('node-cron');
const Event = require('./models/Event');
const Subscription = require('./models/Subscription');
const webpush = require('web-push');
require('dotenv').config();

// Ensure VAPID details are set for web-push. push route also sets this,
// but setting here guarantees the cron sender can authenticate.
if (process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE) {
  try {
    webpush.setVapidDetails('mailto:dev@example.com', process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE);
    console.log('Cron: VAPID keys set for web-push');
  } catch (e) {
    console.warn('Cron: failed to set VAPID keys', e && e.message);
  }
} else {
  console.warn('Cron: VAPID_PUBLIC or VAPID_PRIVATE missing from environment');
}

module.exports = function startCron(){
  // Run every minute to keep demo simple.
  cron.schedule('* * * * *', async ()=>{
    const runAt = new Date();
    console.log('Cron: running check at', runAt.toISOString());
    try{
      const now = new Date();
      const in30 = new Date(now.getTime() + 30*60000);
      // find events that start within next 30 minutes and are upcoming
      const events = await Event.find({status:'Upcoming', date: {$gte: now, $lte: in30}}).populate('userId');
      console.log(`Cron: found ${events.length} upcoming event(s) between ${now.toISOString()} and ${in30.toISOString()}`);

      if(!events.length) return;

      const subs = await Subscription.find({});
      console.log(`Cron: found ${subs.length} subscription(s)`);

      for(const ev of events){
        const payload = {
          title: `Upcoming: ${ev.title}`,
          body: `Starts at ${new Date(ev.date).toLocaleString()}`
        };

        for(const s of subs){
          try{
            // ensure plain object (not a mongoose document proxy)
            const subObj = (typeof s.toObject === 'function') ? s.toObject() : s;
            await webpush.sendNotification(subObj, JSON.stringify(payload));
            console.log('Cron: notification sent to', subObj.endpoint || subObj._id);
          }catch(e){
            console.warn('Cron: failed to send to subscription', (s && s.endpoint) || s && s._id, e && e.message);
          }
        }
      }
    }catch(err){
      console.error('Cron error', err && err.stack ? err.stack : err);
    }
  });
};
