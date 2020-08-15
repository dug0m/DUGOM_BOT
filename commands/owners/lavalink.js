const { Command } = require("discord.js-commando"),
    discord = require("discord.js");

module.exports = class LavalinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: "lavalink",
            aliases: ["라바링크"],
            group: "owners",
            memberName: "lavalink",
            description: "라바링크 상태를 불러옵니다.",
            ownerOnly: true,
            guarded: true
        });
    }

    async run(message) {
        if (message.author.id !== "659037810992480259") return message.channel.send(new discord.MessageEmbed().setDescription(`❗ **봇 관리자 전용입니다.**`).setColor(0xFF0000));

        const {
            memory,
            cpu,
            uptime,
            frameStats,
            playingPlayers,
            players
        } = this.client.music.nodes.first().stats;

        const allocated = Math.floor(memory.allocated / 1024 / 1024);
        const used = Math.floor(memory.used / 1024 / 1024);
        const free = Math.floor(memory.free / 1024 / 1024);
        const reservable = Math.floor(memory.reservable / 1024 / 1024);

        const systemLoad = (cpu.systemLoad * 100).toFixed(2);
        const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);

        const botUptime = this.uptime(uptime);

        if (frameStats) {
            const { sent, deficit, nulled } = frameStats;
            message.channel.send(`\`\`\`
[Lavalink] | Playing: ${playingPlayers} / Players: ${players}
Memory - Allocated: ${allocated} MB / Used: ${used} MB / Free: ${free} MB / Reservable: ${reservable} MB
CPU - Core: ${cpu.cores} / System Load: ${systemLoad}% / Lavalink Load: ${lavalinkLoad}%
Frame Stats - Sent: ${sent} / Deficit: ${deficit} / Nulled: ${nulled}

Uptime: ${botUptime}
\`\`\``);
        }
        
        message.channel.send(`\`\`\`
[Lavalink] | Playing: ${playingPlayers} / Players: ${players}
Memory - Allocated: ${allocated} MB / Used: ${used} MB / Free: ${free} MB / Reservable: ${reservable} MB
CPU - Core: ${cpu.cores} / System Load: ${systemLoad}% / Lavalink Load: ${lavalinkLoad}%

Uptime: ${botUptime}
\`\`\``);
    }

    uptime(time) {
        const calculations = {
            week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
            day: Math.floor(time / (1000 * 60 * 60 * 24)),
            hour: Math.floor((time / (1000 * 60 * 60)) % 24),
            minute: Math.floor((time / (1000 * 60)) % 60),
            second: Math.floor((time / 1000) % 60)
        };

        let str = "";

        for (const [key, val] of Object.entries(calculations)) {
            if (val > 0) str += `${val} ${key}${val > 1 ? "s" : ""} `;
        }

        return str;
    }
}