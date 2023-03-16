import { csfd } from "node-csfd-api";
import fs from "fs";
async function getMoviesController(
  movie: string,
  revenues: string,
  viewers: number,
  screenings: number,
  budget: any,
  currency: any
) {
  try {
    let dat: any;
    const mov: any = await csfd.search(movie);

    const move: any = await csfd.movie(mov.movies[0]?.id);

    dat = {
      original_title: movie,
      nazev: move.title,
      revenues: revenues,
      viewers: viewers,
      screenings: screenings,
      budget: budget,
      currency: currency,
      trvani: move.duration,
      zemepuvodu: move.origins,
      directors: move.creators.directors,
      actors: move.creators.actors.slice(0, 5),
      premieres: move.premieres,
      rating: move.rating,
      ratingCount: move.ratingCount,
      genres: move.genres,
    };

    const path = "./smt.json";

    fs.appendFile(path, JSON.stringify(dat, null, 2), (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
      console.log("Data written successfully to disk");
    });
  } catch (error) {
    console.error(error);
  }
}
function file(): any {
  try {
    const data = fs.readFileSync("./csvjson.json", "utf8");

    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

async function getData() {
  let movies: any = file();
  let num: number = 0;
  let da: any = [];
  for (let i = 0; i <= 2440; i += 20) {
    movies.slice(i, i + 20).map(async (item: any) => {
      await getMoviesController(
        item.original_title,
        item.revenues,
        item.viewers,
        item.screenings,
        item.budget,
        item.currency
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log("done");
}

getData();
