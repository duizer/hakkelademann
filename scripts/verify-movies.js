const fs = require('fs');
const path = require('path');
const fm = require('front-matter');

const moviesPath = "content/movies";
const moviesDir = fs.readdirSync(moviesPath);

const test = (res, testName) => {
    if (res.length > 0) {
        throw new Error(`${testName}. Files: ${res.map(f => f.filePath)}`);
    } else {
        console.log(`✅ ${testName}`);
    }
}

const allMovies = moviesDir
    .map(file => {
        const filePath = path.join(moviesPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        return { attributes: fm(content).attributes, filePath };
    });

test(allMovies.filter(f => isNaN(f.attributes.episode)), "Episode property check");

const episodes = allMovies.map(f => f.attributes.episode);
const duplicateEpisodes = episodes.filter((f, i) => episodes.indexOf(f) !== i);
test(allMovies.filter(f => duplicateEpisodes.includes(f.attributes.episode)), "Unique episode number");

const scoreMismatch = allMovies.filter(f => {
    const fixNaN = n => isNaN(n) ? 0 : n;
    const rating = f.attributes.rating;
    const bonusScore = rating.bonus?.flatMap(x => x.score).reduce((partialSum, a) => partialSum + a, 0);
    const total =
        fixNaN(rating.vildeVåben) +
        fixNaN(rating.fedSkurk) +
        fixNaN(rating.stærkeOneliners) +
        fixNaN(rating.episkAction) +
        fixNaN(rating.barHudOgStoreMuskler) +
        fixNaN(rating.gammelSkala?.barHud) +
        fixNaN(rating.gammelSkala?.storeMuskler) +
        fixNaN(bonusScore);

    return rating.total !== total;
});
test(scoreMismatch, "Rating check");

const re = new RegExp("tt[0-9]{7}");
test(allMovies.filter(f => !f.attributes.imdbId?.match(re)), "Imdb id property check");