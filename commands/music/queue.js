const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    paginate = require("../../utils/music/paginate"),
    getQueueDuration = require("../../utils/music/getQueueDuration"),
    formatDuration = require("../../utils/music/formatDuration");

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            aliases: ["q", "큐", "재생목록", "대기열"],
            group: "music",
            memberName: "queue",
            description: "서버 대기열을 보여줍니다.",
            guildOnly: true
        });
    }

    async run(message) {
        const player = this.client.music.players.get(message.guild.id);
        const { title, requester, duration, uri, thumbnail } = player.queue[0];

        const parsedDuration = formatDuration(duration);
        const parsedQueueDuration = formatDuration(getQueueDuration(player));
        let pagesNum = Math.ceil(player.queue.length / 10);
        if (pagesNum === 0) pagesNum = 1;

        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const song = player.queue[i];
            songStrings.push(
                `**${i + 1})** [\`${song.title}\`](${song.uri}) **[${formatDuration(song.duration)}] •** <@${!song.requester.id ? song.requester : song.requester.id}>\n`
            );
        }

        const user = `<@${!requester.id ? requester : requester.id}>`;
        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = songStrings.slice(i * 10, i * 10 + 10).join("");
            const embed = new MessageEmbed()
                .setAuthor(`대기열 - ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
                .setColor("#739cde")
                .setThumbnail(thumbnail)
                .setDescription(`**재생 중:** [\`${title}\`](${uri}) **[${parsedDuration}] • ${user}**\n\n**대기열:** ${str == "" ? "  없음" : "\n" + str}`)
                .setFooter(`페이지 ${i + 1}/${pagesNum} | ${player.queue.length}개의 음악 | 총 재생 시간: ${parsedQueueDuration}`);
            pages.push(embed);
        }

        if (pages.length == pagesNum && player.queue.length > 10) paginate(this.client, message, pages, ["◀️", "▶️"], 120000, player.queue.length, parsedQueueDuration);
        else return message.channel.send(pages[0]);
    }
}