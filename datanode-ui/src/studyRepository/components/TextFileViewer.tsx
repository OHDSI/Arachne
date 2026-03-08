import { useRef, useEffect } from "react"

interface TextFileViewerProps {
  content: string
  className?: string
}

export function TextFileViewer({ content, className }: TextFileViewerProps) {
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = 0
    }
  }, [content])

  return (
    <pre
      ref={preRef}
      className={`overflow-auto rounded border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words ${className ?? ""}`}
    >
      {content || "(empty file)"}
    </pre>
  )
}
