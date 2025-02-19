"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";
import {
  getGoogleDriveDirectUrl,
  isGoogleDriveUrl,
} from "../utils/googleDrive";

// export default function ContentCard({ content }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [videoPreview, setVideoPreview] = useState(false);
//   const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const renderHashtags = () => {
//     if (!content.hashtags) return null;

//     if (Array.isArray(content.hashtags)) {
//       return content.hashtags.map((tag, index) => (
//         <span
//           key={index}
//           className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
//         >
//           #{tag.trim()}
//         </span>
//       ));
//     }

//     if (typeof content.hashtags === "string") {
//       return content.hashtags.split(",").map((tag, index) => (
//         <span
//           key={index}
//           className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
//         >
//           #{tag.trim()}
//         </span>
//       ));
//     }

//     return null;
//   };

//   const getThumbnailUrl = (url) => {
//     if (!url) return "/placeholder.svg";
//     return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url) : url;
//   };
//   const getUrl = (url, type = "view") => {
//     if (!url) return null;
//     return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url, type) : url;
//   };

//   return (
//     <div
//       className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* <Image
//         src={getThumbnailUrl(content.thumbnail) || "/placeholder.svg"}
//         alt={content.title}
//         layout="fill"
//         objectFit="cover"
//         className="w-full h-full object-cover"
//       /> */}

//       {content?.videos?.length > 0 ? (
//         <div
//           className="relative w-full h-full"
//           onMouseEnter={() => setVideoPreview(true)}
//           onMouseLeave={() => setVideoPreview(false)}
//         >
//           {videoPreview ? (
//             isGoogleDriveVideo ? (
//               <iframe
//                 key={videoUrl}
//                 src={videoUrl}
//                 allow="autoplay"
//                 className="w-full h-full object-cover"
//                 frameBorder="0"
//                 allowFullScreen
//               ></iframe>
//             ) : (
//               <video
//                 key={videoUrl}
//                 muted
//                 autoPlay
//                 loop
//                 className="w-full h-full object-cover"
//               >
//                 <source src={videoUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )
//           ) : (
//             <button
//               onClick={() => setVideoPreview(true)}
//               className="w-full h-full flex items-center justify-center text-white bg-gray-800"
//             >
//               <Video className="w-10 h-10" />
//             </button>
//           )}

//           <button
//             onClick={() =>
//               handleDownload(
//                 videoUrl,
//                 `video-${content.title || "download"}.mp4`
//               )
//             }
//             className="absolute bottom-14 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
//             title="Download video"
//           >
//             <Download className="w-5 h-5 text-white" />
//           </button>
//         </div>
//       ) : content?.thumbnail ? (
//         <Image
//           src={getUrl(content.thumbnail) || "/placeholder.svg"}
//           alt={content.title || "Thumbnail"}
//           layout="fill"
//           objectFit="cover"
//         />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center text-white">
//           No video or thumbnail available
//         </div>
//       )}

//       {isHovered && (
//         <div className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between transition-all duration-200">
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-2">
//               {content.title}
//             </h3>
//             <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
//           </div>
//           <Link
//             href={`/content/${content._id}`}
//             className="block w-full text-center bg-white text-black py-2 rounded hover:bg-gray-200 transition-colors"
//           >
//             View Details
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ContentCard({ content }) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false)
//   const [mediaUrl, setMediaUrl] = useState(null)
//   const videoRef = useRef(null)

//   useEffect(() => {
//     if (content?.videos?.length > 0) {
//       const url = content.videos[0]
//       setIsGoogleDriveVideo(isGoogleDriveUrl(url))
//       setMediaUrl(isGoogleDriveVideo ? getGoogleDriveDirectUrl(url, "video") : url)
//     } else if (content?.thumbnail) {
//       setMediaUrl(getGoogleDriveDirectUrl(content.thumbnail))
//     }
//   }, [content, isGoogleDriveVideo])

//   const renderHashtags = () => {
//     if (!content.hashtags) return null

//     const tags = Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(",")

//     return tags.map((tag, index) => (
//       <span key={index} className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded">
//         #{tag.trim()}
//       </span>
//     ))
//   }

//   const handleDownload = () => {
//     const url =
//       content?.videos?.length > 0
//         ? isGoogleDriveVideo
//           ? getGoogleDriveDirectUrl(content.videos[0], "download")
//           : content.videos[0]
//         : mediaUrl

