const { Command } = require("faux-classes");

module.exports = class MoveCard extends Command {

  get name() { return "movecard"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get argRequirement() { return 2; }
  async exec(message, args, { user }) {
    let body = await this.client.trello.get.cards(user.trelloToken, user.current);
    let card = undefined;
    let listName = args.slice(1).join(" ");
    Object.keys(body).map((board) => {
      board = body[board];
      if (board.shortLink == args[0]) {
        card = board;
        card.id = args[0];
      }
    });
    if (card !== undefined) {
      let lists = await this.client.trello.get.lists(user.trelloToken, user.current);
      let query = await this.client.util.query(
        message, lists,
        listName,
        "name", item => `${item.name} (${item.cards.length} Cartões)`,
        "Digite o número da lista para o qual deseja mover o cartão."
      );
      if (query.quit) return;
      let result = query.result;
      if (result !== null) {
        await this.client.trello.set.card.list(user.trelloToken, card.id, result.id);
        message.reply(`Cartão "${card.name}" \`(${args[0]})\` movido para a lista "${result.name}".`);
      } else {
        message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado.");
      }
    } else {
      message.reply("Oops! O ID do cartão não existe ou não está no quadro selecionado.");
    }
  }

  get helpMeta() {
    return {
      category: "Editing",
      description: "Move um cartão para uma lista específica.",
      usage: ["<cardID> <listName>"]
    };
  }
};
