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
table.className = "table table-hover table-bordered table-striped table-"
table.className += (color == "light") ? "dark" : "light"
triggerTooltip()
theme.addEventListener("click", async () => {
    window.theme.toggle()
    color = await window.theme.get()
    theme.innerText = color + "_mode"
    theme.title = "Chuyển sang nền "
    theme.title += (color == "light") ? "sáng" : "tối"
    table.className = "table table-hover table-bordered table-striped table-"
    table.className += (color == "light") ? "dark" : "light"
    triggerTooltip()
})

var config = await window.config.read()
var content = []
const cnt = document.getElementById("content")
for (var i = 0; i < config.length; i++) {
    content.push(cnt.insertRow())
    for (var index = 0; index < 4; index++) {
        content[i].insertCell()
    }
}
for (var i = 0; i < config.length; i++) {
    content[i].cells[0].innerHTML = (i + 1).toString() 
    content[i].cells[1].innerHTML = (config[i].type == "text") ? "" : "https://www.youtube.com/playlist?list="
    content[i].cells[1].innerHTML += config[i].id
}


