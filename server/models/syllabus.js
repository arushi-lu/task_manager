

const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({

  studyWeek: {
    type: String,
    required: true,
  },
  coveredTopic: {
    type: String,
    required: true,
  },
  assignmentDates: {
    type: [String],
  },
  courseName: {
    type: String,
    required: true,
  },
  weekNum: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Syllabus', syllabusSchema);
