const express = require('express');
const app = express();
const registerRoute = require('./modules/routes/registerRoutes');


app.use(express.json());

app.use('/register', registerRoute);

app.use((req, res, next) => {
  res.status(404).json({
    error: 'Wrong Request'
  });
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to port 5000!");
  }
})