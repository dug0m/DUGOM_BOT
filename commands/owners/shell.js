const { Command } = require("discord.js-commando"),
    discord = require("discord.js"),
    { exec } = require("child_process");

module.exports = class ShellCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shell",
            aliases: ["쉘", "노디ㅣ", "sh"],
            group: "owners",
            memberName: "shell",
            description: "터미널에서 코드를 실행합니다.",
            ownerOnly: true,
            args: [
                {
                    key: "script",
                    prompt: "어떤 코드를 터미널에서 실행할까요?",
                    type: "string"
                }
            ],
            guarded: true
        });
    }

    async run(msg, args) {
        if (message.author.id !== "659037810992480259") return message.channel.send(new discord.MessageEmbed().setDescription(`❗ **봇 관리자 전용입니다.**`).setColor(0xFF0000));
        
        exec(`chcp 65001 | ${args.script}`, (err, stdout, stderr) => {
            if (err) msg.channel.send(`\`\`\`sh\n${stderr.length > 1500 ? stderr.substr(0, 1500) : stderr}\n\`\`\``)
            else msg.channel.send(`\`\`\`sh\n${stdout.length > 1500 ? stdout.substr(0, 1500) : stdout}\n\`\`\``);
        })
    }
}