var express = require('express');
module.exports = function(app) {
    // Set .html as the default template extension
    app.set('view engine', 'html');

    // Initialize the ejs template engine
    app.engine('html', require('ejs').renderFile);

    // Make the files in the public folder available to the world
    app.use(express.static(__dirname + '/public'));

};