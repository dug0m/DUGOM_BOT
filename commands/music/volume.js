const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class VolumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            aliases: ["불륨", "불륨", "음량"],
            group: "music",
            memberName: "volume",
            description: "음량을 조절합니다.",
            guildOnly: true,
            args: [
                {
                    key: "number",
                    prompt: "음량을 몇으로 설정할까요?",
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
                let volume = Number(number);
                if (number > 1000) volume = 1000;
                player.setVolume(volume);

                return message.channel.send(new MessageEmbed().setDescription(`👌 **음량을 \`${number}%\` (으)로 설정했어요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}