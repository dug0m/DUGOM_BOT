const { Command } = require("discord.js-commando"),
    { version, MessageEmbed } = require("discord.js")
    moment = require("moment-timezone");
moment.locale = "ko-KR";

module.exports = class BotInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botinfo",
            aliases: ["봇정보", "봇상태", "bi"],
            group: "information",
            memberName: "botinfo",
            description: "봇 정보를 보여줍니다."
        });
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setThumbnail(this.client.user.displayAvatarURL())
            .addField("태그", this.client.user.tag)
            .addField("ID", this.client.user.id)
            .addField("생성일", moment(this.client.user.createdAt).format("YYYY/MM/DD A hh : mm : ss (Z)"))
            .addField("유저 수", this.client.users.cache.size + " 명")
            .addField("서버 수", this.client.guilds.cache.size + " 개")
            .addField("샤드", `[ ${this.client.shard.ids} / ${this.client.shard.count} ]`)
            .setColor("#739cde");

        const embed2 = new MessageEmbed()
            .setColor("#739cde")
            .addField("개발언어", `JavaScript | ${this.client.emojis.cache.find(x => x.name == "JS")}`)
            .addField("런타임", `Node.js (${process.versions.node}) | ${this.client.emojis.cache.find(x => x.name == "node_js")}`)
            .addField(`${this.client.emojis.cache.find(x => x.name == "mongodb")} MongoDB`, `상태: \`${state[require("mongoose").connection.readyState]} [${enstate[require("mongoose").connection.readyState]}]\``)

        message.channel.send(embed);
        message.channel.send(embed2);
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