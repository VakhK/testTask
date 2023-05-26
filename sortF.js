const fs = require('fs');


const CHUNK_FOLDER_NAME = './chunks/';
const options = { highWaterMark: 1024 }      
const readStream = fs.createReadStream('randomWords.csv', options);
const alpha = Array.from(Array(3000)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());

const customSort = () => {

    prepare();

    let last = '';

    readStream.on('data', chunk => {
        const chunkString = last + chunk.toString();
        const chunkArray = chunkString.split(',');
        last = chunkArray.pop();
        chunkArray.forEach(function (word) {
            word = word.trim();
            var letter = word.substring(0, 1);
            fs.appendFileSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + ".csv", word + ",");
        })
    });

    readStream.on('end', () => {
        if (last) {
            var word = last;
            word = word.trim();         
            var letter = last.trim().substring(0, 1);
            fs.appendFileSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + ".csv", word + ",");
        }

        alphabet.forEach(function (letter) {
            if (fs.existsSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + '.csv')) {
                var content = fs.readFileSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + '.csv');
                content = content.toString().split(",").sort().join("\n").trim() + (letter != 'z' ? "\n" : "")
                fs.appendFileSync("./final-sorted.txt", content);
            }
        })

        console.log("done")
    });
};


function prepare() {
    alphabet.forEach(function (letter) {
        if (!fs.existsSync(CHUNK_FOLDER_NAME + letter)) {
            fs.mkdirSync(CHUNK_FOLDER_NAME + letter)
        }
        if (fs.existsSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + '.csv')) {
            fs.unlinkSync(CHUNK_FOLDER_NAME + letter + "/letter-" + letter + '.csv');
        }
    })
    if (fs.existsSync("./final-sorted.txt")) {
        fs.unlinkSync("./final-sorted.txt");
    }
}

customSort();