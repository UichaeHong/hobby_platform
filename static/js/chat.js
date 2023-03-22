let socket = io();
let msg;

$("#send").click(function () {
  msg = $("#input_text").val();
  let template = `
  <div class="line">
    <span class="chat_box mine">내 채팅: ${msg}</span>
  </div>`;
  $(".chat_form").append(template);
  socket.emit("user-send", msg);
});

socket.on("broadcast", function (data) {
  let template = `
  <div class="line">
    <span class="chat_box">상대 채팅: ${data}</span>
  </div>`;
  if (data != msg) {
    $(".chat_form").append(template);
  }
});
