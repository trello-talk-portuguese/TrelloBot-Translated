const { Command } = require("faux-classes");

module.exports = class MuteWebhook extends Command {

  get name() { return "mutewebhook"; }
  get cooldown() { return 1; }
  get permissions() { return ["auth", "trello-perm"]; }
  get aliases() { return ["mwebhook", "mute", "m", "mwh"]; }
  get argRequirement() { return 1; }

  async exec(message, args, { user }) {
    try {
      const boardId = await this.client.util.getBoardId(user, args[0]);
      if (boardId === null) return message.channel.send("Você não tem acesso a esse quadro!");
      const { webhookId = undefined } = await this.client.data.get.webhookBoard(boardId) || {};
      if (webhookId === undefined) return message.channel.send("Você não tem um webhook conectado com este quadro!");

      await this.client.data.set.webhookMute(message.guild.id, args[0], true);
      message.reply(`Quadro silenciado: \`${boardId}\`.`);
    } catch (e) {
      if (e === 404) {
        message.reply("Webhook não encontrado.");
      } else throw e;
    }
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Silencia um webhook.",
      usage: ["<boardID>"]
    };
  }
};
