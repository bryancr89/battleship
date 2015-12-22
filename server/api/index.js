var game = require('./game');

module.exports = function(app) {
    app.use('/api', game);
};
