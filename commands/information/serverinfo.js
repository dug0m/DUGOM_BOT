const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js"),
    moment = require("moment-timezone");
moment.locale = "ko-KR";

module.exports = class ServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "serverinfo",
            aliases: ["섭정", "서버정보", "서버인포", "si"],
            group: "information",
            memberName: "serverinfo",
            description: "서버정보를 보여줍니다."
        });
    }

    async run(message) {
        const embed = new MessageEmbed()
            .setColor("#739cde")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setTitle(message.guild.name)
            .addField("ID", message.guild.id)
            .addField("서버 소유자", message.guild.owner.user.tag)
            .addField("서버 생성일", moment(message.guild.createdAt).format("YYYY/MM/DD A hh : mm : ss (Z)"))
            .addField("서버 유저", `${message.guild.memberCount} (USER: ${message.guild.members.cache.filter(m => !m.user.bot).size} / BOT: ${message.guild.members.cache.filter(m => m.user.bot).size})`)
            .addField("서버 지역", region[message.guild.region])
            .addField("인증단계 | 미디어/콘텐츠 필터 | 2단계 인증 | 시스템 채널", `${verification[message.guild.verificationLevel]} | ${contentfil[message.guild.explicitContentFilter]} | ${mfaLevel[message.guild.mfaLevel]} | ${message.guild.systemChannel ? message.guild.systemChannel : "없음"}`)
            .addField("샤드", `이 서버는 ${this.client.shard.count}개의 샤드 중 ${message.guild.shardID}번째에 들어가 있어요.`)
            .addField("부스트 정보", `레벨: **${message.guild.premiumTier}**\n부스트 개수: **${message.guild.premiumSubscriptionCount}**`);

        const boostembed = new MessageEmbed()
            .setColor("#f03ce4")
            .setTitle(`${this.client.emojis.cache.find(x => x.name == "nitro_boost")} \`${message.guild.name}\` 서버 부스트 목록:`)
            .setDescription(`\`\`\`\n${message.guild.members.cache.filter(member => !!member.premiumSinceTimestamp).map(member => `- ${member.user.tag} | ${moment(member.premiumSince).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}`).join('\n') ? message.guild.members.cache.filter(member => !!member.premiumSinceTimestamp).map(member => `- ${member.user.tag} | ${moment(member.premiumSince).format("YYYY년 MM월 DD일 HH시 mm분 ss초")}`).join('\n') : "없음"}\n\`\`\``);

        message.channel.send(embed);
        message.channel.send(boostembed);
    }
}

const mfaLevel = ["비활성화", "활성화"];

const contentfil = {
    DISABLED: "없음",
    MEMBERS_WITHOUT_ROLES: "역할 없는 멤버의 미디어/콘텐츠 스캔",
    ALL_MEMBERS: "모든 멤버의 미디어/콘텐츠 스캔"
}

const verification = {
    NONE: "없음",
    LOW: "낮음",
    MEDIUM: "보통",
    HIGH: "높음",
    VERY_HIGH: "매우높음"
}

const region = {
    "south-korea": ":flag_kr: 한국 [South Korea]",
    "japan": ":flag_jp: 일본 [Japan]",
    "brazil": ":flag_br: 브라질 [Brazil]",
    "india": ":flag_in: 인도 [India)",
    "europe": ":flag_eu: 유럽 [Europe]",
    "hongkong": ":flag_hk: 홍콩 [Hong Kong]",
    "russia": ":flag_ru: 러시아 [Russia]",
    "southafrica": ":flag_za: 남아프리카 공화국 [South Africa]",
    "singapore": ":flag_sg: 싱가포르 [Singapore]",
    "sydney": ":flag_au: 시드니 [Sydney]",
    "us-central": ":flag_us: 미국 중부 [US Central]",
    "us-east": ":flag_us: 미국 동부 [US East]",
    "us-south": ":flag_us: 미국 남부 [US South]",
    "us-west": ":flag_us: 미국 서부 [US West]"
}