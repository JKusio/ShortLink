const express = require('express');
const config = require('./config');
const loader = require('./loader');

(async () => {
    const app = express();

    await loader(app);
    
})();