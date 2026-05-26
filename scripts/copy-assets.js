import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const sourceDir = join(process.cwd(), 'assets')
const outputDir = join(process.cwd(), 'dist', 'assets')

if (!existsSync(sourceDir)) {
  throw new Error(`Source assets folder not found: ${sourceDir}`)
}

mkdirSync(dirname(outputDir), { recursive: true })
cpSync(sourceDir, outputDir, { recursive: true })