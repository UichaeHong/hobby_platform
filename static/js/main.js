window.onload = function () {
  buildcalendar();
}; // 웹 페이지가 로드되면 buildcalendar 실행

let nowMonth = new Date(); // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date(); // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0); // 비교 편의를 위해 today의 시간을 초기화

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
function buildcalendar() {
  let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1); // 이번달 1일
  let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0); // 이번달 마지막날

  let tbody_calendar = document.querySelector(".calendar > tbody");
  document.getElementById("calYear").innerText = nowMonth.getFullYear(); // 연도 숫자 갱신
  document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1); // 월 숫자 갱신

  while (tbody_calendar.rows.length > 0) {
    // 이전 출력결과가 남아있는 경우 초기화
    tbody_calendar.deleteRow(tbody_calendar.rows.length - 1);
  }

  let nowRow = tbody_calendar.insertRow(); // 첫번째 행 추가

  for (let j = 0; j < firstDate.getDay(); j++) {
    // 이번달 1일의 요일만큼
    let nowColumn = nowRow.insertCell(); // 열 추가
  }

  for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {
    // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복

    let nowColumn = nowRow.insertCell(); // 새 열을 추가하고
    nowColumn.innerText = leftPad(nowDay.getDate()); // 추가한 열에 날짜 입력

    if (nowDay.getDay() == 0) {
      // 일요일인 경우 글자색 빨강으로
      nowColumn.style.color = "#DC143C";
    }
    if (nowDay.getDay() == 6) {
      // 토요일인 경우 글자색 파랑으로 하고
      nowColumn.style.color = "#0000CD";
      nowRow = tbody_calendar.insertRow(); // 새로운 행 추가
    }

    if (nowDay < today) {
      // 지난날인 경우
      nowColumn.className = "pastDay";
    } else if (
      nowDay.getFullYear() == today.getFullYear() &&
      nowDay.getMonth() == today.getMonth() &&
      nowDay.getDate() == today.getDate()
    ) {
      // 오늘인 경우
      nowColumn.className = "today";
      nowColumn.onclick = function () {
        choiceDate(this);
      };
    } else {
      // 미래인 경우
      nowColumn.className = "futureDay";
      nowColumn.onclick = function () {
        choiceDate(this);
      };
    }
  }
}

// 날짜 선택
function choiceDate(nowColumn) {
  if (document.getElementsByClassName("choiceDay")[0]) {
    // 기존에 선택한 날짜가 있으면
    document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay"); // 해당 날짜의 "choiceDay" class 제거
  }
  nowColumn.classList.add("choiceDay"); // 선택된 날짜에 "choiceDay" class 추가
}

// 이전달 버튼 클릭
function prevCalendar() {
  nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate()); // 현재 달을 1 감소
  buildcalendar(); // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextCalendar() {
  nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate()); // 현재 달을 1 증가
  buildcalendar(); // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
  if (value < 10) {
    value = "0" + value;
    return value;
  }
  return value;
}

// 탭
const tabItem = document.querySelectorAll(".category_list li");
const tabContent = document.querySelectorAll(".tab-content");

tabItem.forEach((item) => {
  item.addEventListener("click", tabHandler);
});

async function tabHandler(item) {
  $(".datalist").empty();
  const tabTarget = item.currentTarget;
  const target = tabTarget.dataset.tab;
  console.log(tabTarget.value);
  tabItem.forEach((title) => {
    title.classList.remove("current");
  });
  tabContent.forEach((target) => {
    target.classList.remove("current");
  });
  document.querySelector("#" + target).classList.add("current");
  tabTarget.classList.add("current");

  // 카드 만들기
  let room_data = await axios.get("/getData");
  room_data = room_data.data.data;
  let new_room_data = [];
  let category = "";
  switch (tabTarget.value) {
    case 0:
      category = "전체보기";
      break;
    case 1:
      category = "축구";
      break;
    case 2:
      category = "야구";
      break;
    case 3:
      category = "농구";
      break;
    case 4:
      category = "배구";
      break;
  }
  console.log(category);
  for (let i = 0; i < room_data.length; i++) {
    if (category == room_data[i].category) {
      // console.log(room_data[i], input.value);
      // console.log(new_room_data);
      new_room_data.push(room_data[i]);
    }
  }

  for (let i = 0; i < new_room_data.length; i++) {
    $(".datalist").append(`
    <li>
    <a href="#">  
      <div class="list_box">
        <div class="img_box">
          <img src="../static/img/ps_11_goalline.jpg" alt="" />
        </div>
        <div class="info">
          <p class="small_badge">${new_room_data[i].category}</p>
          <p class="title">
             ${new_room_data[i].title}
          </p>
          <p class="date">
            <i class="fa-regular fa-calendar"></i
            ><strong>날짜</strong> : ${new_room_data[i].date}
          </p>
          <p class="person">
            <i class="fa-solid fa-person"></i
            ><strong>정원</strong> : ${new_room_data[i].personnel}
          </p>
        </div>
        <div class="badge">신청가능</div>
      </div>
    </a>
  </li>
`);
  }
  if (category == "전체보기") {
    for (let i = 0; i < room_data.length; i++) {
      $(".datalist").append(`
    <li>
    <a href="#">  
      <div class="list_box">
        <div class="img_box">
          <img src="../static/img/ps_11_goalline.jpg" alt="" />
        </div>
        <div class="info">
          <p class="small_badge">${room_data[i].category}</p>
          <p class="title">
             ${room_data[i].title}
          </p>
          <p class="date">
            <i class="fa-regular fa-calendar"></i
            ><strong>날짜</strong> : ${room_data[i].date}
          </p>
          <p class="person">
            <i class="fa-solid fa-person"></i
            ><strong>정원</strong> : ${room_data[i].personnel}
          </p>
        </div>
        <div class="badge">신청가능</div>
      </div>
    </a>
  </li>
`);
    }
  }
}

// 검색기능
$(".input_style").change(async () => {
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
    $(".datalist").append(`
    <li>
    <a href="#">  
      <div class="list_box">
        <div class="img_box">
          <img src="../static/img/ps_11_goalline.jpg" alt="" />
        </div>
        <div class="info">
          <p class="small_badge">축구</p>
          <p class="title">
             ${new_room_data[i].title}
          </p>
          <p class="date">
            <i class="fa-regular fa-calendar"></i
            ><strong>날짜</strong> : ${new_room_data[i].date}
          </p>
          <p class="person">
            <i class="fa-solid fa-person"></i
            ><strong>정원</strong> : ${new_room_data[i].personnel}
          </p>
        </div>
        <div class="badge">신청가능</div>
      </div>
    </a>
  </li>
`);
  }

  if ($(".input_style").val() == "") {
    axios.get("/main", (res) => {
      console.log(res);
    });
  }
});
