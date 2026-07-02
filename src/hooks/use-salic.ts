import { useState, useEffect } from 'react'
import { fetchProjects, fetchProjectById, type SalicProject } from '@/lib/salic-api'

export function useProjects(query?: string) {
  const [data, setData] = useState<SalicProject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      fetchProjects(query)
        .then(setData)
        .catch(() => setData([]))
        .finally(() => setIsLoading(false))
    }, 300) // debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  return { data, isLoading }
}

export function useProjectDetail(pronac?: string) {
  const [data, setData] = useState<SalicProject | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!pronac) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    fetchProjectById(pronac)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setIsLoading(false))
  }, [pronac])

  return { data, isLoading }
}
