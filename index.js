  //import the modules(1)
  const express = require('express');
  let http = require('http');
  const bodyParser = require('body-parser');
  const config = require('./config/serverConfig')
  const routes = require("./routes")
  const cors = require('cors')

  //create the instance(2)
  let app = express();
  http = http.Server(app);

  //middleware (4)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }), );
  app.use(cors())
  routes.appRoutes(app);


  //Spinning server to listen on port and host (3)
  http.listen(config.port, config.host, () => {
      console.log(`Listening on http://${config.host}:${config.port}`);
  });