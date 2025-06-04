const apiKey = "bf055b9";
const searchInputEl = document.getElementById("search-input");
let searchValue = "";
const searchBtn = document.getElementById("search-btn");
const searchResultsEl = document.getElementById("search-results");
let movieTitle;

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const movieData = await Promise.all(
    movieTitle.map((title) =>
      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${title}`).then(
        (res) => res.json()
      )
    )
  );
  searchValue = searchInputEl.value;
  console.log(searchValue);
  renderHtml(movieData);
});

fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=blade-runner`)
  .then((res) => res.json())
  .then((data) => {
    movieTitle = data.Search.map((movie) => {
      return movie.Title;
    });

    return movieTitle;
  });

function renderHtml(movies) {
  console.log(movies);
  let moviesHtml = "";
  movies.forEach((movie) => {
    moviesHtml += `
      <div class="movie">
        <div class="movie-img">
          <img src="${movie.Poster}" alt="poster from movie ${movie.Title}" />
        </div>
        <div class="movie-details">
          <div class="movie-details-subsection">
            <div class="movie-title-details">
              <h2>${movie.Title}</h2>
              <p class="star">star</p>
              <p class="movie-raiting">${movie.imdbRating}</p>
            </div>
            <ul>
              <li>${movie.Runtime}</li>
              <li>${movie.Genre}</li>
              <li><button>ADD</button>Watchlist</li>
            </ul>
            <p>${movie.Plot}</p>
          </div>
        </div>
      </div>
  `;
  });

  searchResultsEl.innerHTML = moviesHtml;
}
