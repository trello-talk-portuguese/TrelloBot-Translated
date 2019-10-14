const { Command } = require("faux-classes");

module.exports = class CardAttach extends Command {

  get name() { return "cardattach"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["attachfile", "addattachment", "+attachment", "+file", "addfile"]; }
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
      let url = null;
      if (message.attachments.array().length > 0) {
        url = message.attachments.array()[0].url;
      }
      if (!args[1] && !url) {
        message.reply("Você precisa completar o comando com um anexo ou Link.");
      } else if (!url) {
        if (args[1].match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)) {
          url = args[1];
        } else {
          message.reply("URL Inválido! Ele precisa iniciar com HTTP ou HTTPS.");
        }
      }
      if (url) {
        await this.client.trello.add.attachment(user.trelloToken, args[0], url).then(() => {
          message.reply(`Adicionado um anexo no cartão "${bid.name}". \`(${args[0]})\``);
        });
      }
    } else {
      message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado!");
    }
  }

  get helpMeta() {
    return {
      category: "Editing",
      description: "Adiciona um anexo a um quadro específico.",
      usage: ["<cardID> [url]"]
    };
  }
};
