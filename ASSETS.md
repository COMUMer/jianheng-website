# 图片与视觉来源

摄影素材来自 Pexels，按 [Pexels License](https://www.pexels.com/license/) 使用，已下载到项目内并做了统一裁剪与压缩。运行网站无需连接第三方图片服务。照片用于品牌氛围与业务场景表达，不代表见衡自有办公场所、设备或客户项目。

| 本地文件 | 作者 | 原始来源 |
| --- | --- | --- |
| `public/images/skyline-hero.jpg` | Ben Cheung | [Shenzhen city skyline at night](https://www.pexels.com/photo/city-skyline-during-night-time-11980026/) |
| `public/images/bridge-hero.jpg` | Ansel Bresson | [Aerial view of Shenzhen Bay Bridge and cityscape](https://www.pexels.com/photo/aerial-view-of-shenzhen-bay-bridge-and-cityscape-33469557/) |
| `public/images/sunset-hero.jpg` | Lywin | [Shenzhen Bay Bridge at sunset](https://www.pexels.com/photo/shenzhen-bay-bridge-from-shenzhen-to-hong-kong-17954340/) |
| `public/images/shenzhen-card.jpg` | Lywin | [Shenzhen skyline with China Resources Tower at dusk](https://www.pexels.com/photo/shenzhen-skyline-with-china-resources-tower-at-dusk-38833564/) |
| `public/images/team-card.jpg` | Pavel Danilyuk | [Team meeting](https://www.pexels.com/photo/man-in-white-long-sleeve-shirt-standing-beside-woman-in-red-long-sleeve-shirt-7869313/) |
| `public/images/workshop-card.jpg` | Artem Podrez | [Woman presenting at a meeting](https://www.pexels.com/photo/woman-presenting-at-a-meeting-8518733/) |
| `public/images/knowledge-scene.jpg` | Christina Morillo | [Developer working at multiple monitors](https://www.pexels.com/photo/close-up-photo-of-person-typing-on-laptop-1181675/) |
| `public/images/analytics-scene.jpg` | Jakub Zerdzicki | [Business workflow dashboard](https://www.pexels.com/photo/business-workflow-dashboard-with-tablet-and-monitors-38984817/) |
| `public/images/platform-scene.jpg` | Jakub Zerdzicki | [Programmer working on a laptop](https://www.pexels.com/photo/close-up-of-programmer-typing-code-on-laptop-36496927/) |

图标来自项目内已安装的 Lucide React。企业标志沿用原版自绘 SVG。

方案轮播首图 `public/images/shenzhen-ai-center.jpg`（1921 × 819）由内置 ImageGen 生成，画面是虚构的深圳湾软件研发中心。提示词为“2.35:1 的企业网站横幅摄影，左侧为玻璃幕墙外的深圳湾与城市天际线，右侧为现代软件研发工位和蓝色数据屏，日间自然光，无文字、标志和水印”。

首屏以下的双栏简介、全宽轮播、合作流程与波浪页脚参考[深圳水务科技官网存档](https://web.archive.org/web/20251209050711/https://www.sz-watech.com/)。本站使用见衡文案和本地配图。

项目合作区使用 `public/images/bridge-hero.jpg`（深圳湾大桥，无人物）作为交付航线的视觉背景，配图来自 Pexels，许可见上表。

版式参考 [腾讯官网](https://www.tencent.com/zh-cn/) 与 [字节跳动官网](https://www.bytedance.com/zh/)，重新设计见衡自身的页面结构、视觉和文案；未使用两站的品牌标识、企业照片、新闻、客户数据或公司事实。

## 数字业务园区首屏

- 本地文件：`public/images/business-district-hero.jpg`（1774 × 887，JPEG）。
- 使用内置 ImageGen 按下面的提示生成，再进行 JPEG 编码以减少首屏传输体积。画面为原创场景示意，不代表见衡实际园区。
- 布局参考 [深圳水务科技官网](https://www.sz-watech.com/) 的全宽俯视场景、透明导航与热点交互；图像、文案和业务入口使用见衡自己的内容。

最终生成提示词：

```text
Use case: stylized-concept
Asset type: full-bleed interactive website hero background for a Chinese enterprise software and AI company.
Create a high-end 3D architectural visualization of a lush modern Shenzhen-inspired technology district, viewed from above at a steep oblique angle (roughly 55 degrees down), orthographic/very low perspective distortion, clean real-estate digital-twin aesthetic. The city fills the frame edge to edge, with structures and boulevards cropped naturally at the edges; there is no skyline, horizon, sky, empty background, or floating platform. Show several low and mid-rise white concrete and teal-glass R&D buildings, two slender glass towers, intersecting slate gray streets with white lanes and a few tiny vehicles, green planted medians, a small public park, and a broad blue-green canal along the lower left crossed by a short pedestrian bridge. Make each city block visually coherent and distinct. Four anchor districts visible at roughly 25%/38%, 47%/58%, 63%/30%, 75%/65% of the image: a white campus, a landscaped collaboration hub, a tall glass data office, and a modern low-rise business center respectively. Fine-grained, realistic 3D materials, sharply detailed roofs, shaded tree canopies, soft daylight and crisp contact shadows. Modern calm corporate look: silver-white concrete, desaturated aquamarine glass and water, vibrant but credible emerald landscaping, pale slate roads. Top border slightly cooler/darker for a white overlay navigation, the rest of the scene bright. Ultra-wide landscape composition, target ratio roughly 2:1, rich city detail across all parts, at least 1536px wide. This is the image only: absolutely no text, pin markers, logos, web interface, captions, icons, decorative HUD or watermarks.
```
