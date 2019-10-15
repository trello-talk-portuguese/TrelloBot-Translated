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

module.exports = class WebBits extends Command {
  get name() { return "webbits"; }
  get cooldown() { return 0; }
  get aliases() { return ["bits"]; }

  async exec(message, args) {
    await this.client.promptList(message, Object.keys(this.client.util.TrelloEvents).sort(), (event, embed) => {
      if (embed) {
        return `**\`${event}\`** - ${this.client.util.TrelloEvents[event]}`;
      } else {
        return `${event} - ${this.client.util.TrelloEvents[event]}`;
      }
    }, {
      header: "Use esses bits para configurar seus webhooks usando `" + this.client.config.prefix + "editwebhook`\n" +
        "Use `" + this.client.config.prefix + "webbits [página]` para ver a lista",
      pluralName: "Trello Webhook Bits",
      itemsPerPage: 10,
      startPage: args[0]
    });
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Lista os bits dos webhooks.",
      usage: ["[página]"]
    };
  }
};
