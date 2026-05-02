const tableBody = document.getElementById("tableBody");
const courseList = document.getElementById("courseList");

const days = ["MON","TUE","WED","THU","FRI"];

/* SLOT MAP */
const slotMap = {
A11:{day:"MON",time:0}, B11:{day:"MON",time:1}, C11:{day:"MON",time:2},
A21:{day:"MON",time:4}, A14:{day:"MON",time:5}, B21:{day:"MON",time:6}, C21:{day:"MON",time:7},

D11:{day:"TUE",time:0}, E11:{day:"TUE",time:1}, F11:{day:"TUE",time:2},
D21:{day:"TUE",time:4}, E14:{day:"TUE",time:5}, E21:{day:"TUE",time:6}, F21:{day:"TUE",time:7},

A12:{day:"WED",time:0}, B12:{day:"WED",time:1}, C12:{day:"WED",time:2},
A22:{day:"WED",time:4}, B14:{day:"WED",time:5}, B22:{day:"WED",time:6}, A24:{day:"WED",time:7},

D12:{day:"THU",time:0}, E12:{day:"THU",time:1}, F12:{day:"THU",time:2},
D22:{day:"THU",time:4}, F14:{day:"THU",time:5}, E22:{day:"THU",time:6}, F22:{day:"THU",time:7},

A13:{day:"FRI",time:0}, B13:{day:"FRI",time:1}, C13:{day:"FRI",time:2},
A23:{day:"FRI",time:4}, C14:{day:"FRI",time:5}, B23:{day:"FRI",time:6}, B24:{day:"FRI",time:7},
};

/* 🎨 COLOR SYSTEM */
let colorSet = [];
function generateColors(){
  colorSet = [];
  for(let i=0;i<7;i++){
    colorSet.push(`hsl(${Math.random()*360},70%,45%)`);
  }
}
generateColors();

let selectedColor = null;

/* COLOR PICKER */
function renderColorPicker(){
  const picker = document.getElementById("colorPicker");
  picker.innerHTML = "";

  colorSet.forEach(c=>{
    let div = document.createElement("div");
    div.className = "colorBox";
    div.style.background = c;

    div.onclick = ()=>{
      selectedColor = c;
      document.querySelectorAll(".colorBox").forEach(b=>b.classList.remove("active"));
      div.classList.add("active");
    };

    picker.appendChild(div);
  });
}
renderColorPicker();

/* TABLE INIT */
function initTable(){
  tableBody.innerHTML = "";

  days.forEach(day=>{
    let row = `<tr><td>${day}</td>`;

    for(let i=0;i<8;i++){
      if(i===3){
        row += `<td class="lunch">Lunch</td>`;
      } else {
        let slot = Object.keys(slotMap).find(
          s=>slotMap[s].day===day && slotMap[s].time===i
        );

        row += `<td id="${day}-${i}">${slot || "-"}</td>`;
      }
    }

    row += "</tr>";
    tableBody.innerHTML += row;
  });
}
initTable();

/* COURSES */
let courses = [];

function addCourse(){
  const id = Date.now();

  const div = document.createElement("div");
  div.className = "courseRow";

  div.innerHTML = `
    <input placeholder="Subject" id="sub-${id}">
    <input placeholder="Faculty" id="fac-${id}">
    <div class="slotBox" id="slots-${id}"></div>
    <button onclick="removeCourse(${id})">X</button>
  `;

  courseList.appendChild(div);

  const box = div.querySelector(".slotBox");

  Object.keys(slotMap).forEach(s=>{
    let btn = document.createElement("button");
    btn.innerText = s;

    btn.onclick = ()=>btn.classList.toggle("active");

    box.appendChild(btn);
  });

  courses.push(id);
}

function removeCourse(id){
  document.getElementById(`sub-${id}`).parentElement.remove();
  courses = courses.filter(c=>c!==id);
}

/* GENERATE */
function generate(){
  initTable();
  let occupied = {};

  for(let id of courses){

    let subject = document.getElementById(`sub-${id}`).value.trim();
    let faculty = document.getElementById(`fac-${id}`).value.trim();
    let selected = document.querySelectorAll(`#slots-${id} button.active`);

    if(!subject || !faculty || selected.length === 0){
      alert("⚠️ Fill all fields & select slots");
      continue;
    }

    /* 🎨 USE SELECTED OR RANDOM */
    let courseColor = selectedColor || colorSet[Math.floor(Math.random()*colorSet.length)];

    for(let btn of selected){

      let slot = btn.innerText;
      let {day,time} = slotMap[slot];
      let key = `${day}-${time}`;

      if(occupied[key]){
        alert(`⚠️ Clash at ${slot}`);
        continue;
      }

      occupied[key] = true;

      let cell = document.getElementById(key);
      cell.style.background = courseColor;
      cell.innerHTML = `
        <div>${subject}</div>
        <small>${faculty}</small>
      `;
    }
  }
}

/* THEME */
document.getElementById("themeToggle").onclick = ()=>{
  document.body.classList.toggle("light");
};