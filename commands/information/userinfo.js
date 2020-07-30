const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    moment = require("moment-timezone");
const { a } = require("hangul-js");
moment.locale = "ko-KR";

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            aliases: ["유저정보", "ui", "유저상태"],
            group: "information",
            memberName: "userinfo",
            description: "맨션한 유저 또는 자신의 정보를 가져옵니다.",
            args: [
                {
                    key: "user",
                    prompt: "어떤 유저의 정보를 가져올까요?",
                    type: "user",
                    default: message => message.author
                }
            ]
        });
    }

    run(message, { user }) {

        const embed = new MessageEmbed()
            .setColor("#739cde")
            .setTitle(this.client.guilds.cache.get(message.guild.id).member(user.id).displayName)
            .addField("태그", user.tag)
            .addField("ID", user.id)
            .addField("상태", status[user.presence.status])
            .setThumbnail(user.displayAvatarURL({ dynamic: true }));

        if (user.presence.status !== "offline" && !user.bot) embed.addField("접속 클라이언트", `${Object.keys(user.presence.clientStatus).map(e => Cstatus[e]).join(", ")}`);

        if (user.presence.activities[0]) embed.addField("게임 (상위 1번)", `${user.presence.activities.map(a => `${a.name ? a.name : "알 수 없음"} 플레이 중\n> **상세정보:** \`${a.details ? a.details : "알 수 없음"}\`\n> **상태:** \`${a.state ? a.state : "알 수 없음"}\``)[1]}`);

        embed.addField("계정 생성일", moment(user.createdAt).format("YYYY/MM/DD A hh : mm : ss (Z)"));
        embed.addField("서버 가입일", moment(this.client.guilds.cache.get(message.guild.id).member(user.id).joinedAt).format("YYYY/MM/DD A hh : mm : ss (Z)"));

        embed.addField(`역할 [${this.client.guilds.cache.get(message.guild.id).member(user.id).roles.cache.filter(n => n.id !== message.guild.id).size}개]`, this.client.guilds.cache.get(message.guild.id).member(user.id).roles.cache.filter(r => r.id !== message.guild.id).map(r => r).join(", ") || "없음")
        if (this.client.guilds.cache.get(message.guild.id).member(user.id).roles.cache.filter(n => n.id !== message.guild.id).size > 25) {
            embed.addField(`역할 [${this.client.guilds.cache.get(message.guild.id).member(user.id).roles.cache.filter(n => n.id !== message.guild.id).size}개 중 25개]`, this.client.guilds.cache.get(message.guild.id).member(user.id).roles.cache.filter(r => r.id !== message.guild.id).map(r => r).splice(0, 25).join(", "));
        }

        message.channel.send(embed);
    }
}

const status = {
    online: "💚  `온라인`",
    idle: "💛  `자리 비움`",
    dnd: "❤  `다른 용무 중`",
    offline: "🤍  `오프라인`"
}

const Cstatus = {
    desktop: "💻  `데스크탑 [PC]`",
    web: "🌐  `인터넷 [WEB]`",
    mobile: "📱  `모바일 [APP]`"
}