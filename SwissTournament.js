/**
 * Created by user on 11/12/2015.
 */



var SwissTournament = new function () {
    this.players = [];
    this.groups = [];
    this.groups_players = [];
    this.number_of_groups = 0;

    function Player(name, id) {
        this.name = name;
        this.score = 0;
        this.state = 0;
        this.id = id;
        // 0 = inactive
        // 1 = playing
    }

    function Pair(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.state = -1;
        // -1 = inactive
        // 0 = playing
        // 1 = player1 win
        // 2 = player2 win
    }

    function combination_2(n) {
        return n * (n - 1) / 2;
    }

    function randomNumber() {
        return Math.random() - 0.5;
    }

    this.initiate = function (players_str) {
        this.players = players_str.split("\n");
        this.players = this.players.filter(Boolean);
        this.players.sort(randomNumber);
        this.load(this.players, this.number_of_groups);
    };

    this.load = function (players_array, number_of_groups, initial_value) {
        storageItem[date_now]["players"] = players_array.slice();
        storageItem[date_now]["number_of_groups"] = number_of_groups;
        var players_length = players_array.length;
        this.number_of_groups = number_of_groups;
        for (var n = 0; n < players_length; ++n) {
            this.players[n] = new Player(players_array[n], n);
        }

        this.sort();
        if (initial_value) {
            for (n = 0; n < players_length; ++n) {
                this.players[n].score = initial_value.players[n][0];
            }
            var groups_length = this.groups.length;
            for (var g = 0; g < groups_length; ++g) {
                var pairs_length = this.groups[g].length;
                for (var p = 0; p < pairs_length; ++p) {
                    this.groups[g][p].state = initial_value.groups[g][p] || -1;
                }
            }
        }

    };

    this.sort = function () {
        this.groups = [];

        var players_length = this.players.length;
        var players_per_group = Math.floor(players_length / this.number_of_groups);
        var remainder_player = players_length % this.number_of_groups;
        var offset = 0;

        for (var g = 0; g < this.number_of_groups; ++g) {
            var number_of_players = players_per_group;
            if (remainder_player) {
                number_of_players++;
                remainder_player--;
            }

            this.groups.push([]);
            this.groups_players.push([]);
            var group = this.groups[g];
            var group_player = this.groups_players[g];
            var rounds = combination_2(number_of_players);
            var loop = 0;
            for (var p = 0; p < number_of_players; ++p) {
                var reverse = false;
                group_player.push(this.players[p + offset]);
                for (var q = p + 1; q < number_of_players; q++) {
                    var position = loop < rounds / 2 ? loop * 2 : 2 * (rounds - loop) - 1;
                    loop++;
                    group[position] = new Pair(this.players[(reverse ? q : p) + offset], this.players[(reverse ? p : q) + offset]);
                    reverse ^= true;
                }
            }
            offset += number_of_players;
        }
    };

    this.next = function (_g, _p, _offset, _state) {
        if (_g != null && _p != null) {
            var _pair = this.groups[_g][_p];
            _pair.player1.state = _pair.player2.state = 0;
            _pair.state = _state == 0 ? -1 : _state;
        }

        var offset = 0;
        var groups_length = this.groups.length;
        for (var g = 0; g < groups_length; ++g) {
            var group = this.groups[g];

            var pairs_length = group.length;
            for (var p = 0; p < pairs_length; ++p) {
                offset++;
                if (g == _g && p == _p) continue;
                var pair = group[p];
                if (!(pair.player1.state || pair.player2.state) && pair.state == -1) {
                    pair.player1.state = pair.player2.state = 1;
                    pair.state = 0;
                    return {g: g, p: p, offset: --offset};
                }
            }
        }

        if (_state == 0) {
            _pair.player1.state = pair.player2.state = 1;
            _pair.state = 0;
            return {g: _g, p: _p, offset: _offset};
        }

    };

    this.updateState = function (g, p, offset, state) {
        var pair = this.groups[g][p];
        if (pair.state == state)return;

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
        pair.state = state
    }
}();