const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class McskinCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mcskin",
            aliases: ["마크", "마크스킨"],
            group: "other",
            memberName: "mcskin",
            description: "입력한 유저이름으로 마크스킨 정보를 가져옵니다.",
            args: [
                {
                    key: "name",
                    prompt: "유저이름을 입력해주세요.",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { name }) {
        message.channel.send(new MessageEmbed()
        .setTitle(`${name} 님의 스킨`)
        .setColor("#739cde")
        .setThumbnail(`https://minotar.net/armor/bust/${name}/100.png`)
        .setDescription(`[[ 아바타 ]](https://minotar.net/helm/${name}/100.png) [[ 3D 아바타 ]](https://minotar.net/cube/${name}/100.png)
[[ 전신 ]](https://minotar.net/armor/body/${name}/100.png) [[ 반신 ]](https://minotar.net/armor/bust/${name}/100.png)
[[ 다운로드 ]](https://minotar.net/download/${name})`));
    }
}