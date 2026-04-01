# Buddy Roller

A standalone CLI tool that rolls a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) buddy companion from your terminal.

The buddy system is a hidden companion feature inside Claude Code. Each buddy is deterministically generated from a seed — same seed, same buddy. This tool extracts the core generation algorithm and lets you roll buddies independently.

## Quick Start

```bash
# Prerequisites: Node.js (>= 20) or Bun (>= 1.1), pnpm
pnpm install
pnpm roll
```

## Usage

```bash
pnpm roll                            # Random roll
pnpm roll -- --seed "hello"          # Deterministic roll (same seed = same buddy)
pnpm roll -- --seed "hello" --json   # JSON output
pnpm roll -- --all-frames            # Show all 3 animation frames
pnpm roll -- --help                  # Help
```

### Example Output

```
────────────────────────────────────────
  🎲 BUDDY ROLLER
────────────────────────────────────────

   UNCOMMON  ★★

  Species  chonk (胖猫)
  Face     (·.·)
  Eye      ·
  Hat      tophat

  Sprite:
     [___]
    /\    /\
   ( ·    · )
   (   ..   )
    `------´

────────────────────────────────────────
  Stats
────────────────────────────────────────
  🔧 DEBUGGING  ███░░░░░░░░░░░░░░░░░  15
  🧘 PATIENCE   ███████████████████░  93
  🌀 CHAOS      █████████░░░░░░░░░░░  45
  📚 WISDOM     ████████░░░░░░░░░░░░  41
  💬 SNARK      █░░░░░░░░░░░░░░░░░░░   5

────────────────────────────────────────
  Seed: 770577bc-91c7-4a62-9ca1-2d6d777c401f
────────────────────────────────────────
```

## Buddy Attributes

| Attribute | Values |
|-----------|--------|
| **Rarity** | Common (60%) · Uncommon (25%) · Rare (10%) · Epic (4%) · Legendary (1%) |
| **Species** | duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk (18 total) |
| **Eyes** | `·` `✦` `×` `◉` `@` `°` |
| **Hats** | none, crown, tophat, propeller, halo, wizard, beanie, tinyduck |
| **Stats** | DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK (1–100) |
| **Shiny** | 1% chance |

## How It Works

1. A seed string is hashed (FNV-1a) into a 32-bit integer
2. The integer seeds a Mulberry32 PRNG
3. The PRNG deterministically picks rarity, species, eyes, hat, shiny, and stats
4. The result is rendered as an ASCII sprite in the terminal

No network requests. No API keys. Everything runs locally.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (>= 20) or [Bun](https://bun.sh/) (>= 1.1)
- **Language**: TypeScript
- **Bundler**: [tsdown](https://tsdown.dev/) (powered by [Rolldown](https://rolldown.rs/))
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Dependencies**: Zero runtime dependencies

## Project Structure

```
cc-buddy-roller/
├── package.json
├── tsconfig.json
├── tsdown.config.ts
├── README.md
├── README.zh-CN.md
└── src/
    ├── types.ts      # Type definitions & constants
    ├── roll.ts       # PRNG & generation algorithm
    ├── sprites.ts    # ASCII sprite rendering
    └── cli.ts        # CLI entry point
```

## Disclaimer

> **This project is for educational and research purposes only.**
>
> The buddy companion system, including all related algorithms, ASCII artwork,
> character designs, game mechanics, and associated intellectual property,
> is part of [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
> developed by [Anthropic, PBC](https://www.anthropic.com/). **All rights,
> title, and interest in the original work remain solely with Anthropic.**
>
> This repository is an independent extraction created strictly for
> non-commercial study, technical analysis, and personal learning. It is
> **not affiliated with, endorsed by, or sponsored by Anthropic** in any way.
>
> - You **may not** use this project or any derivative work for commercial purposes.
> - You **may not** redistribute, sublicense, or claim ownership of the
>   underlying algorithms or artwork.
> - You **should** refer to Anthropic's official
>   [Terms of Service](https://www.anthropic.com/terms) and
>   [Usage Policy](https://www.anthropic.com/usage-policy) for authoritative
>   guidance on permitted use.
>
> If you are a rights holder and believe this project infringes on your
> intellectual property, please open an issue and the repository will be
> promptly taken down.
>
> **USE AT YOUR OWN RISK.** The author(s) of this repository provide no
> warranty of any kind and accept no liability for any damages arising from
> the use of this software.

## License

No license is granted. See [Disclaimer](#disclaimer).
