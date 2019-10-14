const { Command } = require("faux-classes");

module.exports = class OpenCard extends Command {

  get name() { return "opencard"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["unarchivecard"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.cardsArchived(user.trelloToken, user.current);
    let bid = undefined;
    Object.keys(body).map((board) => {
      board = body[board];
      if (board.shortLink == args[0]) {
        bid = board;
        bid.id = args[0];
      }
    });
    if (bid !== undefined) {
      await this.client.trello.set.card.closed(user.trelloToken, bid.id, false);
      message.reply(`Cartão "${bid.name}" \`(${bid.shortLink})\` removido dos arquivos.`);
    } else {
      message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado!");
    }
  }

  get helpMeta() {
    return {
      category: "Editing",
      description: "Remove um cartão sele.",
      usage: ["<cardID>"]
    };
  }
};
