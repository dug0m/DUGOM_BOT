const { Command } = require("discord.js-commando");

module.exports = class ShardCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shard",
            aliases: ["shardstats", "shardinfo", "샤드정보", "샤드"],
            group: "general",
            memberName: "shard",
            description: "샤드정보를 불러옵니다.",
            ownerOnly: true
        });
    }

    async run(message) {
        const promises = [
            this.client.shard.fetchClientValues("guilds.cache.size"),
            this.client.shard.broadcastEval("this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)")
        ];

        const shardInfo = await this.client.shard.broadcastEval(`[
            this.shard.ids,
            this.shard.mode,
            this.guilds.cache.size,
            this.channels.cache.size,
            this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
            (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            this.music.players.size,
            this.ws.ping
        ]`);

        Promise.all(promises)
            .then(results => {
                let totalMem = 0;
                shardInfo.forEach(s => totalMem += parseInt(s[5]));
                let totalCh = 0;
                shardInfo.forEach(s => totalCh += parseInt(s[3]));
                let avgLatency = 0;
                shardInfo.forEach(s => avgLatency += s[7]);
                let players = 0;
                shardInfo.forEach(s => players += s[6]);
                avgLatency = avgLatency / shardInfo.length;
                avgLatency = Math.round(avgLatency);
                const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
                const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);

                message.channel.send(`\`\`\`md
[Shard - Total] | Status: 💚
Guilds: ${totalGuilds} | Channels: ${totalCh} | Users: ${totalMembers}
API: ${avgLatency} ms | Mem: ${totalMem.toFixed(2)} MB | Players: ${players}\n\`\`\``);
            });

        shardInfo.forEach(i => {
            const status = i[1] === "process" ? "💚" : "🖤";
            message.channel.send(`\`\`\`md
[Shard - ${parseInt(i[0]) + 1}] | Status: ${status}
Guilds: ${i[2]} | Channels: ${i[3]} | Users: ${i[4]}
API: ${i[7]} ms | Mem: ${i[5]} MB | Players: ${i[6]}\n\`\`\``);
        });
    }
}