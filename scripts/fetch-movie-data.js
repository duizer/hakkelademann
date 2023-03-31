const fs = require('fs');
const path = require('path');
require('dotenv').config();

const apikey = process.env.MOVIEDB_APIKEY;

if (!apikey)
    throw new Error("No API key found. Please set environment variable MOVIEDB_APIKEY");

const moviesPath = "content/movies";
let moviesDir = fs.readdirSync(moviesPath);

const loop = async _ => {
    for (let index = 0; index < moviesDir.length; index++) {
        let file = moviesDir[index];
        let content = fs.readFileSync(path.join(moviesPath, file), 'utf8');
        let re = new RegExp("tt[0-9]{7}");
        let r = content.match(re);
        if (r) {
            let imdbId = r[0];
            let id = await fetchId(imdbId);
            let movie = await fetchMovie(id);
            fs.writeFileSync(`data/${imdbId}.json`, JSON.stringify(movie, null, "  "));
            console.log(file + ": " + r[0] + " -> " + id);
        }
    }
}

loop();

async function fetchId(imdbId) {
    const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${apikey}&external_source=imdb_id`;
    const response = await fetch(url);
    const asJson = await response.json();
    return asJson.movie_results[0].id;
}

async function fetchMovie(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}`;
    const response = await fetch(url);
    return await response.json();
}