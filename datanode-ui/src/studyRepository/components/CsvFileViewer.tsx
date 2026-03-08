import { useMemo } from "react"
import { parse } from "papaparse"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

interface CsvFileViewerProps {
  content: string
  className?: string
}

/** Parse CSV string into headers and rows. */
function parseCsv(content: string): { headers: string[]; rows: Record<string, string>[] } {
  if (!content.trim()) return { headers: [], rows: [] }
  const parsed = parse(content, {
    header: true,
    skipEmptyLines: "greedy",
  })
  const rows = (parsed.data ?? []) as Record<string, string>[]
  const headers = (parsed.meta?.fields ?? (rows[0] ? Object.keys(rows[0]) : [])) as string[]
  return { headers, rows }
}

export function CsvFileViewer({ content, className }: CsvFileViewerProps) {
  const { headers, rows } = useMemo(() => parseCsv(content), [content])

  if (headers.length === 0 && rows.length === 0) {
    return (
      <div className={`rounded border border-border bg-muted/30 p-4 text-sm text-muted-foreground ${className ?? ""}`}>
        Empty or invalid CSV
      </div>
    )
  }

  return (
    <div className={`overflow-auto rounded border border-border ${className ?? ""}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h) => (
              <TableHead key={h} className="whitespace-nowrap font-medium">
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {headers.map((h) => (
                <TableCell key={h} className="max-w-[200px] truncate" title={String(row[h] ?? "")}>
                  {String(row[h] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
