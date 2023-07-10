const timeDisplay = document.getElementById("time")
function updateTime() {
    timeDisplay.innerText = new Date()
    setTimeout(updateTime, 1000);
}
updateTime()


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

function triggerTooltip() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

const theme = document.getElementById("theme")
const table = document.getElementById("table")
var color = await window.theme.get()
theme.innerText = color + "_mode"
theme.title = "Chuyển sang nền "
theme.title += (color == "light") ? "sáng" : "tối"
table.className = "table table-hover table-bordered table-"
table.className += (color == "light") ? "dark" : "light"
triggerTooltip()
theme.addEventListener("click", async () => {
    window.theme.toggle()
    color = await window.theme.get()
    theme.innerText = color + "_mode"
    theme.title = "Chuyển sang nền "
    theme.title += (color == "light") ? "sáng" : "tối"
    table.className = "table table-hover table-bordered table-"
    table.className += (color == "light") ? "dark" : "light"
    triggerTooltip()
})

var conf = await window.config.read()
var content = []
const cnt = document.getElementById("content")
for (var i = 0; i < conf.length; i++) {
    content.push(cnt.insertRow())
    for (var index = 0; index < 4; index++) {
        content[i].insertCell()
    }
}

function minTommss(minutes){
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes))
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

for (var i = 0; i < conf.length; i++) {
    content[i].cells[0].innerHTML = (i + 1).toString() 
    var prestr = (conf[i].type == 'text') ? '' : 'https://www.youtube.com/playlist?list='
    var mainstr = conf[i].id
    content[i].cells[1].innerHTML = `<div>${prestr}${mainstr}</div>`
    /*content[i].addEventListener("mouseover", function() {
        this.getElementByTagName("div")[0].style.backgroundColor = "#323539"
    })*/
    content[i].cells[2].innerHTML = minTommss(conf[i].time)
    content[i].cells[3].innerHTML = ""
    conf[i].day.sort()
    conf[i].day.forEach(wkday => content[i].cells[3].innerHTML += (wkday + 2).toString() + ", ")
    content[i].cells[3].innerHTML = content[i].cells[3].innerHTML.substr(0, content[i].cells[3].innerHTML.length - 2)
}


