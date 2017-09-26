const Jimp = require("jimp");

async function genimage(playerName, level, achpts, guildName) {
    var fileName = './app/img/follwow-infoPersonnage.png';
    var loadedImage;

    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const image = await Jimp.read(fileName).then(function(image) {
            loadedImage = image;
        }).then(() => {
            loadedImage.print(font, 1010, 710, achpts);;
            loadedImage.print(font, 100, 35, playerName);
            loadedImage.print(font, 1050, 195, level);
            loadedImage.print(font, 350, 850, guildName).write('./public/new-img.png');
            return loadedImage;
        })
        .then(img => {
            img.getBase64(Jimp.MIME_PNG, (err, data) => {
                if (err) throw err;
                process.stdout.write(data);
            });
        })
        .catch(function(err) {
            console.error("Erreur lors de l'écriture du fichier image : " + err);
        });
}

genimage(process.env.playerName, process.env.level, process.env.achpts, process.env.guildName);