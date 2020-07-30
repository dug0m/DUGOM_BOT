const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", {
    token: "YOUR.TOKEN",
    totalShards: "auto",
    shardList: "auto",
    mode: "process",
    respawn: "true",
    timeout: 999999
});

manager.spawn().catch((err) => console.error(err));
manager.on("shardCreate", shard => console.log(`[SHARD] Launched shard id(s) ${shard.id}`));