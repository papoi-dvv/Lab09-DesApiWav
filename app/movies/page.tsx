import Link from 'next/link'
import MovieSearch from './MovieSearch'
import MovieDetailModal from './MovieDetailModal'

// Este archivo es un Server Component: renderizamos en el servidor
// para cumplir el requisito 1 (Página Principal - SSR). Usamos fetch
// con una API key configurable vía process.env. Si la llamada falla
// (por ejemplo en entornos sin salida a internet) devolvemos un
// conjunto reducido de datos de ejemplo para que la página no rompa.

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

// Función ejecutada únicamente en el Servidor (SSR)
const SAMPLE_MOVIES = [
  {
    Title: 'Avengers: Endgame',
    Year: '2019',
    imdbID: 'tt4154796',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MTE2NjYxNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
  },
  {
    Title: 'The Avengers',
    Year: '2012',
    imdbID: 'tt0848228',
    Type: 'movie',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQzNjAtNTM1Ni00N2Y3LWFmNTEtODM1ZWM2YzZjZDE2XkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg',
  },
]

async function getPopularMovies() {
  const apiKey = process.env.OMDB_API_KEY || 'f1def80d'
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=avengers`

  try {
    const res = await fetch(url)
    // Si la respuesta no es OK devolvemos ejemplos
    if (!res.ok) {
      console.error('OMDb SSR fetch failed:', res.status, res.statusText)
      return SAMPLE_MOVIES
    }

    const data = await res.json()
    if (data && data.Response === 'True') return data.Search || []
    return SAMPLE_MOVIES
  } catch (error) {
    // Problemas de red o DNS -> devolver muestras locales
    console.error('Error fetching SSR movies:', error)
    return SAMPLE_MOVIES
  }
}

export default async function MoviesPage() {
  const popularMovies = await getPopularMovies()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 sm:p-12 selection:bg-amber-500 selection:text-black">
      
      {/* Encabezado */}
      <header className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 mb-4 tracking-tight">
          🎬 CineHub Híbrido
        </h1>
        <p className="text-gray-400 text-lg font-medium">
          Laboratorio Next.js: Combinación de Server-Side y Client-Side Rendering
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-16">
        
        {/* Sección de Búsqueda Interactiva (CSR) */}
        <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-amber-400 flex items-center gap-2">
            🔍 Buscador en Tiempo Real
          </h2>
          <MovieSearch />
        </section>

        {/* Sección de Tendencias Populares (SSR) */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-800 pb-3 flex items-center gap-2">
            🔥 Tendencias Populares <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30 font-mono">SSR</span>
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {popularMovies.map((movie: Movie) => (
              <Link
                key={movie.imdbID}
                href={`/movies?movieId=${movie.imdbID}`}
                scroll={false}
                className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg block"
              >
                <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
                  {movie.Poster !== 'N/A' ? (
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Sin Póster</div>
                  )}
                  <span className="absolute top-2 right-2 bg-black/80 text-amber-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {movie.Type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {movie.Title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{movie.Year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Modal encargado de escuchar la URL para pintar el detalle */}
      <MovieDetailModal />
    </div>
  )
}