var express = require('express');
var router = express.Router();
var redis = require('redis');
var _ = require('underscore');
var Q = require('q');

var client = redis.createClient();
var config = require('../config');
var gameLogic = require('../logic/game');

function playHandler(res, gameId, action) {
    client.get(gameId, function (err, gameStored) {
        if (err) {
            return res.send(err);
        }
        var game = gameLogic.play(JSON.parse(gameStored), action);
        client.set(game.id, JSON.stringify(game));
        res.send(game);
    });
}

function orderGamesByDuration(games) {
    return games.sort(function(a, b) {
        if(a.duration < b.duration) {
            return -1
        } else if(a.duration > b.duration) {
            return 1;
        }
        return 0;
    });
}

function getAllGames(keys) {
    var promises = [];
    keys.forEach(function (key) {
        var deferred = Q.defer();
        client.get(key, function (err, storedGame) {
            if (err) {
                return deferred.reject(err);
            }
            var game = JSON.parse(storedGame);
            deferred.resolve({
                id: game.id,
                playerName: game.playerName,
                duration: new Date(game.endDate) - new Date(game.startDate),
                isPlayerWinner: game.isPlayerWinner
            });
        });
        promises.push(deferred.promise);
    });
    return promises;
}

function getGamesPlayerWin(games) {
    return games.filter(function(game) {
        return game.isPlayerWinner;
    });
}

function getGames(games, size) {
    games = getGamesPlayerWin(games);
    games = orderGamesByDuration(games);
    return size ? games.splice(0, size) : games;
}

router.get('/games', function (req, res) {
    var size = req.query.size;
    client.keys('*', function (err, keys) {
        if (err) {
            return res.send(err);
        }
        Q.all(getAllGames(keys))
            .then(function (games) {
                res.send(getGames(games, size));
            });
    });
});

router.post('/games', function (req, res) {
    var newGame = gameLogic.create(req.body.playerName);
    client.set(newGame.id, JSON.stringify(newGame));
    res.send(newGame);
});

router.get('/games/:id', function (req, res) {
    client.get(req.params.id, function (err, storedGame) {
        res.send(storedGame ? storedGame : {});
    });
});

router.put('/games/:id', function (req, res) {
    var gameData = req.body;
    client.set(gameData.id, JSON.stringify(gameData));
    res.send(gameData);
});

router.delete('/games/:id', function (req, res) {
    client.del(req.params.id);
    res.send({});
});

router.post('/games/:id/play', function (req, res) {
    playHandler(res, req.params.id, req.body);
});

router.get('/games/:id/play', function (req, res) {
    playHandler(res, req.params.id);
});

module.exports = router;
