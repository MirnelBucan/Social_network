function response (data) {
  let resp = data.responseText;
  try {
    if (data.message != void (0)) {
      resp = data.message;
    } else {
      resp = JSON.parse(data.responseText);
      resp = resp.message;
    }
  } catch (e) {}
  return resp;
}

$( document ).ready( () => {
  var socket = io.connect('http://localhost:3000');
  socket.on('connected', function (msg) {
    socket.emit('receiveHistory');
  });

  socket.on('message', addMessage);

  socket.on('history', messages => {
    for (let message of messages) {
      addMessage(message);
    }
  });

  $('.chat-message button').on('click', e => {
    e.preventDefault();

    var selector = $("textarea[name='message']");
    var messageContent = selector.val().trim();
    if(messageContent !== '') {
      socket.emit('msg', messageContent);
      selector.val('');
    }
  });

  function encodeHTML (str){
    return $('<div />').text(str).html();
  }

  function addMessage(message) {
    message.date = (new Date(message.date)).toLocaleString();

    message.content = encodeHTML(message.content);
    var html = `
            <li>
                <div class="message-data">
                    <span class="message-data-name">${message.author.username}</span>
                    <span class="message-data-time">${message.date}</span>
                </div>
                <div class="message my-message" dir="auto">${message.content}</div>
            </li>`;

    $(html).hide().appendTo('.chat-history ul').slideDown(200);

  }
});