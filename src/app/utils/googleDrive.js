// // // googleDrive.js
// export function getGoogleDriveDirectUrl(url, type = "view") {
//     const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0];
  
//     if (!fileId) {
//       return url; // Return original URL if no file ID found
//     }
  
//     switch (type) {
//       case "video":       // For video preview
//         return `https://drive.google.com/file/d/${fileId}/preview`;
//       case "download":    // For downloading the video
//         return `https://drive.google.com/uc?export=download&id=${fileId}`;
//       default:            // Default view
//         return `https://drive.google.com/uc?export=view&id=${fileId}`;
//     }
//   }
  
//   export function isGoogleDriveUrl(url) {
//     return url?.includes("drive.google.com");
//   }

// utils/googleDrive.ts

// const GOOGLE_DRIVE_URL_REGEX = /^(?:https?:\/\/)?drive\.google\.com\/(?:file\/d\/|open\?id=)([^&]+)/

// export function isGoogleDriveUrl(url) {
//   return url?.includes("drive.google.com")
// }

// export function getGoogleDriveDirectUrl(url, type = "view") {
//   const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]

//   if (!fileId) {
//     return url // Return original URL if no file ID found
//   }

//   switch (type) {
//     case "video": // For video preview
//       return `https://drive.google.com/file/d/${fileId}/preview`
//     case "download": // For downloading files (both video and images)
//       return `https://drive.google.com/uc?export=download&id=${fileId}`
//     case "thumbnail": // For image thumbnails
//       return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
//     default: // Default view
//       return `https://drive.google.com/uc?export=view&id=${fileId}`
//   }
// }

/**
 * Utility functions for handling Google Drive URLs
 */

// Regex for extracting Google Drive file IDs from various URL formats
const GOOGLE_DRIVE_URL_REGEX =
  /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/

/**
 * Check if a URL is from Google Drive
 */
export function isGoogleDriveUrl(url) {
  if (!url) return false
  return url.includes("drive.google.com")
}

/**
 * Extract the file ID from a Google Drive URL
 */
export function extractGoogleDriveFileId(url) {
  if (!url) return null

  // Try to extract using regex first
  const match = url.match(GOOGLE_DRIVE_URL_REGEX)
  if (match && match[1]) return match[1]

  // Fallback to the old method
  const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]
  return fileId || null
}

/**
 * Get a direct URL for Google Drive content based on type
 * Note: This only works for files that have been shared with "Anyone with the link"
 */
export function getGoogleDriveDirectUrl(url, type = "view") {
  const fileId = extractGoogleDriveFileId(url)

  if (!fileId) {
    return url // Return original URL if no file ID found
  }

  switch (type) {
    case "video": // For video preview
      return `https://drive.google.com/file/d/${fileId}/preview`
    case "download": // For downloading files
      return `https://drive.google.com/uc?export=download&id=${fileId}`
    case "thumbnail": // For image thumbnails
      // Use the Google Drive content API which is more reliable for thumbnails
      return `https://lh3.googleusercontent.com/d/${fileId}=w1000`
    case "image": // For full images
      // Use the Google Drive content API which is more reliable for images
      return `https://lh3.googleusercontent.com/d/${fileId}`
    default: // Default view
      return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
}

/**
 * Get multiple URL formats to try for Google Drive images
 * This helps handle different sharing permissions and file types
 */
export function getGoogleDriveImageUrls(url) {
  const fileId = extractGoogleDriveFileId(url)
  if (!fileId) return [url]

  return [
    // Google Photos/Drive content API (most reliable for shared images)
    `https://lh3.googleusercontent.com/d/${fileId}`,
    // Smaller thumbnail version
    `https://lh3.googleusercontent.com/d/${fileId}=w1000`,
    // Standard export view
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    // Direct download as fallback
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    // Original URL as final fallback
    url,
  ]
}

