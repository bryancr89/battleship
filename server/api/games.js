var express = require('express');
var router = express.Router();
var redis = require('redis');
var _ = require('underscore');

var client = redis.createClient();
var config = require('../config');
var gameLogic = require('../logic/game');

function playHandler(res, gameId, action) {
    client.get(gameId, function(err, gameStored) {
        if (err) {
            return res.send(err);
        }
        var game = gameLogic.play(JSON.parse(gameStored), action);
        client.set(game.id, JSON.stringify(game));
        res.send(game);
    });
}

router.get('/games', function (req, res) {
    client.keys('*', function (err, keys) {
        var gamesList = [];
        if (err) {
            return res.send(err);
        }
        keys.forEach(function (item) {
            gamesList.push(item);
        });
        res.send(gamesList);
    });
});

router.post('/games', function (req, res) {
    var newGame = gameLogic.create({
        playerName: req.body.playerName
    });
    client.set(newGame.id, JSON.stringify(newGame));
    res.send(newGame);
});

router.get('/games/:id', function (req, res) {
    client.get(req.params.id, function (err, storedGame) {
        res.send(storedGame? storedGame : {});
    });
});

router.put('/games/:id', function (req, res) {
    var gameData = req.body;
    client.set(gameData.id, JSON.stringify(gameData));
    res.send(gameData);
});

router.post('/games/:id/play', function (req, res) {
    playHandler(res, req.params.id, req.body);
});

router.get('/games/:id/play', function (req, res) {
    playHandler(res, req.params.id);
});

module.exports = router;
