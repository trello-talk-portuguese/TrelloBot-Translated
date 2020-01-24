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

module.exports = class RenameList extends Command {

  get name() { return "renamelist"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get argRequirement() { return 3; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.lists(user.trelloToken, user.current);
    if (!args.join(" ").match(/\s\|\s/, "|")) {
      message.channel.send(`Formato inválido`);
      return;
    }
    let c = args.join(" ").replace(/\s\|\s/, "|").split("|");
    let oldName = c[0].trim();
    let newName = c[1].trim();
    let query = await this.client.util.query(
      message, body,
      oldName,
      "name", item => `${item.name} (${item.cards.length} Cartões)`,
      "Digite o número da lista que deseja renomear."
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== null) {
      if (result.name !== newName)
        await this.client.trello.set.list.name(user.trelloToken, result.id, newName);
      message.reply(`A lista foi renomeado de "${result.name}" para "${newName}".`);
    } else {
      message.reply(`Nenhuma lista com o nome "${oldName}" foi encontrada!`);
    }
  }

  get helpMeta() {
    return {
      category: "Edição",
      description: "Renomeia uma lista.",
      usage: ["<oldName> | <newName>"]
    };
  }
};
