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

module.exports = class SubscribeList extends Command {

  get name() { return "subscribelist"; }
  get cooldown() { return 2; }
  get argRequirement() { return 1; }
  get permissions() { return ["auth"]; }
  get aliases() { return ["sublist"]; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.lists(user.trelloToken, user.current);
    let listName = args.join(" ");
    let query = await this.client.util.query(
      message, body,
      listName,
      "name", item => `${item.name} (${item.cards.length} Cartões)`,
      "Digite o número da lista em que deseja se (des)inscrever."
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== undefined) {
      let newSub = !result.subscribed;
      await this.client.trello.subscribe.list(user.trelloToken, result.id, newSub);
      message.channel.send(`Você ${newSub ? "está" : "não está"} inscrito na lista "${result.name}".`);
    } else {
      message.reply(`Nenhuma lista com o nome "${listName}" foi encontrada!`);
    }
  }

  get helpMeta() {
    return {
      category: "Informações do Usuário",
      description: "Se (des)increve de uma lista específica.",
      usage: ["<listName>"]
    };
  }
};
