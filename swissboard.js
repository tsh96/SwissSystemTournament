var board = document.getElementById("board");
var details = document.getElementById("details");

var player_proto = document.createElement("div");
player_proto.classList.add("player");

var vs_proto = document.createElement("div");
vs_proto.innerText = "vs";

var next_proto = document.createElement("div");
next_proto.innerText = "Next";
next_proto.classList.add("next");

var pair_proto = document.createElement("div");
pair_proto.classList.add("pair");

var number_of_tables;

function drawBoard() {
    board.innerHTML = "";
    var groups = SwissTournament.groups;
    var number_of_groups = groups.length;

    for (var g = 0; g < number_of_groups; ++g) {
        var h1 = document.createElement("h1");
        h1.innerText = "Group " + (g + 1);
        board.appendChild(h1);

        var pairs = groups[g];
        var number_of_pairs = pairs.length;
        for (var p = 0; p < number_of_pairs; ++p) {
            var pair = pairs[p];

            var player1 = pair.player1;
            var player2 = pair.player2;

            var player1HTML = player_proto.cloneNode(false);
            player1HTML.innerText = player1.name + " (" + player1.score + ")";
            player1HTML.id = player1.id;

            var player2HTML = player_proto.cloneNode(false);
            player2HTML.innerText = player2.name + " (" + player2.score + ")";
            player2HTML.id = player2.id;

            if (pair.state == 1) {
                player1HTML.className = "player winner";
                player2HTML.className = "player looser";
            } else if (pair.state == 2) {
                player1HTML.className = "player looser";
                player2HTML.className = "player winner";
            }

            var nextHTML = next_proto.cloneNode(true);

            var pairHTML = pair_proto.cloneNode(false);
            pairHTML.state = 0;
            pairHTML.appendChild(player1HTML);
            pairHTML.appendChild(vs_proto.cloneNode(true));
            pairHTML.appendChild(player2HTML);
            pairHTML.appendChild(nextHTML);

            board.appendChild(pairHTML);
        }
    }
}

function updateState(g, p, offset, state) {
    var pair = document.getElementsByClassName("pair")[offset];
    if (pair.state == state) return;
    pair.state = state;

    SwissTournament.updateState(g, p, offset, state);

    var players = SwissTournament.players;
    var playersHTML = document.getElementsByClassName("player");
    var playersHTML_length = playersHTML.length;
    for (var n = 0; n < playersHTML_length; ++n) {
        var player = playersHTML[n];
        player.innerText = players[player.id].name + " (" + players[player.id].score + ")";
    }

    updateDetails();
    //autoSave();

}

function coverDialog(g, p, offset, state) {
    var pairHTML = document.getElementsByClassName("pair")[offset];
    if (pairHTML.state == state) return;

    var player1HTML = pairHTML.getElementsByClassName("player")[0];
    var player2HTML = pairHTML.getElementsByClassName("player")[1];

    var coverHTML = document.createElement("div");
    coverHTML.style.position = "absolute";
    coverHTML.style.width = "100%";
    coverHTML.style.height = "100%";
    coverHTML.style.background = "rgba(0,0,0,0.5)";
    document.body.appendChild(coverHTML);

    var dialogHTML = document.createElement("div");
    dialogHTML.className = "centeredDialog";
    dialogHTML.innerHTML = "If you want to change the result <br> type \"CHANGE\" in the following field <br>";

    var inputHTML = document.createElement("input");
    inputHTML.onkeydown = function () {
        if (event.keyCode == 13) {
            coverHTML.remove();
            dialogHTML.remove();
            if (inputHTML.value == "CHANGE") {
                updateState(g, p, offset, state);
                switch (state) {
                    case 1:
                        player1HTML.className = "player winner";
                        player2HTML.className = "player looser";
                        break;
                    case 2:
                        player1HTML.className = "player looser";
                        player2HTML.className = "player winner";
                        break;
                }
            }
        }
    };

    dialogHTML.appendChild(inputHTML);

    document.body.appendChild(dialogHTML);

}

function next(g, p, offset, state) {
    var feedback = SwissTournament.next(g, p, offset, state);
    if (!feedback) return;
    var pairHTML = document.getElementsByClassName("pair")[feedback.offset];
    var player1HTML = pairHTML.getElementsByClassName("player")[0];
    var player2HTML = pairHTML.getElementsByClassName("player")[1];
    var nextHTML = pairHTML.getElementsByClassName("next")[0];

    nextHTML.addEventListener("click", nextClick, false);
    function nextClick() {
        pairHTML.classList.remove("current");
        player1HTML.onclick = function () {
            coverDialog(feedback.g, feedback.p, feedback.offset, 1);
        };
        player2HTML.onclick = function () {
            coverDialog(feedback.g, feedback.p, feedback.offset, 2);
        };
        next(feedback.g, feedback.p, feedback.offset, pairHTML.state);
        var repeat = number_of_tables - document.getElementsByClassName("current").length - 1;
        for (var n = 0; n < repeat; ++n)
            next();
        nextHTML.removeEventListener("click", nextClick, false);
    }

    player1HTML.onclick = function () {
        player1HTML.className = "player winner";
        player2HTML.className = "player looser";
        updateState(feedback.g, feedback.p, feedback.offset, 1);
    };

    player2HTML.onclick = function () {
        player1HTML.className = "player looser";
        player2HTML.className = "player winner";
        updateState(feedback.g, feedback.p, feedback.offset, 2);
    };

    pairHTML.classList.add("current");
}

