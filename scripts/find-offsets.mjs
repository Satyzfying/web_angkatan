import fs from 'fs';
import path from 'path';
import { svgPathBbox } from 'svg-path-bbox';

const fullMapPath = 'src/assets/maps/indonesia-full.svg';
const evastraMapsDir = 'src/assets/maps/EvastraMaps';

function extractPaths(svgContent) {
  const paths = [];
  const regex = /<path d="([^"]+)" fill="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svgContent)) !== null) {
    paths.push({
      d: match[1],
      fill: match[2],
      bbox: svgPathBbox(match[1])
    });
  }
  return paths;
}

const fullSvg = fs.readFileSync(fullMapPath, 'utf8');
const fullPaths = extractPaths(fullSvg);

const offsets = {};

const files = fs.readdirSync(evastraMapsDir).filter(f => f.endsWith('.svg'));

for (const file of files) {
  const content = fs.readFileSync(path.join(evastraMapsDir, file), 'utf8');
  const individualPaths = extractPaths(content);

  if (individualPaths.length === 0) continue;

  individualPaths.sort((a, b) => {
    const areaA = (a.bbox[2] - a.bbox[0]) * (a.bbox[3] - a.bbox[1]);
    const areaB = (b.bbox[2] - b.bbox[0]) * (b.bbox[3] - b.bbox[1]);
    return areaB - areaA;
  });

  const targetPath = individualPaths[0];
  const targetW = targetPath.bbox[2] - targetPath.bbox[0];
  const targetH = targetPath.bbox[3] - targetPath.bbox[1];

  let bestMatch = null;
  let minDiff = Infinity;

  for (const fullPath of fullPaths) {
    if (fullPath.fill !== targetPath.fill) continue;

    const fullW = fullPath.bbox[2] - fullPath.bbox[0];
    const fullH = fullPath.bbox[3] - fullPath.bbox[1];

    const diff = Math.abs(targetW - fullW) + Math.abs(targetH - fullH);
    if (diff < minDiff) {
      minDiff = diff;
      bestMatch = fullPath;
    }
  }

  if (bestMatch && minDiff < 1) {
    const dx = bestMatch.bbox[0] - targetPath.bbox[0];
    const dy = bestMatch.bbox[1] - targetPath.bbox[1];

    if (individualPaths.length > 1) {
      const p2 = individualPaths[1];
      const p2W = p2.bbox[2] - p2.bbox[0];
      const p2H = p2.bbox[3] - p2.bbox[1];

      const expectedFullX = p2.bbox[0] + dx;
      const expectedFullY = p2.bbox[1] + dy;

      const match2 = fullPaths.find(fp =>
        fp.fill === p2.fill &&
        Math.abs((fp.bbox[2] - fp.bbox[0]) - p2W) < 1 &&
        Math.abs((fp.bbox[3] - fp.bbox[1]) - p2H) < 1 &&
        Math.abs(fp.bbox[0] - expectedFullX) < 1 &&
        Math.abs(fp.bbox[1] - expectedFullY) < 1
      );
      if (!match2) {
        console.warn(`Warning: second path mismatch for ${file}. Proceeding anyway.`);
      }
    }

    const provinceIdName = file.replace('.svg', '');
    offsets[provinceIdName] = { x: dx, y: dy };
  } else {
    console.error(`Could not find a match for ${file}! Min diff: ${minDiff}`);
  }
}

fs.writeFileSync('src/assets/maps/province-offsets.json', JSON.stringify(offsets, null, 2));
console.log('Successfully wrote province-offsets.json');
