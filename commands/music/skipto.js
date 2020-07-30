const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class SkiptoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "skipto",
            aliases: ["스킵투"],
            group: "music",
            memberName: "skipto",
            description: "입력한 번호로 음악으로 스킵합니다.",
            guildOnly: true,
            args: [
                {
                    key: "number",
                    prompt: "몇번으로 음악을 스킵할까요?",
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
                if (number === 0) return message.channel.send(new MessageEmbed().setDescription("❗ **0번 트랙은 현재 재생중인 음악입니다.**").setColor(0xFF0000));
                if ((number > player.queue.length) || (number && !player.queue[number - 1])) return message.channel.send(new MessageEmbed().setDescription(`❗ **음악을 찾을 수 없어요.**`).setColor(0xFF0000));
                const { title } = player.queue[number - 1];
                if (number == 1) player.stop();
                player.queue.splice(0, number - 1);
                player.stop();

                return message.channel.send(new MessageEmbed().setDescription(`👌 **\`${title}\` 를(을) 스킵했어요.**`).setColor("#739cde"));
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}