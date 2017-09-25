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
            description: "Show achievement points from a player [realm][player_name][eu/us]",
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
            description: "Show achievement points from a player [realm][player_name][eu/us]",
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
                }

                if (origin != 'eu' || origin != 'us' || params[3] == undefined) {
                    origin = 'eu';
                }

                blizzardApp.wow.character(['profile', 'guild'], { realm: realm, name: playerName, origin: origin })
                    .then(response => {
                        process.env.achpts = response.data.achievementPoints.toString();
                        process.env.guildName = response.data.guild.name.toString();
                        process.env.level = response.data.level.toString();
                        process.env.playerName = playerName.toString();
                        console.log("Avant !");

                        const gen = require('./main');
                        console.log(gen.genimg());

                        console.log("Après !");
                        if (lang === "en") {
                            const embed = new Discord.RichEmbed()
                                .setTitle("Informations de votre personnage")
                                .attachFile("./public/new-img.png");

                            console.log(__dirname + "/../public/new-img.png");
                            return message.reply({ embed });
                        } else if (lang === "fr") {
                            response = playerName + " a " + AchievementPoints + " points de haut-faits";
                            return message.reply(response)
                        }
                        console.log("OKKKKKK");
                    });
            }
        },
    ]
    return commands;
}