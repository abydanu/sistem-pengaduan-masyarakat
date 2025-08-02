"use client"

import { useState, useEffect } from "react"

export function useNavigationData(navigationData, delay = 1000) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(navigationData)
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [navigationData, delay])

  return { data, isLoading }
}
