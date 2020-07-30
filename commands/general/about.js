const { Command } = require("discord.js-commando"),
    { version, MessageEmbed } = require("discord.js");

module.exports = class AboutCommand extends Command {
    constructor(client) {
        super(client, {
            name: "about",
            aliases: ["정보"],
            group: "general",
            memberName: "about",
            description: "봇의 정보를 보여줍니다."
        });
    }

    async run(message) {
        const embed = new MessageEmbed().setAuthor(`${this.client.user.username}봇의 정보를 보여드릴게요!`, this.client.user.displayAvatarURL())
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(`안녕하세요! **${this.client.user.username}봇**을 사용해주셔서 감사해요!
저는 JavaScript 코드로 만들어졌고\n[Discord.js](https://github.com/discordjs/discord.js) (${version}) 가 이용되었어요.
저를 [\`이 링크\`](http://is.gd/dugom_b)로 유저님의 서버에 초대해주세요!
\`\`\`md
1. 라바링크를 통한 최상의 음질 제공
2. 여러가지 유틸리티 기능 제공
\`\`\`
`)
        .setColor("#739cde")
        .addField("재수정한 오픈소스", `[타자게임](https://github.com/flashbot-discord/flashbot/blob/typing-game/commands/game/typing.js)`);

        message.channel.send(embed);
    }
}