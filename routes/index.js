const express = require('express');
module.exports = {
    appRoutes: (app) => {
        const v1 = express.Router();
        app.use('/api', v1);
        v1.use('/auth', require('./authRoutes'));
        v1.use('/user', require('./userRoutes'));
        v1.use('/pass', require('./vaultDataRoutes'));
        v1.use('/nominee', require('./nomineeRoutes'));
    }
}