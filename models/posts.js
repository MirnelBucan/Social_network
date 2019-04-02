
const mongoose = require('mongoose');

const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const postsSchema = new Schema({
    postId: { type: Number, index: true },
    content: {type: String, default: undefined },
    likes: { type: Number, default: 0},
    author: { type: Schema.Types.ObjectId, ref: 'User'},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
  },{
    timestamps: true
});

postsSchema.plugin(autoIncrement, {inc_field: 'postId'});

module.exports = mongoose.model('Post', postsSchema);