//     const link = document.createElement("a")
//     link.href = url
//     link.download = `${content.title || "download"}.${content?.videos?.length > 0 ? "mp4" : "jpg"}`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       if (videoRef.current) {
//         videoRef.current.pause()
//       }
//     } else {
//       if (videoRef.current) {
//         videoRef.current.play()
//       }
//     }
//     setIsPlaying(!isPlaying)
//   }

//   return (
//     <div
//       className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {content?.videos?.length > 0 ? (
//         <div className="relative w-full h-full">
//           {isGoogleDriveVideo ? (
//             <iframe
//               src={mediaUrl}
//               allow="autoplay"
//               className="w-full h-full object-cover"
//               frameBorder="0"
//               allowFullScreen
//             ></iframe>
//           ) : (
//             <video ref={videoRef} className="w-full h-full object-cover" src={mediaUrl} muted loop playsInline />
//           )}
//         </div>
//       ) : content?.thumbnail ? (
//         <Image
//           src={mediaUrl || "/placeholder.svg"}
//           alt={content.title || "Thumbnail"}
//           layout="fill"
//           objectFit="cover"
//         />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center text-white">No video or thumbnail available</div>
//       )}

//       {isHovered && (
//         <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-between transition-all duration-200">
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
//             <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
//           </div>
//           <div className="flex justify-between items-center">
//             {content?.videos?.length > 0 && (
//               <button
//                 onClick={handlePlayPause}
//                 className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
//                 title={isPlaying ? "Pause video" : "Play video"}
//               >
//                 {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
//               </button>
//             )}
//             <button
//               onClick={handleDownload}
//               className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors"
//               title={`Download ${content?.videos?.length > 0 ? "video" : "image"}`}
//             >
//               <Download className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default function ContentCard({ content }) {
//   const [isHovered, setIsHovered] = useState(false)
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false)
//   const [mediaUrl, setMediaUrl] = useState(null)
//   const videoRef = useRef(null)
//   const iframeRef = useRef(null)

//   useEffect(() => {
//     if (content?.videos?.length > 0) {
//       const url = content.videos[0]
//       const isGDrive = isGoogleDriveUrl(url)
//       setIsGoogleDriveVideo(isGDrive)
//       setMediaUrl(isGDrive ? getGoogleDriveDirectUrl(url, "video") : url)
//     } else if (content?.thumbnail) {
//       setMediaUrl(getGoogleDriveDirectUrl(content.thumbnail))
//     }
//   }, [content])

//   const renderHashtags = () => {
//     if (!content.hashtags) return null

//     const tags = Array.isArray(content.hashtags) ? content.hashtags : content.hashtags.split(",")

//     return tags.map((tag, index) => (
//       <span key={index} className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded">
//         #{tag.trim()}
//       </span>
//     ))
//   }

//   const handleDownload = () => {
//     const url =
//       content?.videos?.length > 0
//         ? isGoogleDriveVideo
//           ? getGoogleDriveDirectUrl(content.videos[0], "download")
//           : content.videos[0]
//         : mediaUrl

//     const link = document.createElement("a")
//     link.href = url
//     link.download = `${content.title || "download"}.${content?.videos?.length > 0 ? "mp4" : "jpg"}`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const handlePlayPause = () => {
//     if (isGoogleDriveVideo) {
//       if (iframeRef.current) {
//         const message = isPlaying ? "pause" : "play"
//         iframeRef.current.contentWindow.postMessage(message, "*")
//       }
//     } else {
//       if (videoRef.current) {
//         if (isPlaying) {
//           videoRef.current.pause()
//         } else {
//           videoRef.current.play()
//         }
//       }
//     }
//     setIsPlaying(!isPlaying)
//   }

//   useEffect(() => {
//     const handleMessage = (event) => {
//       if (event.data === "paused") {
//         setIsPlaying(false)
//       } else if (event.data === "playing") {
//         setIsPlaying(true)
//       }
//     }

//     window.addEventListener("message", handleMessage)
//     return () => window.removeEventListener("message", handleMessage)
//   }, [])

