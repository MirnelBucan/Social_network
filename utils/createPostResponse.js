const formatDate = require('../utils/formatDate');
// Function for post response creation
module.exports = data =>{
  let date = formatDate(data.post.createdAt);
  return `<article class="row">
            <div class="col-md-2 col-sm-2 hidden-xs">
                <figure class="thumbnail">
                    <img class="img-responsive"
                         src="/images/user-avatar-placeholder.png">
                    <figcaption class="text-center">
                        <a href="/profile/${data.user._id}">${data.user.username}</a>
                    </figcaption>
                </figure>
            </div>
            <div class="col-md-10 col-sm-10 col-xs-12">
                <div class="panel panel-default arrow left">
                    <div class="panel-body">
                        <header class="text-left">
                            <div class="comment-user">
                                <i class="fa fa-user"></i>
                                <a href="/profile/${data.user._id}">${data.user.username}</a>
                                <i class="deletePost fa fa-times" style="float: right;" value="${data.post._id}"></i>
                            </div>
                            <hr>
                            <time class="comment-date" datetime="${date}%>">
                                <i class="fa fa-clock-o"></i> ${date}
                            </time>
                        </header>
                        <div class="comment-post">
                            <p>
                                ${data.post.content}
                            </p>
                        </div>
                        <hr>
                        <div class="row" style="margin-left: 5px">
                            <button id='like' class="btn btn-info like" name="${data.post._id}">Like</button>
                            <span id='numberOfLikes' class="mr-auto">${data.post.likes}</span>
                            <button id='comment' class="btn btn-info comment" style="float:right; margin-right: 10px;">Comments</button>
                        </div>
                    </div>
                </div>
                <div id='comments' class="panel panel-default arrow left" style="display:none">
                    <article id='commentInputContainer' class="row">

                        <div class="col-md-12 col-sm-12 col-xs-12">
                            <div class="panel panel-default arrow left">
                                <div class="panel-body">
                                    <header class="text-left">
                                        <div class="comment-user" style="margin-bottom: 20px;">
                                            <i class="fa fa-user"></i>
                                            ${data.user.username}
                                        </div>
                                    </header>
                                    <div class="comment-post form-group">
                                        <textarea id='commentContent' class="form-control" placeholder="Enter new comment.."
                                      style="resize: none; height:10rem;"></textarea>
                                        <hr>
                                        <div class="row" style="margin-left: 5px">
                                            <button name="${data.post._id}"class="btn btn-danger newComment"
                                                    style="float:right; margin-right: 10px;">Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                    <!-- end of input-->
                </div>
            </div>
        </article>
        <hr>`
};