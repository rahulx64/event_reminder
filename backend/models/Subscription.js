const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  endpoint: {type: String, required: true, unique: true},
  keys: {type: Object},
  expirationTime: {type: Date},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Subscription', SubSchema);
