
const helpList = [
    {
        command: "help",
        info: "See all commands."
    },
    {
        command: "prefix",
        info: "See current prefix"
    },
    {
        command: "prefix change [new prefix]",
        info: "change prefix * prefix must be 1 character as !,$,+."
    },
    {
        command: "homework",
        info: "Open homework list."
    },
    {
        command: "homework add [homework] [due date]",
        info: "Add homework to list. due date must be dd/mm/yyyy [01/01/2000]"
    }
    
]


module.exports.help = (msg, prefix) => {
  const command = helpList
    .map((cmd, index) => {
      return `\n\t + [${index + 1}] ${prefix}${cmd.command} \n\t\t ${cmd.info}`;
    })
    .join(" ");
  msg.react("🤝");
  msg.channel.send("```arm\n - Here this is all command\n\tcommand not include []\n" + command + "```");
};
