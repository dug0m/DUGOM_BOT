const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class DevelopersCommand extends Command {
    constructor(client) {
        super(client, {
            name: "developers",
            aliases: ["디벨로퍼", "개발자", "hellothisisverification"],
            group: "general",
            memberName: "developers",
            description: "개발자를 보여줍니다."
        });
    }

    run(message) {
        message.channel.send(new MessageEmbed().addField("닉네임 (태그)", `${this.client.users.cache.get("659037810992480259").tag} ${this.client.emojis.cache.find(x => x.name == "staff")}`).addField("연락수단", `_hangom@kakao.com`).setColor("739cde").setThumbnail(this.client.user.displayAvatarURL()));
        message.channel.send(new MessageEmbed().addField("봇 개발에 도움을 주신 분", `${this.client.users.cache.get("604617640891121664").tag}\n└ **ditto7891@gmail.com**\n\n${this.client.emojis.cache.find(x => x.name == "ArdanKR")} ${this.client.users.cache.get("690504046905393182").tag}\n└ **ardankr2019@naver.com**`).setColor("#739cde"));
    }
}