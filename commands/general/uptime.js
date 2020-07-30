const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    moment = require("moment-timezone");

moment.locale = "ko-KR";

module.exports = class UptimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "uptime",
            aliases: ["업타임"],
            group: "general",
            memberName: "uptime",
            guildOnly: true,
            description: "봇의 업타임을 확인합니다."
        });
    }

    run(message) {
        const totalSeconds = process.uptime();
        const realTotalSecs = Math.floor(totalSeconds % 60);
        const days = Math.floor((totalSeconds % (31536 * 100)) / 86400);
        const hours = Math.floor((totalSeconds / 3600) % 24);
        const mins = Math.floor((totalSeconds / 60) % 60);

        return message.channel.send(new MessageEmbed().setFooter(`봇이 시작 됨: ${moment(this.client.readyAt).format("YYYY/MM/DD A hh : mm : ss (Z)")}`).setDescription(`⌚ **지금까지 \`${days}일 ${hours}시간 ${mins}분 ${realTotalSecs}초\` 켜져 있었어요.**`).setColor("#739cde"));
    }
}