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

module.exports = class ListArchive extends Command {

  get name() { return "listarchive"; }
  get aliases() { return ["archivedlists"]; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board"]; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.listsArchived(user.trelloToken, user.current);
    if (!body.length)
      return message.reply("Não foram encontradas listas arquivadas.");
    await this.client.promptList(message, body, list => list.name, {
      header: "Use `" + this.client.config.prefix + "openlist <listName>` para desarquivar uma lista\n" +
        "Use `" + this.client.config.prefix + "listarchive [página]` para ver a lista",
      pluralName: "Listas arquivadas no Trello",
      itemsPerPage: 15,
      startPage: args[0]
    });
  }

  get helpMeta() {
    return {
      category: "Visualização",
      description: "Lista todos os cartões arquivados num quadro.",
      usage: ["[página]"]
    };
  }
};
