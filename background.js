/**
 * Created by user on 21/11/2015.
 */

chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create('players_name_input.html', {
        'id': "players_name_input",
        'outerBounds': {
            'width': 400,
            'height': 500
        }
    });
});

function showBoard() {
    chrome.app.window.create('Swissboard.html', {
        'outerBounds': {
            'width': 800,
            'height': 800
        }
    });
}

function showDetails() {
    chrome.app.window.create('details.html', {
        'outerBounds': {
            'width': 400,
            'height': 800
        }
    });
}

var number_of_table;

var date_now = Date.now();
var storageItem = {};
storageItem[date_now] = {};
storageItem[date_now]["players"] = [];
storageItem[date_now]["initial_value"] = {};

function autoSave() {
    storageItem[date_now]["number_of_tables"] = SwissTournament.number_of_tables;

    var players = storageItem[date_now]["initial_value"]["players"] = [];
    var players_length = SwissTournament.players.length;
    for (var n = 0; n < players_length; ++n) {
        players[n] = [SwissTournament.players[n].score, SwissTournament.players[n].state];
    }

    var groups = storageItem[date_now]["initial_value"]["groups"] = [];
    var groups_length = SwissTournament.groups.length;
    for (var g = 0; g < groups_length; ++g) {
        groups[g] = [];
        var pairs_length = SwissTournament.groups[g].length;
        for (var p = 0; p < pairs_length; ++p) {
            groups[g][p] = SwissTournament.groups[g][p].state;
        }
    }

    chrome.storage.local.set(storageItem);
}

function load(id) {
    chrome.storage.local.get(id + "", function (callback) {
        var storageItem = callback[id + ""];
        SwissTournament.number_of_tables = storageItem.number_of_tables;
        SwissTournament.number_of_groups = storageItem.number_of_groups;
        SwissTournament.load(storageItem.players, storageItem.number_of_groups, storageItem.initial_value);
        showBoard();
        showDetails();
        chrome.app.window.get("players_name_input").close();
    })
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case MessageType.INITIAL:
                SwissTournament.number_of_tables = request.number_of_tables;
                SwissTournament.number_of_groups = request.number_of_groups;
                SwissTournament.initiate(request.content);
                showBoard();
                showDetails();
                chrome.app.window.get("players_name_input").close();
                break;
            case MessageType.DRAWBOARD:
                sendResponse(SwissTournament.groups);
                break;
            case MessageType.REQUESTDETAILS:
                chrome.runtime.sendMessage({type: MessageType.DETAILS, content: SwissTournament.groups_players});
                break;
            case MessageType.NEXT:
                sendResponse(SwissTournament.next(request.g, request.p, request.offset, request.state));
                break;
            case MessageType.REQUESTBOARD:
                sendResponse(SwissTournament.number_of_tables);
                break;
            case MessageType.UPDATESTATE:
                SwissTournament.updateState(request.g, request.p, request.offset, request.state);
                chrome.runtime.sendMessage({type: MessageType.DETAILS, content: SwissTournament.groups_players});
                sendResponse(SwissTournament.players);
                autoSave();
        }
    }
);