var express = require('express');
var router = express.Router();
var redis = require('redis');

var client = redis.createClient();
var game = require('../logic/games');

router.get('/games', function(req, res) {
    client.keys('*', function (err, keys) {
        var gamesList = [];
        if (err) {
            res.send(err);
        }
        keys.forEach(function(item) {
            gamesList.push(item);
        });
        res.send(gamesList);
    });
});

router.post('/games', function(req, res) {
    console.log('Hello', req.body);
    var newGame = game.create();
    client.set(newGame.id, newGame);
    res.send(newGame);
});

router.put('/games/:id', function(req, res) {
    client.get(req.params.id, function(err, reply) {
        res.send(reply);
    });
});

router.get('/games/:id/movements', function(req, res) {
    res.send({
        a: 'ok'
    });
});

module.exports = router;
