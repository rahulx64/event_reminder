const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  title: {type: String, required: true},
  image: {type: String},
  date: {type: Date, required: true},
  status: {type: String, enum: ['Upcoming','Completed'], default: 'Upcoming'},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Event', EventSchema);
