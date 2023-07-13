//time
const timeDisplay = document.getElementById("time-display")
const timeDisplayEdit = document.getElementById("edit-time-display")
function updateTime() {
    let d = new Date()
    timeDisplay.innerText = d
    timeDisplayEdit.innerText = d
    setTimeout(updateTime, 1000);
}
updateTime()
//decimal time to normal time
function minTommss(minutes){
    let sign = minutes < 0 ? "-" : "";
    let min = Math.floor(Math.abs(minutes))
    let sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}
//fixed table header
function tableFixHead(evt) {
    const el = evt.currentTarget,
        sT = el.scrollTop;
    el.querySelectorAll("thead th").forEach(th =>
        th.style.transform = `translateY(${sT}px)`
    );
}
  
document.querySelectorAll(".table-box").forEach(el =>
    el.addEventListener("scroll", tableFixHead)
);
//bootstrap tooltip
function triggerTooltip() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}
//theme
const theme = document.getElementById("theme")
const themeEdit = document.getElementById("edit-theme")
const table = document.getElementById("table")
const editTable = document.getElementById("edit-table")
let color = await window.theme.get()
theme.innerText = color + "_mode"
theme.title = "Chuyển sang nền "
theme.title += (color == "light") ? "sáng" : "tối"
themeEdit.innerText = color + "_mode"
themeEdit.title = "Chuyển sang nền "
themeEdit.title += (color == "light") ? "sáng" : "tối"
table.className = "table table-hover table-bordered table-"
table.className += (color == "light") ? "dark" : "light"
editTable.className = `table table-hover table-bordered table-${(color == "light") ? "dark" : "light"}`
triggerTooltip()
theme.addEventListener("click", async () => {
    window.theme.toggle()
    color = await window.theme.get()
    theme.innerText = color + "_mode"
    let title = "Chuyển sang nền "
    title += (color == "light") ? "sáng" : "tối"
    $('#theme').attr('data-bs-original-title', title);
    $('#edit-theme').attr('data-bs-original-title', title);
    table.className = `table table-hover table-bordered table-${(color == "light") ? "dark" : "light"}`
    editTable.className = `table table-hover table-bordered table-${(color == "light") ? "dark" : "light"}`
})
themeEdit.addEventListener("click", async () => {
    window.theme.toggle()
    color = await window.theme.get()
    theme.innerText = color + "_mode"
    let title = "Chuyển sang nền "
    title += (color == "light") ? "sáng" : "tối"
    $('#theme').attr('data-bs-original-title', title);
    $('#edit-theme').attr('data-bs-original-title', title);
    table.className = `table table-hover table-bordered table-${(color == "light") ? "dark" : "light"}`
    editTable.className = `table table-hover table-bordered table-${(color == "light") ? "dark" : "light"}`
})
//table init
let conf = await window.config.read()
const cnt = document.getElementById("content")
const cntEdit = document.getElementById("edit-content")

function setRow(i) {
    let row = cnt.insertRow()
    for (let index = 0; index < 5; index++) {
        row.insertCell()
    }
    row.cells[0].innerHTML = (i + 1).toString() 
    let prestr = (conf[i].type == 'text') ? '' : 'https://www.youtube.com/playlist?list='
    let mainstr = conf[i].id
    row.cells[1].innerHTML = `<div>${prestr}${mainstr}</div>`
    /*row.addEventListener("mouseover", () => {
        this.getElementByTagName("div")[0].style.backgroundColor = "#323539"
    })*/
    row.cells[2].innerHTML = (conf[i].type == "text") ? "Lời nhắc" : "Liên kết"
    conf[i].tm.forEach(tim => row.cells[3].innerHTML += `${minTommss(tim.time)}<br> `)
    row.cells[3].innerHTML = row.cells[3].innerHTML.substr(0, row.cells[3].innerHTML.length - 2)
    conf[i].tm.forEach(tim => {
        tim.day.forEach(wkday => row.cells[4].innerHTML += `${(wkday !== 6) ? (wkday + 2).toString() : "CN"}, `)
    })
}
function setRowEdit(tim, i) {
    let row = cntEdit.insertRow()
    for (let index = 0; index < 3; index++) {
        row.insertCell()
    }
    row.cells[0].innerHTML = (i + 1).toString()
    row.cells[1].innerHTML += `<input type="time" value="${minTommss(tim.time)}" class="inp-time">`
    row.cells[2].innerHTML = '<textarea class="inp-day">'
    tim.day.forEach(wkday => row.cells[2].childNodes[0].value += `${(wkday !== 6) ? (wkday + 2).toString() : "CN"}, `)
    row.cells[2].childNodes[0].value = row.cells[2].childNodes[0].value.substr(0, row.cells[2].childNodes[0].value.length - 2)
}

