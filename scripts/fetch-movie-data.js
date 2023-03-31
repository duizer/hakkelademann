const fs = require('fs');
const path = require('path');
require('dotenv').config();

const apikey = process.env.MOVIEDB_APIKEY;

if (!apikey)
    throw new Error("No API key found. Please set environment variable MOVIEDB_APIKEY");

const fetchId = async imdbId => {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${apikey}&external_source=imdb_id`;
    const response = await fetch(url);
    const asJson = await response.json();
    return asJson.movie_results[0].id;
}

const fetchMovie = async id => {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}`;
    const response = await fetch(url);
    return await response.json();
}

const moviesPath = "content/movies";
const moviesDir = fs.readdirSync(moviesPath);

const imdbIds = moviesDir
    .map(file => {
        const content = fs.readFileSync(path.join(moviesPath, file), 'utf8');
        const re = new RegExp("tt[0-9]{7}");
        const r = content.match(re);
        return !r ? undefined : r[0];
    })
    .filter(id => !!id);

const imdbIdsToSync = imdbIds
    .filter(id => !fs.existsSync(`data/${id}.json`));

console.log(`Found ${imdbIdsToSync.length} movies to fetch\n`);

const loop = async _ => {
    for (let index = 0; index < imdbIdsToSync.length; index++) {
        let imdbId = imdbIdsToSync[index];
        let id = await fetchId(imdbId);
        let movie = await fetchMovie(id);
        fs.writeFileSync(`data/${imdbId}.json`, JSON.stringify(movie, null, "  "));
        console.log(`✅ Fetched IMDB ID ${imdbId}`);
    }
}
loop();
