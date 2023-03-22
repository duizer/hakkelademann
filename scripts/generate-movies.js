const fs = require('fs');

const jsonFile = process.argv[2];
let rawdata = fs.readFileSync(jsonFile);
let movies = JSON.parse(rawdata);

movies
    .filter(e => !!e.Filmtitel)
    .forEach(element => {
        let filename = element.Filmtitel;
        filename = filename.replaceAll("III", "3");
        filename = filename.replaceAll("II", "2");
        filename = filename.replaceAll(":", "");
        filename = filename.replaceAll(".", "");
        filename = filename.replaceAll("/", "");
        filename = filename.replaceAll("(", "");
        filename = filename.replaceAll(")", "");
        filename = filename.replaceAll("å", "aa");
        filename = filename.replaceAll(" ", "-");
        filename = filename.replaceAll("  ", "");
        filename = filename.replaceAll("--", "-");
        filename = filename.toLowerCase();
        console.log(filename);
        
        let content = `---\ntitle: "${element.Filmtitel}"\ndate: 2023-03-21T21:19:17Z\ndraft: false\nepisode: ${element.AfsnitNr}\nrating.total: ${element.Total}\n---\n\n`;
        
        fs.writeFileSync(`content/movies/${filename}.md`, content);
    });