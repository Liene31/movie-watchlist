const path = window.location.pathname;
const apiKey = "bf055b9";
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.getElementById("search-results");
const myWatchlistEl = document.getElementById("my-watchlist");
let moviesWatchlistHtml = "";
let movieIdArray = [];
let movieDataArray = [];
let moviesFromLocalStorage =
  JSON.parse(localStorage.getItem("myWishList")) || [];
let watchlistDataArray = moviesFromLocalStorage;

if (
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/index.html")
) {
  document.getElementById("search-btn").addEventListener("click", function (e) {
    e.preventDefault();
    const searchValue = searchInputEl.value;
    document.getElementById("main").classList.remove("start-exploring-bg");

    // Search for the movies with given title
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`)
      .then((res) => res.json())
      .then((data) => {
        movieIdArray = data.Search.map((movie) => movie.imdbID);

        // Promise.all to wait for all fetches
        // Returns details on individual movie by ID
        return Promise.all(
          movieIdArray.map((id) =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}`).then(
              (res) => res.json()
            )
          )
        );
      })
      .then((data) => {
        movieDataArray = data;
        renderToHtml(movieDataArray, searchResultsEl);
        searchInputEl.value = "";
        console.log(searchValue);
      });
  });

  document.getElementById("main").addEventListener("click", function (e) {
    if (e.target.dataset.watchlistId) {
      getMoviesAddedToWatchlist(e.target.dataset.watchlistId);

      localStorage.setItem("myWishList", JSON.stringify(watchlistDataArray));

      document
        .getElementById(`${e.target.dataset.watchlistId}`)
        .classList.remove("fa-circle-plus");

      document
        .getElementById(`${e.target.dataset.watchlistId}`)
        .classList.add("fa-circle-minus");
    }
  });

  function getMoviesAddedToWatchlist(movieId) {
    const watchlistData = movieDataArray.find(
      (movie) => movie.imdbID === movieId
    );
    watchlistDataArray.push(watchlistData);
  }
} else if (
  path === "/watchlist" ||
  path === "/watchlist/" ||
  path.endsWith("/watchlist.html")
) {
  if (moviesFromLocalStorage) {
    renderToHtml(watchlistDataArray, myWatchlistEl);
  }
}

function renderToHtml(moviesArray, containerEl) {
  let moviesHtml = "";

  moviesArray.forEach((movie) => {
    console.log(movie);
    moviesHtml += `
    <div class="movie">
      <div class="movie-img">
        <img src="${movie.Poster}" alt="poster from movie ${movie.Title}" />
      </div>
      <div class="movie-details">
        <div class="movie-details-subsection">
          <div class="movie-title-details">
            <h2>${movie.Title}</h2>
            <p class="star"><i class="fa-solid fa-star"></i></p>
            <p class="movie-raiting">${movie.imdbRating}</p>
          </div>
          <ul>
            <li>${movie.Runtime}</li>
            <li>${movie.Genre}</li>
            <li>
                <button class="add-btn"><i class="fa-solid fa-circle-plus" id="${movie.imdbID}" data-watchlist-id=${movie.imdbID}></i></button>
                Watchlist
            </li>
          </ul>
          <p class="movie-description">${movie.Plot}</p>
        </div>
      </div>
    </div>
`;
  });
  containerEl.innerHTML = moviesHtml;
}

// 1. Returns currently only first page
// 2. Maybe should put type movie or add later filters for years/type etc.
