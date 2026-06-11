import { NextRequest, NextResponse } from 'next/server'
import { getBCP } from '@/lib/db'
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType,
} from 'docx'
import { BCPRecord } from '@/lib/types'

function buildDocument(bcp: BCPRecord): Document {
  const content = bcp.generatedContent || ''
  const companyName = bcp.data?.company?.name || 'Your Business'
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Parse markdown-ish content into docx paragraphs
  const children: Paragraph[] = []

  // Title page
  children.push(
    new Paragraph({
      text: 'BUSINESS CONTINUITY PLAN',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [new TextRun({ text: companyName, size: 36, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Generated: ${today}`, size: 24, color: '666666' })],
      spacing: { after: 800 },
    }),
  )

  // Parse content lines
  const lines = content.split('\n')
  let inList = false

  for (const line of lines) {
    if (!line.trim()) {
      if (inList) inList = false
      children.push(new Paragraph({ spacing: { after: 80 } }))
      continue
    }

    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        text: line.slice(2).trim(),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: { bottom: { color: '003078', size: 8, style: BorderStyle.SINGLE } },
      }))
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        text: line.slice(3).trim(),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
      }))
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        text: line.slice(4).trim(),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }))
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      children.push(new Paragraph({
        bullet: { level: 0 },
        children: [new TextRun({ text: line.slice(2).trim() })],
        spacing: { after: 60 },
      }))
      inList = true
    } else if (/^\d+\. /.test(line)) {
      children.push(new Paragraph({
        numbering: { reference: 'default-numbering', level: 0 },
        children: [new TextRun({ text: line.replace(/^\d+\. /, '').trim() })],
        spacing: { after: 60 },
      }))
    } else if (line.startsWith('**') && line.endsWith('**')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.slice(2, -2), bold: true })],
        spacing: { after: 100 },
      }))
    } else {
      // Inline bold handling
      const parts = line.split(/(\*\*[^*]+\*\*)/)
      const runs = parts.map(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return new TextRun({ text: part.slice(2, -2), bold: true })
        }
        return new TextRun({ text: part })
      })
      children.push(new Paragraph({
        children: runs,
        spacing: { after: 100 },
      }))
    }
  }

  return new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { line: 276 } },
        },
      },
    },
    sections: [{ children }],
  })
}

export async function POST(req: NextRequest) {
  const { bcpId } = await req.json()
  const bcp = await getBCP(bcpId)

  if (!bcp || !bcp.generatedContent) {
    return NextResponse.json({ error: 'BCP not found or not generated' }, { status: 404 })
  }

  const doc = buildDocument(bcp)
  const buffer = await Packer.toBuffer(doc)

  const companyName = bcp.data?.company?.name?.replace(/[^a-z0-9]/gi, '-') || 'BCP'
  const filename = `BCP-${companyName}.docx`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
