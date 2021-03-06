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

const { Command } = require('faux-classes');

module.exports = class ClearAuth extends Command {
  get name() { return 'clearauth'; }
  get cooldown() { return 0; }

  async exec(message, args, { user }) {
    const userId = message.author.id;
    const currentAuth = await this.client.data.get.user(userId);
    if (currentAuth === null) return message.reply('Sua conta não está autenticada com o trello!');
    await message.channel.send('Você tem certeza de que deseja desautenticar? Você precisará reautenticar para voltar a utilizar os comandos do Trello. (Digite `sim` para confirmar)');

    const filter = m => m.author.id === userId;
    const messages = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
    });

    if (!messages.size || messages.first().content.toLowerCase() !== 'sim') {
      return message.channel.send('Cancelado!');
    }

    await this.client.data.delete.user(userId);
    await message.channel.send('Autenticação removida!');
  }

  get helpMeta() {
    return {
      category: 'Geral',
      description: 'Limpa sua autenticação com o trello. Se você \'não souber o que está fazendo, não\' execute esse comando.'
    };
  }
};
