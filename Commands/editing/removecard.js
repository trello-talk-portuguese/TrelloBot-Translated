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

module.exports = class RemoveCard extends Command {

  get name() { return "removecard"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["remcard", "-card", "deletecard", "delcard"]; }
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
      try {
        await message.reply(`Você tem certeza que quer deletar o cartão "${bid.name}"? Digite \`sim\` para confirmar. Qualquer outra coisa irá cancelar essa ação.`);
        let nextMessage = await this.client.awaitMessage(message);
        if (nextMessage.content == "yes") {
          await this.client.trello.delete.card(user.trelloToken, args[0]);
          message.reply(`Cartão "${bid.name}" foi deletado com sucesso. \`(${args[0]})\``);
        } else {
          await message.channel.send("Confirmação cancelada.");
        }
      } catch (e) {
        await message.channel.send("Abortado por uma interrupção.");
      }
    } else {
      message.reply("Oops! Este cartão não existe ou não está no quadro selecionado.");
    }
  }

  get helpMeta() {
    return {
      category: "Edição",
      description: "Remove o cartão de um quadro.",
      usage: ["<cardID>"]
    };
  }
};
