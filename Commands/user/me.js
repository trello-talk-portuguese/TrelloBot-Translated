const { Command } = require("faux-classes");

module.exports = class Me extends Command {

  get name() { return "me"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "embed"]; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.boards(user.trelloToken, user.trelloID);
    let embed = {
      color: this.client.config.embedColor,
      description: `**ID:** \`${body.id}\`\n` +
        `**Iniciais:** ${body.initials}\n` +
        `**Tipo de Membro:** ${this.client.util.capFirst(body.memberType)}\n` +
        (body.url ? `**URL:** ${body.url}\n` : "") +
        `**Quadros:** ${body.boards.length} \`${this.client.config.prefix}boards\`\n` +
        `**Organizações:** ${body.idOrganizations.length}\n` +
        `\n${body.bio || ""}\n`,
      author: {
        name: `${body.fullName} (${body.username})`,
        icon_url: this.client.config.icon_url
      },
      thumbnail: {
        url: body.avatarURL
      },
      fields: [{
        name: "Preferências",
        value: `**Modo daltônico:** ${body.prefs.colorBlind ? "On" : "Off"}\n` +
          `**Local:** ${body.prefs.locale}\n` +
          `**Enviar Resumos:** ${body.prefs.sendSummaries ? "Sim" : "Não"}`
      }]
    };
    let productsField = {
      name: "Produtos",
      value: ""
    };
    if (body.products.length) {
      body.products.forEach(product => {
        switch (product) {
          case 10: // Trello Gold from Buisness Class
            productsField.value += ":suitcase: Trello Gold para um time do Buisness Class\n";
            break;
          case 37: // Monthly Trello Gold
            productsField.value += ":star: Trello Gold Mensal\n";
            break;
          case 38: // Annually Trello Gold
            productsField.value += ":star2: Trello Gold Anual\n";
            break;
        }
      });
    } else {
      productsField.value = "*Nada*";
    }
    embed.fields.push(productsField);
    message.channel.send("", { embed });
  }

  get helpMeta() {
    return {
      category: "User Management",
      description: "Verifica as informações da sua conta do trello."
    };
  }
};
