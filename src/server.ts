import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rollRandom, rollWithSeed } from './roll.js';
import { renderFace, renderSprite } from './sprites.js';
import { RARITY_STARS, STAT_NAMES, type StatName } from './types.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML = readFileSync(join(__dirname, '../public/index.html'), 'utf8');

const SPECIES_CN: Record<string, string> = {
  duck: '鸭子',
  goose: '鹅',
  blob: '史莱姆',
  cat: '猫',
  dragon: '龙',
  octopus: '章鱼',
  owl: '猫头鹰',
  penguin: '企鹅',
  turtle: '乌龟',
  snail: '蜗牛',
  ghost: '幽灵',
  axolotl: '六角恐龙',
  capybara: '水豚',
  cactus: '仙人掌',
  robot: '机器人',
  rabbit: '兔子',
  mushroom: '蘑菇',
  chonk: '胖猫',
};

const STAT_ICONS: Record<StatName, string> = {
  DEBUGGING: '🔧',
  PATIENCE: '🧘',
  CHAOS: '🌀',
  WISDOM: '📚',
  SNARK: '💬',
};

const server = createServer((req, res) => {
  if (!req.url || req.method !== 'GET') {
    res.writeHead(req.method === 'GET' ? 404 : 405);
    res.end();
    return;
  }

  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/roll') {
    const seedParam = url.searchParams.get('seed');

    let seed: string;
    let roll;

    if (seedParam) {
      seed = seedParam;
      roll = rollWithSeed(seed);
    } else {
      const result = rollRandom();
      seed = result.seed;
      roll = result.roll;
    }

    const allFrames = [0, 1, 2].map((f) => renderSprite(roll.bones, f));

    const body = JSON.stringify({
      seed,
      rarity: roll.bones.rarity,
      species: roll.bones.species,
      speciesCn: SPECIES_CN[roll.bones.species] ?? '',
      eye: roll.bones.eye,
      hat: roll.bones.hat,
      face: renderFace(roll.bones),
      shiny: roll.bones.shiny,
      stars: RARITY_STARS[roll.bones.rarity],
      stats: roll.bones.stats,
      statNames: STAT_NAMES,
      statIcons: STAT_ICONS,
      frames: allFrames,
    });

    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(body);
    return;
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(HTML);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎲 Buddy Roller web app → http://localhost:${PORT}`);
});
