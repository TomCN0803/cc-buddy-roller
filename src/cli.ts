#!/usr/bin/env bun
import { rollRandom, rollWithSeed, type Roll } from './roll.js'
import { renderFace, renderSprite } from './sprites.js'
import { RARITY_STARS, STAT_NAMES, type Rarity, type StatName } from './types.js'

// ── ANSI helpers (zero dependencies) ─────────────────────────────────
const ESC = '\x1b['
const RESET = `${ESC}0m`
const BOLD = `${ESC}1m`
const DIM = `${ESC}2m`
const _ITALIC = `${ESC}3m`

const fg = {
  gray: `${ESC}90m`,
  white: `${ESC}97m`,
  green: `${ESC}32m`,
  blue: `${ESC}34m`,
  magenta: `${ESC}35m`,
  yellow: `${ESC}33m`,
  cyan: `${ESC}36m`,
  red: `${ESC}31m`,
}

const bg = {
  gray: `${ESC}100m`,
  green: `${ESC}42m`,
  blue: `${ESC}44m`,
  magenta: `${ESC}45m`,
  yellow: `${ESC}43m`,
}

const RARITY_FG: Record<Rarity, string> = {
  common: fg.gray,
  uncommon: fg.green,
  rare: fg.blue,
  epic: fg.magenta,
  legendary: fg.yellow,
}

const RARITY_BG: Record<Rarity, string> = {
  common: bg.gray,
  uncommon: bg.green,
  rare: bg.blue,
  epic: bg.magenta,
  legendary: bg.yellow,
}

const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
}

const SPECIES_CN: Record<string, string> = {
  duck: '鸭子', goose: '鹅', blob: '史莱姆', cat: '猫', dragon: '龙',
  octopus: '章鱼', owl: '猫头鹰', penguin: '企鹅', turtle: '乌龟',
  snail: '蜗牛', ghost: '幽灵', axolotl: '六角恐龙', capybara: '水豚',
  cactus: '仙人掌', robot: '机器人', rabbit: '兔子', mushroom: '蘑菇',
  chonk: '胖猫',
}

const STAT_ICONS: Record<StatName, string> = {
  DEBUGGING: '🔧',
  PATIENCE: '🧘',
  CHAOS: '🌀',
  WISDOM: '📚',
  SNARK: '💬',
}

// ── Bar renderer ─────────────────────────────────────────────────────
function statBar(value: number, width = 20): string {
  const filled = Math.round((value / 100) * width)
  const empty = width - filled
  let color: string
  if (value >= 80) color = fg.green
  else if (value >= 50) color = fg.cyan
  else if (value >= 25) color = fg.yellow
  else color = fg.red
  return `${color}${'█'.repeat(filled)}${DIM}${'░'.repeat(empty)}${RESET}`
}

// ── Help ─────────────────────────────────────────────────────────────
function showHelp(): void {
  console.log(`
${BOLD}cc-buddy-roller${RESET} — Roll a Claude Code buddy companion

${BOLD}USAGE${RESET}
  cc-buddy-roller [options]

${BOLD}OPTIONS${RESET}
  --seed <string>    Use a specific seed (deterministic roll)
  --json             Output raw JSON instead of formatted display
  --all-frames       Show all 3 animation frames
  --help             Show this help message

${BOLD}EXAMPLES${RESET}
  cc-buddy-roller                     ${DIM}# Random roll${RESET}
  cc-buddy-roller --seed hello        ${DIM}# Deterministic roll${RESET}
  cc-buddy-roller --seed hello --json ${DIM}# JSON output${RESET}
  cc-buddy-roller --all-frames        ${DIM}# Show animation frames${RESET}
`)
}

// ── Parse args ───────────────────────────────────────────────────────
const args = process.argv.slice(2)
let seed: string | undefined
let jsonMode = false
let allFrames = false

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--seed':
      seed = args[++i]
      if (!seed) {
        console.error('Error: --seed requires a value')
        process.exit(1)
      }
      break
    case '--json':
      jsonMode = true
      break
    case '--all-frames':
      allFrames = true
      break
    case '--help':
    case '-h':
      showHelp()
      process.exit(0)
  }
}

// ── Roll ─────────────────────────────────────────────────────────────
let result: Roll
let usedSeed: string

if (seed) {
  result = rollWithSeed(seed)
  usedSeed = seed
} else {
  const r = rollRandom()
  result = r.roll
  usedSeed = r.seed
}

const { bones } = result

// ── JSON output ──────────────────────────────────────────────────────
if (jsonMode) {
  console.log(JSON.stringify({
    seed: usedSeed,
    species: bones.species,
    rarity: bones.rarity,
    eye: bones.eye,
    hat: bones.hat,
    shiny: bones.shiny,
    stats: bones.stats,
    face: renderFace(bones),
    sprite: renderSprite(bones, 0),
  }, null, 2))
  process.exit(0)
}

// ── Formatted output ─────────────────────────────────────────────────
const rarityColor = RARITY_FG[bones.rarity]
const rarityBg = RARITY_BG[bones.rarity]
const stars = RARITY_STARS[bones.rarity]
const speciesCn = SPECIES_CN[bones.species] ?? bones.species

const divider = `${DIM}${'─'.repeat(40)}${RESET}`

console.log()
console.log(divider)
console.log(`${BOLD}  🎲 BUDDY ROLLER${RESET}`)
console.log(divider)
console.log()

// Rarity badge
console.log(`  ${rarityBg}${BOLD} ${RARITY_LABEL[bones.rarity].toUpperCase()} ${RESET} ${rarityColor}${stars}${RESET}`)
console.log()

// Species
console.log(`  ${BOLD}Species${RESET}  ${bones.species} ${DIM}(${speciesCn})${RESET}`)
console.log(`  ${BOLD}Face${RESET}     ${renderFace(bones)}`)
console.log(`  ${BOLD}Eye${RESET}      ${bones.eye}`)
console.log(`  ${BOLD}Hat${RESET}      ${bones.hat === 'none' ? `${DIM}none${RESET}` : bones.hat}`)

if (bones.shiny) {
  console.log(`  ${fg.yellow}${BOLD}✨ SHINY!${RESET}`)
}

console.log()

// Sprite
console.log(`  ${DIM}Sprite:${RESET}`)
const sprite = renderSprite(bones, 0)
for (const line of sprite) {
  console.log(`  ${rarityColor}${line}${RESET}`)
}

// All frames
if (allFrames) {
  console.log()
  console.log(`  ${DIM}All frames:${RESET}`)
  for (let f = 0; f < 3; f++) {
    console.log(`  ${DIM}── frame ${f} ──${RESET}`)
    const frameLines = renderSprite(bones, f)
    for (const line of frameLines) {
      console.log(`  ${rarityColor}${line}${RESET}`)
    }
  }
}

console.log()
console.log(divider)
console.log(`  ${BOLD}Stats${RESET}`)
console.log(divider)

// Stats
for (const name of STAT_NAMES) {
  const val = bones.stats[name]
  const icon = STAT_ICONS[name]
  const label = name.padEnd(10)
  console.log(`  ${icon} ${BOLD}${label}${RESET} ${statBar(val)} ${BOLD}${String(val).padStart(3)}${RESET}`)
}

console.log()
console.log(divider)
console.log(`  ${DIM}Seed: ${usedSeed}${RESET}`)
console.log(`  ${DIM}Re-roll: pnpm roll -- --seed "${usedSeed}"${RESET}`)
console.log(divider)
console.log()
