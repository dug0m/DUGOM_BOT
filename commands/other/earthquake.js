const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    axios = require("axios"),
    cheerio = require("cheerio");

module.exports = class EarthquakeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "earthquake",
            aliases: ["지진", "지진현황"],
            group: "other",
            memberName: "earthquake",
            description: "지진현황을 가져옵니다."
        });
    }

    async run(message) {
        await axios.get(`https://search.naver.com/search.naver?query=${encodeURI("지진")}`).then(res => {
            if (res.status !== 200) return message.channel.send(new MessageEmbed().setDescription(`❗ **네이버 서버에서 정보를 불러올 수 없습니다.**`).setColor(0xFF0000));

            const $ = cheerio.load(res.data);
            
            const get = {
                region: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.details > p.location").text(),
                date: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.details > p").eq(1).text(),
                img: $("div.cs_disaster > div.wrap_dzst > div.map_dzst > div.img_area > img").attr("src"),
                num: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.scale > em").text(),
                aa: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.details > dl.detail_list > dd").eq(0).text(),
                bb: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.details > dl.detail_list > dd > p.cast_info > span.text").text(),
                cc: $("div.cs_disaster > div.wrap_dzst > div.scr_dzst > div.info_box > div.details > dl.detail_list > dt").eq(0).text()
            };

            message.channel.send(new MessageEmbed()
            .setTitle(get.region)
            .setDescription("발생시각: " + get.date)
            .setImage(get.img)
            .addField("규모", get.num, true)
            .addField(get.cc, get.aa, true)
            .setFooter(`참고사항: ${get.bb}`)
            .setColor(0xFF0000));
        });
    }
}