const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

const videoLinks = [
  "https://i.imgur.com/bbigbCj.mp4"
];

module.exports.config = {
  name: "🥺",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Islamick Chat",
  description: "Auto reply to 🥺 with video",
  commandCategory: "noprefix",
  usages: "🥺",
  cooldowns: 5,
  dependencies: {
    "request": "*",
    "fs-extra": "*",
    "axios": "*"
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  const body = event.body?.toLowerCase() || "";
  if (!body.startsWith("🥺")) return;

  const texts = [
    "╭•┄┅════❁🌺❁════┅┄•╮\n\nআমি বলবো কেমন করে আমার শরিলের লোম দারিয়ে যায়-!!🥺\n\n╰•┄┅════❁🌺❁════┅┄•╯"
  ];

  const chosenText = texts[Math.floor(Math.random() * texts.length)];
  const cachePath = __dirname + "/cache/🥺_reply.mp4";

  const callback = () => {
    api.sendMessage({
      body: chosenText,
      attachment: fs.createReadStream(cachePath)
    }, event.threadID, () => fs.unlinkSync(cachePath), event.messageID);
  };

  const videoURL = videoLinks[Math.floor(Math.random() * videoLinks.length)];
  const stream = request(encodeURI(videoURL));
  stream.pipe(fs.createWriteStream(cachePath)).on("close", callback);
};

module.exports.languages = {
  "en": {
    "on": "🥺 auto-reply turned on.",
    "off": "🥺 auto-reply turned off.",
    "successText": "✅"
  },
  "vi": {
    "on": "Đã bật phản hồi 🥺.",
    "off": "Đã tắt phản hồi 🥺.",
    "successText": "✅"
  }
};

module.exports.run = async ({ api, event, Threads, getText }) => {
  const { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  data["🥺"] = !data["🥺"];
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `${data["🥺"] ? getText("on") : getText("off")} ${getText("successText")}`,
    threadID,
    messageID
  );
};
