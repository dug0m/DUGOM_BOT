const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    fetch = require("node-fetch")
    moment = require("moment-timezone");

moment.locale = "ko-KR";

module.exports = class TwitchCommand extends Command {
    constructor(client) {
        super(client, {
            name: "twitch",
            aliases: ["트위치"],
            group: "general",
            memberName: "twitch",
            description: "트위치 스트리머 정보를 불러옵니다.",
            args: [
                {
                    key: "streamer",
                    prompt: "어떤 스트리머의 정보를 불러올까요?",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { streamer }) {
        const res = await fetch(`http://minibox.club/twitch/${streamer}`).then(e => e.json());

        try {
            const embed = new MessageEmbed()
                .setAuthor(res.data[0].user_name)
                .setTitle(res.data[0].title)
                .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer}-1920x1080.jpg`)
                .setTimestamp(res.data[0].started_at)
                .setFooter(`${res.data[0].viewer_count}명 시청 중`)
                .setURL(`https://twitch.tv/${streamer}`)
                .setColor("#6441a5");
    
            message.channel.send(embed);
        } catch (e) {
            message.channel.send(new MessageEmbed().setDescription(`❗ **해당 유저는 오프라인 이거나 계정이 없습니다.**`).setColor(0xFF0000));
        }
    }
}