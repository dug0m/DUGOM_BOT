const util = require("util"),
    discord = require("discord.js"),
    tags = require("common-tags"),
    { Command } = require("discord.js-commando");

const nl = "!!NL!!",
    nlPattern = new RegExp(nl, "g");

module.exports = class EvalCommand extends Command {
    constructor(client) {
        super(client, {
            name: "eval",
            aliases: ["이벨", "이발", "컴파일", "compile"],
            group: "owners",
            memberName: "eval",
            description: "자바스크립트 코드를 실행합니다.",
            args: [
                {
                    key: "script",
                    prompt: "어떤 코드를 실행할까요?",
                    type: "string"
                }
            ]
        });

        this.lastResult = null;
        Object.defineProperty(this, '_sensitivePattern', { value: null, configurable: true });
    }

    run(message, args) {
        const client = message.client;
        const lastResult = this.lastResult;
        const doReply = val => {
            if (val instanceof Error) {
                message.channel.send(new discord.MessageEmbed().setDescription(`❗ **콜백 에러: \`${val}\`**`).setColor(0xFF0000));
            } else {
                const result = this.makeResultMessages(val, process.hrtime(this.hrStart));
                if (Array.isArray(result)) {
                    for (const item of result) message.channel.send(item);
                } else {
                    message.channel.send(result);
                }
            }
        };

        let hrDiff;
        try {
            const hrStart = process.hrtime();
            this.lastResult = eval(args.script);
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return message.channel.send(new discord.MessageEmbed().setDescription(`❗ **코드 실행 중 에러: \`${err}\`**`).setColor(0xFF0000));
        }

        this.hrStart = process.hrtime();
        const result = this.makeResultMessages(this.lastResult, hrDiff, args.script);
        if (Array.isArray(result)) {
            return result.map(item => message.channel.send(item));
        } else {
            return message.channel.send(result);
        }
    }

    makeResultMessages(result, hrDiff, input = null) {
		const inspected = util.inspect(result, { depth: 0 })
			.replace(nlPattern, '\n')
			.replace(this.sensitivePattern, '어허!');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
			split[split.length - 1] :
			inspected[last];
		const prepend = `\`\`\`javascript\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if(input) {
			return discord.splitMessage(tags.stripIndents`
				**코드 실행까지: ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms**
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		} else {
			return discord.splitMessage(tags.stripIndents`
				**콜백 실행까지: ${hrDiff[0] > 0 ?`${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.**
				\`\`\`javascript
				${inspected}
				\`\`\`
			`, { maxLength: 1900, prepend, append });
		}
    }
    
    get sensitivePattern() {
        if (!this._sensitivePattern) {
            const client = this.client;
            let pattern = "";
            if (client.token) pattern += escapeRegex(client.token);
            Object.defineProperty(this, "_sensitivePattern", { value: new RegExp(pattern, "gi"), configurable: false });
        }
        return this._sensitivePattern;
    }
}

function escapeRegex(str) {
	return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}