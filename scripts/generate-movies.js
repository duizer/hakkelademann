const fs = require('fs');

const jsonFile = process.argv[2];
let rawdata = fs.readFileSync(jsonFile);
let movies = JSON.parse(rawdata);

movies
    .filter(e => !!e.Filmtitel)
    .forEach(element => {
        let filename = element.Filmtitel;
        filename = filename.trim();
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

        let v = {
            title: element.Filmtitel,
            date: "2023-03-21T21:19:17Z",
            draft: false,
            imdbId: element.imdbId,
            episode: element.AfsnitNr,
            rating: {
                vildeVåben: element.VildeVåben,
                stærkeOneliners: element.StærkeOneliners,
                fedSkurk: element.FedSkurk,
                episkAction: element.EpiskAction,
                barHudOgStoreMuskler: element.BarHudOgStoreMuskler,
                total: element.Total
            }
        };

        if (element.BarHud || element.StoreMuskler) {
            v.rating.gammelSkala = {
                barHud: element.BarHud,
                storeMuskler: element.StoreMuskler
            };
        }

        if (element.Bonus) {
            v.rating.bonus =
            {
                score: element.Bonus.Score,
                kategori: element.Bonus.Kategori
            };
        }

        let content = `---\n${JSON.stringify(v, null, "  ")}\n---\n\n`;

        fs.writeFileSync(`content/movies/${filename}.md`, content);
    });