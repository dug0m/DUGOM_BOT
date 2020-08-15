const { Command } = require("discord.js-commando"),
    { MessageEmbed, escapeMarkdown } = require("discord.js");

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
        const commands = this.client.registry.findCommands(args.command, false, message);

        if (args.command) {
            if (commands.length === 1) {
                let help = new MessageEmbed()
                    .setAuthor(`${commands[0].name}${commands[0].ownerOnly ? " [BOT Owner Only]" : ""}${commands[0].guildOnly ? " [Guild Only]" : ""}${commands[0].nsfw ? " [Nsfw Only]" : ""}`)
                    .setColor("#739cde")
                    .setDescription(commands[0].description)
                    .addField("그룹 [카테고리]", `${commands[0].group.name}`)
                    .addField("Aliases", `\`${commands[0].aliases.join(", ")}\``);

                message.author.send(help);
                await message.react("🇩");
                await message.react("🇲");
            } else if (commands.length > 15) {
                return message.channel.send(new MessageEmbed().setDescription(`❗ **같은 \`이름/Aliases\` 명령어가 있어요. 더 정확하게 입력해주세요.**`).setColor(0xFF0000));
            } else if (commands.length > 1) {
                return message.channel.send(disambiguation(commands, "commands"));
            } else {
                return message.channel.send(new MessageEmbed().setDescription(`❗ **명령어를 찾을 수 없어요. \`두곰아 도움\` (으)로 명령어를 알아보세요.**`).setColor(0xFF0000));
            }
        } else {
            const owners = this.client.owners,
                ownerList = owners ? owners.map((usr, i) => {
                    const or = i === owners.length - 1 && owners.length > 1 ? "or " : "";
                    return `${or}${escapeMarkdown(usr.username)}#${usr.discriminator}`;
                }).join(owners.length > 2 ? ", " : " ") : "";

            message.author.send(new MessageEmbed().setAuthor(this.client.user.username, this.client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`안녕하세요! 저는 음악, 게임 등의 여러가지 유틸리티를 제공하는 챗봇입니다!\n명령어 상세정보를 보려면 \`두곰아 [명령어]\` 를 입력하세요.\n\n**도와드릴까요? [${ownerList}로 문의하세요.](https://ejlkr.ml)**\n**초대해주세요: [ejlkr.ml/d_bot/invite](https://ejlkr.ml/d_bot/invite)**`)
            .setColor("#739cde")
            .addField("⚙️ 기본", "`도움`, `핑`, `업타임`, `개발자`, `정보`")
            .addField("🎶 음악", "`연결`, `재생`, `정지`, `일시정지`, `다시재생`,\n`대기열`, `현재곡`, `반복`, `빨리감기`, `되감기`, `대기열초기화`,\n`섞기`, `스킵`, `스킵투`, `음량`, `시간이동`")
            .addField("🎮 게임", "`타자게임`, `지뢰찾기`")
            .addField("❓ 기타", "`재난문자`, `지진`, `태풍`, `한강수온`, `하트`, `마크`,\n`트위치`, `웹뷰`, `나무위키`"));
            await message.react("🇩");
            await message.react("🇲");
        }
    }
}

function disambiguation(items, label, property = "name") {
    const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return new MessageEmbed().setDescription(`❗ **\`${label}\` 에서 같은 이름을 가진 명령어를 여러개 찾았습니다:**\n${itemList}`).setColor(0xFF0000);
}