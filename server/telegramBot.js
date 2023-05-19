
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');

const Syllabus = require('./models/syllabus');

const botToken = "6187626463:AAEBXdgIheuEy-JJcaYmumvq0v0x5fYTlwk"; 
const bot = new TelegramBot(botToken, { polling: true });

const sendReminder = (chatId, message) => {
  bot.sendMessage(chatId, message);
};

const getUpcomingAssignments = async () => {
  const syllabus = await Syllabus.find();
  const now = moment();
  const upcomingAssignments = syllabus.filter((entry) => {
    return entry.assignmentDates.some((date) => {
      const assignmentDate = moment(date, 'YYYY-MM-DD');
      return assignmentDate.diff(now, 'days') <= 5;
    });
  });
  return upcomingAssignments;
};

const startTelegramBot = () => {
  bot.onText(/\/remind/, async (msg) => {
    const chatId = msg.chat.id;
    const upcomingAssignments = await getUpcomingAssignments();

    if (upcomingAssignments.length === 0) {
      bot.sendMessage(chatId, 'No upcoming assignments');
      return;
    }

    upcomingAssignments.forEach((assignment) => {
      const reminderMessage = `Reminder: Upcoming assignment for ${assignment.courseName}- ${assignment.coveredTopic} on ${assignment.assignmentDates}`;
      sendReminder(chatId, reminderMessage);
    });
  });
};

module.exports = {
  startTelegramBot,
};
