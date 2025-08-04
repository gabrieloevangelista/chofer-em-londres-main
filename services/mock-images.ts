import { additionalUnsplashImages, additionalPexelsImages, additionalPixabayImages } from "./mock-images-extended"
import type { UnsplashImage } from "./unsplash"
import type { PexelsImage } from "./pexels"
import type { PixabayImage } from "./pixabay"

// Dados simulados para Unsplash
export const mockUnsplashImages: UnsplashImage[] = [
  {
    id: "unsplash-1",
    description: "London Bridge at sunset",
    alt_description: "View of London Bridge with beautiful sunset",
    urls: {
      raw: "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1",
      full: "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
      regular:
        "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
      small:
        "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
      thumb:
        "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
    },
    user: {
      name: "John Smith",
      username: "johnsmith",
    },
    links: {
      html: "https://unsplash.com/photos/abc123",
    },
  },
  {
    id: "unsplash-2",
    description: "Big Ben and Westminster",
    alt_description: "Big Ben and Westminster Palace in London",
    urls: {
      raw: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1",
      full: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
      regular:
        "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
      small:
        "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
      thumb:
        "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
    },
    user: {
      name: "Jane Doe",
      username: "janedoe",
    },
    links: {
      html: "https://unsplash.com/photos/def456",
    },
  },
  {
    id: "unsplash-3",
    description: "Tower Bridge",
    alt_description: "Tower Bridge in London",
    urls: {
      raw: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1",
      full: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
      regular:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
      small:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
      thumb:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
    },
    user: {
      name: "Mark Wilson",
      username: "markwilson",
    },
    links: {
      html: "https://unsplash.com/photos/ghi789",
    },
  },
  {
    id: "unsplash-4",
    description: "London Eye",
    alt_description: "London Eye ferris wheel",
    urls: {
      raw: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1",
      full: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb",
      regular:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max",
      small:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max",
      thumb:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max",
    },
    user: {
      name: "Sarah Johnson",
      username: "sarahjohnson",
    },
    links: {
      html: "https://unsplash.com/photos/jkl012",
    },
  },
  ...additionalUnsplashImages,
]

// Dados simulados para Pexels
export const mockPexelsImages: PexelsImage[] = [
  {
    id: 1001,
    width: 1920,
    height: 1080,
    url: "https://www.pexels.com/photo/london-bridge-1001/",
    photographer: "Alex Brown",
    photographer_url: "https://www.pexels.com/@alexbrown",
    photographer_id: 101,
    avg_color: "#4C4C4C",
    src: {
      original: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg",
      large2x:
        "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    alt: "London Bridge at night",
  },
  {
    id: 1002,
    width: 1920,
    height: 1080,
    url: "https://www.pexels.com/photo/big-ben-1002/",
    photographer: "Chris Green",
    photographer_url: "https://www.pexels.com/@chrisgreen",
    photographer_id: 102,
    avg_color: "#5D5D5D",
    src: {
      original: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg",
      large2x:
        "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    alt: "Big Ben and Westminster",
  },
  {
    id: 1003,
    width: 1920,
    height: 1080,
    url: "https://www.pexels.com/photo/tower-bridge-1003/",
    photographer: "David White",
    photographer_url: "https://www.pexels.com/@davidwhite",
    photographer_id: 103,
    avg_color: "#6E6E6E",
    src: {
      original: "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg",
      large2x:
        "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait:
        "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape:
        "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
    },
    alt: "Tower Bridge in London",
  },
  ...additionalPexelsImages,
]

// Dados simulados para Pixabay
export const mockPixabayImages: PixabayImage[] = [
  {
    id: 2001,
    pageURL: "https://pixabay.com/photos/london-bridge-2001/",
    type: "photo",
    tags: "london, bridge, river",
    previewURL: "https://cdn.pixabay.com/photo/2016/10/30/20/44/london-1783954__340.jpg",
    previewWidth: 340,
    previewHeight: 213,
    webformatURL: "https://cdn.pixabay.com/photo/2016/10/30/20/44/london-1783954_640.jpg",
    webformatWidth: 640,
    webformatHeight: 400,
    largeImageURL: "https://cdn.pixabay.com/photo/2016/10/30/20/44/london-1783954_1280.jpg",
    imageWidth: 1920,
    imageHeight: 1200,
    imageSize: 1231234,
    views: 12345,
    downloads: 5432,
    collections: 321,
    likes: 543,
    comments: 54,
    user_id: 201,
    user: "PixelPro",
    userImageURL: "https://cdn.pixabay.com/user/2019/10/20/18-33-30-675_250x250.jpg",
  },
  {
    id: 2002,
    pageURL: "https://pixabay.com/photos/big-ben-2002/",
    type: "photo",
    tags: "big ben, london, parliament",
    previewURL: "https://cdn.pixabay.com/photo/2014/09/11/18/23/tower-bridge-441853__340.jpg",
    previewWidth: 340,
    previewHeight: 213,
    webformatURL: "https://cdn.pixabay.com/photo/2014/09/11/18/23/tower-bridge-441853_640.jpg",
    webformatWidth: 640,
    webformatHeight: 400,
    largeImageURL: "https://cdn.pixabay.com/photo/2014/09/11/18/23/tower-bridge-441853_1280.jpg",
    imageWidth: 1920,
    imageHeight: 1200,
    imageSize: 1345678,
    views: 23456,
    downloads: 6543,
    collections: 432,
    likes: 654,
    comments: 65,
    user_id: 202,
    user: "PhotoMaster",
    userImageURL: "https://cdn.pixabay.com/user/2020/05/15/10-54-45-780_250x250.jpg",
  },
  {
    id: 2003,
    pageURL: "https://pixabay.com/photos/tower-bridge-2003/",
    type: "photo",
    tags: "tower bridge, london, thames",
    previewURL: "https://cdn.pixabay.com/photo/2016/07/30/08/13/london-1556699__340.jpg",
    previewWidth: 340,
    previewHeight: 213,
    webformatURL: "https://cdn.pixabay.com/photo/2016/07/30/08/13/london-1556699_640.jpg",
    webformatWidth: 640,
    webformatHeight: 400,
    largeImageURL: "https://cdn.pixabay.com/photo/2016/07/30/08/13/london-1556699_1280.jpg",
    imageWidth: 1920,
    imageHeight: 1200,
    imageSize: 1456789,
    views: 34567,
    downloads: 7654,
    collections: 543,
    likes: 765,
    comments: 76,
    user_id: 203,
    user: "SnapShot",
    userImageURL: "https://cdn.pixabay.com/user/2021/02/10/15-30-22-190_250x250.jpg",
  },
  ...additionalPixabayImages,
]

// Função para filtrar imagens com base na consulta
export function filterImagesByQuery(images: any[], query: string): any[] {
  const lowerQuery = query.toLowerCase()
  return images.filter((image) => {
    // Para Unsplash
    if ("description" in image) {
      return (
        (image.description && image.description.toLowerCase().includes(lowerQuery)) ||
        (image.alt_description && image.alt_description.toLowerCase().includes(lowerQuery))
      )
    }
    // Para Pexels
    else if ("alt" in image) {
      return image.alt.toLowerCase().includes(lowerQuery) || image.photographer.toLowerCase().includes(lowerQuery)
    }
    // Para Pixabay
    else if ("tags" in image) {
      return image.tags.toLowerCase().includes(lowerQuery)
    }
    return false
  })
}
