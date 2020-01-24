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

module.exports = class MoveCard extends Command {

  get name() { return "movecard"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get argRequirement() { return 2; }
  async exec(message, args, { user }) {
    let body = await this.client.trello.get.cards(user.trelloToken, user.current);
    let card = undefined;
    let listName = args.slice(1).join(" ");
    Object.keys(body).map((board) => {
      board = body[board];
      if (board.shortLink == args[0]) {
        card = board;
        card.id = args[0];
      }
    });
    if (card !== undefined) {
      let lists = await this.client.trello.get.lists(user.trelloToken, user.current);
      let query = await this.client.util.query(
        message, lists,
        listName,
        "name", item => `${item.name} (${item.cards.length} Cartões)`,
        "Digite o número da lista para o qual deseja mover o cartão."
      );
      if (query.quit) return;
      let result = query.result;
      if (result !== null) {
        await this.client.trello.set.card.list(user.trelloToken, card.id, result.id);
        message.reply(`Cartão "${card.name}" \`(${args[0]})\` movido para a lista "${result.name}".`);
      } else {
        message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado.");
      }
    } else {
      message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado.");
    }
  }

  get helpMeta() {
    return {
      category: "Edição",
      description: "Move um cartão para uma lista específica.",
      usage: ["<cardID> <listName>"]
    };
  }
};
