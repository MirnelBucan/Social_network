const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

/**
 * We define our schema for comments
 */
const commentsSchema = new Schema({
    comentId: { type: Number, index: true },
    content: { type: String, default: undefined },
    likes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref:'User'}, //we create 1:1 relation with user
    post: { type: Schema.Types.ObjectId, ref:'Post'}, // we create 1:1 relation with post
  },{
    //we include timestamps by default mongoose creates createdAt and updatedAt property
    timestamps: true
});

commentsSchema.plugin(autoIncrement, {inc_field: 'commentId'});
//we create our model for DB and export it
module.exports = mongoose.model('Comment', commentsSchema);