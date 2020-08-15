const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            aliases: ["셧다운", "종료"],
            group: "owners",
            memberName: "shutdown",
            description: "해당 샤드를 종료합니다.",
            ownerOnly: true,
            args: [
                {
                    key: "shard",
                    prompt: "몇번 샤드를 종료할까요?",
                    type: "integer"
                }
            ],
            guarded: true
        });
    }

    async run(message, { shard }) {
        if (message.author.id !== "659037810992480259") return message.channel.send(new MessageEmbed().setDescription(`❗ **봇 관리자 전용입니다.**`).setColor(0xFF0000));

        const msg = await message.channel.send(new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "loading")} **\`${shard}\`번 샤드에 종료요청을 보냈어요.**`).setColor("#739cde"));
        this.client.shard.broadcastEval(`if (this.shard.ids.includes(${shard})) process.exit();`);
        msg.edit("", new MessageEmbed().setDescription(`${this.client.emojis.cache.find(x => x.name == "checked_gif")}  **\`${shard}\`번 샤드가 종료되었어요.**`).setColor("#739cde"));
    }
}