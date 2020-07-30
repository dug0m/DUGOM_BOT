const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    formatDuration = require("../../utils/music/formatDuration"),
    constants = ["전체", "완료"],
    selections = new Set();

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            aliases: ["재생", "플레이", "ㅔ", "p", "ㅔㅣ묘"],
            group: "music",
            memberName: "play",
            description: "유튜브에서 검색하여 음악을 재생합니다.",
            guildOnly: true,
            clientPermissions: ["CONNECT", "SPEAK"],
            args: [
                {
                    key: "query",
                    prompt: "어떤 음악을 검색할까요?",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { query }) {
        const { channel } = message.member.voice;

        const spawn = this.client.music.players.spawn({
            guild: message.guild,
            voiceChannel: channel,
            textChannel: message.channel
        });

        this.client.music.players.set(message.guild.id, spawn);

        const player = this.client.music.players.get(message.guild.id);
        if (player && channel) {
            if (player.voiceChannel.id === channel.id) {
                let i = 0;

                const searchResults = await this.client.music.search(query, message.author);
                const tracks = searchResults.tracks.slice(0, 10);
                const tracksInfo = tracks.map(r => `**${++i})** [\`${r.title}\`](${r.uri})`).join("\n");

                const embed = new MessageEmbed()
                    .setAuthor("💿 음악 선택 | 원하는 곡의 번호를 입력 후 '완료'를 입력하세요.")
                    .setDescription(tracksInfo)
                    .setColor("#739cde")
                    .setFooter(`팁: 30초 제한 | "전체" 를 입력하면 1 ~ 10번 모든 곡을 대기열에 추가합니다.`);

                const m = await message.channel.send(embed);

                const filter = m => (message.author.id === m.author.id) && (player.voiceChannel.id === channel.id) && ((m.content >= 1 && m.content <= tracks.length) || constants.includes(m.content.toLowerCase()));

                const collector = message.channel.createMessageCollector(filter);
                const tracksToQueue = await handleCollector(collector, tracks);

                i = 0;
                const selectedTracksInfo = tracksToQueue.map(r => `**${++i})** [\`${r.title}\`](${r.uri})`).join("\n");
                const selectedTracksEmbed = new MessageEmbed()
                    .setDescription(selectedTracksInfo)
                    .setColor("#739cde")
                    .setFooter(`총 ${i}개의 음악이 선택되었습니다.`);

                m.delete();

                const msg = await message.channel.send("이대로 음악 선택을 종료할까요? 👍 또는 👎", selectedTracksEmbed);
                await msg.react("👍");
                await msg.react("👎");

                try {
                    const reactionFilter = (reaction, user) => ["👍", "👎"].includes(reaction.emoji.name) && (message.author.id === user.id);
                    const reactions = await msg.awaitReactions(reactionFilter, {
                        max: 1,
                        time: 15000,
                        errors: ["time"]
                    });
                    const selectedReaction = reactions.get("👍") || reactions.get("👎");
                    if (selectedReaction.emoji.name === "👍") {
                        msg.reactions.removeAll();
                        msg.delete();
                        for (const track of tracksToQueue) {
                            player.queue.add(track);
                            message.channel.send(`대기열에 **\`${track.title}\` • ${formatDuration(track.duration)}** 을(를) 추가했어요.`);
                        }
                        if (!player.playing) player.play();
                    } else {
                        msg.reactions.removeAll();
                        msg.delete();
                        message.channel.send(new MessageEmbed().setDescription(`❗ **음악 선택이 취소되었어요. 선택한 트랙은 대기열에 추가되지 않아요.**`).setColor(0xFF0000));
                    }
                } catch (e) {
                    this.client.logger.error(e);
                }
            } else {
                message.channel.send(new MessageEmbed().setDescription(`❗ **해당 명령어는 음성채널 \`${message.guild.channels.cache.find(x => x.type == "voice" && x.members.size > 0 && x.members.find(x => x.user.id == this.client.user.id)).name}\` 에서 사용가능 해요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`❗ **${message.author} 님이 먼저 음성채널에 연결해야 해요.**`).setColor(0xFF0000));
        }
    }
}

function handleCollector(collector, tracks) {
    const tracksToQueue = [];
    return new Promise((resolve, reject) => {
        try {
            collector.on("collect", message => {
                if (message.content.toLowerCase() === "전체") {
                    collector.stop();
                    selections.clear();
                    resolve(tracks);
                } else if (message.content.toLowerCase() === "완료") {
                    collector.stop();
                    selections.clear();
                    resolve(tracksToQueue);
                } else {
                    const entry = message.content;
                    if (selections.has(entry)) {
                        message.channel.send(new MessageEmbed().setDescription(`❗ **해당 음악은 이미 선택 된 음악입니다.**`).setColor(0xFF0000)).then(m => m.delete({ timeout: 3000 }));
                    } else {
                        message.channel.send(new MessageEmbed().setDescription(`👌 **음악이 선택 됨: \`${tracks[entry - 1].title}\`**`).setColor("#739cde")).then(m => m.delete({ timeout: 3000 }));
                        tracksToQueue.push(tracks[entry - 1]);
                        selections.add(entry);
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}