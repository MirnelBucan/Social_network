const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    msgId: { type: Number, index: true },
    content: {type: String, default: undefined },
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    date: {type: Date }
  },{
    timestamps: true
});

messagesSchema.plugin(autoIncrement, {inc_field: 'msgId'});

module.exports = mongoose.model('Message', messagesSchema);