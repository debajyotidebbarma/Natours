const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connnection successful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection shutting down');
  console.log(err, err.message);
  server.close(() => {
    process.exit(1);
  });
});
