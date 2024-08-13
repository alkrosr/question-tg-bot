import { Telegraf } from 'telegraf';
import config from 'config';
import questions from './questions.js';
import { getRandomQuestion, timeToMilliseconds } from './utils.js';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(config.get('TOKEN_TG_BOT'));

const INTERVAL = timeToMilliseconds({ minutes: 1 });
const WORKING_HOURS_START = 7;
const WORKING_HOURS_END = 22;

let intervalId;

function isWorkingTime() {
  const currentHour = new Date().getHours();
  return currentHour >= WORKING_HOURS_START && currentHour < WORKING_HOURS_END;
}

function sendRandomQuestion(ctx) {
  const question = getRandomQuestion(questions);
  ctx.reply(question);

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    if (isWorkingTime()) {
      sendRandomQuestion(ctx);
    }
  }, INTERVAL);
}

bot.start((ctx) => {
  ctx.reply("Бот запущен!");
  sendRandomQuestion(ctx);
});

bot.command('next', (ctx) => {
  sendRandomQuestion(ctx);
});

bot.launch();
console.log("Бот запущен...");
