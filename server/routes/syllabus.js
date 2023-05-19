
const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');


const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const filePath = req.file.path;
  const fileType = req.file.mimetype;

  if (fileType === 'text/plain' || fileType === 'application/pdf') {

    fs.readFile(filePath, 'utf-8', (error, fileData) => {
      if (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Error reading file' });
        return;
      }


      const syllabusEntries = JSON.parse(fileData);


      for (const entry of syllabusEntries) {
        const { studyWeek, coveredTopic, assignmentDates, courseName, weekNum } = entry;

        const Syllabus = require('../models/syllabus'); // Assuming your model is defined in a separate file
        const newSyllabus = new Syllabus({
          studyWeek,
          coveredTopic,
          assignmentDates,
          courseName,
          weekNum,
        });

        
        newSyllabus.save()
          .then(() => {
            console.log('Syllabus entry saved successfully');
          })
          .catch((saveError) => {
            console.error('Error saving syllabus entry:', saveError);
          });
      }


      res.status(200).json({ message: 'File uploaded and data saved successfully' });
    });
  } else {

    res.status(400).json({ error: 'Invalid file type. Only .txt and .pdf files are allowed' });
  }
});

router.get('/syllabus', (req, res) => {
    const Syllabus = require('../models/syllabus');
    Syllabus.find({}, 'weekNum coveredTopic assignmentDates courseName')
      .then((syllabus) => {

        const syllabusData = {};
  

        for (const entry of syllabus) {
          const { weekNum, coveredTopic, assignmentDates, courseName } = entry;
  

          if (!syllabusData[weekNum]) {
            syllabusData[weekNum] = [];
          }
  

          syllabusData[weekNum].push({
            coveredTopic,
            assignmentDates,
            courseName,
          });
        }
  
        res.json(syllabusData);
      })
      .catch((err) => {
        console.error('Error retrieving syllabus:', err);
        res.status(500).json({ error: 'Error retrieving syllabus' });
      });
  });

  router.delete('/syllabus', (req, res) => {
    const Syllabus = require('../models/syllabus');
    Syllabus.deleteMany({})
      .then(() => {
        res.status(200).json({ message: 'All syllabus entries deleted successfully' });
      })
      .catch((err) => {
        console.error('Error deleting syllabus entries:', err);
        res.status(500).json({ error: 'Error deleting syllabus entries' });
      });
  });
  

module.exports = router;
