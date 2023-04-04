const API_KEY = "da6d140f12041ce3c25dd960d39e374e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const peliculasPopulares = document.getElementById("peliculas-populares");

async function obtenerPeliculasPopulares() {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
    const data = await response.json();

    for (let pelicula of data.results) {
      const imagen = pelicula.poster_path ? `${IMAGE_BASE_URL}${pelicula.poster_path}` : "https://via.placeholder.com/500x750?text=No+disponible";
      const titulo = pelicula.title;
      const calificacion = pelicula.vote_average;
      const fechaEstreno = pelicula.release_date;

      const peliculaElemento = document.createElement("li");
      peliculaElemento.classList.add("pelicula");

      // Agregar eventListener al elemento peliculaElemento para el evento click
      peliculaElemento.addEventListener("click", function () {
        window.location.href = "detalle_pelicula.html?id=" + pelicula.id;
        mostrarDetallePelicula();
      });

      const peliculaImagen = document.createElement("img");
      peliculaImagen.src = imagen;
      peliculaImagen.alt = titulo;
      peliculaElemento.appendChild(peliculaImagen);

      const peliculaTitulo = document.createElement("h3");
      peliculaTitulo.textContent = titulo;
      peliculaElemento.appendChild(peliculaTitulo);

      const peliculaCalificacion = document.createElement("p");
      peliculaCalificacion.textContent = `Calificación: ${calificacion}`;
      peliculaElemento.appendChild(peliculaCalificacion);

      const peliculaFechaEstreno = document.createElement("p");
      peliculaFechaEstreno.textContent = `F. Estreno: ${fechaEstreno}`;
      peliculaElemento.appendChild(peliculaFechaEstreno);

      peliculasPopulares.appendChild(peliculaElemento);

      // Desaparecer loader
      const loader = document.querySelector(".loader");
      loader.classList.add("loader--hidden");
      loader.addEventListener("transitionend", () => {
          document.body.removeChild(loader);
      });
      const contenido = document.getElementById('contenedor_body');
          contenido.style.display = 'block';
           
    }
  } catch (error) {
    console.error(error);
  }
}

obtenerPeliculasPopulares();

//Debounce
const input = document.getElementById('buscar-peliculas');
const sugerencias = document.getElementById('sugerencias');

async function realizarBusqueda() {
  const valor = input.value.trim();

  if (valor.length >= 0) {
    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${valor}`);
      const data = await response.json();

      sugerencias.innerHTML = '';

      for (let pelicula of data.results) {
        const titulo = pelicula.title;

        const peliculaElemento = document.createElement("li");
        peliculaElemento.textContent = titulo;
        sugerencias.appendChild(peliculaElemento);

        // Agregar eventListener al elemento peliculaElemento para el evento click
        peliculaElemento.addEventListener("click", function () {
          window.location.href = "detalle_pelicula.html?id=" + pelicula.id;
          mostrarDetallePelicula();
        });
        
      
      }
    } catch (error) {
      console.error(error);
    }
  }
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const debouncedBusqueda = debounce(realizarBusqueda, 500);

input.addEventListener('keyup', function (event) {
  const valor = event.target.value.trim();

  if (valor.length >= 0) {
    sugerencias.innerHTML = 'Cargando...';
    debouncedBusqueda();
  } else {
    peliculasBusqueda.innerHTML = '';
  }
});

const peliculasBusqueda = document.getElementById("peliculas-busqueda");
const contenedorPeliculasBusqueda = document.getElementById("contenedor-peliculas-busqueda");
const tituloBusqueda = document.getElementById("titulo-busqueda");
const sinResultados = document.getElementById("sin-resultados");
const contenedorPeliculasPopulares = document.getElementById("contenedor-peliculas-populares");
// Mostrar las peliculas de la busqueda
async function mostrarBusqueda() {

  const valor = input.value.trim();
  input.value = "";

  if (valor.length > 0) {
    try {
      contenedorPeliculasPopulares.style.display = 'none';
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${valor}`);
      const data = await response.json();

      peliculasBusqueda.innerHTML = '';

      tituloBusqueda.textContent = `Resultados de la búsqueda: ${valor}`;

      if (data.results == 0) {
        sinResultados.style.display = 'block';
      } else {
        sinResultados.style.display = 'none';
      }

      for (let pelicula of data.results) {
        const imagen = pelicula.poster_path ? `${IMAGE_BASE_URL}${pelicula.poster_path}` : "https://via.placeholder.com/500x750?text=No+disponible";
        const titulo = pelicula.title;
        const calificacion = pelicula.vote_average;
        const fechaEstreno = pelicula.release_date;

        const peliculaElemento = document.createElement("li");
        peliculaElemento.classList.add("pelicula");

        // Agregar eventListener al elemento peliculaElemento para el evento click
        peliculaElemento.addEventListener("click", function () {
          window.location.href = "detalle_pelicula.html?id=" + pelicula.id;
          mostrarDetallePelicula();
        });

        const peliculaImagen = document.createElement("img");
        peliculaImagen.src = imagen;
        peliculaImagen.alt = titulo;
        peliculaElemento.appendChild(peliculaImagen);

        const peliculaTitulo = document.createElement("h3");
        peliculaTitulo.textContent = titulo;
        peliculaElemento.appendChild(peliculaTitulo);

        const peliculaCalificacion = document.createElement("p");
        peliculaCalificacion.textContent = `Calificación: ${calificacion}`;
        peliculaElemento.appendChild(peliculaCalificacion);

        const peliculaFechaEstreno = document.createElement("p");
        peliculaFechaEstreno.textContent = `F. Estreno: ${fechaEstreno}`;
        peliculaElemento.appendChild(peliculaFechaEstreno);

        peliculasBusqueda.appendChild(peliculaElemento);
        contenedorPeliculasBusqueda.style.display = "block";
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// obtén la referencia al botón de búsqueda
const botonBuscar = document.getElementById("search-button");

// agrega un evento de escucha al botón de búsqueda
botonBuscar.addEventListener("click", function (event) {
  event.preventDefault();
  debouncedBusqueda();
  mostrarBusqueda();
});

input.addEventListener('keydown', function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    debouncedBusqueda();
    mostrarBusqueda();
  }
});

// CLik al logo o al nombre de la página
const logo = document.querySelector('.logo');
const title = document.querySelector('h1');

logo.addEventListener('click', function () {

  contenedorPeliculasBusqueda.style.display = "none";
  contenedorPeliculasPopulares.style.display = 'block';
});

title.addEventListener('click', function () {
  contenedorPeliculasBusqueda.style.display = "none";
  contenedorPeliculasPopulares.style.display = 'block';
});



