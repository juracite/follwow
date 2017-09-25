const { promisify } = require('util');
const exec = promisify(require("child_process").exec);
const path = require('path');

module.exports = {
        genimg: async gen => {
                const stdout = await exec(`node ${path.resolve(`${__dirname}/gen-image.js`)}`);
                
                return module.exports.imageFromURI(stdout);
        },
        imageFromURI: data => {
            let [, ext, buffer] = data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
            buffer = Buffer.from(buffer, "base64");
    
            return { buffer, ext };
        }
}