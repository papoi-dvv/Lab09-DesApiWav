'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function MovieSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([])
      setError('')
      return
    }

    // Debounce de 500ms para mitigar llamadas excesivas en tiempo real
    const delayDebounce = setTimeout(() => {
      let cancelled = false

      const doSearch = async () => {
        setLoading(true)
        setError('')
        try {
          // Usamos fetch para no depender de axios en el cliente y
          // permitimos cambiar la API key vía variable de entorno
          const apiKey = (process.env.NEXT_PUBLIC_OMDB_API_KEY as string) || 'f1def80d'
          const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}`
          const res = await fetch(url)
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          const data = await res.json()
          if (cancelled) return
          if (data.Response === 'True') {
            setResults(data.Search || [])
          } else {
            setResults([])
            setError(data.Error || 'No se encontraron resultados')
          }
        } catch (err) {
          setResults([])
          setError('No se pudo conectar a OMDb. Revisa tu conexión o la API key.')
        } finally {
          if (!cancelled) setLoading(false)
        }
      }

      doSearch()

      return () => {
        cancelled = true
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div>
      <input
        type="text"
        placeholder="Escribe para buscar películas o series (ej: Batman, Suits)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 bg-gray-800 text-white rounded-xl border-2 border-gray-700 focus:border-amber-500 focus:outline-none transition font-medium placeholder-gray-500 shadow-inner"
      />

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-amber-500"></div>
        </div>
      )}

      {error && <p className="text-red-400 mt-4 text-sm font-semibold">⚠️ {error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6 max-h-[480px] overflow-y-auto p-2 border-t border-gray-800">
          {results.map((movie) => (
            <Link
              key={movie.imdbID}
              href={`/movies?movieId=${movie.imdbID}`}
              scroll={false}
              className="group bg-gray-950 rounded-lg overflow-hidden border border-gray-800 hover:border-amber-500 transition shadow-md block"
            >
              <div className="relative aspect-[2/3] bg-gray-900">
                {movie.Poster !== 'N/A' ? (
                  <img src={movie.Poster} alt={movie.Title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">Sin Póster</div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-xs text-gray-200 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {movie.Title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{movie.Year}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}