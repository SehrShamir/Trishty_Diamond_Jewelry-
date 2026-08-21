import { Container } from "@medusajs/ui"

const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <Container className="aspect-[1/1] w-full bg-gray-200 animate-pulse bg-ui-bg-subtle rounded-2xl" />
      <div className="flex flex-col items-center mt-4 gap-1">
        <div className="w-3/5 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-1/4 h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonProductPreview
