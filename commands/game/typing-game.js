const { Command } = require("discord.js-commando"),
    { MessageEmbed, Collection, MessageCollector } = require("discord.js"),
    hangul = require("hangul-js"),
    fs = require("fs"),
    path = require("path");

module.exports = class TypingGameCommand extends Command {
    constructor(client) {
        super(client, {
            name: "typing-game",
            aliases: ["타이핑", "typing", "타자", "타자게임"],
            group: "game",
            memberName: "typing-game",
            description: "타자게임",
            guildOnly: true,
            args: [
                {
                    key: "query",
                    prompt: "타자게임 서비스: [시작/정지]",
                    type: "string"
                }
            ]
        });

        this.loaded = false;
        this.loading = false;
        this.default = "ko_KR";
        this.session = new Collection();
        this.data = new Collection();
    }

    async run(message, args) {

        /* flashbot source (https://github.com/flashbot-discord/flashbot/blob/typing-game/commands/game/typing.js) */

        switch (args.query) {
            case "reload":
            case "리로드":
                this.p = path.join(path.resolve(), "utils", "typing");
                this.loaded = false;
                this.data.forEach((_) => {
                    delete require.cache[path.join(this.p, "ko_KR.json")]
                });

                return this.loadData(message);

            case "start":
            case "시작": {
                if (!this.loaded) {
                    if (this.loading) return;
                    this.p = path.join(path.resolve(), "utils", "typing");
                    this.loadData(message);
                }

                if (this.session.has(message.channel.id)) return message.channel.send(new MessageEmbed().setDescription(`❗ **이 채널에서 타자게임이 진행 중이예요. 나중에 다시 해주세요.**`).setColor(0xFF0000));
                this.session.set(message.channel.id, {})

                if (!this.data.get(this.default)) {
                    message.channel.send(new MessageEmbed().setDescription(`❗ **타자파일이 존재하지 않습니다.**`).setColor(0xFF0000));
                    return this.stop(message);
                }

                const data = this.data.get(this.default);

                const text = data[Math.floor(Math.random() * data.length)];
                const displayText = text.split("").join("\u200b")

                await message.channel.send(new MessageEmbed().setDescription(`🤟 **타자 시작! 아래 문장을 정확하게 입력해주세요! (제한시간: 1분)**\n\`\`\`\n${displayText}\n\`\`\``).setColor("#739cde"));

                const startTime = Date.now();
                const mc = message.channel.createMessageCollector((m) => !m.author.bot, { time: 60000 });
                this.session.set(message.channel.id, mc);

                mc.on("collect", (m) => {
                    if (m.content === displayText) return message.channel.send(new MessageEmbed().setDescription(`❗ **복사/붙여넣기는 금지되어 있습니다.**`).setColor(0xFF0000));
                    if (m.content !== text) return;

                    const time = (Date.now() - startTime) / 1000;
                    const ta = Math.round(hangul.d(text).length / time * 60);
                    message.channel.send(new MessageEmbed().setDescription(`⏰ **시간: ${time}초 / 타 수: ${ta}타**`).setColor("#739cde"));
                    mc.stop("correct")
                });

                mc.on("end", (_, reason) => {
                    if (reason === "stopcmd") message.channel.send(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "checked_gif")} **타자게임을 종료할게요.**`).setColor("#739cde"))
                    else if (reason !== "correct") message.channel.send(new MessageEmbed().setDescription(`❗ **입력 반응이 없어 타자게임을 종료했어요.**`).setColor(0xFF0000));

                    this.session.delete(message.channel.id);
                });

                break;
            }

            case "stop":
            case "종료":
            case "정지":
            case "중지":
                this.stop(message);
        }

        /* flashbot source (https://github.com/flashbot-discord/flashbot/blob/typing-game/commands/game/typing.js) */

    }

    stop(message) {
        if (!this.session.has(message.channel.id)) return message.channel.send(new MessageEmbed().setDescription(`❗ **타자게임이 진행 중이지 않아요.**`).setColor(0xFF0000));
        if (this.session.get(message.channel.id) instanceof MessageCollector) this.session.get(message.channel.id).stop("stopcmd");
        this.session.delete(message.channel.id);
    }

    loadData(message) {
        if (!fs.existsSync(this.p)) return message.channel.send(new MessageEmbed().setDescription(`❗ **타자폴더가 존재하지 않습니다.**`).setColor(0xFF0000));

        const locales = fs.readdirSync(this.p);

        if (locales.length < 1) return message.channel.send(new MessageEmbed().setDescription(`❗ **타자파일이 존재하지 않습니다.**`).setColor(0xFF0000));

        locales.forEach((l) => {
            if (!fs.lstatSync(path.join(this.p, l)).isFile() || !l.endsWith(".json")) return;
            this.data.set(l.slice(0, l.length - 5), require(path.join(this.p, l)));
        });

        this.loaded = true;
        this.loading = false;
        message.channel.send(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "checked_gif")} **타자데이터를 로드했어요.**`).setColor("#739cde"));
    }
}