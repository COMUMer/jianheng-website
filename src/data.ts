export type Service = {
  id: string
  index: string
  title: string
  description: string
  tags: string[]
  image?: string
}

export type Scenario = {
  id: string
  number: string
  label: string
  category: string
  title: string
  description: string
  tags: string[]
  steps: [string, string, string]
  service: string
}

export type Principle = {
  number: string
  word: string
  title: string
  text: string
}

export const navigation = [
  { id: 'home', label: '首页' },
  { id: 'scenarios', label: '解决方案' },
  { id: 'about', label: '关于见衡' },
]

export const statements = [
  { index: '01', title: '软件 × AI', text: '以工程承载创新' },
  { index: '02', title: '从想法到应用', text: '聚焦真实业务问题' },
  { index: '03', title: '共创长期价值', text: '让产品与业务一起生长' },
]

export const services: Service[] = [
  {
    id: 'software',
    index: '01',
    title: '定制软件开发',
    description: '从业务需求出发，打造好用、稳定、可持续迭代的软件产品。',
    tags: ['Web 应用', '企业管理系统', '小程序 / 移动端'],
    image: '/images/platform-scene.jpg',
  },
  {
    id: 'ai',
    index: '02',
    title: 'AI 应用开发',
    description: '将大模型能力融入真实场景，让 AI 从一个概念变成你的生产力。',
    tags: ['智能体 Agent', '企业知识库', '大模型应用集成'],
    image: '/images/workshop-card.jpg',
  },
  {
    id: 'digital',
    index: '03',
    title: '企业数字化',
    description: '连接分散的数据与业务流程，让团队协作更顺畅，让决策有据可依。',
    tags: ['流程自动化', '数据可视化', '系统集成'],
    image: '/images/shenzhen-card.jpg',
  },
  {
    id: 'consulting',
    index: '04',
    title: '技术咨询与共创',
    description: '从想法验证到架构设计，与你一起找到适合业务的技术路径。',
    tags: ['产品规划', '技术架构', '持续迭代支持'],
  },
]

function serviceById(id: string) {
  const service = services.find(item => item.id === id)
  if (!service) throw new Error(`Unknown service: ${id}`)
  return service
}

export const defaultService = serviceById('ai').title
export const consultingService = serviceById('consulting')

export const scenarios: Scenario[] = [
  {
    id: 'knowledge',
    number: '01',
    label: '企业知识库',
    category: '智能问答',
    title: '让企业知识随问随答',
    description: '把分散的文档变成可检索的知识，让回答有据可查。',
    tags: ['知识检索增强 RAG', '智能问答', '来源可追溯'],
    steps: ['接入内部文档', '按权限检索知识', '回答并标注来源'],
    service: serviceById('ai').title,
  },
  {
    id: 'workflow',
    number: '02',
    label: '流程自动化',
    category: '业务协同',
    title: '把重复工作交给自动化流程',
    description: '连接表单、审批和业务系统，减少重复录入与手动流转。',
    tags: ['工作流编排', '智能文档处理', '系统连接'],
    steps: ['接收表单与文件', '提取信息并触发审批', '同步到业务系统'],
    service: serviceById('digital').title,
  },
  {
    id: 'analytics',
    number: '03',
    label: '智能数据分析',
    category: '经营洞察',
    title: '让数据回答业务问题',
    description: '汇总业务数据，用自然语言查询指标，并通过看板呈现结果。',
    tags: ['自然语言查询', '经营看板', '数据洞察'],
    steps: ['汇总各系统数据', '统一指标并分析', '生成可读的经营看板'],
    service: serviceById('digital').title,
  },
  {
    id: 'platform',
    number: '04',
    label: '定制业务平台',
    category: '软件开发',
    title: '为真实业务打造合适的系统',
    description: '按团队的工作方式，把客户管理、项目协作和权限统一到一个平台。',
    tags: ['客户管理', '项目协作', '权限与角色'],
    steps: ['梳理角色与需求', '设计统一业务平台', '交付并持续迭代'],
    service: serviceById('software').title,
  },
]

export const principles: Principle[] = [
  {
    number: '01',
    word: '洞察',
    title: '先理解问题，再选择技术。',
    text: '从使用者和业务的实际处境出发，厘清目标、约束与机会，让技术始终回应真正的需要。',
  },
  {
    number: '02',
    word: '求实',
    title: '让创新经得起日常使用。',
    text: '重视产品体验，也关注工程质量。通过原型、开发和验证，让每一步都向真实可用的结果靠近。',
  },
  {
    number: '03',
    word: '共创',
    title: '好的产品，来自持续对话。',
    text: '以坦诚清晰的沟通建立协作，在每个重要阶段共同判断，让产品与业务一起成长。',
  },
]

export const process = [
  { number: '01', title: '需求洞察', text: '一起理解业务，明确目标与边界。' },
  { number: '02', title: '方案共创', text: '用原型与技术方案，让想法清晰可见。' },
  { number: '03', title: '产品构建', text: '分阶段开发与验证，持续沟通进展。' },
  { number: '04', title: '交付迭代', text: '完成上线交付，陪伴产品持续演进。' },
]
