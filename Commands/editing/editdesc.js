/*
 This file is part of TrelloBot.

 Copyright © Snazzah 2016 - 2019
 Copyright © Yamboy1 (and contributors) 2019 - 2020
 Copyright © Lobo Metalurgico 2019 - 2020

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

module.exports = class EditDesc extends Command {

  get name() { return "editdesc"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["editdescription", "editcarddescription", "editcarddesc"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.cards(user.trelloToken, user.current);
    let bid = undefined;
    Object.keys(body).map((board) => {
      board = body[board];
      if (board.shortLink == args[0]) {
        bid = board;
        bid.id = args[0];
      }
    });
    if (bid !== undefined) {
      await this.client.trello.set.card.description(user.trelloToken, args[0], args.slice(1).join(" "));
      message.reply(`A descrição do cartão "${bid.name}" foi ${args.slice(1).join(" ") == "" ? "Removida" : "Editada"}. \`${bid.shortLink}\``);
    } else {
      message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado");
    }
  }

  get helpMeta() {
    return {
      category: "Edição",
      description: "Edita a descrição de um quadro.",
      usage: ["<cardID> [descrição]"]
    };
  }
};
