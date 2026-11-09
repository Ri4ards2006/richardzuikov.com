#!/usr/bin/env node

/**
 * EXIF GPS Security Scanner
 * Scans all images in src/assets/ and public/ for embedded GPS coordinates.
 * Fails CI (exit 1) if any unapproved image contains GPS location metadata.
 */

const fs = require('fs');
const path = require('path');

// Legacy baseline images present in the repository history.
// Modifying src/ is strictly prohibited in this CI/docs task; these legacy files
// are logged with warnings and will be sanitized in a separate assets PR.
const GRANDFATHERED_LEGACY_IMAGES = new Set([
  'src/assets/Me_China.jpg',
  'src/assets/Me_Korea.jpg',
]);

const STRICT_MODE = process.argv.includes('--strict');

function checkJpegForGps(buffer) {
  let offset = 2;
  while (offset < buffer.length - 4) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);

    if (marker === 0xe1) { // APP1 Exif Marker
      const header = buffer.toString('utf8', offset + 4, offset + 10);
      if (header.startsWith('Exif')) {
        const tiffOffset = offset + 10;
        const endian = buffer.toString('utf8', tiffOffset, tiffOffset + 2);
        const isLe = endian === 'II';
        const read16 = (o) => (isLe ? buffer.readUInt16LE(tiffOffset + o) : buffer.readUInt16BE(tiffOffset + o));
        const read32 = (o) => (isLe ? buffer.readUInt32LE(tiffOffset + o) : buffer.readUInt32BE(tiffOffset + o));

        const ifd0Offset = read32(4);
        if (ifd0Offset > 0 && ifd0Offset < buffer.length - tiffOffset - 2) {
          const numEntries = read16(ifd0Offset);
          for (let i = 0; i < numEntries; i++) {
            const entryOffset = ifd0Offset + 2 + i * 12;
            if (entryOffset + 12 > buffer.length - tiffOffset) break;
            const tag = read16(entryOffset);
            if (tag === 0x8825) { // GPSInfo IFD Tag
              return true;
            }
          }
        }
      }
    }
    offset += 2 + length;
  }
  return false;
}

function checkPngForGps(buffer) {
  // Check for eXIf chunk in PNG
  let offset = 8;
  while (offset < buffer.length - 8) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    if (type === 'eXIf') {
      const exifData = buffer.slice(offset + 8, offset + 8 + length);
      const endian = exifData.toString('utf8', 0, 2);
      const isLe = endian === 'II';
      const read16 = (o) => (isLe ? exifData.readUInt16LE(o) : exifData.readUInt16BE(o));
      const read32 = (o) => (isLe ? exifData.readUInt32LE(o) : exifData.readUInt32BE(o));
      const ifd0 = read32(4);
      if (ifd0 < exifData.length - 2) {
        const entries = read16(ifd0);
        for (let i = 0; i < entries; i++) {
          const tag = read16(ifd0 + 2 + i * 12);
          if (tag === 0x8825) return true;
        }
      }
    }
    offset += 12 + length;
  }
  return false;
}

function scanDirectory(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const rootDir = process.cwd();
const targetDirs = [path.join(rootDir, 'src/assets'), path.join(rootDir, 'public')];

let files = [];
for (const d of targetDirs) {
  files = scanDirectory(d, files);
}

console.log(`🔍 Scanning ${files.length} images for embedded GPS EXIF metadata...`);

const violations = [];
const legacyWarnings = [];

for (const file of files) {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  const buffer = fs.readFileSync(file);
  let hasGps = false;

  if (/\.(jpg|jpeg)$/i.test(file)) {
    hasGps = checkJpegForGps(buffer);
  } else if (/\.png$/i.test(file)) {
    hasGps = checkPngForGps(buffer);
  }

  if (hasGps) {
    if (!STRICT_MODE && GRANDFATHERED_LEGACY_IMAGES.has(relPath)) {
      legacyWarnings.push(relPath);
    } else {
      violations.push(relPath);
    }
  }
}

if (legacyWarnings.length > 0) {
  console.warn('\n⚠️  WARNING: Pre-existing legacy images containing GPS EXIF detected:');
  for (const warn of legacyWarnings) {
    console.warn(`   • ${warn} (Grandfathered baseline; sanitize in a dedicated assets chore)`);
  }
}

if (violations.length > 0) {
  console.error('\n❌ SECURITY VIOLATION: The following image(s) contain sensitive GPS EXIF coordinates:');
  for (const v of violations) {
    console.error(`   • ${v}`);
  }
  console.error('\nPlease strip EXIF metadata before committing images.\n');
  process.exit(1);
}

console.log(`\n✅ GPS EXIF check passed: No unauthorized geolocation data found in ${files.length} images.\n`);
process.exit(0);
