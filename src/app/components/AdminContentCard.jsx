"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getGoogleDriveDirectUrl,
  isGoogleDriveUrl,
} from "../utils/googleDrive";

export default function AdminContentCard({ content, onContentSelect }) {
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

    if (Array.isArray(content.hashtags)) {
      return content.hashtags.map((tag, index) => (
        <span
          key={index}
          className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
        >
          #{tag.trim()}
        </span>
      ));
    }

    if (typeof content.hashtags === "string") {
      return content.hashtags.split(",").map((tag, index) => (
        <span
          key={index}
          className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
        >
          #{tag.trim()}
        </span>
      ));
    }

    return null;
  };

  const getThumbnailUrl = (url) => {
    if (!url) return "/placeholder.svg";
    return isGoogleDriveUrl(url) ? getGoogleDriveDirectUrl(url) : url;
  };

  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden bg-[#1f2937]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* <Image
        src={getThumbnailUrl(content.thumbnail) || "/placeholder.svg"}
        alt={content.title}
        width={400}
        height={225}
        className="w-full h-full object-cover"
      /> */}

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
        <div
          onClick={() => onContentSelect(content)}
          className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between transition-all duration-200"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {content.title}
            </h3>
            <div className="flex flex-wrap gap-2">{renderHashtags()}</div>
          </div>
          <Link
            href={`/content/${content._id}`}
            className="block w-full text-center bg-white text-black py-2 rounded hover:bg-gray-200 transition-colors"
          >
            View Details
          </Link>
        </div>
      )}
    </div>
  );
}
