const express = require("express");

const app = express();

module.exports = app;

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

let dbPath = path.join(__dirname, "moviesData.db");

let db = null;

app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server has started");
    });
  } catch (e) {
    console.log(`DbError: ${e.message}`);

    process.exit(1);
  }
};

initializeDbAndServer();

//API GET MOVIENAMES

app.get("/movies/", async (request, response) => {
  const getAllMovieNames = `
    select
    movie_name 
    from movie
    `;
  const moviesArray = await db.all(getAllMovieNames);
  response.send(
    moviesArray.map((movie) => {
      return { movieName: movie.movie_name };
    })
  );
});

//API POST MOVIE

app.post("/movies/", async (request, response) => {
  const { movieName, directorId, leadActor } = request.body;
  const addMovie = `
    insert into movie(movie_name,director_id,lead_actor)
    values('${movieName}',${directorId},'${leadActor}')
    `;
  await db.run(addMovie);
  response.send("Movie Successfully Added");
});

//API GET MOVIE

app.get("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const getMovie = `
    select
    *
    from movie
    where movie_id = ${movieId};
    `;
    const moviesArray = await db.get(getMovie);
    console.log(moviesArray);
    response.send(moviesArray);
  } catch (e) {
    console.log(e.message);
  }
});

//API UPDATE DETAILS

app.put("/movies/:movieId", async (request, response) => {
  try {
    const { directorId, movieName, leadActor } = request.body;
    const { movieId } = request.params;
    const updateMovie = `
    update movie
    set director_id = ${directorId},movie_name = '${movieName}',lead_actor = '${leadActor}'
    where movie_id = ${movieId}
    `;
    await db.run(updateMovie);
    response.send("Movie Details Updated");
  } catch (e) {
    console.log(e.message);
  }
});

//API DELETE MOVIE
app.delete("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const updateMovie = `
    delete
    from movie
    where movie_id = ${movieId}
    `;
    await db.run(updateMovie);
    response.send("Movie Removed");
  } catch (e) {
    console.log(e.message);
  }
});

//API GET DIRECTOR

app.get("/directors/", async (request, response) => {
  try {
    const updateMovie = `
    select
    * from director
   
    `;
    const director = await db.run(updateMovie);
    response.send(director);
  } catch (e) {
    console.log(e.message);
  }
});
