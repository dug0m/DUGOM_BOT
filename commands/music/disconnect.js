const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class DisconnectCommand extends Command {
    constructor(client) {
        super(client, {
            name: "disconnect",
            aliases: ["연결해제", "나가", "dc", "리브", "leave", "정지", "중지", "스탑", "stop"],
            group: "music",
            memberName: "disconnect",
            description: "음성채널에서 연결을 해제합니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                this.client.music.players.destroy(message.guild.id);
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}