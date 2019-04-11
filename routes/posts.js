const router = require('express').Router(),
  Post = require('../models/posts'),
  Comment = require('../models/comments'),
  formatDate = require('../utils/formatDate'),
  createPostResponse = require('../utils/createPostResponse'),
  createCommentResponse = require('../utils/createCommentResponse');

//GET post
router.get('/',async (req, res, next) => {
  //get all posts from DB in descending order
  try{
    const posts = await Post.find().sort({createdAt: 'desc'})
      .populate({path: 'author', select: '_id username'}) // populate our reference with user object
      .populate({path: 'comments',select:'_id content author likes createdAt' , //populate comment reference
        populate:{ path:'author', select:'_id username'}}); //populate author reference of comment object
    //send page to client
    res.render('posts',{ posts , formatDate , username: req.user.username });
  }catch (err){
    res.json(err);
  }
});
//POST /post/create - post creation handler
router.post('/create', async (req, res, next) => {
  let post = new Post({
    content: req.body.content,
    author: req.user._id
  });
  let response = '';
  try{
    let createdPost = await post.save();
    //function to generate html code for post creation
    response = createPostResponse({post: createdPost, user: req.user});
    res.json(response);
  }catch (err){
    //error on server side, couldn't handle request to db server
    res.status(500).json(err);
  }
});
//PUT /like/:id - update post like handler . Where /:id is URL params
router.put('/like/:id', async (req, res, next) => {
  try {
    //update post, increase number of likes on post
    let post = await Post.findByIdAndUpdate( { _id: req.params.id } , {$inc: { likes: 1} });
    //respond user to successfully updated number of likes
    res.json({msg: 'success'});
  } catch (err) {
    res.status(500).json(err);
  }
});
//DELETE /post/:id - delete post with passed id in URL params
router.delete('/:id', async (req, res, next) =>{
  try{
    //delete post
    let deletedPost = await Post.findOneAndDelete({_id: req.params.id});
    //than delete all comments of that post
    let deletedComment = await Comment.deleteMany({ _id: { $in: deletedPost.comments } });
    res.json({msg:'Successfully deleted post'});
  }catch(err){
    res.status(500).json(err);
  }
});

//POST /post/:id/comment/create - comment handler, id is post id
router.post('/:id/comment/create', async (req, res, next) => {
  // Create instance of comment
  let newComment = new Comment({
    content: req.body.content,
    author: req.user._id,
    post: req.params.id,
  });
  try{
    // Save that comment to db
    let comment = await newComment.save();
    // Set reference to newly created post
    let post = await Post.findOneAndUpdate({_id: postId},{ $push:{ comments: comment._id }});
    // Create response for comment
    let createdComment = createCommentResponse({comment,user: req.user});
    res.json(createdComment);
  } catch(err) {
    console.log(err);
    res.status(409).json(err);
  }
});
//DELETE comment handler
router.delete('/:postId/comment/:commentId', async (req, res, next) =>{
  let postId = req.params.postId,
    commentId = req.params.commentId;
  try{
    //remove comment from db
    let comment = await Comment.findByIdAndRemove(commentId);
    //delete reference from post
    let post = await Post.findById(postId);
    let deleted = await post.comments.pull(commentId);
    //save change to post
    await post.save();
    res.json({deleted,comment});
  }catch(err){
    res.json(err);
  }
});
//UPDDATE comment id
router.put('/comment/like/:id', async (req, res, next) => {
  let commentId = req.params.id;
  try {
    let comment = await Comment.findByIdAndUpdate(commentId, {$inc: { likes: 1} });
    res.json({msg:'success'});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;