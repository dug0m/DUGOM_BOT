const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    formatDuration = require("../../utils/music/formatDuration");

module.exports = class SeekCommand extends Command {
    constructor(client) {
        super(client, {
            name: "seek",
            aliases: ["시간이동", "싴", "식"],
            group: "music",
            memberName: "seek",
            description: "입력한 시간으로 이동합니다.",
            guildOnly: true,
            args: [
                {
                    key: "time",
                    prompt: "몇시간/몇분으로 이동할까요?",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { time }) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
               if (time * 1000 >= player.queue[0].length || number < 0) return message.channel.send(new MessageEmbed().setDescription(`❗ **해당 시간은 음악이 끝나는 시간을 벗어납니다.**`).setColor(0xFF0000));
               player.seek(time * 1000);

               const parsedDuration = formatDuration(player.position);
               return message.channel.send(new MessageEmbed().setDescription(`👌 **\`${parsedDuration}\`초로 시간을 이동했어요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}