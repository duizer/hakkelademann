const fs = require('fs');
const { exec } = require("child_process");

const jsonFile = process.argv[2];
let rawdata = fs.readFileSync(jsonFile);
let movies = JSON.parse(rawdata);

movies
    .filter(e => !!e.Filmtitel)
    .forEach(element => {
        let title = element.Filmtitel;
        title = title.replaceAll("III", "3");
        title = title.replaceAll("II", "2");
        title = title.replaceAll(":", "");
        title = title.replaceAll(".", "");
        title = title.replaceAll("/", "");
        title = title.replaceAll("(", "");
        title = title.replaceAll(")", "");
        title = title.replaceAll("å", "aa");
        title = title.replaceAll(" ", "-");
        title = title.replaceAll("  ", "");
        title = title.replaceAll("--", "-");
        title = title.toLowerCase();
        //console.log(title);

        let cmd = "hugo new content/movies/" + title + ".md";
        // console.log(cmd);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
        });
        // console.log(title.replace(" ", "-"));
    });