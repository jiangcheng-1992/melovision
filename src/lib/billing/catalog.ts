export type BillingCycle = "monthly" | "yearly";

export type PlanCatalogItem = {
  code: "free" | "creator" | "pro";
  name: string;
  subtitle: string;
  monthlyPriceCny: number;
  yearlyPriceMonthlyEquivalentCny: number;
  monthlyCredits: number;
  featured: boolean;
  titleClass: string;
  buttonClass: string;
  ctaByCycle: Record<BillingCycle, string>;
  features: Array<{ label: string; enabled: boolean; emphasis?: boolean }>;
};

export type CreditCostItem = {
  action: string;
  cost: number;
  free?: boolean;
};

export const PLAN_CATALOG: PlanCatalogItem[] = [
  {
    code: "free",
    name: "入门版",
    subtitle: "适合体验核心功能",
    monthlyPriceCny: 0,
    yearlyPriceMonthlyEquivalentCny: 0,
    monthlyCredits: 10,
    featured: false,
    titleClass: "text-on-surface",
    buttonClass:
      "border border-[#4a4455]/30 text-[#e5e0f3] hover:bg-[#363342] hover:border-[#4a4455]/50",
    ctaByCycle: {
      monthly: "免费开始",
      yearly: "免费开始",
    },
    features: [
      { label: "10 积分/月", enabled: true },
      { label: "720p 分辨率", enabled: true },
      { label: "基础音乐风格", enabled: true },
      { label: "带水印输出", enabled: true },
      { label: "社区广场访问", enabled: true },
      { label: "优先生成队列", enabled: false },
      { label: "API 访问", enabled: false },
    ],
  },
  {
    code: "creator",
    name: "创作者版",
    subtitle: "释放你的无限创意",
    monthlyPriceCny: 29,
    yearlyPriceMonthlyEquivalentCny: 23,
    monthlyCredits: 100,
    featured: true,
    titleClass: "text-[#d2bbff]",
    buttonClass:
      "bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] text-[#ede0ff] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)]",
    ctaByCycle: {
      monthly: "按月订阅",
      yearly: "立即订阅",
    },
    features: [
      { label: "100 积分/月", enabled: true },
      { label: "1080p 分辨率", enabled: true },
      { label: "所有音乐风格", enabled: true },
      { label: "无水印输出", enabled: true },
      { label: "优先队列", enabled: true },
      { label: "高级视觉风格", enabled: true },
      { label: "字幕自定义", enabled: true },
      { label: "API 访问", enabled: false },
    ],
  },
  {
    code: "pro",
    name: "专业版",
    subtitle: "为商业工作室打造",
    monthlyPriceCny: 79,
    yearlyPriceMonthlyEquivalentCny: 63,
    monthlyCredits: 400,
    featured: false,
    titleClass: "text-[#4cd7f6]",
    buttonClass:
      "border border-[#4cd7f6]/20 bg-[#363342] text-[#4cd7f6] hover:bg-[#4a4455]",
    ctaByCycle: {
      monthly: "按月开通专业版",
      yearly: "开启专业版",
    },
    features: [
      { label: "400 积分/月", enabled: true },
      { label: "包含创作者版所有功能", enabled: true, emphasis: true },
      { label: "API 访问", enabled: true },
      { label: "批量生成", enabled: true },
      { label: "自定义风格上传", enabled: true },
      { label: "最高优先级队列", enabled: true },
      { label: "商业使用权", enabled: true },
      { label: "邮件支持", enabled: true },
    ],
  },
];

export const CREDIT_COST_CATALOG: CreditCostItem[] = [
  { action: "生成音乐 (3个候选)", cost: 5 },
  { action: "生成完整视频 MV", cost: 20 },
  { action: "重新生成单个分镜", cost: 2 },
  { action: "下载 1080p (无水印)", cost: 5 },
  { action: "下载 720p (带水印)", cost: 0, free: true },
];

export function getPlanByCode(code: string) {
  return PLAN_CATALOG.find((plan) => plan.code === code) ?? PLAN_CATALOG[0];
}
