import { mockPixabayImages, filterImagesByQuery } from "./mock-images"

export interface PixabayImage {
  id: number
  pageURL: string
  type: string
  tags: string
  previewURL: string
  previewWidth: number
  previewHeight: number
  webformatURL: string
  webformatWidth: number
  webformatHeight: number
  largeImageURL: string
  imageWidth: number
  imageHeight: number
  imageSize: number
  views: number
  downloads: number
  collections: number
  likes: number
  comments: number
  user_id: number
  user: string
  userImageURL: string
}

export interface PixabaySearchResponse {
  total: number
  totalHits: number
  hits: PixabayImage[]
}

export async function searchPixabayImages(query: string, page = 1, perPage = 20): Promise<PixabaySearchResponse> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockPixabayImages, query)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedImages = filteredImages.slice(startIndex, endIndex)

    return {
      total: filteredImages.length,
      totalHits: filteredImages.length,
      hits: paginatedImages,
    }
  } catch (error) {
    console.error("Error searching Pixabay images:", error)
    return { total: 0, totalHits: 0, hits: [] }
  }
}

export async function getRandomPixabayImage(query: string): Promise<PixabayImage | null> {
  try {
    // Simular um pequeno atraso para imitar uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    const filteredImages = filterImagesByQuery(mockPixabayImages, query)
    if (filteredImages.length === 0) return null

    const randomIndex = Math.floor(Math.random() * filteredImages.length)
    return filteredImages[randomIndex]
  } catch (error) {
    console.error("Error getting random Pixabay image:", error)
    return null
  }
}
