module.exports = function initializeRoutes(app) {
    app.get('/', function (req, res) {
        res.render('index.html');
    });
};
