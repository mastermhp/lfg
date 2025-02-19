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

// export function getGoogleDriveDirectUrl(url, type = "view") {
//   const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]

//   if (!fileId) {
//     return url // Return original URL if no file ID found
//   }

//   switch (type) {
//     case "video": // For video preview
//       return `https://drive.google.com/file/d/${fileId}/preview`
//     case "download": // For downloading the video
//       return `https://drive.google.com/uc?export=download&id=${fileId}`
//     default: // Default view
//       return `https://drive.google.com/uc?export=view&id=${fileId}`
//   }
// }

// export function isGoogleDriveUrl(url) {
//   return url?.includes("drive.google.com")
// }

export function getGoogleDriveDirectUrl(url, type = "view") {
  const fileId = url.match(/[-\w]{25,}(?!.*[-\w]{25,})/)?.[0]

  if (!fileId) {
    return url // Return original URL if no file ID found
  }

  switch (type) {
    case "video":
      // For video preview, use the embed URL
      return `https://drive.google.com/file/d/${fileId}/preview`
    case "download":
      // For downloading the file
      return `https://drive.google.com/uc?export=download&id=${fileId}`
    case "image":
      // For image preview, use the uc?export=view URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    default:
      // Default view, use the uc?export=view URL which works for both images and documents
      return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
}

export function isGoogleDriveUrl(url) {
  return url?.includes("drive.google.com")
}

export function getMediaType(url) {
  if (!url) return "unknown"

  const extension = url.split(".").pop().toLowerCase()
  const videoExtensions = ["mp4", "webm", "ogg", "mov"]
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]

  if (videoExtensions.includes(extension)) {
    return "video"
  } else if (imageExtensions.includes(extension)) {
    return "image"
  } else {
    return "unknown"
  }
}

