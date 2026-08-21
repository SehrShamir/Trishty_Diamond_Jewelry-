import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/types"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useRef, useState } from "react"

const MAX_IMAGE_MB = 10
const MAX_VIDEO_MB = 50

type CategoryMetadata = Record<string, unknown> | null

type AdminCategory = {
  id: string
  metadata?: CategoryMetadata
}

const readField = (metadata: CategoryMetadata, key: string): string | null => {
  if (!metadata || typeof metadata !== "object") return null
  const value = (metadata as Record<string, unknown>)[key]
  return typeof value === "string" && value.length > 0 ? value : null
}

const CategoryMediaWidget = ({ data }: DetailWidgetProps<AdminCategory>) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    readField(data.metadata as CategoryMetadata, "image")
  )
  const [videoUrl, setVideoUrl] = useState<string | null>(
    readField(data.metadata as CategoryMetadata, "video_url")
  )
  const [busy, setBusy] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const patchMetadata = async (patch: Record<string, string | null>) => {
    const current = (data.metadata as Record<string, unknown> | null) ?? {}
    const merged: Record<string, unknown> = { ...current }
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) {
        delete merged[k]
      } else {
        merged[k] = v
      }
    }

    const res = await fetch(`/admin/product-categories/${data.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ metadata: merged }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Failed to update category (${res.status}): ${body}`)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("files", file)
    const res = await fetch("/admin/uploads", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Upload failed (${res.status}): ${body}`)
    }
    const payload = (await res.json()) as { files?: Array<{ url?: string }> }
    const url = payload.files?.[0]?.url
    if (!url) throw new Error("Upload response missing file URL")
    return url
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPEG, PNG, WebP).")
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_IMAGE_MB}MB.`)
      return
    }
    setBusy(true)
    try {
      const url = await uploadFile(file)
      await patchMetadata({ image: url })
      setImageUrl(url)
      toast.success("Image saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setBusy(false)
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file (MP4, WebM).")
      return
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video must be under ${MAX_VIDEO_MB}MB.`)
      return
    }
    setBusy(true)
    try {
      const url = await uploadFile(file)
      await patchMetadata({ video_url: url })
      setVideoUrl(url)
      toast.success("Video saved")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setBusy(false)
      if (videoInputRef.current) videoInputRef.current.value = ""
    }
  }

  const removeImage = async () => {
    if (!window.confirm("Remove the image from this category card?")) return
    setBusy(true)
    try {
      await patchMetadata({ image: null })
      setImageUrl(null)
      toast.success("Image removed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed")
    } finally {
      setBusy(false)
    }
  }

  const removeVideo = async () => {
    if (!window.confirm("Remove the video from this category card?")) return
    setBusy(true)
    try {
      await patchMetadata({ video_url: null })
      setVideoUrl(null)
      toast.success("Video removed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Home Card Media</Heading>
      </div>

      <div className="space-y-4 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle">
          Shown on the storefront homepage in the "Our Selections" grid. Upload
          a video to make the card auto-play. If no video is set, the image
          below is used. If neither is set, the first product&apos;s thumbnail
          is used.
        </Text>

        <div className="space-y-2">
          <Heading level="h3">Image</Heading>
          {imageUrl ? (
            <>
              <img
                key={imageUrl}
                src={imageUrl}
                alt="Category card"
                className="bg-ui-bg-subtle w-full max-w-xs rounded-md"
              />
              <Text size="small" className="text-ui-fg-subtle break-all">
                {imageUrl}
              </Text>
              <div className="flex gap-x-2">
                <Button variant="secondary" size="small" onClick={() => imageInputRef.current?.click()} disabled={busy}>
                  {busy ? "Working…" : "Replace image"}
                </Button>
                <Button variant="danger" size="small" onClick={removeImage} disabled={busy}>
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <Button variant="secondary" size="small" onClick={() => imageInputRef.current?.click()} disabled={busy}>
              {busy ? "Uploading…" : "Upload image"}
            </Button>
          )}
          <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        <div className="space-y-2">
          <Heading level="h3">Video</Heading>
          {videoUrl ? (
            <>
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                className="bg-ui-bg-subtle w-full max-w-xs rounded-md"
              />
              <Text size="small" className="text-ui-fg-subtle break-all">
                {videoUrl}
              </Text>
              <div className="flex gap-x-2">
                <Button variant="secondary" size="small" onClick={() => videoInputRef.current?.click()} disabled={busy}>
                  {busy ? "Working…" : "Replace video"}
                </Button>
                <Button variant="danger" size="small" onClick={removeVideo} disabled={busy}>
                  Remove
                </Button>
              </div>
            </>
          ) : (
            <Button variant="secondary" size="small" onClick={() => videoInputRef.current?.click()} disabled={busy}>
              {busy ? "Uploading…" : "Upload video"}
            </Button>
          )}
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.after",
})

export default CategoryMediaWidget
