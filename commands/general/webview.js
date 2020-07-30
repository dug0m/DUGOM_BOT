const { Command } = require("discord.js-commando"),
    { MessageAttachment } = require("discord.js"),
    puppeteer = require("puppeteer");

module.exports = class WebviewCommand extends Command {
    constructor(client) {
        super(client, {
            name: "webview",
            aliases: ["웹뷰", "웹보기", "미리보기", "인터넷"],
            group: "general",
            memberName: "webview",
            description: "봇을 통해 웹 사이트를 미리볼 수 있습니다.",
            args: [
                {
                    key: "url",
                    prompt: "어떤 사이트를 볼까요? [프로토콜 제외]",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { url }) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(`http://${url}`);

        const screenshot = await page.screenshot();
        const title = await page.title();
        const site_url = await page.url();

        message.channel.send({ embed: { title: title, url: site_url, color: "#739cde", image: { url: "attachment://result.png" }, files: [new MessageAttachment(screenshot, "result.png")] } });

        await browser.close();
    }
}