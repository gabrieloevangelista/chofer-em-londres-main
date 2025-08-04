import { searchUnsplashImages, getRandomUnsplashImage, type UnsplashImage } from "./unsplash"
import { searchPexelsImages, getRandomPexelsImage, type PexelsImage } from "./pexels"
import { searchPixabayImages, getRandomPixabayImage, type PixabayImage } from "./pixabay"

export type ImageSource = "unsplash" | "pexels" | "pixabay" | "all"

export interface NormalizedImage {
  id: string
  source: ImageSource
  title: string
  description: string
  url: string
  thumbnailUrl: string
  largeUrl: string
  authorName: string
  authorUrl: string
  sourceUrl: string
  width: number
  height: number
}

export interface SearchImagesResult {
  images: NormalizedImage[]
  totalResults: number
  hasMore: boolean
}

// Normaliza uma imagem do Unsplash para o formato comum
function normalizeUnsplashImage(image: UnsplashImage): NormalizedImage {
  return {
    id: `unsplash-${image.id}`,
    source: "unsplash",
    title: image.description || image.alt_description || "Unsplash image",
    description: image.alt_description || image.description || "",
    url: image.urls.regular,
    thumbnailUrl: image.urls.small,
    largeUrl: image.urls.full,
    authorName: image.user.name,
    authorUrl: `https://unsplash.com/@${image.user.username}`,
    sourceUrl: image.links.html,
    width: 0, // Unsplash API não retorna dimensões diretamente
    height: 0,
  }
}

// Normaliza uma imagem do Pexels para o formato comum
function normalizePexelsImage(image: PexelsImage): NormalizedImage {
  return {
    id: `pexels-${image.id}`,
    source: "pexels",
    title: image.alt || "Pexels image",
    description: image.alt || "",
    url: image.src.medium,
    thumbnailUrl: image.src.small,
    largeUrl: image.src.large2x,
    authorName: image.photographer,
    authorUrl: image.photographer_url,
    sourceUrl: image.url,
    width: image.width,
    height: image.height,
  }
}

// Normaliza uma imagem do Pixabay para o formato comum
function normalizePixabayImage(image: PixabayImage): NormalizedImage {
  return {
    id: `pixabay-${image.id}`,
    source: "pixabay",
    title: image.tags.split(",")[0] || "Pixabay image",
    description: image.tags || "",
    url: image.webformatURL,
    thumbnailUrl: image.previewURL,
    largeUrl: image.largeImageURL,
    authorName: image.user,
    authorUrl: `https://pixabay.com/users/${image.user}-${image.user_id}/`,
    sourceUrl: image.pageURL,
    width: image.imageWidth,
    height: image.imageHeight,
  }
}

// Busca imagens de uma fonte específica ou de todas as fontes
export async function searchImages(
  query: string,
  source: ImageSource = "all",
  page = 1,
  perPage = 20,
): Promise<SearchImagesResult> {
  const results: NormalizedImage[] = []
  let totalResults = 0
  let hasMore = false

  try {
    // Busca em todas as fontes ou apenas na fonte especificada
    if (source === "all" || source === "unsplash") {
      const unsplashResults = await searchUnsplashImages(query, page, perPage)
      results.push(...unsplashResults.results.map(normalizeUnsplashImage))
      totalResults += unsplashResults.total
      hasMore = hasMore || page < unsplashResults.total_pages
    }

    if (source === "all" || source === "pexels") {
      const pexelsResults = await searchPexelsImages(query, page, perPage)
      results.push(...pexelsResults.photos.map(normalizePexelsImage))
      totalResults += pexelsResults.total_results
      hasMore = hasMore || !!pexelsResults.next_page
    }

    if (source === "all" || source === "pixabay") {
      const pixabayResults = await searchPixabayImages(query, page, perPage)
      results.push(...pixabayResults.hits.map(normalizePixabayImage))
      totalResults += pixabayResults.total
      hasMore = hasMore || pixabayResults.hits.length === perPage
    }

    return {
      images: results,
      totalResults,
      hasMore,
    }
  } catch (error) {
    console.error("Error searching images:", error)
    return {
      images: [],
      totalResults: 0,
      hasMore: false,
    }
  }
}

// Obtém uma imagem aleatória de uma fonte específica ou de qualquer fonte
export async function getRandomImage(query: string, source: ImageSource = "all"): Promise<NormalizedImage | null> {
  try {
    if (source === "all") {
      // Escolhe uma fonte aleatória
      const sources: ("unsplash" | "pexels" | "pixabay")[] = ["unsplash", "pexels", "pixabay"]
      source = sources[Math.floor(Math.random() * sources.length)] as "unsplash" | "pexels" | "pixabay"
    }

    if (source === "unsplash") {
      const image = await getRandomUnsplashImage(query)
      return image ? normalizeUnsplashImage(image) : null
    }

    if (source === "pexels") {
      const image = await getRandomPexelsImage(query)
      return image ? normalizePexelsImage(image) : null
    }

    if (source === "pixabay") {
      const image = await getRandomPixabayImage(query)
      return image ? normalizePixabayImage(image) : null
    }

    return null
  } catch (error) {
    console.error("Error getting random image:", error)
    return null
  }
}
