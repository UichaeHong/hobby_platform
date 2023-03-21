// 검색기능
$(".input_style").change(async () => {
  console.log("이벤트");
  let room_data = await axios.get("/getData");
  room_data = room_data.data.data;
  $(".datalist").empty();
  console.log("방비우기");
  let new_room_data = [];

  for (let i = 0; i < room_data.length; i++) {
    console.log(room_data[i].title.includes($(".input_style").val()));
    if (room_data[i].title.includes($(".input_style").val())) {
      // console.log(room_data[i], input.value);
      // console.log(new_room_data);
      new_room_data.push(room_data[i]);
    }
  }
  for (let i = 0; i < new_room_data.length; i++) {
    console.log("new_room");
    $(".datalist").append(`
  <li>
    <div class="list_box">
      <div class="img_box">
        <img src="../static/img/ps_11_goalline.jpg" alt="" />
      </div>
      <div class="info">
        <p>제목: ${new_room_data[i].title}</p>
        <p>날짜: ${new_room_data[i].date}</p>
        <p>지역: ${new_room_data[i].location}</p>
        <p>인원: ${new_room_data[i].personnel}</p>
        <p>가격: ${new_room_data[i].price}</p>
      </div>
    </div>
  </li>
`);
  }

  if ($(".input_style").val() == "") {
    axios.get("/main", (res) => {
      console.log(res);
    });
  }
});

// 달력
