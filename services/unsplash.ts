import { mockUnsplashImages, filterImagesByQuery } from "./mock-images"

export interface UnsplashImage {
  id: string
  description: string | null
  alt_description: string | null
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

export interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

export async function searchUnsplashImages(query: string, page = 1, perPage = 20): Promise<UnsplashSearchResponse> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockUnsplashImages, query)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedImages = filteredImages.slice(startIndex, endIndex)

    return {
      total: filteredImages.length,
      total_pages: Math.ceil(filteredImages.length / perPage),
      results: paginatedImages,
    }
  } catch (error) {
    console.error("Error searching Unsplash images:", error)
    return { total: 0, total_pages: 0, results: [] }
  }
}

export async function getRandomUnsplashImage(query: string): Promise<UnsplashImage | null> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockUnsplashImages, query)
    if (filteredImages.length === 0) return null

    const randomIndex = Math.floor(Math.random() * filteredImages.length)
    return filteredImages[randomIndex]
  } catch (error) {
    console.error("Error getting random Unsplash image:", error)
    return null
  }
}
