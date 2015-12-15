chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case MessageType.DETAILS:
            document.body.innerHTML = "";
            var groups_player = request.content;
            var number_of_groups = groups_player.length;
            for (var g = 0; g < number_of_groups; ++g) {
                var h1 = document.createElement('h1');
                h1.innerText = "Group" + (g + 1);
                document.body.appendChild(h1);

                var players = groups_player[g];
                players.sort(function (a, b) {
                    return b.score - a.score;
                });
                var number_of_players = players.length;
                for (var p = 0; p < number_of_players; ++p) {
                    var player = document.createElement('div');
                    player.innerText = players[p].name + " (" + players[p].score + ")";
                    document.body.appendChild(player);
                }
            }
            break;
    }
});

chrome.runtime.sendMessage({type: MessageType.REQUESTDETAILS});