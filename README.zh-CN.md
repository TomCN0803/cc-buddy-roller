# Buddy Roller

一个独立的命令行工具，用于抽取 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 中隐藏的 Buddy 伙伴角色。

Claude Code 内置了一套隐藏的伙伴系统，每个 Buddy 都由种子（seed）确定性生成——相同的种子永远产出相同的 Buddy。本工具提取了其核心生成算法，让你可以在终端里独立抽卡。

## 快速开始

```bash
# 前置要求：Bun (>= 1.1)、pnpm
pnpm install
pnpm roll
```

## 使用方式

```bash
pnpm roll                            # 随机抽一个
pnpm roll -- --seed "hello"          # 指定种子（同种子 = 同结果）
pnpm roll -- --seed "hello" --json   # 输出 JSON 格式
pnpm roll -- --all-frames            # 展示全部 3 帧动画
pnpm roll -- --help                  # 查看帮助
```

### 示例输出

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

## Buddy 属性一览

| 属性 | 可选值 |
|------|--------|
| **稀有度** | Common 普通 (60%) · Uncommon 稀有 (25%) · Rare 珍贵 (10%) · Epic 史诗 (4%) · Legendary 传说 (1%) |
| **物种** | duck 鸭子、goose 鹅、blob 史莱姆、cat 猫、dragon 龙、octopus 章鱼、owl 猫头鹰、penguin 企鹅、turtle 乌龟、snail 蜗牛、ghost 幽灵、axolotl 六角恐龙、capybara 水豚、cactus 仙人掌、robot 机器人、rabbit 兔子、mushroom 蘑菇、chonk 胖猫（共 18 种） |
| **眼睛** | `·` `✦` `×` `◉` `@` `°`（共 6 种） |
| **帽子** | 无、皇冠、礼帽、螺旋桨帽、光环、巫师帽、毛线帽、头顶小鸭子（共 8 种） |
| **属性值** | DEBUGGING 调试、PATIENCE 耐心、CHAOS 混沌、WISDOM 智慧、SNARK 毒舌（范围 1–100） |
| **闪光** | 1% 概率触发 |

## 工作原理

1. 将种子字符串通过 FNV-1a 算法哈希为 32 位整数
2. 用该整数初始化 Mulberry32 伪随机数生成器
3. 依次确定性抽取：稀有度、物种、眼睛、帽子、闪光、五项属性值
4. 渲染为 ASCII 像素画输出到终端

全程离线运行，不需要网络请求，不需要 API Key。

## 技术栈

- **运行时**：[Bun](https://bun.sh/) (>= 1.1)
- **语言**：TypeScript
- **包管理**：[pnpm](https://pnpm.io/)
- **运行时依赖**：无（零依赖）

## 项目结构

```
cc-buddy-roller/
├── package.json
├── tsconfig.json
├── README.md          # 英文文档
├── README_CN.md       # 中文文档
└── src/
    ├── types.ts       # 类型定义与常量
    ├── roll.ts        # 伪随机数生成与抽取算法
    ├── sprites.ts     # ASCII 像素画渲染
    └── cli.ts         # 命令行入口
```

## 免责声明

> **本项目仅供学习交流使用，请勿用于任何商业用途。**
>
> Buddy 伙伴系统的全部内容——包括但不限于生成算法、ASCII 美术素材、角色设计、
> 游戏机制及一切相关知识产权——均属于
> [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 的开发方
> [Anthropic, PBC](https://www.anthropic.com/)。
> **相关原始作品的一切权利、所有权和权益归 Anthropic 所有。**
>
> 本仓库是出于个人学习、技术研究和非商业目的而独立提取整理的，
> **与 Anthropic 公司没有任何关联、合作或授权关系**。
>
> - **禁止**将本项目或其衍生作品用于任何商业目的。
> - **禁止**对底层算法或美术素材进行再分发、转授权或声称拥有其所有权。
> - 如需了解使用许可的权威说明，请参阅 Anthropic 官方的
>   [服务条款](https://www.anthropic.com/terms) 和
>   [使用政策](https://www.anthropic.com/usage-policy)。
>
> 如果您是相关权利人，认为本项目侵犯了您的知识产权，请通过 Issue 联系我们，
> 我们会在第一时间予以处理并下架。
>
> **风险自负。** 本仓库的作者不提供任何形式的担保，亦不对因使用本软件而产生的
> 任何损失承担责任。

## 许可证

本项目不授予任何许可。请参阅[免责声明](#免责声明)。
