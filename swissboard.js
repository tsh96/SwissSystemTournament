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
            player1HTML.player = player1;

            var player2HTML = player_proto.cloneNode(false);
            player2HTML.innerText = player2.name + " (" + player2.score + ")";
            player2HTML.player = player2;

            if (pair.state == 1) {
                player1HTML.className = "player winner";
                player2HTML.className = "player looser";
            } else if (pair.state == 2) {
                player1HTML.className = "player looser";
                player2HTML.className = "player winner";
            }

            var nextHTML = next_proto.cloneNode(true);

            var pairHTML = pair_proto.cloneNode(false);
            pairHTML.pair = pair;
            pairHTML.appendChild(player1HTML);
            pairHTML.appendChild(vs_proto.cloneNode(true));
            pairHTML.appendChild(player2HTML);
            pairHTML.appendChild(nextHTML);

            board.appendChild(pairHTML);
        }
    }
}

function updateState(pair, state) {
    if (pair.state == state) return;

    switch (state) {
        case 1:
            pair.player1.score++;
            break;
        case 2:
            pair.player2.score++;
            break;
    }

    switch (pair.state) {
        case 1:
            pair.player1.score--;
            break;
        case 2:
            pair.player2.score--;
            break;
    }

    pair.state = state;

    var playersHTML = document.getElementsByClassName("player");
    var playersHTML_length = playersHTML.length;
    for (var n = 0; n < playersHTML_length; ++n) {
        var player = playersHTML[n];
        player.innerText = player.player.name + " (" + player.player.score + ")";
    }

    updateDetails();
    autoSave();
}

function coverDialog(pair, offset, state) {
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
                updateState(pair, state);
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

function next(pair, offset, state) {
    var feedback = SwissTournament.next(pair, offset, state);
    if (!feedback) return;
    var pairHTML = document.getElementsByClassName("pair")[feedback.offset];
    var player1HTML = pairHTML.getElementsByClassName("player")[0];
    var player2HTML = pairHTML.getElementsByClassName("player")[1];
    var nextHTML = pairHTML.getElementsByClassName("next")[0];

    nextHTML.addEventListener("click", nextClick, false);
    function nextClick() {
        pairHTML.classList.remove("current");
        player1HTML.onclick = function () {
            coverDialog(feedback.pair, feedback.offset, 1);
        };
        player2HTML.onclick = function () {
            coverDialog(feedback.pair, feedback.offset, 2);
        };
        next(pairHTML.pair, feedback.offset, pairHTML.pair.state);
        var repeat = number_of_tables - document.getElementsByClassName("current").length - 1;
        for (var n = 0; n < repeat; ++n)
            next();
        nextHTML.removeEventListener("click", nextClick, false);
    }

    player1HTML.onclick = function () {
        player1HTML.className = "player winner";
        player2HTML.className = "player looser";

        updateState(feedback.pair, 1);
    };

    player2HTML.onclick = function () {
        player1HTML.className = "player looser";
        player2HTML.className = "player winner";

        updateState(feedback.pair, 2);
    };

    pairHTML.classList.add("current");
}

