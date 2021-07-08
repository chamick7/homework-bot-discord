const fs = require("fs");
const { connect } = require("http2");
const moment = require("moment");

module.exports.viewHomeWork = (msg) => {
  let homeWorkData = getHomeWork();
  homeWorkData = homeWorkData.filter((hw) => moment(hw.dueDate, "DD/MM/YYYY").isAfter(moment()));
  const homework = homeWorkData
    .map((hw, index) => {
      return `\n\t [${hw.id}]    " ${hw.name} " \t ${moment(hw.dueDate, "DD/MM/YYYY").format(
        "dddd DD MMMM YYYY"
      )} `;
    })
    .join(" ");

  msg.react("🤝");

  msg.channel.send(
    "------------\n\n **Homework list** ```bash\n \t ID. \t\t Name \t\t\t DueDate\n" +
      homework +
      "```"
  );
};

function readFileHomeWork() {
  return JSON.parse(fs.readFileSync("storage/homework.json", "utf-8"));
}

function getHomeWork() {
  const data = readFileHomeWork();
  return data.homeWorkList;
}

module.exports.addHomeWork = (msg, prefix) => {
  const content = msg.content.substr(1).toLowerCase().split(" ");

  if (content.length === 4 && moment(content[3], "DD/MM/YYYY")) {
  } else {
    msg.react("❌");
    msg.channel.send(
      `>>> Add home work must be format -> **${prefix}homework add [homework] [due date]** `
    );
  }
};
