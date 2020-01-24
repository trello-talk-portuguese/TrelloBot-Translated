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

module.exports = class ViewList extends Command {

  get name() { return "viewlist"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board"]; }
  get aliases() { return ["list"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    let listName = args.join(" ").replace(/\s*$/, "");
    let matches = listName.match(/\s\d+$/);
    let p = 1;
    let ipp = 15;
    if (matches) {
      // pageNumber() will sort out numbers later
      p = parseInt(matches[0]);
      listName = listName.replace(/\d+$/, "").replace(/\s*$/, "");
    }
    let body = await this.client.trello.get.lists(user.trelloToken, user.current);
    if (!body.length)
      return message.reply("Não foram encontradas listas no quadro. Verifique o arquivo com `" + this.client.config.prefix + "listarchive`.");
    let query = await this.client.util.query(
      message, body,
      listName,
      "name", item => `${item.name} (${item.cards.length} Cartões)`,
      "Digite o número da lista que deseja ver."
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== null) {
      if (!result.cards.length) {
        message.reply("Não foram encontrados cartões nesta lista. Você pode verificar os arquivos usando `" + this.client.config.prefix + "cardarchive` ou criar um cartão usando `" + this.client.config.prefix + "createcard`.");
      } else {
        await this.client.promptList(message, result.cards, (card, embed) => {
          let emojis = (card.subscribed ? "🔔" : "");
          if (embed)
            return `\`${card.shortLink}\` ${card.name} ${emojis} ${card.labels.map(label => `**\`${label.name || "Etiqueta não nomeada"}}  (${label.color || "Sem Cor"})\`**`).join(" ")}`;
          else {
            let l = "";
            if (card.labels.length)
              l += "{" + this.client.util.layout.cardLabels(card.labels).join(", ") + "}";
            return `${card.shortLink}: ${card.name} ${emojis} ${l}`;
          }
        }, {
          header: "Use `" + this.client.config.prefix + "card <cardID>` para ver as informações de um cartão\n" +
            "Use `" + this.client.config.prefix + "viewlist " + result.name + " [página]` para ver a lista de cartões",
          pluralName: "Listas do Trello",
          itemsPerPage: 10,
          startPage: args[0]
        });
      }
    } else message.reply("");
  }

  get helpMeta() {
    return {
      category: "Visualização",
      description: "Lista todos os cartões de uma lista.",
      usage: ["<listName> [página]"]
    };
  }
};
