/* eslint-disable no-unused-vars */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { sequelize } = require('./src/models');
const { routes } = require('./src/routes');
const errorHandler = require('./src/middleware/ErrorHandlingMiddleware');

// инициализируем приложение
const app = express();
app.use(cors());
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');

//   next();
// });
const corsOptions = {
  // origin: '*',
  // credentials: true, // access-control-allow-credentials:true
  // optionSuccessStatus: 200,
};

// app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Обработка ошибок
app.use(errorHandler);

app.use(express.static('./public/')); // to access the files in public folder
app.use(
  fileUpload({
    // limits: { fileSize: 10 * 1024 * 1024 },
    // useTempFiles: true,
    // tempFileDir: '/tmp/',
  })
);

routes.forEach((item) => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`));
});

// app.use((req, res, next) => {
//   res.header(
//     'Access-Control-Allow-Origin',
//     'https://english-learn-vue.herokuapp.com/',
//   );
// res.header('Access-Control-Allow-Credentials', true);
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// res.header(
//   'Access-Control-Allow-Headers',
//   'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,multipart/form-data'
// );
// if (req.method === 'OPTIONS') {
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type, Origin, Authorization'
//   );
// }
//   next();
// });
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
