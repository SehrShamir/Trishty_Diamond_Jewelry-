"use client"

import * as React from "react"
import { Play, Pause } from "lucide-react"

type VideoSlideProps = {
  url: string
  type: "video" | "360"
}

const VideoSlide = ({ url, type }: VideoSlideProps) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  // Check if URL is a YouTube/Vimeo embed or a direct video file
  const isEmbed = url.includes("youtube") || url.includes("vimeo") || url.includes("youtu.be")

  if (isEmbed) {
    const embedUrl = getEmbedUrl(url)
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={type === "360" ? "360-degree product view" : "Product video"}
        />
      </div>
    )
  }

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50 cursor-pointer"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-gray-900 ml-1" />
          </div>
        </div>
      )}
      {isPlaying && (
        <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
            <Pause className="w-4 h-4 text-gray-900" />
          </div>
        </div>
      )}
    </div>
  )
}

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }

  return url
}

export default VideoSlide
