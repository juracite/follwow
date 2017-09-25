////////////////////////////////////////////////////////////////////////////////
//    This program is free software: you can redistribute it and/or modify    //
//    it under the terms of the GNU General Public License as published by    //
//    the Free Software Foundation, either version 3 of the License, or       //
//    (at your option) any later version.                                     //
//                                                                            //
//    This program is distributed in the hope that it will be useful,         //
//    but WITHOUT ANY WARRANTY; without even the implied warranty of          //
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           //
//    GNU General Public License for more details.                            //
//                                                                            //
//    You should have received a copy of the GNU General Public License       //
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.   //
////////////////////////////////////////////////////////////////////////////////

const Discord = require('discord.js');
const bot = new Discord.Client({ autoReconnect: true, max_message_cache: 0 });
const lodash = require('lodash');

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

exports.run = function(botToken, server_name, text_channel_name, BLIZZARD_API_KEY, BLIZZARD_API_SECRET) {
    bot.login(botToken);

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    var commands = require('./commands').run(BLIZZARD_API_KEY);

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function search_command(command_name) {
        for (var i = 0; i < commands.length; i++) {
            if (commands[i].command == command_name.toLowerCase()) {
                return commands[i];
            }
        }

        return false;
    }

    function handle_command(message, text) {
        var params = text.split(" ");
        var command = search_command(params[0]);

        if (command) {
            if (params.length - 1 < command.parameters.length) {
                message.reply("Insufficient parameters!");
            } else {
                command.execute(message, params);
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////

    bot.on("ready", () => {
        var server = bot.guilds.find("name", server_name);
        if (server === null) throw "Couldn't find server '" + server_name + "'";

        text_channel = server.channels.find(chn => chn.name === text_channel_name && chn.type === "text"); //The text channel the bot will use to announce stuff
        if (text_channel === null) throw "Couldn't find text channel '#" + text_channel_name + "' in server '" + server_name + "'";

        bot.user.setGame();
        console.log("Connected!");
    });

    bot.on("disconnect", event => {
        console.log("Disconnected: " + event.reason + " (" + event.code + ")");
    });

    bot.on("message", async message => {
        if (message.channel.type === "dm" && message.author.id !== bot.user.id) { //Message received by DM
            //Check that the DM was not send by the bot to prevent infinite looping
            message.channel.sendMessage(dm_text);
        } else if (message.channel.type === "text" && message.channel.name === text_channel.name) { //Message received on desired text channel
            if (message.isMentioned(bot.user)) {
                message.reply(mention_text);
            } else {
                if (message.content == '!purge') {
                    const messages = await message.channel.fetchMessages({ limit: 50 });
                    const botMsg = messages.filter(message => message.author.bot);
                    const commandMsg = messages.filter(message => message.content.substring(0, 2) == '!f');
                    console.log(commandMsg);

                    await Promise.all(
                        botMsg.map(msg => msg.delete())
                    ).then(commandMsg.map(msg => msg.delete())).then(message.channel.send('All posts deleted (last 50)'));
                }


                var message_text = message.content;
                if (message_text[0] == '!' && message_text[1] == 'f' && message_text[2] == ' ') { //Command issued
                    handle_command(message, message_text.substring(3));

                    setTimeout(function() {
                        message.delete()
                    }, 300000);

                    //console.log(message_text.substring(3));
                }
            }
        }
    });
}