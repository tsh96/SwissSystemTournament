var split_bar = document.getElementById("split_bar");

var split_percent = 40;
setSplitBarPosition();
window.onresize = setSplitBarPosition;

function setSplitBarPosition() {
    var width = document.body.offsetWidth;
    split_bar.style.left = width * split_percent / 100 - 3 + "px";
    board.style.width = 100 - split_percent + "%";
    details.style.width = split_percent + "%";
}

split_bar.addEventListener("mousedown", SplitBarMouseDown, false);

function SplitBarMouseDown(e) {
    window.addEventListener("mousemove", SplitBarMouseMove, false);
    window.addEventListener("mouseup", SplitBarMouseUp, false);
}

function SplitBarMouseUp(e) {
    window.removeEventListener("mousemove", SplitBarMouseMove, false);
}

function SplitBarMouseMove(e) {
    split_percent = e.x / document.body.offsetWidth * 100;
    split_percent = split_percent < 90 ? split_percent > 10 ? split_percent : 10 : 90;
    split_bar.style.left = split_percent / 100 * document.body.offsetWidth + "px";
    board.style.width = 100 - split_percent + "%";
    details.style.width = split_percent + "%";

}
