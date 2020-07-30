const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class PauseCommand extends Command {
    constructor(client) {
        super(client, {
            name: "pause",
            aliases: ["일시중지", "일시정지", "다시재생", "resume"],
            group: "music",
            memberName: "pause",
            description: "음악을 일시정지 합니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                player.pause(player.playing);
                return message.channel.send(new MessageEmbed().setDescription(`👌 **음악을 ${player.playing ? "다시재생" : "일시정지"} 할게요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}