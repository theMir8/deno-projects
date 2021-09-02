import { Bot } from "https://deno.land/x/telegram@v0.0.3/mod.ts";
// import * as types from "https://deno.land/x/telegram@v0.0.3/types.ts";
import { Context, State } from "https://deno.land/x/telegram@v0.0.3/context.ts";

import { Keyboard } from "./keyboard.ts";

const token = Deno.env.get("BOT_TOKEN") as string;
const bot = new Bot(token);

const keyboard = new Keyboard()
  .text("Yes, they certainly are").row()
  .text("I'm not quite sure").row()
  .text("No. 😈");

function print<T>(data: T) {
  console.log(data);
}

async function fetchSourceCode(): Promise<string> {
  const res = await fetch(
    "https://raw.githubusercontent.com/denogram/denogram/master/examples/deno_bot.ts",
  );
  return res.text();
}

async function fetchStars(usernameAndRepo: string): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${usernameAndRepo}`);
  const data = await res.json();
  // print(data);
  return data.stargazers_count;
}

async function fetchFollowers(username: string): Promise<[number, string]> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();
  print(76765);
  return [data.followers, data.name];
}

async function MessageHandler(ctx: Context<State>) {
  const text = ctx.message?.text;
  var listTexts: string[];
  if (text === "/start") {
    await ctx.reply("hello, world", {
      reply_markup: keyboard.build(true),
    });
  } else if (text === "/stars") {
    const stars = await fetchStars("denogram/denogram");
    await ctx.reply(`Stars: ${stars}`);
  } else if (text?.includes("/stars@")) {
    listTexts = text.split("@");
    const stars = await fetchStars(listTexts[1]);
    await ctx.reply(`Stars: ${stars}`);
  } else if (text === "/src" || text === "/src@DenoBot") {
    const src = await fetchSourceCode();
    await ctx.replyWithMarkdownV2(`\`\`\`${src}\`\`\``);
  } else if (text?.includes("/followers@")) {
    listTexts = text.split("@");
    const udl = await fetchFollowers(listTexts[1]);
    await ctx.reply(`${udl[1]} has ${udl[0]} followers`);
  }
}

// Error handler
bot.use(async (ctx, next) => {
  try {
    await next(ctx);
  } catch (err) {
    console.error(err.message);
  }
});

bot.on("text", MessageHandler);

bot.launch();
