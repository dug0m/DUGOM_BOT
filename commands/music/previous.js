const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class PreviousCommand extends Command {
    constructor(client) {
        super(client, {
            name: "previous",
            aliases: ["이전곡", "이전음악"],
            group: "music",
            memberName: "previous",
            description: "이전 음악으로 이동합니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                if (player.previous == null) return message.channel.send(new MessageEmbed().setDescription(`❗ **이전 음악이 없어요.**`).setColor(0xFF0000));
                player.queue.unshift(player.previous);
                player.stop();
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}