import { Telegraf } from 'telegraf';
import config from 'config';
import questions from './questions.js';
import { getRandomQuestion, timeToMilliseconds } from './utils.js';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(config.get('TOKEN_TG_BOT'));

const INTERVAL = timeToMilliseconds({ minutes: 1 });
console.log('INTERVAL', INTERVAL);
const WORKING_HOURS_START = 7;
const WORKING_HOURS_END = 22;

let intervalId;

// Проверка на рабочие часы
function isWorkingTime() {
  const currentHour = new Date().getHours();
  return currentHour >= WORKING_HOURS_START && currentHour < WORKING_HOURS_END;
}

// Отправка случайного вопроса
function sendRandomQuestion(ctx) {
  const chatId = ctx.chat.id; // Извлекаем chatId из ctx
  const question = getRandomQuestion(questions);
  ctx.reply(question);

  // Перезапуск интервала
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    if (isWorkingTime()) {
      sendRandomQuestion(ctx); // Передаем ctx, чтобы использовать chatId
    }
  }, INTERVAL);
}

// Команда /start
bot.start((ctx) => {
  ctx.reply("Бот запущен!");
  sendRandomQuestion(ctx); // Передаем ctx вместо chatId
});

// Команда /next
bot.command('next', (ctx) => {
  sendRandomQuestion(ctx); // Передаем ctx вместо chatId
});

bot.launch();
console.log("Бот запущен...");
