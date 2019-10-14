const { Command } = require("faux-classes");

module.exports = class RemoveWebhook extends Command {

  get name() { return "remwebhook"; }
  get cooldown() { return 1; }
  get permissions() { return ["auth", "trello-perm"]; }
  get aliases() { return ["-webhook", "delwebhook", "removewebhook", "deletewebhook"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    try {
      const boardId = await this.client.util.getBoardId(user, args[0]);
      const { webhookId = undefined } = await this.client.data.get.webhookBoard(boardId) || {};
      if (webhookId === undefined) return message.reply("Webhook não encontrado.");

      const internalWebhooks = await this.client.trello.get.webhooks(user.trelloToken);
      const webhook = internalWebhooks.find(webhook => webhook.id === webhookId);
      if (webhook === undefined) await message.channel.send("Webhook interno não encontrado, pulando...");
      else await this.client.trello.delete.webhook(user.trelloToken, webhook.id);

      await this.client.data.delete.webhook(message.guild.id, boardId);

      message.reply(`Webhook deletado do quadro \`${boardId}\`.`);
    } catch (e) {
      if (e === 404) {
        message.reply("Webhook não encontrado.");
      } else throw e;
    }
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Deleta o webhook de um quadro.",
      usage: ["<boardID>"]
    };
  }
};