//   return (
//     <div
//       className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {content?.videos?.length > 0 ? (
//         <div className="relative w-full h-full">
//           {isGoogleDriveVideo ? (
//             <iframe
//               ref={iframeRef}
//               src={`${mediaUrl}?enablejsapi=1`}
//               allow="autoplay"
//               className="w-full h-full object-cover"
//               frameBorder="0"
//               allowFullScreen
//             ></iframe>
//           ) : (
//             <video ref={videoRef} className="w-full h-full object-cover" src={mediaUrl} muted loop playsInline />
//           )}
//         </div>
//       ) : content?.thumbnail ? (
//         <Image
//           src={mediaUrl || "/placeholder.svg"}
//           alt={content.title || "Thumbnail"}
//           layout="fill"
//           objectFit="cover"
//         />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center text-white">No video or thumbnail available</div>
//       )}

//       {/* {isHovered && ( */}
//         <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-between transition-all duration-200">
//           <div>
//             <h3 className="text-lg font-semibold text-white mb-2">{content.title}</h3>
//             <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
//           </div>
//           <div className="flex justify-between items-center">
//             {content?.videos?.length > 0 && (
//               <button
//                 onClick={handlePlayPause}
//                 className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
//                 title={isPlaying ? "Pause video" : "Play video"}
//               >
//                 {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
//               </button>
//             )}
//             <button
//               onClick={handleDownload}
//               className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors"
//               title={`Download ${content?.videos?.length > 0 ? "video" : "image"}`}
//             >
//               <Download className="w-5 h-5 text-white" />
//             </button>
//           </div>
//         </div>
//       {/* )} */}
//     </div>
//   )
// }

export default function ContentCard({ content }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isGoogleDriveVideo, setIsGoogleDriveVideo] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (content?.videos?.length > 0) {
      const url = content.videos[0];
      const isGDrive = isGoogleDriveUrl(url);
      setIsGoogleDriveVideo(isGDrive);
      setMediaUrl(isGDrive ? getGoogleDriveDirectUrl(url, "video") : url);
    } else if (content?.thumbnail) {
      setMediaUrl(getGoogleDriveDirectUrl(content.thumbnail));
    }
  }, [content]);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current
          .play()
          .catch((error) => console.error("Error playing video:", error));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  useEffect(() => {
    if (isGoogleDriveVideo && iframeRef.current) {
      const message = isHovered ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow.postMessage(
        `{"event":"command","func":"${message}","args":""}`,
        "*"
      );
    }
  }, [isHovered, isGoogleDriveVideo]);

  const renderHashtags = () => {
    if (!content.hashtags) return null;

    const tags = Array.isArray(content.hashtags)
      ? content.hashtags
      : content.hashtags.split(",");

    return tags.map((tag, index) => (
      <span
        key={index}
        className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
      >
        #{tag.trim()}
      </span>
    ));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const url =
      content?.videos?.length > 0
        ? isGoogleDriveVideo
          ? getGoogleDriveDirectUrl(content.videos[0], "download")
          : content.videos[0]
        : mediaUrl;

    const link = document.createElement("a");
    link.href = url;
    link.download = `${content.title || "download"}.${
      content?.videos?.length > 0 ? "mp4" : "jpg"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content?.videos?.length > 0 ? (
        <div className="relative w-full h-full z-50">
          {isGoogleDriveVideo ? (
            <iframe
              ref={iframeRef}
              src={`${mediaUrl}?enablejsapi=1&controls=0&modestbranding=1&rel=0`}
              allow="autoplay"
              className="w-full h-full object-cover"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={mediaUrl}
              muted
              loop
              playsInline
              preload="auto"
            />
          )}
          <button
            onClick={() =>
              handleDownload(
                videoUrl,
                `video-${content.title || "download"}.mp4`
              )
            }
            className="absolute bottom-4 right-4 bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors"
            title="Download video"
          >
            {" "}
            <Download className="w-5 h-5 text-white" />{" "}
          </button>{" "}
        </div>
      ) : content?.thumbnail ? (
        <Image
          src={mediaUrl || "/placeholder.svg"}
          alt={content.title || "Thumbnail"}
          layout="fill"
          objectFit="cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          No video or thumbnail available
        </div>
      )}

      {isHovered && (
        <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-between transition-all duration-200">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {content.title}
            </h3>
            <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors z-10"
              title={`Download ${
                content?.videos?.length > 0 ? "video" : "image"
              }`}
            >
              <Download className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
