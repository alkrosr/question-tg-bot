import { Telegraf, Markup } from "telegraf";
import questions from "./questions.js";
import { getRandomQuestion, timeToMilliseconds } from "./utils.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN_TG_BOT;
if (!token) throw new Error("No token");
const bot = new Telegraf(token);

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

function getKeyboard() {
    if (intervalId) {
      return Markup.keyboard([
        ['Следующий вопрос', 'Остановить'],
      ]).resize().oneTime(false);
    } else {
      return Markup.keyboard([
        ['Начать'],
      ]).resize().oneTime(false);
    }
  }
  
  bot.start((ctx) => {
    ctx.reply("Бот запущен!", getKeyboard());
    sendRandomQuestion(ctx);
  });
  
  bot.hears('Начать', (ctx) => {
    if (!intervalId) {
      sendRandomQuestion(ctx);
      ctx.reply('Бот начал отправлять вопросы.', getKeyboard());
    } else {
      ctx.reply('Бот уже работает.', getKeyboard());
    }
  });
  
  bot.hears('Следующий вопрос', (ctx) => {
    if (intervalId) {
      sendRandomQuestion(ctx);
    } else {
      ctx.reply('Бот не активен. Нажмите "Начать", чтобы запустить его.');
    }
  });
  
  bot.hears('Остановить', (ctx) => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      ctx.reply("Отправка вопросов остановлена.", getKeyboard());
    } else {
      ctx.reply("Бот уже остановлен.");
    }
  });

bot.launch();
console.log("Бот запущен...");
