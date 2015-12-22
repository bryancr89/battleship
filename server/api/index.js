var game = require('./games');

module.exports = function(app) {
    app.use('/api', game);
};
