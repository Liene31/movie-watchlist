const apiKey = "bf055b9";
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.getElementById("search-results");
let = movieIdArray = [];
let = movieDataArray = [];

document.getElementById("search-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const searchValue = searchInputEl.value;

  fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      movieIdArray = data.Search.map((movie) => movie.imdbID);

      // Use Promise.all to wait for all fetches
      return Promise.all(
        movieIdArray.map((id) =>
          fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`).then(
            (res) => res.json()
          )
        )
      );
    })
    .then((data) => {
      movieDataArray = data;
      renderHtml(movieDataArray);
    });
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

// 1. Returns currently only first page
// 2. Maybe should put type movie or add later filters for years/type etc.
