export function getGoogleDriveDirectUrl(url) {
    // Extract file ID from Google Drive URL
    const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]
  
    if (!fileId) {
      return url // Return original URL if no file ID found
    }
  
    // Return direct download URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  export function isGoogleDriveUrl(url) {
    return url.includes("drive.google.com")
  }
  
  