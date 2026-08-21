import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/types"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useRef, useState } from "react"

const MAX_SIZE_MB = 50

type ProductMetadata = Record<string, unknown> | null

const getVideoUrl = (metadata: ProductMetadata): string | null => {
  if (!metadata || typeof metadata !== "object") return null
  const value = (metadata as Record<string, unknown>).video_url
  return typeof value === "string" && value.length > 0 ? value : null
}

const ProductVideoWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(
    getVideoUrl(data.metadata as ProductMetadata)
  )
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateMetadata = async (nextVideoUrl: string | null) => {
    const current = (data.metadata as Record<string, unknown> | null) ?? {}
    const merged: Record<string, unknown> = { ...current }
    if (nextVideoUrl) {
      merged.video_url = nextVideoUrl
    } else {
      delete merged.video_url
    }

    const res = await fetch(`/admin/products/${data.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ metadata: merged }),
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Failed to update product (${res.status}): ${body}`)
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file (MP4, WebM, etc).")
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Video must be under ${MAX_SIZE_MB}MB.`)
      return
    }

    setBusy(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const uploadRes = await fetch("/admin/uploads", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (!uploadRes.ok) {
        const body = await uploadRes.text()
        throw new Error(`Upload failed (${uploadRes.status}): ${body}`)
      }
      const payload = (await uploadRes.json()) as { files?: Array<{ url?: string }> }
      const url = payload.files?.[0]?.url
      if (!url) throw new Error("Upload response missing file URL")

      await updateMetadata(url)
      setVideoUrl(url)
      toast.success("Video uploaded")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed"
      toast.error(message)
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleRemove = async () => {
    if (!window.confirm("Remove the video from this product?")) return
    setBusy(true)
    try {
      await updateMetadata(null)
      setVideoUrl(null)
      toast.success("Video removed")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Remove failed"
      toast.error(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Product Video</Heading>
      </div>
      <div className="space-y-4 px-6 py-4">
        {videoUrl ? (
          <>
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              className="bg-ui-bg-subtle w-full max-w-md rounded-md"
            />
            <Text size="small" className="text-ui-fg-subtle break-all">
              {videoUrl}
            </Text>
            <div className="flex gap-x-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
              >
                {busy ? "Working…" : "Replace video"}
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={handleRemove}
                disabled={busy}
              >
                Remove video
              </Button>
            </div>
          </>
        ) : (
          <>
            <Text size="small" className="text-ui-fg-subtle">
              Upload an MP4 or WebM clip. It will appear in the storefront
              product gallery alongside the images. Max {MAX_SIZE_MB}MB.
            </Text>
            <Button
              variant="secondary"
              size="small"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "Uploading…" : "Upload video"}
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVideoWidget
