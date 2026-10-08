import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const guiSrc = 'C:/Users/DELL/OneDrive/Documents/ResponsivCode/erp-gui/src'
const outSrc = path.join(root, 'src')

function fixImports(content, outExt) {
  return content
    .replace(/from ['"](@\/[^'"]+)\.tsx['"]/g, "from '$1.jsx'")
    .replace(/from ['"](@\/[^'"]+)\.ts['"]/g, "from '$1.js'")
    .replace(/from ['"](\.[^'"]+)\.tsx['"]/g, "from '$1.jsx'")
    .replace(/from ['"](\.[^'"]+)\.ts['"]/g, "from '$1.js'")
    .replace(/import App from '\.\/App\.tsx'/g, "import App from './App.jsx'")
}

async function transpileFile(srcPath, destPath, loader) {
  const source = fs.readFileSync(srcPath, 'utf8')
  const result = await esbuild.transform(source, {
    loader,
    format: 'esm',
    jsx: 'automatic',
    target: 'esnext',
  })
  fs.writeFileSync(destPath, fixImports(result.code))
}

function walk(dir, rel = '') {
  const tasks = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const srcPath = path.join(dir, entry.name)
    const relPath = path.join(rel, entry.name)
    const destPath = path.join(outSrc, relPath)

    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      tasks.push(...walk(srcPath, relPath))
      continue
    }

    if (entry.name.endsWith('.tsx')) {
      const outPath = destPath.replace(/\.tsx$/, '.jsx')
      tasks.push(transpileFile(srcPath, outPath, 'tsx'))
    } else if (entry.name.endsWith('.ts')) {
      const outPath = destPath.replace(/\.ts$/, '.js')
      tasks.push(transpileFile(srcPath, outPath, 'ts'))
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
  return tasks
}

if (fs.existsSync(outSrc)) {
  fs.rmSync(outSrc, { recursive: true, force: true })
}
fs.mkdirSync(outSrc, { recursive: true })
await Promise.all(walk(guiSrc))
console.log('Ported src from erp-gui to frontend/src (JS via esbuild)')
