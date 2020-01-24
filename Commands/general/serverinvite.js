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

module.exports = class ServerInvite extends Command {

  get name() { return "serverinvite"; }
  get cooldown() { return 0; }
  get aliases() { return ["support", "supportserver"]; }
  exec(message) {
    message.channel.send(`Entre no servidor de suporte por um desses links!\n${this.client.util.linkList(this.client.config.supportServers)}`);
  }

  get helpMeta() {
    return {
      category: "Geral",
      description: "Obtém um link para o servidor de suporte."
    };
  }
};
