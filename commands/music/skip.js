const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class SkipCommand extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            aliases: ["스킵", "다음음악", "다음곡"],
            group: "music",
            memberName: "skip",
            description: "다음 음악으로 스킵합니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                if (player.trackRepeat) player.setTrackRepeat(false);
                if (player.queueRepeat) player.setQueueRepeat(false);
                if (player) player.stop();
                return message.channel.send(new MessageEmbed().setDescription(`👌 **현재 음악을 스킵할게요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}