for (let i = 0; i < conf.length; i++) {
    setRow(i)
}
//select row, using jquery on stackoverflow https://stackoverflow.com/questions/24750623/select-a-row-from-html-table-and-send-values-onclick-of-a-button
let selected 
let selectedEdit 
function triggerSelectRow(){
    $("#content tr").click(function(){
        $(this).addClass('table-active').siblings().removeClass('table-active');    
        selected=$(this).find('td:first').html() - 1;
    });
}
function triggerSelectRowEdit(){
    $("#edit-content tr").click(function(){
        $(this).addClass('table-active').siblings().removeClass('table-active');    
        selectedEdit=$(this).find('td:first').html() - 1;
    });
}
triggerSelectRow()
//add, edit, remove
//add
document.getElementById("edit-add").addEventListener("click", () => {
    conf[selected].tm.push({
            "time": 0,
            "day": []
        }
    )
    setRowEdit(conf[selected].tm[conf[selected].tm.length - 1], conf[selected].tm.length - 1)
    triggerSelectRowEdit()
    window.config.update(JSON.stringify(conf))
})
//remove
document.getElementById("remove").addEventListener("click", () => {
    cnt.deleteRow(selected)
    conf.splice(selected, 1)
    $("#content").load(location.href + " #content", () => {
        for (let i = 0; i < conf.length; i++) {
            setRow(i)
        }
        triggerSelectRow()
    })
    window.config.update(JSON.stringify(conf))
})
document.getElementById("add").addEventListener("click", () => {
    conf.push({
        "dir": (conf.length + 1).toString(),
        "type": "text",
        "id": "",
        "tm": [{
            "time": 0,
            "day": []
        }],
        "index": 0
    })
    setRow(conf.length - 1)
    triggerSelectRow()
    window.config.update(JSON.stringify(conf))
})
//remove
document.getElementById("edit-remove").addEventListener("click", () => {
    cntEdit.deleteRow(selectedEdit)
    conf[selected].tm.splice(selectedEdit, 1)
    $("#edit-content").load(location.href + " #edit-content", () => {
        conf[selected].tm.forEach((tim, i) => setRowEdit(tim, i))
        triggerSelectRowEdit()
    })
    conf[selected].tm.forEach((tim, i) => setRowEdit(tim, i))
    triggerSelectRowEdit()
    window.config.update(JSON.stringify(conf))
})
//edit
const inpLabel = document.getElementById("inp-label")
document.getElementById("text").addEventListener("click", () => {
    inpLabel.style.display = "hidden"
    inpLabel.innerText = "- Lời nhắc:"
    inpLabel.style.display = "block"
    conf[selected].type = "text"
})
document.getElementById("link").addEventListener("click", () => {
    inpLabel.style.display = "hidden"
    inpLabel.innerText = "- Liên kết danh sách phát:"
    inpLabel.style.display = "block"
    conf[selected].type = "link"
})

document.getElementById("edit").addEventListener("click", () => {
    inpLabel.innerText = (conf[selected].type === "text") ? "- Lời nhắc:" : "- Liên kết danh sách phát:"
    document.getElementById(conf[selected].type).checked = true
    document.getElementById("cont").value = `${(conf[selected].type == 'text') ? '' : 'https://www.youtube.com/playlist?list='}${conf[selected].id}`
    conf[selected].tm.forEach((tim, i) => setRowEdit(tim, i))
    triggerSelectRowEdit()
})

function isValidLink(url) {
    let regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;
    return url.match(regExp)&&url.match(regExp).length>0;
}

function linkParse(url){
    let reg = new RegExp("[&?]list=([a-z0-9_]+)","i");
    let match = reg.exec(url);
    if (match&&match[1].length>0&&youtube_validate(url)){
        return match[1];
    }else{
        return null
    }
}    

function timeStringToFloat(time) {
    let hoursMinutes = time.split(/[.:]/);
    let hours = parseInt(hoursMinutes[0], 10);
    let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

document.getElementById("submit").addEventListener("click", () => {
    let len = cntEdit.rows.length
    conf[selected].id = document.getElementById("cont").value
    if (conf[selected].type === "link" && linkParse(conf[selected].id)) {
        conf[selected].id = linkParse(conf[selected].id)
    }
    for (let i = 0; i < cntEdit.rows.length; i++) {
        conf[selected].tm[i].time = timeStringToFloat(cntEdit.rows[i].cells[1].childNodes[0].value)
        cntEdit.rows[i].cells[2].childNodes[0].value.replace(/ /g, "").split(",").forEach(wkday => {
            if (typeof(wkday.toString()) === "number") {
                conf[selected].tm[i].day.push((wkday === "CN") ? 6 : (wkday.toString() - 2))
            }
        })
    }
    window.config.update(JSON.stringify(conf))
    for(let i = 0; i < len; i++) {
        cntEdit.deleteRow(0)
    }
    $("#content").load(location.href + " #content", () => {
        for (let i = 0; i < conf.length; i++) {
            setRow(i)
        }
        triggerSelectRow()
    })
})

document.getElementById("cancel").addEventListener("click", () => {
    let len = cntEdit.rows.length
    for(let i = 0; i < len; i++) {
        cntEdit.deleteRow(0)
    }
})