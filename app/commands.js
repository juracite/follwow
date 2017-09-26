const blizzard = require('./blizzardAuth');
const Jimp = require("jimp");
const Discord = require('discord.js');
const path = require('path');

var dm_text = "Hey there! Use !fcommands on a public chat room to see the command list.";
var mention_text = "Use !fcommands to see the command list.";

var lang = "en";

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
exports.run = function(BLIZZARD_API_KEY) {
    const blizzardApp = blizzard.run(BLIZZARD_API_KEY);
    const capitalizeFirstChar = str => str.charAt(0).toUpperCase() + str.substring(1);

    var commands = [

        {
            command: "lang",
            description: "Change the language between English (en) or French (fr)",
            parameters: [],
            execute: function(message, params) {
                if (params[1] == undefined) {
                    if (lang === "en") {
                        var response = "EN/FR only";
                    } else if (lang === "fr") {
                        var response = "Seulement EN/FR";
                    }
                } else if (params[1].toLowerCase() == "en") {
                    dm_text = "Hey there! Use !fcommands on a public chat room to see the command list.";
                    mention_text = "Use !fcommands to see the command list.";
                    lang = "en";
                    var response = "The bot is now in english.";
                } else if (params[1].toLowerCase() == "fr") {
                    dm_text = "Salut ! Utilise !fcommands dans un chat publique pour voir la liste des commandes disponibles.";
                    mention_text = "Utilise !fcommands pour voir la liste des commandes.";
                    lang = "fr";
                    var response = "Le bot est maintenant en français.";
                } else {
                    if (lang === "en") {
                        var response = "Sorry?";
                    } else if (lang === "fr") {
                        var response = "Pardon ?";
                    }
                }

                message.reply(response);
            }
        },

        {
            command: "commands",
            description: "List of all commands",
            parameters: [],
            execute: function(message, params) {
                var response = "Available commands:";

                for (var i = 0; i < commands.length; i++) {
                    var c = commands[i];
                    response += "\n!f " + c.command;

                    for (var j = 0; j < c.parameters.length; j++) {
                        response += " <" + c.parameters[j] + ">";
                    }

                    response += ": " + c.description;
                }

                message.reply(response);
            }
        },

        {
            command: "hf_pts",
            description: "Show achievement points from a player [realm][player_name][eu/us(optional)]",
            parameters: [],
            execute: function(message, params) {
                var response = "Mmmh mmh, buuuggggg ... ... dunno why  .  y  .  y";
                var realm = params[1];
                var playerName = params[2];
                var origin = params[3];
                var AchievementPoints = 0;

                if (params[1] == undefined || params[2] == undefined) {
                    if (lang === "en") {
                        var response = "Paramètre(s) manquant(s) (Royaume ou le nom du personnage)";
                    } else if (lang === "fr") {
                        var response = "Missing parameter(s) (Realm or playername)";
                    }
                }

                if (origin != 'eu' || origin != 'us' || params[3] == undefined) {
                    origin = 'eu';
                }

                blizzardApp.wow.character(['profile'], { realm: realm, name: playerName, origin: origin })
                    .then(response => {
                        AchievementPoints = response.data.achievementPoints;
                        if (lang === "en") {
                            response = playerName + " has " + AchievementPoints + " achievement points";
                            return message.reply(response)
                        } else if (lang === "fr") {
                            response = playerName + " a " + AchievementPoints + " points de haut-faits";
                            return message.reply(response)
                        }
                    }).catch(e => { return message.reply("Impossible de trouver le personnage.") });
            }
        },

        {
            command: "info",
            description: "Show achievement points from a player [realm][player_name][eu/us(optional)]",
            parameters: [],
            execute: function(message, params) {
                var response = "Mmmh mmh, buuuggggg ... ... dunno why  .  y  .  y";
                var realm = params[1];
                var playerName = params[2];
                var origin = params[3];
                var AchievementPoints = '';
                var guild = '';
                var level = '';


                if (params[1] == undefined || params[2] == undefined) {
                    if (lang === "en") {
                        var response = "Paramètre(s) manquant(s) (Royaume ou le nom du personnage)";
                    } else if (lang === "fr") {
                        var response = "Missing parameter(s) (Realm or playername)";
                    }
                } else if (params[3] != undefined) {
                    if (params[4] != 'eu' && params[4] != 'us') {
                        origin = 'eu';
                    } else if (params[4] == undefined) {
                        realm = params[1] + " " + params[2];
                        playerName = params[3];
                    } else {
                        origin = params[4];
                    }
                }

                if (origin != 'eu' && origin != 'us' || params[3] == undefined) {
                    origin = 'eu';
                }

                console.log(realm);

                blizzardApp.wow.character(['profile', 'guild'], { realm: realm, name: playerName, origin: origin })
                    .then(async response => {

                        AchievementPoints = response.data.achievementPoints.toString();
                        if (response.data.guild == undefined) {
                            guild = "N/A";
                        } else {
                            guild = response.data.guild.name.toString();
                        }
                        level = response.data.level.toString();
                        playerName = playerName.toString();
                        playerName = capitalizeFirstChar(playerName);
                        if (guild.length > 17) {
                            guild = guild.substring(0, 17) + "...";
                        }

                        if (lang === "en") {
                            message.reply("Loading image...");
                        } else if (lang === "fr") {
                            message.reply("Génération de l'image...");
                        }

                        const gen = require('./main');
                        const image = await gen.genimg(playerName, level, AchievementPoints, guild);

                        if (lang === "en") {
                            let fileName = playerName + "." + image.ext;
                            /*
                            const embed = new Discord.RichEmbed()
                                .setTitle("Informations de votre personnage");
                            console.log('IMAGE_début');
                            embed.attachFile(image.buffer, fileName);
                            console.log('IMAGE_fin');
                            */

                            let attach = new Discord.Attachment(image.buffer, fileName);
                            return message.channel.send(attach);
                            //return message.channel.send({ embed });
                        } else if (lang === "fr") {
                            response = playerName + " a " + AchievementPoints + " points de haut-faits";
                            return message.reply(response)
                        }

                    }).catch(err => {
                        if (lang === "en") {
                            return message.reply("Unable to find the player informations." + " Reason : " + err.response.data.reason);
                        } else if (lang === "fr") {
                            return message.reply("Impossible de trouver le personnage." + " Raison : " + err.response.data.reason);
                        }

                    });
            }
        },
    ]
    return commands;
}