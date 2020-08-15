const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    formatDuration = require("../../utils/music/formatDuration");

module.exports = class NowPlayingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "nowplaying",
            aliases: ["현재곡", "재생곡", "재생중인곡", "np", "나우플레잉", "ㅞ"],
            group: "music",
            memberName: "nowplaying",
            description: "현재 재생중인 음악의 정보를 보여줍니다.",
            guildOnly: true
        });
    }

    async run(message) {
        try {
            const player = this.client.music.players.get(message.guild.id);
            const { title, duration, uri, identifier, requester } = player.queue[0];
    
            const parsedCurrentDuration = formatDuration(player.position);
            const parsedDuration = formatDuration(duration);
            const part = Math.floor((player.position / duration) * 30);
            const uni = player.playing ? "▶" : "⏸";
    
            const embed = new MessageEmbed()
                .setColor("#739cde")
                .setTitle(title)
                .setURL(uri)
                .setImage(`https://img.youtube.com/vi/${identifier}/maxresdefault.jpg`)
                .addField("요청자", requester)
                .setDescription(`\`\`\`
[${parsedCurrentDuration} / ${parsedDuration}] ${uni} ${"─".repeat(part) + "⚪" + "─".repeat(30 - part)}
\`\`\``)
    
            message.channel.send(embed);
        } catch (e) {
            return message.channel.send(new MessageEmbed().setDescription(`❗ **재생 중인 음악이 없어요.**`).setColor(0xFF0000));
        }
    }
}