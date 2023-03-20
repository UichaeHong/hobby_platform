import axios from "axios";

let login_btn = document.querySelector(".form_button");
let id = document.querySelector("#form_input_id");
let pw = document.querySelector("form_input_pw");

const tryLogin = () => {
  alert("hi");
  //   axios({
  //     url: "/login",
  //     method: "POST",
  //     data: {
  //       id: id.value,
  //       pw: pw.value,
  //     },
  //   });
};

login_btn.addEventListener("click", tryLogin());
