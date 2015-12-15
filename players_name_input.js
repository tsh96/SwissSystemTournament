/**
 * Created by user on 21/11/2015.
 */

/************************************************ change title events ************************************************/

var players_input = document.getElementById("players_input");
var players_submit = document.getElementById("players_submit");
players_submit.addEventListener("click", players_submit_click, false);

var number_of_group = document.getElementById("number_of_group");
var number_of_table = document.getElementById("number_of_table");

function combination_2(n) {
    return n * (n - 1) / 2;
}

function players_submit_click() {
    chrome.runtime.sendMessage({
        type: MessageType.INITIAL,
        content: players_input.value,
        number_of_groups: number_of_group.value,
        number_of_tables: number_of_table.value
    });
}

var rounds_output = document.getElementById("rounds");
number_of_group.onblur = players_input.onblur = function () {
    var rounds = 0;
    var players_length = players_input.value.split("\n").filter(Boolean).length;
    var players_per_group = Math.floor(players_length / number_of_group.value);
    var remainder_player = players_length % number_of_group.value;

    for (var g = 0; g < number_of_group.value; ++g) {
        var number_of_players = players_per_group;
        if (remainder_player) {
            number_of_players++;
            remainder_player--;
        }

        rounds += combination_2(number_of_players);
    }
    rounds_output.innerHTML = "Number of rounds: " + rounds;
};

chrome.storage.local.get(null, function (callback) {

});