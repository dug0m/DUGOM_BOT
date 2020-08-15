const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    axios = require("axios"),
    cheerio = require("cheerio");

module.exports = class NamuwikiCommand extends Command {
    constructor(client) {
        super(client, {
            name: "namuwiki",
            aliases: ["꺼무위키", "나무위키"],
            group: "other",
            memberName: "namuwiki",
            description: "입력한 Query로 나무위키에서 정보를 찾습니다.",
            args: [
                {
                    key: "query",
                    prompt: "무엇을 검색할까요?",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { query }) {
        await axios.get(`https://namu.wiki/Search?q=${encodeURI(query)}`).then(res => {
            if (res.status !== 200) return message.channel.send(new MessageEmbed().setDescription(`❗ **나무위키 서버에서 정보를 불러올 수 없습니다.**`).setColor(0xFF0000));

            const $ = cheerio.load(res.data);

            let str = "";

            $("div.search-item").each((i, element) => {
                if (i < 9) str += `[${$(element).find("h4 > a").text().trim()}](https://namu.wiki${$(element).find("h4 > a").attr("href")})\n`
            });
            
            if (!str) return message.channel.send(new MessageEmbed().setDescription(`❗ **검색결과가 없습니다.**`).setColor(0xFF0000));

            message.channel.send(new MessageEmbed().setAuthor(query, "https://imgd.androidappsapk.co/a7kSR0oiO7RwFs9D_5pa078iXKm-d36joFkXSavx7ll3nY_hSlTTfZAtPN2LSgNBiJ0=s300").setColor("#5bd98b").setDescription(str));
        });
    }
}