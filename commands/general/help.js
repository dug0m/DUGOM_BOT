const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["도움말", "도움", "헬프", "명령어", "커맨드"],
            group: "general",
            memberName: "help",
            description: "도움말을 보여줍니다.",
            guarded: true,
            args: [
                {
                    key: "command",
                    prompt: "상세정보를 알아 볼 명령어의 이름 또는 Aliases를 입력해주세요.",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    async run(message, args) {
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(args.command, false, message);

        if (args.command) {
            if (commands.length === 1) {
                let help = new MessageEmbed()
                    .setAuthor(`${commands[0].name}${commands[0].ownerOnly ? " [BOT Owner Only]" : ""}${commands[0].guildOnly ? " [Guild Only]" : ""}${commands[0].nsfw ? " [Nsfw Only]" : ""}`)
                    .setColor("#739cde")
                    .addField("설명", `\`${commands[0].description}\``, true)
                    .addField("그룹 [카테고리]", `\`${commands[0].group.name} [${commands[0].groupID}/${commands[0].memberName}\``, true)
                    .addField("Aliases", `\`${commands[0].aliases.join(", ")}\``, true);

                message.channel.send(help);
            } else if (commands.length > 15) {
                return message.channel.send(new MessageEmbed().setDescription(`❗ **같은 \`이름/Aliases\` 명령어가 있어요. 더 정확하게 입력해주세요.**`).setColor(0xFF0000));
            } else if (commands.length > 1) {
                return message.channel.send(disambiguation(commands, "commands"));
            } else {
                return message.channel.send(new MessageEmbed().setDescription(`❗ **명령어를 찾을 수 없어요. \`두곰아 도움\` (으)로 명령어를 알아보세요.**`).setColor(0xFF0000));
            }
        } else {
            message.channel.send(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "discord_dev")} **${this.client.user.username}봇을 사용해주셔서 감사합니다!**`).setColor("#739cde")
            .addField("기본", "`도움`, `하트`, `한강`,\n`개발자`, `디엠클리어`,\n`체인지로그`, `핑`, `트위치`,\n`업타임`, `웹뷰`", true)
            .addField("정보", "`봇정보`, `서버정보`, `유저정보`", true)
            .addField("음악", "`재생`, `정지`, `일시정지`,\n`다시재생`, `빨리감기`,\n`되감기`, `반복`, `현재곡`,\n`대기열`, `이전곡`, `스킵`,\n`시간이동`, `셔플`, `스킵투`,\n`음량`, `대기열초기화`, `연결`", true)
            .addField("게임", "`타자게임`"));
        }
    }
}