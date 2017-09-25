const Jimp = require("jimp");

async function genimage(playerName, level, achpts, guildName) {
    var fileName = './app/img/follwow-infoPersonnage.png';
    var loadedImage;

    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    const image = await Jimp.read(fileName).then(function(image) {
        loadedImage = image;
        return Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    }).then(function(font) {
        loadedImage.print(font, 1010, 710, achpts);;
        loadedImage.print(font, 795, 35, playerName);
        loadedImage.print(font, 1050, 195, level);
        loadedImage.print(font, 350, 850, guildName).write('./public/new-img.png');
    }).catch(function(err) {
        console.error("Erreur lors de l'écriture du fichier image : " + err);
    });

    image.getBase64(Jimp.MIME_PNG, (err, data) => {
        if (err) throw err;
        process.stdout.write(data);
    });
}

genimage(process.env.playerName, process.env.level, process.env.achpts, process.env.guildName);