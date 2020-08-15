const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    axios = require("axios"),
    cheerio = require("cheerio");

module.exports = class TyphoonCommand extends Command {
    constructor(client) {
        super(client, {
            name: "typhoon",
            aliases: ["태풍", "태풍조회", "태풍현황"],
            group: "other",
            memberName: "typhoon",
            description: "태풍현황을 가져옵니다."
        });
    }

    async run(message) {
        await axios.get(`https://search.naver.com/search.naver?query=${encodeURI("태풍")}`).then(res => {
            if (res.status !== 200) return message.channel.send(new MessageEmbed().setDescription(`❗ **네이버 서버에서 정보를 불러올 수 없습니다.**`).setColor(0xFF0000));

            const $ = cheerio.load(res.data);

            const get = {
                region: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > p").eq(0).text(),
                aa: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > h4.frst").text(),
                prediction2: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > p").eq(2).text(),
                date: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > dl > dd").eq(0).text(),
                bb: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > dl > dd").eq(1).text(),
                cc: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > dl > dd").eq(2).text(),
                dd: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > dl > dd").eq(3).text(),
                ee: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > dl > dd").eq(4).text(),
                img: $("div.cs_disaster > div.wrap_dzst > div.map_dzst > a > img").attr("src")
            }

            message.channel.send(new MessageEmbed()
            .setTitle(get.region)
            .setDescription("기준일시: " + get.date)
            .addField("태풍", get.aa, true)
            .addField("진행방향", get.bb, true)
            .addField("진행속도", get.cc, true)
            .addField("중심기압", get.dd, true)
            .addField("중심부근 최대풍속", get.ee, true)
            .setFooter(`예상경로: ${get.prediction2 ? get.prediction2 : "알 수 없음"}`)
            .setImage(get.img)
            .setColor(0xFF0000));
        })
    }
}