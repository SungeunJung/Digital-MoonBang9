const proxy = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        'api/',
        proxy({
            target: 'http://3.21.233.207:5000/api/',
            changeOrigin: true,
        })
    );
};