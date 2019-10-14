const { Command } = require("faux-classes");

module.exports = class CreateCard extends Command {

  get name() { return "createcard"; }
  get cooldown() { return 2; }
  get permissions() { return ["auth", "board", "trello-perm"]; }
  get aliases() { return ["createcard", "+card", "ccard", "acard"]; }
  get argRequirement() { return 3; }

  async exec(message, args, { user }) {
    let body = await this.client.trello.get.lists(user.trelloToken, user.current);
    if (!args.join(" ").match(/\s\|\s/, "|")) {
      message.channel.send(`Formato Inválido!`);
      return;
    }
    let c = args.join(" ").replace(/\s\|\s/, "|").split("|");
    let cargs = c.reverse()[0].split(" ");
    let listName = c.slice(c.length - 1).join(" ");
    let query = await this.client.util.query(
      message, body,
      listName,
      "name", item => `${item.name} (${item.cards.length} Cartões)`,
      "Digite o número da lista em que você deseja criar o cartão"
    );
    if (query.quit) return;
    let result = query.result;
    if (result !== null) {
      let createdCard = await this.client.trello.add.card(user.trelloToken, result.id, cargs.join(" "));
      message.reply(`Cartão "${cargs.join(" ")}" \`(${createdCard.shortLink})\` criado na lista "${result.name}".`);
    } else message.reply(`Nenhuma lista com o nome "${listName}" foi encontrado!`);
  }

  get helpMeta() {
    return {
      category: "Editing",
      description: "Cria um cartão.",
      usage: ["<listName> | <cardName>"]
    };
  }
};
