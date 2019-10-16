/*
 This file is part of TrelloBot.

 Copyright © Snazzah ??? - 2019
 Copyright © Yamboy1 (and contributors) 2019
 Copyright © Lobo Metalurgico 2019

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { Command } = require("faux-classes");

module.exports = class Boards extends Command {

  get name() { return "boards"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth"]; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.boards(user.trelloToken, user.trelloID);
    if (!body.boards.length)
      return message.reply("Não foram encontrados quadros em que você faça parte. Você pode criar um quadro em https://trello.com/.");
    await this.client.promptList(message, body.boards, (board, embed) => {
      let emojis = (board.subscribed ? "🔔" : "") + (board.starred ? "⭐" : "") + (board.pinned ? "📌" : "");
      let current = board.shortLink === user.current;
      if (embed) {
        if (current)
          return `\`${board.shortLink}\` ${emojis} [${board.name} **(Atual)**](${board.shortUrl})`;
        else return `\`${board.shortLink}\` ${emojis} ${board.name}`;
      } else {
        if (current)
          return `> ${board.shortLink}: ${board.name} (Atual) ${emojis}`;
        else return `${board.shortLink}: ${board.name} ${emojis}`;
      }
    }, {
      header: "Use `" + this.client.config.prefix + "switch <boardID>` para alternar entre os quadros.\n" +
        "Use `" + this.client.config.prefix + "boards [página]` parra ver a lista de quadros.",
      pluralName: "Quadros no Trello",
      itemsPerPage: 15,
      startPage: args[0]
    });
  }

  get helpMeta() {
    return {
      category: "Visualização",
      description: "Mostra todos os seus quadros.",
      usage: ["[página]"]
    };
  }
};
