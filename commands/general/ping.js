const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            aliases: ["핑", "ㅔㅑㅜㅎ", "vld"],
            group: "general",
            memberName: "ping",
            description: "핑을 측정합니다."
        });
    }

    async run(message) {
        const m = await message.channel.send(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "loading")} **측정 중..**`).setColor("#739cde"));
        m.edit(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "mongodb")} MongoDB 연결상태: \`${state[require("mongoose").connection.readyState]} [${enstate[require("mongoose").connection.readyState]}]\``).addField(`${this.client.emojis.cache.find(x => x.name == "botLab_discord_loading")} Discord API:`, `**${Math.round(this.client.ws.ping)}** ms`, true).addField("메세지 응답:", `**${m.createdTimestamp - message.createdTimestamp}** ms`, true).setColor("#739cde"));
    }
}

const state = {
    0: "연결 해제됨",
    1: "연결됨",
    2: "연결중",
    3: "연결 해제 중"
}

const enstate = {
    0: "DISCONNECTED",
    1: "CONNECTED",
    2: "CONNECTING..",
    3: "DISCONNECTING.."
}