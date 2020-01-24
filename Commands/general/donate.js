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

module.exports = class Donate extends Command {

  get name() { return "donate"; }
  get cooldown() { return 0; }
  get aliases() { return ["patreon", "paypal"]; }

  exec(message) {
    if(!(Array.isArray(this.client.config.donate) && this.client.config.donate[0]))
      return message.channel.send("O dono do bot não preencheu com um link para doação :(");
    message.channel.send(`Suporte o desenvolvedor doando com um desses links :)\n${this.client.util.linkList(this.client.config.donate)}`);
  }

  get helpMeta() {
    return {
      category: "Geral",
      description: "Obtém um link de doação para o desenvolvedor. (Use esse comando se quiser deixar um desenvolvedor feliz)"
    };
  }
};
