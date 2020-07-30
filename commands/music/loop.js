const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class LoopCommand extends Command {
    constructor(client) {
        super(client, {
            name: "loop",
            aliases: ["뤂", "루프", "반복", "repeat"],
            group: "music",
            memberName: "loop",
            description: "음악/대기열을 반복합니다.",
            guildOnly: true,
            args: [
                {
                    key: "select",
                    prompt: "[음악/대기열] 중 어떤 걸 반복할까요?",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { select }) {
        const player = this.client.music.players.get(message.guild.id);
        const { channel } = message.member.voice;

        switch (select) {
            case "song":
            case "음악":
            case "노래":
            case "송":
        }
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                switch (select) {
                    case "song":
                    case "음악":
                    case "노래":
                    case "송":
                        if (!player.trackRepeat) {
                            player.setTrackRepeat(true);
                            return message.channel.send(new MessageEmbed().setDescription(`🔄 **음악을 반복할게요.**`).setColor("#739cde"));
                        } else {
                            player.setTrackRepeat(false);
                            return message.channel.send(new MessageEmbed().setDescription(`🔄 **음악 반복을 해제할게요.**`).setColor("#739cde"));
                        }

                    case "queue":
                    case "큐":
                    case "대기열":
                    case "재생목록":
                        if (player.queueRepeat) {
                            player.setQueueRepeat(false);
                            return message.channel.send(new MessageEmbed().setDescription(`🔄 **대기열 반복을 해제할게요.**`).setColor("#739cde"));
                        } else {
                            player.setQueueRepeat(true);
                            return message.channel.send(new MessageEmbed().setDescription(`🔄 **대기열을 반복할게요.**`).setColor("#739cde"));
                        }
                }
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}