const { promisify } = require('util');
const exec = promisify(require("child_process").exec);
const path = require('path');

module.exports = {
        genimg: async(playerName, level, achpts, guildName) => {
                const stdout = await exec(`node ${path.resolve(`${__dirname}/gen-image.js`)}`, {
                        env: {
                                playerName: playerName,
                                level: level,
                                achpts: achpts,
                                guildName: guildName,
                        },
                        maxBuffer: Infinity
                    });
                return module.exports.imageFromURI(stdout);
        },
        imageFromURI: data => {
                let [, ext, buffer] = data.stdout.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                buffer = Buffer.from(buffer, "base64");
                return { buffer, ext };
        }
}