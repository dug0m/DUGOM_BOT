module.exports = player => {
    if (!player.queue.length) return player.queue[0].duration;
    return player.queue.reduce((prev, curr) => prev + curr.duration, 0) + player.queue[0].duration;
}