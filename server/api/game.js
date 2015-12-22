var express = require('express');
var router = express.Router();

router.get('/game', function(req, res) {
    res.send({
        a: 'ok'
    });
});

router.post('/game', function(req, res) {
    res.send({
        a: 'ok'
    });
});

router.put('/game/:id', function(req, res) {
    res.send({
        a: 'ok'
    });
});

router.get('/game/:id/movements', function(req, res) {
    res.send({
        a: 'ok'
    });
});

module.exports = router;
