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

module.exports = class PurgeHooks extends Command {

  get name() { return "purgehooks"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "trello-perm"]; }
  get aliases() { return ["pwh"]; }

  async exec(message, args, { user }) {
    let r = await this.client.trello.get.webhooks(user.trelloToken);
    try {
      if (r.length === 0)
        return message.reply("Você não tem webhook's internos.");
      await message.reply(`:warning:Tem certeza de que deseja eliminar os webhooks internos de ${r.length}? Isso interromperá todos os webhooks e precisará ser adicionado novamente para continuar. Digite \`sim\` para confirmar, qualquer outra coisa cancelará a exclusão.`);
      let nextMessage = await this.client.awaitMessage(message);
      if (nextMessage.content == "sim") {
        let processes = await Promise.all(r.map(hook => this.deleteHook(user.trelloToken, hook.id)));
        message.reply(`Eliminado(s) ${processes.filter(v => v == 1).length} hooks, ${processes.filter(v => v == 2).length} falha(s) ao deletar. Você deve adicionar os webhooks novamente agora.`);
      } else {
        await message.channel.send("Confirmação Cancelada.");
      }
    } catch (e) {
      await message.channel.send("Confirmação cancelada devido a uma interrupção.");
    }
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Deleta os webhooks internos."
    };
  }
  deleteHook(token, id) {
    return new Promise(resolve => {
      this.client.trello.delete.webhook(token, id)
        .then(() => resolve(1)).catch(() => resolve(2));
    });
  }
};