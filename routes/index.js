const express = require('express');
module.exports = {
    appRoutes: (app) => {
        const v1 = express.Router();

        function hello(req, res) {
            console.log("hello")
            res.send("Hello Sarvottam")

        }
        v1.get("/", hello)
        app.use('/api', v1);
        v1.use('/auth', require('./authRoutes'));
        v1.use('/user', require('./userRoutes'));
        v1.use('/pass', require('./vaultDataRoutes'));
        v1.use('/nominee', require('./nomineeRoutes'));
    }
}