const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", {
    token: "NzI4MDcwMDQ2NTI5NzQ5MDQz.Xwfh8g.zDcZs4BWAOz1aZ0CsOA0rjy67TQ",
    totalShards: "auto",
    shardList: "auto",
    mode: "process",
    respawn: "true",
    timeout: 999999
});

manager.spawn().catch((err) => console.error(err));
manager.on("shardCreate", shard => console.log(`[SHARD] Launched shard id(s) ${shard.id}`));