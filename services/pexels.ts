import { mockPexelsImages, filterImagesByQuery } from "./mock-images"

export interface PexelsImage {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  alt: string
}

export interface PexelsSearchResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsImage[]
  next_page: string | null
}

export async function searchPexelsImages(query: string, page = 1, perPage = 20): Promise<PexelsSearchResponse> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockPexelsImages, query)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedImages = filteredImages.slice(startIndex, endIndex)

    const hasNextPage = endIndex < filteredImages.length

    return {
      total_results: filteredImages.length,
      page,
      per_page: perPage,
      photos: paginatedImages,
      next_page: hasNextPage ? `page=${page + 1}` : null,
    }
  } catch (error) {
    console.error("Error searching Pexels images:", error)
    return { total_results: 0, page: 1, per_page: perPage, photos: [], next_page: null }
  }
}

export async function getRandomPexelsImage(query: string): Promise<PexelsImage | null> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockPexelsImages, query)
    if (filteredImages.length === 0) return null

    const randomIndex = Math.floor(Math.random() * filteredImages.length)
    return filteredImages[randomIndex]
  } catch (error) {
    console.error("Error getting random Pexels image:", error)
    return null
  }
}
