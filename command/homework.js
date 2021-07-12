const fs = require("fs");
const { connect } = require("http2");
const moment = require("moment");

module.exports.viewHomeWork = (msg, prefix) => {
  let homeWorkData = getHomeWork();

  //filter homework not passed
  homeWorkData = homeWorkData.filter((hw) => moment(hw.dueDate, "DD/MM/YYYY").isAfter(moment()));

  //build string from homeworkData
  const homework = homeWorkData
    .map((hw, index) => {
      return `\n\t [${hw.id}]    " ${hw.name} " \t ${moment(hw.dueDate, "DD/MM/YYYY").format(
        "dddd DD MMMM YYYY"
      )} `;
    })
    .join(" ");

  msg.react("🤝");

  //check if homework not empty
  if (homeWorkData.length > 0) {
    msg.channel.send(
      "------------\n\n **Homework list** ```bash\n \t ID. \t\t Name \t\t\t DueDate\n" +
        homework +
        "```"
    );
  } else {
    msg.channel.send(
      `>>> Home work is Empty!. \n\t You can add by **${prefix}homework add [homework] [due date]**`
    );
  }
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
  //check msg have name and dueDate
  if (content.length === 4) {
    const homeWorkData = getHomeWork();
    const newHomeWork = {
      id: genNewId(),
      name: content[2],
      dueDate: moment(content[3], "DD/MM/YYYY").format("DD/MM/YYYY"),
    };

    homeWorkData.push(newHomeWork);
    writeFileHomeWork(homeWorkData);

    msg.react("👍🏻");
    msg.channel.send(">>> Homework has been Added✅");
  } else {
    msg.react("❌");
    msg.channel.send(
      `>>> Add homework must be format -> **${prefix}homework add [homework] [due date]** `
    );
  }
};

function writeFileHomeWork(data) {
  fs.writeFileSync("storage/homework.json", JSON.stringify({ homeWorkList: data }));
}

function genNewId() {
  let randNum = Math.floor(100000 + Math.random() * 900000);
  return randNum.toString();
}

module.exports.removeHomeWork = (msg, prefix) => {
  const content = msg.content.substr(1).toLowerCase().split(" ");

  if (content.length === 3) {
    let needWriteFile = false;
    let selectedHomeWork = {};
    let reqInp = content[2].toLowerCase();
    const homeworkData = getHomeWork();
    const homeWorkForMap = homeworkData;

    homeWorkForMap.map((hw, index) => {
      if (hw.id.toLowerCase().indexOf(reqInp) > -1 || hw.name.toLowerCase().indexOf(reqInp) > -1 && reqInp.length >= 3) {
        homeworkData.splice(index, 1);
        selectedHomeWork = hw;
        needWriteFile = true;
      }
    });

    if (needWriteFile) {
      writeFileHomeWork(homeworkData);
      msg.react("👍🏻");
      msg.channel.send(
        `> Homework has been deleted ✂️\n 🚫 \t[${selectedHomeWork.id}]\t " ${
          selectedHomeWork.name
        } "\t ${moment(selectedHomeWork.dueDate, "DD/MM/YYYY").format("dddd DD MMMM YYYY")}`
      );
    } else {
      msg.react("❌");
      msg.channel.send(">>> Homework not found ⛔️");
    }
  } else {
    msg.react("❌");
    msg.channel.send(
      `>>> Remove homework must be format -> **${prefix}homework remove [ID or Name]** `
    );
  }
};
