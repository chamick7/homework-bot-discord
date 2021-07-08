const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
require("dotenv").config();

const command = require("./command");

let prefix = "";

client.login(process.env.CLIENT_BOT_KEY);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  prefix = getPrefix();
});

client.on("guildCreate", (guild) => {
  const channel = guild.channels.cache.find(
    (channel) => channel.type === "text" && channel.permissionsFor(guild.me).has("SEND_MESSAGES")
  );
  channel.send(
    `Thanks for invite me!! All of\t **${guild.name}'s **Member \n use ${prefix}help  to start`
  );
});

client.on("message", (msg) => {
  const isPrefix = msg.content.startsWith(prefix);

  if (isPrefix) {
    const content = msg.content.substr(1).toLowerCase().split(" ");
    switch (content[0]) {
      case "help":
        command.help.help(msg, prefix);
        break;

      //get prefix or change prefix
      case "prefix":
        if (content.length == 3 && content[1] === "change") {
          let newPrefix = content[2];
          changePrefix(newPrefix);
          msg.channel.send(`\n>>> Now prefix change to **${newPrefix}**`);
        } else msg.channel.send(`\n>>> Current Prefix is **${prefix}**`);
        break;

      case "h":
      case "homework":
        if (content.length === 1) command.homework.viewHomeWork(msg, prefix);
        else if (content.length > 1 && content[1] === "add") {
          command.homework.addHomeWork(msg, prefix);
        }
        break;
    }
  }
});

function changePrefix(newPrefix) {
  const data = readFileSetting();
  data.prefix = newPrefix;
  writeFileSetting(data);
  prefix = newPrefix;
}

function getPrefix() {
  let setting = readFileSetting();
  return setting.prefix;
}

function readFileSetting() {
  return JSON.parse(fs.readFileSync("storage/setting.json", "utf-8"));
}

function writeFileSetting(data) {
  data = JSON.stringify(data);
  fs.writeFileSync("./storage/setting.json", data);
}
