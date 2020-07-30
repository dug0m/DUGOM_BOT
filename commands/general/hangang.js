const { Command } = require("discord.js-commando"),
    { createCanvas, loadImage } = require("canvas"),
    { MessageAttachment } = require("discord.js");

module.exports = class HangangCommand extends Command {
    constructor(client) {
        super(client, {
            name: "hangang",
            aliases: ["한강", "한강수온"],
            group: "general",
            memberName: "hangang",
            description: "한강수온을 가져옵니다.",
            clientPermissions: ["ATTACH_FILES"]
        });
    }

    async run(message) {
        const { temp, time } = await require("node-fetch")("http://hangang.dkserver.wo.tc/").then(e => e.json());

        const canvas =  createCanvas(1920, 1080);
        const ctx = canvas.getContext("2d");
        const background = await loadImage("http://pds26.egloos.com/pds/201303/02/82/f0144582_5130f6fa5795c.jpg");

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.font = `190px NanumSquare_ac`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";

        ctx.strokeText(`${temp}°C`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`${temp}°C`, canvas.width / 2, canvas.height / 2);

        ctx.font = `70px NanumSquare_ac`;
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";

        ctx.strokeText(`업데이트: ${time}`, canvas.width / 2, 800);
        ctx.fillText(`업데이트: ${time}`, canvas.width / 2, 800);

        message.channel.send({ embed: { title: "한강수온을 알려드릴게요.", color: "#739cde", image: { url: "attachment://result.png" }, files: [new MessageAttachment(canvas.toBuffer(), "result.png")] } });
    }
}