const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    fetch = require("node-fetch");

module.exports = class DisasterCommand extends Command {
    constructor(client) {
        super(client, {
            name: "disaster",
            aliases: ["재난문자", "안전문자"],
            group: "other",
            memberName: "disaster",
            description: "재난문자 목록을 가져옵니다."
        });
    }

    async run(message) {
        let i = 0;

        const get = await fetch("http://m.safekorea.go.kr/idsiSFK/neo/ext/json/disasterDataList/disasterDataList.json").then(res => res.json());

        const embed = new MessageEmbed()
            .setColor("#739cde")
            .setTitle("🚨 재난문자");

        get.forEach(el => {
            i++
            embed.addField(`${el.SJ.replace("재난문자", " ")}`, `> ${el.CONT.split("]").pop().trim()}`);
            if (i === 5) return message.channel.send(embed);
        });
    }
}