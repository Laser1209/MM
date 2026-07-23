/**
 * PDF to PNG converter — converts first page of PDF to PNG thumbnail
 * Requires PyMuPDF (fitz): pip install PyMuPDF
 * Usage: node scripts/pdf2png.mjs <input.pdf> <output.png>
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const inputPath = process.argv[2]
const outputPath = process.argv[3]

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/pdf2png.mjs <input.pdf> <output.png>')
  process.exit(1)
}

const absInput = resolve(inputPath)
const absOutput = resolve(outputPath)

const script = `
import fitz
doc = fitz.open(${JSON.stringify(absInput)})
page = doc[0]
mat = fitz.Matrix(2, 2)
pix = page.get_pixmap(matrix=mat)
pix.save(${JSON.stringify(absOutput)})
doc.close()
print(f'Saved: {pix.width}x{pix.height}')
`

try {
  const output = execSync(`python -c ${JSON.stringify(script)}`, { encoding: 'utf-8' })
  console.log(output.trim())
} catch (err) {
  console.error('Error:', err.stderr || err.message)
  process.exit(1)
}
