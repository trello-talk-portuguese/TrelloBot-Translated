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

module.exports = class OpenList extends Command {
  get name() { return "openlist"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["unarchivelist"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    let listName = args.join(" ");
    let body = await this.client.trello.get.listsArchived(user.trelloToken, user.current);
    let query = await this.client.util.query(
      message, body,
      listName,
      "name", item => `${item.name} (${item.cards.length} Cards)`,
      "Type the number of the list you want to open."
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== null) {
      await this.client.trello.set.list.closed(user.trelloToken, result.id, false);
      message.reply(`Lista "${result.name}" removida dos arquivos.`);
    } else {
      message.reply(`A lista "${listName}" não foi foi encontrada!`);
    }
  }

  get helpMeta() {
    return {
      category: "Edição",
      description: "remove uma lista dos arquivos.",
      usage: ["<listName>"]
    };
  }
};
