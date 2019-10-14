const { Command } = require("faux-classes");

module.exports = class WebBits extends Command {
  get name() { return "webbits"; }
  get cooldown() { return 0; }
  get aliases() { return ["bits"]; }

  async exec(message, args) {
    await this.client.promptList(message, Object.keys(this.client.util.TrelloEvents).sort(), (event, embed) => {
      if (embed) {
        return `**\`${event}\`** - ${this.client.util.TrelloEvents[event]}`;
      } else {
        return `${event} - ${this.client.util.TrelloEvents[event]}`;
      }
    }, {
      header: "Use esses bits para configurar seus webhooks usando `" + this.client.config.prefix + "editwebhook`\n" +
        "Use `" + this.client.config.prefix + "webbits [page]` para ver a lista",
      pluralName: "Trello Webhook Bits",
      itemsPerPage: 10,
      startPage: args[0]
    });
  }

  get helpMeta() {
    return {
      category: "Webhooks",
      description: "Lista webhook bits.",
      usage: ["[page]"]
    };
  }
};
