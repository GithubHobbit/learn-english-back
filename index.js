/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const { routes } = require('./src/routes');

// инициализируем приложение
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use(fileUpload({
  // limits: { fileSize: 10 * 1024 * 1024 },
  // useTempFiles: true,
  // tempFileDir: '/tmp/',
}));

// app.use(express.static('../../public')); //to access the files in public folder
// app.use(fileUpload());

routes.forEach((item) => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`));
});

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/english', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }, (err) => (err ? console.log(err) : console.log('Connected to database')));
    // await mongoose.connect(
    //   'mongodb+srv://alexkozlov:777xaxa777@cluster0.9ybmx.mongodb.net/recipes',
    //   {},
    // );
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
