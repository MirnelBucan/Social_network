$(document).ready(_init);

function _init(){
  resetPost();
  resetComment();
  $(document).on('click', '.like', likeHandler);
  $(document).on('click', '.likeComment', likeCommentHandler);
  $(document).on('click', '.comment',toggleVisibleComment);
  $(document).on('click','.newComment',handleComment);
  $(document).on('click','.deleteComment',handleCommentDelete);
  $(document).on('click','.deletePost',handlePostDelete);
  $('#post').on('click',handlePost);
}

// Like handler
function likeHandler(e){
  //get the id of post
  let post = $(this).attr('name');
 //jQ object for number of likes
  let likes = $(this).next();
  let numLikes = Number(likes.text())+1;
  // Update number of likes on page
  likes.val(numLikes.toString()).text(numLikes.toString());
  $.ajax({
    url:`post/like/${post}`,
    method: 'PUT',
    error:function(response, statusText, error){
      // If something went wrong, decrease number of likes and update page
      numLikes--;
      likes.val(numLikes.toString()).text(numLikes.toString());
    }
  });
}
// handler for like on comments
function likeCommentHandler(e){
  //get the id of post
  let comment = $(this).attr('name');
  //jQ object for number of likes
  let likes = $(this).next();
  let numLikes = Number(likes.text())+1;
  likes.val(numLikes.toString()).text(numLikes.toString());
  $.ajax({
    url:`/post/comment/like/${comment}`,
    method: 'PUT',
    error:function(response, statusText, error){
      numLikes--;
      likes.val(numLikes.toString()).text(numLikes.toString());
    }
  });
}

// handler for new post
function handlePost(e){
  // Get content user entered
  let post = $('#postContent').val().trim();
  //check if user is trying to post empty post
  //if true, reset post he typed in and return
  if(!post.length) {
    resetPost();
    return;
  }
  //if user actually entered something
  //send request to server
  $.ajax({
    url: '/post/create',
    method: 'POST',
    data: {content: post},
    // on status 2xx , we reset what users posted in form, and updated list of posts
    success: function (response){
      resetPost();
      $('#post-container').prepend(response);
    },
    //if error occurs , alert user to it
    error: function(response, statusText, error){
      alert('Error occur , please try again in few minutes');
    }
  });
}

function handleComment(e){
  let comment = $(this).parent().prev().prev().val().trim();
  let postId = $(this).attr('name');
  if(!comment.length) {
    resetPost();
    return;
  }
  $.ajax({
    url: `/post/${postId}/comment/create`,
    method: 'POST',
    data: {content: comment},
    success: function (response){
      resetComment();
      $(response).insertBefore($('#commentInputContainer'));
    },
    error: function(response, statusText, error){
      alert('Error occur, resend your comment in few minutes again please');
    }
  });
}
// Function for post deletion
function handlePostDelete(e){
  let postId = $(this).attr('value');
  let post = $(this).parent().parent().parent().parent().parent().parent();

  $.ajax({
    url: `/post/${postId}`,
    method: 'DELETE',
    success: function (response){
      post.next().remove();
      post.remove();
    },
    error: function(response, statusText, error){
      alert('Post couldn\'t be deleted, try again in few minutes');
    }
  });
}

function handleCommentDelete(e){
  const commentId = $(this).attr('valueComment');
  let comment = $(this).parent().parent().parent().parent().parent().parent();
  const postId= $(this).attr('valuePost');

  $.ajax({
    url: `/post/${postId}/comment/${commentId}`,
    method: 'DELETE',
    success: function (response){
      comment.remove();
    },
    error: function(response, statusText, error){
      alert('Comment couldn\'t be removed, try again in few minutes');
    }
  });
}

// Function for toggling comments visibility
function toggleVisibleComment(e){
  $(this).parent().parent().parent().next().slideToggle();
}

function resetPost(){ $('#postContent').val('');}
function resetComment(){ $('#commentContent').val('');}