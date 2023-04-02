const fs = require('fs');
const path = require('path');
const fm = require('front-matter');

const moviesPath = "content/movies";
const moviesDir = fs.readdirSync(moviesPath);

const test = (res, errorMessage) => {
    if (res.length > 0) {
        throw new Error(`${errorMessage}. Files: ${res.map(f => f.filePath)}`);
    }
}

const allData = moviesDir
    .map(file => {
        const filePath = path.join(moviesPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        return { attributes: fm(content).attributes, filePath };
    });


test(allData.filter(f => isNaN(f.attributes.episode)), "Episode is missing");

const episodes = allData.map(f => f.attributes.episode);
const duplicateEpisodes = episodes.filter((f, i) => episodes.indexOf(f) !== i);
test(allData.filter(f => duplicateEpisodes.includes(f.attributes.episode)), "Has the same episode number");

const scoreMismatch = allData.filter(f => {
    const fixNaN = n => isNaN(n) ? 0 : n;
    const rating = f.attributes.rating;
    const total =
        fixNaN(rating.vildeVåben) +
        fixNaN(rating.fedSkurk) +
        fixNaN(rating.stærkeOneliners) +
        fixNaN(rating.episkAction) +
        fixNaN(rating.barHudOgStoreMuskler) + 
        fixNaN(rating.gammelSkala?.barHud) + 
        fixNaN(rating.gammelSkala?.storeMuskler) + 
        fixNaN(rating.bonus?.score);

    return rating.total !== total;
});
test(scoreMismatch, "Total score does not match");

console.log(scoreMismatch);

// const episodes = allData.map(f => f.attributes.episode).sort((a, b) => a-b);

// console.log(episodes);