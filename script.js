 
 document.getElementById('searchInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchMovie();
    }
});

let currentPage = 1; // Variable para rastrear la página actual
 let api_key = 'b06da8e343b35627e3a94fa4bfabab94'
 let urlBase = 'https://api.themoviedb.org/3/search/movie'
 let urlImg =  'https://image.tmdb.org/t/p/w500'
 
 document.getElementById('searchButton').addEventListener('click', searchMovie)

 let resultContainer = document.getElementById('results')
   
 function searchMovie(){
    let searchInput = document.getElementById('searchInput').value 

    currentPage = 1;

    resultContainer.innerHTML = 'Cargando...'

    /*fetch(`${urlBase}?query=${searchInput}&api_key=${api_key}`)
    .then(response => response.json())
   .then(response => displayMovies(response.results))*/
   fetch(`${urlBase}?query=${searchInput}&api_key=${api_key}&page=${currentPage}`)
        .then(response => response.json())
        .then(response => displayMovies(response.results))
        .catch(error => console.error('Error fetching search results:', error));

 }

 function getMovieDetails(movieId, language) {
    return fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=${language}`)
        .then(response => response.json());
}

function displayMovies(movies){
   
    resultContainer.innerHTML = ''
    if(movies.length === 0){
        resultContainer.innerHTML = '<p> No se encontraron resultados para tu búsqueda </p>'
        return
    }

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('carousel');


    movies.forEach(movie => {
        getMovieDetails(movie.id, 'es')
            .then(movieDetails => {
        let movieDiv = document.createElement('div')
        movieDiv.classList.add('movie')

        let title = document.createElement('h2')
        title.textContent = movie.title

        let releaseDate = document.createElement('p')
        releaseDate.textContent = 'La fecha de lanzamiento fue: ' + movie.release_date
        releaseDate.style.color = 'blue'

        let overview = document.createElement('p')
        overview.textContent = movie.overview
        overview.style.color = 'black'
       
        let vote = document.createElement('h2')
        vote.textContent = 'Puntuación promedio: ' + movie.vote_average

        // Aplicar color al texto de la puntuación
        if (movieDetails.vote_average >= 7) {
            vote.style.color = 'green'; // Color verde para puntuaciones altas
        } else if (movieDetails.vote_average >= 5) {
            vote.style.color = 'orange'; // Color naranja para puntuaciones intermedias
        } else {
            vote.style.color = 'red'; // Color rojo para puntuaciones bajas
        }

        let posterPath = urlImg + movie.poster_path
        let poster = document.createElement('img')
        poster.src = posterPath

        movieDiv.appendChild(poster)
        movieDiv.appendChild(title)
        movieDiv.appendChild(releaseDate)
        movieDiv.appendChild(overview)
        movieDiv.appendChild(vote)

        carouselContainer.appendChild(movieDiv);
    })
    
})

resultContainer.appendChild(carouselContainer);

    // Esperar a que el DOM esté completamente cargado antes de inicializar el carrusel
    $(document).ready(function(){
        $('.carousel').slick({
            // Configuraciones de Slick Carousel
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            // ... otras configuraciones que desees
        });
    });
     // Incrementa la variable currentPage para la próxima búsqueda
     currentPage++;
}


