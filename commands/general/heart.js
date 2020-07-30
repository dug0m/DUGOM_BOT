const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    axios = require("axios"),
    { kb_token } = require("../../config.json");

module.exports = class HeartCommand extends Command {
    constructor(client) {
        super(client, {
            name: "heart",
            aliases: ["하트확인", "하트"],
            group: "general",
            memberName: "heart",
            description: "KOREANBOTS 봇 하트정보를 확인합니다.",
            args: [
                {
                    key: "user",
                    prompt: "어떤 분의 하트정보를 불러올까요?",
                    type: "user",
                    default: message => message.author
                }
            ]
        });
    }

    async run(message, { user }) {
        const res = await require("node-fetch")(`https://api.koreanbots.dev/bots/get/${this.client.user.id}`).then(data => data.json());
        const embed = new MessageEmbed()
            .setFooter(`지금까지 받은 ❤ : ${res.data.votes}개`);

        axios.get(`https://api.koreanbots.dev/bots/voted/${user.id}`, {
            headers: {
                token: kb_token
            }
        }).then(res => {
            if (res.data.voted == true) {
                embed.setDescription(`👏 **와! ${user}님은 ${this.client.user.username}봇을 제대로 사용해 주시는군요! 하트 눌러주셔서 감사해요!**`).setColor("#739cde");
                message.channel.send(embed);
            } else {
                embed.setDescription(`🤔 **${user}님은 저에게 하트를 눌러주시지 않았어요.**\n**[\`여기\`](https://koreanbots.dev/bots/728070046529749043)에서 ${this.client.user.username}봇의 하트를 눌러주세요!**`).setColor(0xFF0000);
                message.channel.send(embed);
            }
        });
    }
}