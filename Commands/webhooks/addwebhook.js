const { Command } = require("faux-classes");

module.exports = class AddWebhook extends Command {

  get name() { return "addwebhook"; }
  get cooldown() { return 1; }
  get permissions() { return ["auth", "trello-perm"]; }
  get aliases() { return ["+webhook", "createwebhook", "makewebhook"]; }
  get argRequirement() { return 2; }

  async exec(message, args, { user }) {
    const boardId = await this.client.util.getBoardId(user, args[0]);
    if (boardId === null) return message.channel.send("Você não tem acesso a esse quadro!");

    const webhookBoard = await this.client.data.get.webhookBoard(boardId);
    const trelloBoard = await this.client.trello.get.board(user.trelloToken, boardId);
    if (webhookBoard !== null) return message.reply(`Já existe um webhook para o quadro ${trelloBoard.name} \`(${boardId})\`.`);

    const webhookRegex = /^(https:\/\/((canary|ptb)?\.)?discordapp\.com\/api\/webhooks\/(\d+)\/([A-Za-z0-9_\-]+))\/?(.*)$/;
    const [, webhookUrl,,, webhookId, webhookToken, extra ] = args[1].match(webhookRegex) || [];

    if (webhookUrl === undefined) return message.reply("Isso não é um link de um webhook válido!");
    if (extra !== "") await message.channel.send(`Inorando \`/${extra}\` `);

    let webhook;
    try {
      webhook = await this.client.fetchWebhook(webhookId, webhookToken);
    } catch (e) {
      return message.reply("Link do webhook inválido!");
    }

    try {
      const createdWebhook = await this.client.trello.add.webhook(user.trelloToken, trelloBoard.id);
      await this.client.data.add.webhook(message.guild.id, boardId, webhookUrl, trelloBoard.id, createdWebhook.id);
      await message.reply(`Webhook ${webhook.name} adicionado no quadro ${trelloBoard.name} \`(${boardId})\``);
    } catch (e) {
      if (e.error.status === 400) {
        console.log(e.response);
        await message.reply(`Ocorreu um erro ao adicionar o webhook ${webhook.name} no quadro ${trelloBoard.name} \`(${boardId})\``);
      } else {
        throw e;
      }
    }
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Define um webhook para um quadro. Só pode usar quadros em que participa.\nVeja aqui: https://i.imgur.com/KrHHKDi.png",
      image: "https://i.imgur.com/KrHHKDi.png",
      usage: ["<boardID> <webhookURL>"]
    };
  }
};
