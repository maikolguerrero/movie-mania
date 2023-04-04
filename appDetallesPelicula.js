const API_KEY = "da6d140f12041ce3c25dd960d39e374e";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const video = "videos?api_key=da6d140f12041ce3c25dd960d39e374e&language=es-ES"

// Detalle Pelicula
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idPelicula = urlParams.get('id');

    // Paso 4: Llamar a la API utilizando el ID de la película
    fetch(`${BASE_URL}/movie/${idPelicula}?api_key=${API_KEY}&language=es-ES`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo obtener la información de la película.');
            }
            return response.json();
        })
        .then(data => {
            // Paso 5: Actualizar el contenido del HTML con los detalles de la película
            const tituloPelicula = document.getElementById('titulo-pelicula');
            tituloPelicula.textContent = data.title;

            const imagenPelicula = document.getElementById('imagen-pelicula');
            imagenPelicula.src = `${IMAGE_BASE_URL}${data.poster_path}`;
            imagenPelicula.alt = data.title;

            const calificacionPelicula = document.getElementById('calificacion-pelicula');
            calificacionPelicula.textContent = data.vote_average;

            const fechaEstrenoPelicula = document.getElementById('fecha-estreno-pelicula');
            fechaEstrenoPelicula.textContent = data.release_date;

            const generos = data.genres.map((genero) => genero.name).join(", ");
            const genero = document.getElementById('genero-pelicula');
            genero.textContent = generos;

            const duracionMinutos = data.runtime;
            const horas = Math.floor(duracionMinutos / 60);
            const minutos = duracionMinutos % 60;
            const peliculaDuracion = document.getElementById("duracion-pelicula");
            peliculaDuracion.textContent = `${horas}h ${minutos}min`;

            const descripcionPelicula = document.getElementById('descripcion-pelicula');
            descripcionPelicula.textContent = data.overview;

            obtenerRepartoPelicula(idPelicula)
                .then(reparto => {
                    const carrusel = document.getElementById("carrusel-reparto");

                    for (let actor of reparto) {
                        const imagen = actor.profile_path ? `${IMAGE_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/500x750?text=No+disponible";
                        const nombre = actor.name;
                        const personaje = actor.character

                        const actorElemento = document.createElement("li");
                        actorElemento.classList.add("actor");

                        const actorImagen = document.createElement("img");
                        actorImagen.src = imagen;
                        actorImagen.alt = nombre;
                        actorImagen.alt = "imageLoaded()";

                        actorElemento.appendChild(actorImagen);

                        const actorNombre = document.createElement("h3");
                        actorNombre.textContent = nombre;
                        actorElemento.appendChild(actorNombre);

                        const actorPersonaje = document.createElement("h4");
                        actorPersonaje.textContent = personaje;
                        actorElemento.appendChild(actorPersonaje);

                        carrusel.appendChild(actorElemento);

                    }
                })
                .catch(error => {
                    console.error('Ha ocurrido un error:', error);
                });

            // Obtener el contenedor del iframe
            const videoContainer = document.querySelector('.video-container');

            // Hacer una petición para obtener la información del video de la película
            fetch(`${BASE_URL}/movie/${idPelicula}/videos?api_key=${API_KEY}&language=es-ES`)
                .then(response => response.json())
                .then(data => {
                    // Obtener el ID del video de YouTube
                    const videoId = data.results[0].key;

                    // Crear la URL del video de YouTube
                    const videoUrl = `https://www.youtube.com/embed/${videoId}`;

                    // Asignar la URL del video al src del iframe
                    videoContainer.querySelector('iframe').src = videoUrl;

                    // Desaparecer loader
                    const loader = document.querySelector(".loader");
                    loader.classList.add("loader--hidden");
                    loader.addEventListener("transitionend", () => {
                        document.body.removeChild(loader);
                    });
                    const contenido = document.getElementById('contenedor_body');
                        contenido.style.display = 'block'; 

                })
                .catch(error => {
                    console.error('Ha ocurrido un error:', error);
                });
        })
        .catch(error => {
            console.error(error);
            const mensajeError = document.createElement('p');
            mensajeError.textContent = error.message;
            const contenedor = document.querySelector('.contenedor');
            contenedor.appendChild(mensajeError);
        });
});


// Función para obtener la información del reparto de la película
async function obtenerRepartoPelicula(idPelicula) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${idPelicula}/credits?api_key=${API_KEY}&language=es-ES`);
        if (!response.ok) {
            throw new Error('No se pudo obtener la información del reparto de la película.');
        }
        const data = await response.json();
        return data.cast;
    } catch (error) {
        console.error(error);
        return [];
    }
}

//Botones Carrusel
const carrusel = document.getElementById("carrusel-reparto");
const btnPrev = document.querySelector('.carrusel-btn-prev');
const btnNext = document.querySelector('.carrusel-btn-next');

// Posición actual del carrusel
let position = 0;

// Mover el carrusel hacia la izquierda
const moveLeft = () => {
    position -= 300;
    position = Math.max(position, 0);
    carrusel.scrollTo({
        left: position,
        behavior: "smooth"
    });
};

// Mover el carrusel hacia la derecha
const moveRight = () => {
    position += 300;
    position = Math.min(position, carrusel.scrollWidth - carrusel.clientWidth);
    carrusel.scrollTo({
        left: position,
        behavior: "smooth"
    });
};

btnPrev.addEventListener('click', moveLeft);
btnNext.addEventListener('click', moveRight);

