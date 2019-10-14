const { Command } = require("faux-classes");

module.exports = class CloseList extends Command {
  get name() { return "closelist"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["archivelist"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    let listName = args.join(" ");
    let body = await this.client.trello.get.lists(user.trelloToken, user.current);
    let query = await this.client.util.query(
      message, body,
      listName,
      "name", item => `${item.name} (${item.cards.length} Cartões)`,
      "Digite o número da lista que você deseja fechar."
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== null) {
      await this.client.trello.set.list.closed(user.trelloToken, result.id, true);
      message.reply(`Lista "${result.name}" arquivada.`);
    } else {
      message.reply(`Nenhumma lista com o nome "${listName}" foi encontrada!`);
    }
  }

  get helpMeta() {
    return {
      category: "Editing",
      description: "Arquive uma lista.",
      usage: ["<listName>"]
    };
  }
};
