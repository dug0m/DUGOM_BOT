const { CommandoClient } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    path = require("path"),
    { prefix, token, owner, kb_token } = require("./config.json"),
    koreanbots = require("koreanbots"),
    MyBot = new koreanbots.MyBot(kb_token),
    { ErelaClient } = require("erela.js"),
    Logger = require("./utils/logger");

const client = new CommandoClient({
    commandPrefix: prefix,
    owner: owner,
    partials: ["MESSAGE", "REACTION"]
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["general", "기본 명령어"],
        ["music", "음악 명령어"],
        ["game", "게임 명령어"],
        ["other", "기타 명령어"],
        ["owners", "봇 관리자 명령어"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: true,
        commandState: true
    })
    .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {

    this.logger = new Logger(this);

    this.logger.info(`${client.user.tag}(${client.user.id}) has Login`);
    client.user.setActivity(`${prefix}도움 | ${client.user.username}봇`, {
        type: "PLAYING"
    });

    MyBot.update(client.guilds.cache.size).then(e => this.logger.warn(e.code)).catch(e => this.logger.error(e.message));

    client.music = new ErelaClient(client, [
        {
            host: "localhost",
            port: 2333,
            password: "0215"
        }
    ])
    .on("nodeConnect", node => this.logger.info(`[Lavalink/Node] Lavalink has connected..`))
    .on("trackStart", ({ textChannel }, { title, duration, identifier, uri }) => {
        const formatDuration = require("./utils/music/formatDuration");
        textChannel.send(new MessageEmbed().setTitle(`${title} • ${formatDuration(duration)}`).setURL(uri).setImage(`https://img.youtube.com/vi/${identifier}/maxresdefault.jpg`).setColor("#739cde"));
    })
    .on("queueEnd", player => {
        client.music.players.destroy(player.guild.id);
    })
    .on("trackEnd", player => {
        player.previous = player.futurePrevious;
    });
});

// Other Events

client.on("voiceStateUpdate", async (oldVoice, newVoice) => {
    const player = client.music.players.get(oldVoice.guild.id);
    if (!player) return;
    if (!newVoice.guild.members.cache.get(client.user.id).voice.channelID) client.music.players.destroy(player.guild.id);
    if (oldVoice.id === client.user.id) return;
    if (!oldVoice.guild.members.cache.get(client.user.id).voice.channelID) return;
    if (oldVoice.guild.members.cache.get(client.user.id).voice.channel.id === oldVoice.channelID) {
        if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
            const vcName = oldVoice.guild.me.voice.channel.name;
            const embed = new MessageEmbed()
                .setDescription(`❗ **남아있는 유저가 없어 \`${60000 / 1000}\`초 후 음성채널 \`${vcName}\` 에서 연결을 해제할게요.**`)
                .setColor(0xFF0000);

            const msg = await player.textChannel.send(embed);
            const delay = ms => new Promise(res => setTimeout(res, ms));
            await delay(60000);

            const vcMembers = oldVoice.guild.voice.channel.members.size;
            if (!vcMembers || vcMembers === 1) {
                const newPlayer = client.music.players.get(newVoice.guild.id);
                if (newPlayer) {
                    client.music.players.destroy(newPlayer.guild.id);
                } else {
                    oldVoice.guild.voice.channel.leave();
                }

                const embed2 = new MessageEmbed()
                    .setDescription(`❗ **음성채널 \`${vcName}\` 에서 연결을 해제할게요.**`)
                    .setColor(0xFF0000);
                return player.textChannel.send("", embed2);
            } else {
                msg.delete();
            }
        }
    }
});

client.login(token);