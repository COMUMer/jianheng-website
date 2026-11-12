# 见衡科技企业官网

见衡（深圳）人工智能科技有限公司企业介绍网站，使用 React + TypeScript + Vite 开发。

首页由园区首屏、公司介绍、全宽解决方案轮播和项目合作组成。首屏下方的结构和动效参考深圳水务科技官网的存档。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```powershell
npm install
npm run dev
```

前端服务严格运行在 **5173 端口**：`http://localhost:5173/`。端口被占用时会报错，不会自动切换。局域网监听地址由 Vite 启动输出显示。

## 构建与生产预览

```powershell
npm run build
npm run preview
```

构建会先运行 TypeScript 检查，静态产物生成到 `dist/`。生产预览同样使用 5173 端口；运行前先停止开发服务。

## 页面与交互

- 首屏全宽园区图包含四个热点，点击后查看对应场景并进入解决方案；移动端提供并列快捷入口。
- 桌面解决方案导航设有下拉入口；移动端提供独立菜单。
- 公司介绍下的四个业务入口会预选对应的咨询方向。
- 解决方案滚动进入视口后自动轮播，支持暂停、预览下一张和键盘选取。切换时同时播放图像水波和文字过渡。
- 首图与热点采用滚动视差。桌面端的业务卡片依次上浮，大图从中间展开，项目合作区的交付航线随滚动进入视口后绘制。区块完全离开视口后会重置，回滚再次进入时动画会重播。手机端简化为淡入，页面支持减少动态效果设置。
- 项目咨询弹窗保留本地需求简报：校验、生成、复制、下载、返回修改；确认隐私说明后通过 Web3Forms 发送到项目邮箱，失败时保留简报并提供重试与邮件兜底。
- 键盘可达：跳转主内容、Esc 关闭弹窗/菜单、弹窗焦点约束、表单错误提示、`prefers-reduced-motion` 适配。

## 内容与接入说明

本项目为纯前端。表单通过 Web3Forms 发送到项目邮箱（`1203229935@qq.com`），未接入 CRM、数据库或用户追踪；Web3Forms 会保存提交记录，提交前必须同意隐私说明。Access Key 通过 `.env.local` 的 `VITE_WEB3FORMS_KEY` 提供；按 Web3Forms 的设计该 Key 会出现在前端，不要提交 `.env.local`。客户案例、营业数据、备案信息未获提供，因此未添加虚构内容。

正式运营时，可换用自有域名 + 服务端接口（例如 Cloudflare Pages Functions + Resend），并在 `src/components/ContactDialog.tsx` 中替换提交适配层；接入时同步调整隐私说明、数据保留期和跨境处理说明。

摄影来源和许可见 `ASSETS.md`。照片用于品牌与业务场景表达，不代表见衡自有办公场所、设备或客户项目。

## 主要文件

```text
index.html                          页面元信息与首屏图片预加载
src/App.tsx                         区块编排、滚动视差与入场触发
src/data.ts                         导航、服务与方案文案
src/sections/Header.tsx             桌面/移动导航
src/sections/Hero.tsx               园区场景、热点与手机快捷入口
src/sections/About.tsx              公司介绍与业务入口
src/sections/Scenarios.tsx          全宽方案轮播与换图动效
src/sections/Delivery.tsx           项目合作流程
src/sections/Footer.tsx             页脚
src/components/ContactDialog.tsx    本地需求简报与隐私说明
src/components/BrandMark.tsx        自绘品牌符号（可描边绘制）
src/components/Logo.tsx             企业标志
src/styles.css                      设计令牌、布局、响应式与动效
src/district.css                    页头与下拉导航样式
src/scene.css                       沉浸首屏、热点与青绿色主题
src/compact.css                     精简布局及视差、淡入与展开过渡
vite.config.ts                      5173 端口、监听与严格端口配置
public/images/                      园区示意图与已本地化的摄影素材
ASSETS.md                           素材来源、许可及园区生成提示词
```

原版页面代码留存于 `.qa/previous-design/`；该目录不参与构建。
