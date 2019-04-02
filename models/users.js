

const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const encrypt = require('../utils/encrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {type: Number, index: true},
  username: {type: String, default: undefined},
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {type: String, required: true },
  name: {type: String , default: undefined },
  surname: {type: String, default: undefined },
},{
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password'))
    this.password = await encrypt(this.password);
  next();
});

userSchema.plugin(autoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('User', userSchema);