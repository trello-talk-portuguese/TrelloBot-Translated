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

module.exports = class BoardInfo extends Command {

  get name() { return "boardinfo"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board"]; }
  get aliases() { return ["board"]; }

  async exec(message, args, { user }) {
    let board = await this.client.trello.get.board(user.trelloToken, user.current);
    if (this.client.embed(message)) {
      let embed = {
        color: this.client.config.embedColor,
        url: board.shortUrl,
        description: board.desc,
        author: {
          name: board.name,
          icon_url: this.client.config.icon_url
        },
        fields: [{
          name: "Contagem",
          value: `**Membros:** ${board.members.length}\n` +
            `**Cartões:** ${board.cards.length}\n` +
            `**Listas:** ${board.lists.length}`,
          inline: true
        }, {
          name: "Configurações do Usuário",
          value: `**Seguindo:** ${board.subscribed ? "Sim" : "Não"}\n` +
            `**Starred:** ${board.starred ? "Sim" : "Não"}\n` +
            `**Fixado:** ${board.pinned ? "Sim" : "Não"}`,
          inline: true
        }, {
          name: "Preferências",
          value: `**Visibilidade**: ${this.client.util.capFirst(board.prefs.permissionLevel)}\n` +
            `**Votos*: ${this.client.util.capFirst(board.prefs.voting)}\n` +
            `**Comentários**: ${this.client.util.capFirst(board.prefs.comments)}\n` +
            `**Convites**: ${this.client.util.capFirst(board.prefs.invitations)}\n`,
          inline: true
        }]
      };
      message.channel.send("", { embed });
    } else {
      let msg = "```md\n";
      msg += `** ${board.name} **\n`;
      if (board.desc !== "") {
        msg += `### ${board.desc}\n`;
      }
      msg += `# Membros: ${board.members.length} \n`;
      msg += `# Cartões: ${board.cards.length} \n`;
      message.channel.send(msg + "\n```");
    }
  }

  get helpMeta() {
    return {
      category: "Visualização",
      description: "Veja todas as informações de um quadro."
    };
  }
};
