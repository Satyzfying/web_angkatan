import fs from 'fs';
import path from 'path';
import { svgPathBbox } from 'svg-path-bbox';

const evastraMapsDir = 'src/assets/maps/EvastraMaps';
const provinceJson = JSON.parse(fs.readFileSync('src/assets/maps/province.json', 'utf8'));
const offsetsJson = JSON.parse(fs.readFileSync('src/assets/maps/province-offsets.json', 'utf8'));

const provinceMapping = {
  "Aceh": "IDAC",
  "Bali": "IDBA",
  "Bangka Belitung": "IDBB",
  "Banten": "IDBT",
  "Bengkulu": "IDBE",
  "DKI Jakarta": "IDJK",
  "Gorontalo": "IDGO",
  "JaBar": "IDJB",
  "JaTim": "IDJI",
  "Jambi": "IDJA",
  "Jateng": "IDJT",
  "KalSel": "IDKS",
  "KalTeng": "IDKT",
  "KalTim": "IDKI",
  "KalUt": "IDKU",
  "Kalimantan Barat": "IDKB",
  "Kepulauan Riau": "IDKR",
  "Lampung": "IDLA",
  "Maluku Utara": "IDMU",
  "Maluku": "IDMA",
  "NTB": "IDNB",
  "NTT": "IDNT",
  "Papua Barat Daya": "IDPD",
  "Papua Barat": "IDPB",
  "Papua Pegunungan": "IDPE",
  "Papua Selatan": "IDPS",
  "Papua Tengah": "IDPT",
  "Papua": "IDPA",
  "Riau": "IDRI",
  "SulBar": "IDSR",
  "SulSel": "IDSN",
  "SulTengah": "IDST",
  "SulTenggara": "IDSG",
  "SulUt": "IDSA",
  "SumBar": "IDSB",
  "SumSel": "IDSS",
  "SumUt": "IDSU",
  "Yogya": "IDYO"
};

function extractPaths(svgContent) {
  const paths = [];
  const regex = /<path d="([^"]+)" fill="([^"]+)"/g;
  let match;
  while ((match = regex.exec(svgContent)) !== null) {
    const fill = match[2];
    if (fill === 'none' || fill === '#ffffff' || fill === '#000000' || !fill) continue;
    paths.push({
      d: match[1],
      fill: match[2]
    });
  }
  return paths;
}

function getPathsBoundingBox(paths) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const path of paths) {
    const b = svgPathBbox(path.d);
    minX = Math.min(minX, b[0]);
    minY = Math.min(minY, b[1]);
    maxX = Math.max(maxX, b[2]);
    maxY = Math.max(maxY, b[3]);
  }
  return { minX, minY, maxX, maxY };
}

function extractViewBox(svgContent) {
  const match = svgContent.match(/viewBox="([\d\.\s-]+)"/);
  if (match) {
    const parts = match[1].split(' ');
    return { w: parseFloat(parts[2]), h: parseFloat(parts[3]) };
  }
  return { w: 0, h: 0 };
}

const mapData = {
  svgWidth: 11185,
  svgHeight: 3579,
  provinces: []
};

for (const [filename, id] of Object.entries(provinceMapping)) {
  const svgPath = path.join(evastraMapsDir, `${filename}.svg`);
  if (!fs.existsSync(svgPath)) {
    console.error(`Missing SVG for ${filename}`);
    continue;
  }

  const content = fs.readFileSync(svgPath, 'utf8');
  const paths = extractPaths(content);
  const vb = extractViewBox(content);
  const bbox = getPathsBoundingBox(paths);

  const offset = offsetsJson[filename] || { x: 0, y: 0 };
  const provinceData = provinceJson[id] || { province: filename, totalMahasiswa: 0, fillClassName: '' };
  const area = (bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY);

  mapData.provinces.push({
    id,
    province: provinceData.province,
    totalMahasiswa: provinceData.totalMahasiswa,
    fillClassName: provinceData.fillClassName,
    x: offset.x,
    y: offset.y,
    width: vb.w,
    height: vb.h,
    centerX: offset.x + (bbox.minX + bbox.maxX) / 2,
    centerY: offset.y + (bbox.minY + bbox.maxY) / 2,
    area,
    paths
  });
}

mapData.provinces.sort((a, b) => b.area - a.area);

fs.writeFileSync('src/assets/maps/cartoon-map-data.json', JSON.stringify(mapData, null, 2));
console.log('Successfully generated cartoon-map-data.json');
