const app = require('../server.js');
module.exports = app;

module.exports.config = {
    api: {
        bodyParser: false
    }
};
