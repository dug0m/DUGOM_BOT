const { Command } = require("discord.js-commando"),
    { MessageEmbed } = require("discord.js");

module.exports = class MinesweeperCommand extends Command {
    constructor(client) {
        super(client, {
            name: "minesweeper",
            aliases: ["지뢰", "지뢰찾기"],
            group: "game",
            memberName: "minesweeper",
            description: "지뢰를 찾습니다.",
            args: [
                {
                    key: "query",
                    prompt: "난이도를 선택하세요: [기본/쉬움/보통/어려움/매우어려움/미침]",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { query }) {
        let bombs = 0;

        switch (query) {
            case "기본":
            case "default":
                bombs = 25;
                break;

            case "쉬움":
            case "easy":
                bombs = 10;
                break;

            case "보통":
            case "medium":
                bombs = 25;

            case "어려움":
            case "hard":
                bombs = 50;

            case "매우어려움":
            case "xhard":
                bombs = 75;
                break;

            case "미침":
            case "insane":
                bombs = 195;
                break;
        }

        const size = 14;
        this.board = this.createBoard(size);
        this.addBombToBoard(bombs);
        this.addPointersToBombs();
        const result = this.boardString;
        await message.channel.send(new MessageEmbed()
        .setDescription(result)
        .setColor("#739cde"));
    }

    get boardString() {
        const printable = new Array(this.board.length + 1);
        for (let i = 0; i < this.board.length; i++) {
            printable[i] = "";
            for (let j = 0; j < this.board[i].length; j++) {
                switch (this.board[i][j]) {
                    case -1:
                        printable[i] += "||:bomb:||";
                        break;

                    case 0:
                        printable[i] += "||:zero:||";
                        break;

                    case 1:
                        printable[i] += "||:one:||";
                        break;
                    
                    case 2:
                        printable[i] += "||:two:||";
                        break;

                    case 3:
                        printable[i] += "||:three:||";
                        break;

                    case 4:
                        printable[i] += "||:four:||";
                        break;

                    case 5:
                        printable[i] += "||:five:||";
                        break;

                    case 6:
                        printable[i] += "||:six:||";
                        break;
                    
                    case 7:
                        printable[i] += "||:seven:||";
                        break;

                    case 8:
                        printable[i] += "||:eight:||";
                        break;

                    case 9:
                        printable[i] += "||:nine:||";
                        break;
                }
            }
        }

        return printable.join("\n");
    }

    createBoard(size) {
        const board = new Array(size);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(size);
        }

        return board;
    }

    addBombToBoard(bombs) {
        let i = 0;
        while (i < bombs) {
            let x = Math.floor(Math.random() * this.board.length);
            let y = Math.floor(Math.random() * this.board[0].length);
            if (this.board[x][y] != -1) {
                this.board[x][y] = -1;
                i++
            }
        }
    }

    addPointersToBombs() {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let count = 0;
                if (this.board[i][j] != -1) {
                    for (let k = -1; k <= 1; k++) {
                        for (let l = -1; l <= 1; l++) {
                            if (i + k >= 0 && j + l >= 0 && i + k < this.board.length && j + l < this.board[i].length) {
                                if (this.board[i + k][j + l] == -1) {
                                    count++;
                                }
                            }
                        }
                    }
                    this.board[i][j] = count;
                }
            }
        }
    }
}