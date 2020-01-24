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

const { CodeBlock, Command } = require("faux-classes");
const { Util } = require("faux-core");
const { inspect } = util = require("util");

module.exports = class AsyncEval extends Command {

  get name() { return "aeval"; }
  get aliases() { return ["aevaluate", "asynceval", "asyncevaluate"]; }
  get permissions() { return ["elevated"]; }
  get listed() { return false; }

  async exec(Message, args, { user }) {
    let message = Message;
    try {
      let start = new Date().getTime();
      let response = await eval(`(async () => \{${args.join(" ")}\})()`);
      let msg = CodeBlock.apply(response, "js");
      let time = new Date().getTime() - start;
      Message.channel.send(`Tempo Levado: ${(time / 1000)} segundos\n${msg}`);
    } catch (e) {
      Message.channel.send(CodeBlock.apply(e.stack, "js"));
    }
  }

  get helpMeta() {
    return {
      category: "Admin",
      description: "eval oh yeah\n\nNOTA: Devido ao async IIFE adicionado neste comando, é necessário usar o termo return para obter algum resultado.\nEx. `C!aeval return 1`"
    };
  }
};
