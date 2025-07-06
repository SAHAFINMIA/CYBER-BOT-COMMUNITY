module.exports.config = {
  name: "googlebar",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️ 𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴 ☢️",
  description: "Comment on table image ( ͡° ͜ʖ ͡°)",
  commandCategory: "edit-img",
  usages: "google [text]",
  cooldowns: 10,
  dependencies: {
    "canvas": "*",
    "axios": "*",
    "fs-extra": "*"
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
};

module.exports.run = async function({ api, event, args }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = require("fs-extra");
  const axios = require("axios");
  const pathImg = __dirname + "/cache/google.png";
  const text = args.join(" ");
  const { threadID, messageID } = event;

  if (!text) return api.sendMessage("✏️ Enter the comment text!", threadID, messageID);

  const imageData = (await axios.get("https://i.imgur.com/GXPQYtT.png", { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(imageData, "utf-8"));

  const baseImage = await loadImage(pathImg);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  let fontSize = 50;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";

  while (ctx.measureText(text).width > 1200) {
    fontSize--;
    ctx.font = `${fontSize}px Arial`;
  }

  const lines = await this.wrapText(ctx, text, 470);
  let startY = 646;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 580, startY + i * fontSize);
  }

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
};
