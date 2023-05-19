
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));

const TelegramBot = require('./telegramBot');



const mongodbUri = 'mongodb+srv://arozhka:aleka12345@cluster0.bxajddy.mongodb.net/task_manager';


mongoose
  .connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err));


const syllabusRoutes = require('./routes/syllabus');
app.use('/api', syllabusRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

TelegramBot.startTelegramBot();