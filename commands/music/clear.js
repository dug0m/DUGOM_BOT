const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: "clear",
            aliases: ["클리어", "대기열초기화", "초기화", "큐초기화", "queueclear"],
            group: "music",
            memberName: "clear",
            description: "대기열을 초기화 합니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                player.queue.length = [];
                return message.channel.send(new MessageEmbed().setDescription(`👌 **대기열을 초기화 했어요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}