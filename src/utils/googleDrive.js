// export function getGoogleDriveDirectUrl(url) {
//     // Extract file ID from Google Drive URL
//     const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]
  
//     if (!fileId) {
//       return url // Return original URL if no file ID found
//     }
  
//     // Return direct download URL
//     return `https://drive.google.com/uc?export=view&id=${fileId}`
//   }
  
//   export function isGoogleDriveUrl(url) {
//     return url.includes("drive.google.com")
//   }
  
// export function getGoogleDriveDirectUrl(url, type = "view") {
//   // Extract file ID from Google Drive URL
//   const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]

//   if (!fileId) {
//     return url // Return original URL if no file ID found
//   }

//   // Different parameters for different file types
//   switch (type) {
//     case "video":
//       return `https://drive.google.com/uc?export=download&id=${fileId}`
//     case "download":
//       return `https://drive.google.com/uc?export=download&id=${fileId}`
//     default:
//       return `https://drive.google.com/uc?export=view&id=${fileId}`
//   }
// }

// export function isGoogleDriveUrl(url) {
//   return url?.includes("drive.google.com")
// }


// googleDrive.js
export function getGoogleDriveDirectUrl(url, type = "view") {
  const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0];

  if (!fileId) {
    return url; // Return original URL if no file ID found
  }

  switch (type) {
    case "video":       // For video preview
      return `https://drive.google.com/file/d/${fileId}/preview`;
    case "download":    // For downloading the video
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    default:            // Default view
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
}

export function isGoogleDriveUrl(url) {
  return url?.includes("drive.google.com");
}

