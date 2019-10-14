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

module.exports = class EditWebhook extends Command {

  get name() { return "editwebhook"; }
  get cooldown() { return 1; }
  get permissions() { return ["auth", "trello-perm"]; }
  get argRequirement() { return 2; }

  toOrigin(str) {
    return Object.keys(this.client.util.TrelloEvents).filter(t => t.toLowerCase() == str.toLowerCase())[0];
  }

  async exec(message, args, { user }) {
    let boards = await this.client.trello.get.boards(user.trelloToken, user.trelloID);
    if (!boards.boards.map(b => b.shortLink).includes(args[0])) {
      message.channel.send("Você não tem acesso a esse quadro!");
    } else {
      let webhook = await this.client.data.get.webhook(message.guild.id, args[0]);
      if (webhook === null) {
        message.reply("Você não possui um webhook ligado a esse quadro!");
      } else {
        if (args[1] !== "all") {
          let cb = [];
          let okay = true;
          args.slice(1).map((arg) => {
            if (Object.keys(this.client.util.TrelloEvents).map(arg => arg.toLowerCase()).includes(arg.slice(1).toLowerCase()) && !cb.includes(arg.toLowerCase())) {
              cb.push(arg.toLowerCase());
            } else {
              okay = false;
            }
          });
          let bits = webhook.bits;
          if (bits.length === 0) {
            bits = Object.keys(this.client.util.TrelloEvents).map(r => r.toLowerCase());
          }
          let added = [];
          let removed = [];
          cb.map(bit => {
            if (okay) {
              if (bit.startsWith("+")) {
                if (!bits.includes(bit.slice(1))) {
                  let newbits = bits;
                  bits[bits.length] = bit.slice(1);
                  added.push(bit.slice(1));
                }
              } else if (bit.startsWith("-")) {
                if (bits.includes(bit.slice(1))) {
                  bits = bits.filter(b => {return b !== bit.slice(1);});
                  removed.push(bit.slice(1));
                }
              } else {
                okay = false;
              }
            } else {
              cb = [];
            }
          });
          if (added.length !== 0 && removed.length !== 0 && cb.length !== 0) {
            message.reply("Bits editados!\n\n**Bits atuais**: " + webhook.bits.map(bit => `\`${this.toOrigin(bit)}\``).join(", ") + "\n\n`Nada foi adicionado.`");
          } else {
            if (!okay || cb.length === 0) {
              message.reply("Ops, algo está errado. A maneira de editar o webhook mudou.\nSintaxe: `" + this.client.config.prefix + "editwebhook 1xqRFnNl -commentCard -voteOnCard +createCard +updateCard +deleteCard`");
            } else {
              await this.client.data.set.webhook(message.guild.id, args[0], bits);
              let msg = "Bits editados!\n\n**Bits atuais**: " + bits.map(bit => `\`${this.toOrigin(bit)}\``).join(", ");
              if (added.length !== 0) {
                msg += "\n\n**Bits Adicionados**: " + added.map(bit => `\`${this.toOrigin(bit)}\``).join(", ");
              }
              if (removed.length !== 0) {
                msg += "\n\n**Bits Removidos**: " + removed.map(bit => `\`${this.toOrigin(bit)}\``).join(", ");
              }
              message.reply(msg);
            }
          }
        } else {
          let bits = Object.keys(this.client.util.TrelloEvents).map(r => r.toLowerCase());
          let added = [];
          let removed = [];
          Object.keys(this.client.util.TrelloEvents).map(bit => {
            if (!webhook.bits.includes(bit.toLowerCase())) added.push(bit);
          });
          if (added.length === 0) {
            message.reply("Bits editados!\n\n**Bits atuais**: " + webhook.bits.map(bit => `\`${this.toOrigin(bit)}\``).join(", ") + "\n\n`Nothing was added.`");
          } else {
            await this.client.data.set.webhook(message.guild.id, args[0], bits);
            let msg = "Bits editados!\n\n**Bits atuais**: " + Object.keys(this.client.util.TrelloEvents).map(bit => `\`${bit}\``).join(", ");
            msg += "\n\n**Bits adicionados**: " + added.map(bit => `\`${this.toOrigin(bit)}\``).join(", ");
            message.reply(msg);
          }
        }
      }
    }
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Edita os bits do webhook. Os bits estão listados no comando \`webbits\`.\nExemplo: \`T!editwebhook 1xqRFnNl -commentCard -voteOnCard +createCard +updateCard +deleteCard\`",
      usage: ["<boardID> <webhookBits|all>"]
    };
  }
};
