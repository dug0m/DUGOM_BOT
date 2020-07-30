const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    formatDuration = require("../../utils/music/formatDuration");

module.exports = class RewindCommand extends Command {
    constructor(client) {
        super(client, {
            name: "rewind",
            aliases: ["리와인드", "뒤로", "되감기"],
            group: "music",
            memberName: "rewind",
            description: "n초 만큼 되감기 합니다.",
            guildOnly: true,
            args: [
                {
                    key: "number",
                    prompt: "몇초 되감기 할까요?",
                    type: "integer"
                }
            ]
        });
    }

    async run(message, { number }) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {

                if ((player.position - number * 1000) > 0) {
                    player.seek(player.position - number * 1000);
                    const parsedDuration = formatDuration(player.position);
                    return message.channel.send(new MessageEmbed().setDescription(`👌 **\`${parsedDuration}\`초로 되감기 했어요.**`).setColor("#739cde"));
                } else {
                    return message.channel.send(new MessageEmbed().setDescription(`❗ **되감기 한 시간이 음악이 끝나는 시간으로 진행할 수 없어요.**`).setColor(0xFF0000));
                }
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}