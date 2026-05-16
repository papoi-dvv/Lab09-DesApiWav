'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface MovieDetail {
  Title: string
  Year: string
  Type: string
  Poster: string
  Rated: string
  Runtime: string
  Genre: string
  Director: string
  Actors: string
  Plot: string
  imdbRating: string
  Awards: string
}

export default function MovieDetailModal() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const movieId = searchParams.get('movieId')

  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!movieId) {
      setMovie(null)
      return
    }

    const fetchMovieDetail = async () => {
      setLoading(true)
      try {
  const apiKey = (process.env.NEXT_PUBLIC_OMDB_API_KEY as string) || 'f1def80d'
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  if (data && data.Response === 'True') setMovie(data)
  else setMovie(null)
      } catch (err) {
  console.error('Error fetching detail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetail()
  }, [movieId])

  const closeDetail = () => {
    // Regresa a la ruta limpia sin recargar la app
    router.push('/movies', { scroll: false })
  }

  if (!movieId) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-gray-100 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Botón Cerrar */}
        <button
            onClick={closeDetail}
            className="absolute top-4 right-4 bg-gray-800 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors z-10 shadow-md"
        >
            ✕
        </button>

        {loading ? (
            <div className="w-full py-24 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-500 mb-4"></div>
            <p className="text-gray-400 text-sm font-medium">Cargando sinopsis técnica...</p>
            </div>
        ) : movie ? (
            <>
            {/* Póster */}
            <div className="w-full md:w-2/5 bg-gray-950 flex items-center justify-center">
                {movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover md:rounded-l-2xl" />
                ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-600">Sin Póster</div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-6 md:p-8 flex-1 space-y-4">
                <div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wide mr-2">
                    {movie.Type}
                </span>
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-semibold">
                    {movie.Rated}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2 text-white">{movie.Title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                    {movie.Year} • {movie.Runtime} • {movie.Genre}
                </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 bg-gray-800/40 p-3 rounded-xl border border-gray-800 w-fit">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="font-bold text-white">{movie.imdbRating}</span>
                <span className="text-xs text-gray-500">/10 en IMDb</span>
                </div>

                {/* Trama */}
                <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Argumento</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{movie.Plot}</p>
                </div>

                {/* Ficha Técnica */}
                <div className="grid grid-cols-1 gap-2 pt-2 text-xs border-t border-gray-800 text-gray-400">
                <p><strong className="text-gray-200">Director:</strong> {movie.Director}</p>
                <p><strong className="text-gray-200">Elenco:</strong> {movie.Actors}</p>
                <p><strong className="text-gray-200">Premios:</strong> {movie.Awards}</p>
                </div>
            </div> {/* <-- Aquí faltaba cerrar el contenedor del contenido */}
            </>
        ) : null}
        </div>
    </div>
    )
}