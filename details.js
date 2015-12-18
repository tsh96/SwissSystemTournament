function updateDetails(){
    var detailsHTML = document.getElementById("details");
    detailsHTML.innerHTML = "";
    var groups_players = SwissTournament.groups_players;
    var number_of_groups = groups_players.length;
    for (var g = 0; g < number_of_groups; ++g) {
        var h1 = document.createElement('h1');
        h1.innerText = "Group" + (g + 1);
        detailsHTML.appendChild(h1);

        var players = groups_players[g];
        players.sort(function (a, b) {
            return b.score - a.score;
        });
        var number_of_players = players.length;
        for (var p = 0; p < number_of_players; ++p) {
            var player = document.createElement('div');
            player.innerText = players[p].name + " (" + players[p].score + ")";
            detailsHTML.appendChild(player);
        }
    }
}