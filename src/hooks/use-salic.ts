import { useState, useEffect } from 'react'
import {
  fetchProjects,
  fetchProjectById,
  type SalicProject,
  type SalicResponse,
} from '@/lib/salic-api'

export function useProjects(query?: string) {
  const [data, setData] = useState<SalicProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setIsLoading(true)
    setError(undefined)
    const timeoutId = setTimeout(() => {
      fetchProjects(query)
        .then((res: SalicResponse<SalicProject[]>) => {
          setData(res.data)
          setIsFallback(res.isFallback)
          setError(res.error)
        })
        .catch(() => {
          setData([])
          setIsFallback(false)
          setError('Não foi possível buscar os dados. Tente novamente mais tarde.')
        })
        .finally(() => setIsLoading(false))
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  return { data, isLoading, isFallback, error }
}

export function useProjectDetail(pronac?: string) {
  const [data, setData] = useState<SalicProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!pronac) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(undefined)
    fetchProjectById(pronac)
      .then((res: SalicResponse<SalicProject | null>) => {
        setData(res.data)
        setIsFallback(res.isFallback)
        setError(res.error)
      })
      .catch(() => {
        setData(null)
        setIsFallback(false)
        setError('Não foi possível buscar os dados. Tente novamente mais tarde.')
      })
      .finally(() => setIsLoading(false))
  }, [pronac])

  return { data, isLoading, isFallback, error }
}
