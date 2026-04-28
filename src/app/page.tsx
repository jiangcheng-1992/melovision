import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clapperboard,
  FilePenLine,
  Layers3,
  Palette,
  Play,
  Share2,
  Sparkles,
  Star,
  Subtitles,
  Wand2,
} from "lucide-react";
import { MarketingTopbar } from "@/components/site/marketing-topbar";

const socialProof = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTezTOTy401VganBMpZMYokf3xTgNRnnJuYyr_VEKyUQBw_hNVzDExoaP78Edxau0oGBBOJlJR--EFXw4fnQ4gEj_25qyiuCieiz9MWd_lMZhTn56dMq5p4T579-J480KnMLfHw4RqH76JxKp3e1nd_WdWnX0X7WzdBQgi6PBs49hiCrTytBREIm5Z83CfnFXdYdJvXUnMMSksajhvtYuEeH_ElO8dwSQ8FpUop_RnY2UcTgRTIhh7UoUwDdioWQgEAcdcyQkG_Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3l_xw54uqANnGYLJh-TPgymD4zDeC_JlP_eFrYXmcD4U2dmaHCAyw2t50ytLXqzYhyDrqkhE9EMINr8i2zb-e5HN_E5pztl_P5sjVr0YOdqMmeunMFKtxOWcSnmqsF_6OEEnCLSh_Dnyn5OKcRNzIr4BS8owwA5qt1rJUUyDJ-7JQ1BxSx8N7LO7GTJYHJVtlWeOOR1thFjfk59pF7vI4wZoMDbSZGbVR1cEUJHZemdvyiF_tqchC57_gQKHo1Mth3LzlT_suQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKtRHuvR-AaoDZJBgR4wrVIN0T0l1OnoCC0Oa7gOYc9cbc1GOvMTNk19-yLsQu7Q1ealdAno47Ue-H_kbJobxOiNZZYW5sxUPxlIP1u1J7VllCLj0zjU48_g8VXwzbbavGiZD0-netFusIrN8Z1JjaPevWH4n2dIP8HHkYnKpN2hez1mWNaeJvi1v_111KdBVLGJSoD6kzylFHFmW6CpNHfuvQFIDj-9ljxDACp3bvswoEcz7SxdB9K-5aiDAJX1VPeL5j9YzCOg",
];

const steps = [
  {
    title: "1. 描述您的愿景",
    description: "输入几句话来描述您想要的情绪、流派和视觉效果。",
    number: "1",
    icon: Sparkles,
    accent: "#d2bbff",
    badgeBg: "#d2bbff",
    badgeText: "#3f008e",
  },
  {
    title: "2. AI 生成音乐与视觉",
    description: "我们的引擎会自动生成高保真歌词、旋律和电影级镜头。",
    number: "2",
    icon: Clapperboard,
    accent: "#4cd7f6",
    badgeBg: "#4cd7f6",
    badgeText: "#003640",
  },
  {
    title: "3. 下载与分享",
    description: "导出 4K 视频，在所有社交平台与您的粉丝分享大作。",
    number: "3",
    icon: Share2,
    accent: "#ffb690",
    badgeBg: "#ffb690",
    badgeText: "#552100",
  },
];

const showcases = [
  {
    title: "霓虹之夜",
    tags: ["赛博朋克", "流行"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGgQ_KpQ9OF6IgomXM3H7-aMBp9YvZVRGiAsz9nvOlityvapGahYOJ6h23VL0AunrTrqCPrNylPNjoqot5EDwY1qv_gxPxoBw9jViD60yoaCyr-k52MwnUHmJhL-nKpMIGEEcjSg-Hbg0KuxbB2a71DPJchKc1SPcD36qrMgw5idiUyRLnjJDsi40HBvqWMpeXZksKQ4KfqGdlPJl_Z8GiCiAvIpGrpwt643Riq-19Q32HS1lnJM8BCB1z8iKavK8juIaSG6qOYA",
  },
  {
    title: "午夜爵士",
    tags: ["Lo-Fi", "爵士"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAE5EzAMHuYstj7ZcDl4z0waxdxJul3XULFUeq75jukeZ5XBa5X0ikZv3cHUjc438rFK6UwYsainA8gfxnyQzsIUr5Ta98YHMKt34Jbqv_icA2hyZ02O8CIHItugqfvLbmw3Gf-HQvrnDLf_NXC84vPIXaIZeye5a792eRL8SDut6lz5mQlUAz9xGZ2mW2flDrov3XQfmlWRjuoKWGnd5oluUWi0gBligfOnodivQzCtLT8CC_BJ_2w6nuA6b4GSn1fm7B8K-dkTQ",
  },
  {
    title: "空灵盛放",
    tags: ["抽象", "梦幻流行"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB28trpvkUDrgp7Hdc25byzQ2dplSn-IXm2pSDBOdIJ5fQrOgzhphOl3TYuj7JZF-mSPcZUsKKyvYN_ecP9fWoEsh7zeLLFqVMoGucD_WGce1572KnucAWDfNsk_4y58_ppd-CeYukavxbjNqSXuzqVm3C57eJzHoqfy-l8RyRjQ8MI5dQrqrt7dAmvBhOkvNarVF7q-LjG1nqALnNLvbHlyVP64KIqx5l1KuNSu_BBbJg7k5YIOAWbrlRfCC6jahRLYP5GlkKKig",
  },
];

const features = [
  {
    title: "AI 词曲创作",
    description: "根据您的独特主题生成朗朗上口的副歌和深情的歌词。",
    icon: FilePenLine,
    color: "#d2bbff",
  },
  {
    title: "智能分镜",
    description: "AI 自动规划视觉序列，与歌曲的能量节奏完美同步。",
    icon: Wand2,
    color: "#4cd7f6",
  },
  {
    title: "风格库",
    description: "20 多种截然不同的视觉风格可选，从动漫到黑色电影应有尽有。",
    icon: Palette,
    color: "#ffb690",
  },
  {
    title: "歌词同步",
    description: "动态文字排版，能够对音轨的节奏和节拍做出实时反应。",
    icon: Subtitles,
    color: "#d2bbff",
  },
  {
    title: "多版本生成",
    description: "为一首歌生成多个视觉版本，直到找到最完美的那一个。",
    icon: Layers3,
    color: "#4cd7f6",
  },
  {
    title: "一键分享",
    description: "立即以正确的格式发布到 YouTube、TikTok 和 Instagram。",
    icon: Share2,
    color: "#ffb690",
  },
];

const plans = [
  {
    name: "免费版",
    subtitle: "探索无限可能",
    price: "¥0",
    cta: "开始使用",
    featured: false,
    items: ["每月 3 个视频", "720p 分辨率", "标准风格"],
  },
  {
    name: "基础版",
    subtitle: "适合新兴艺人",
    price: "¥29",
    cta: "选择基础版",
    featured: false,
    items: ["每月 15 个视频", "1080p 全高清", "高级风格", "无水印"],
  },
  {
    name: "Pro 版",
    subtitle: "完全掌握创意控制权",
    price: "¥79",
    cta: "立即获取 Pro 版",
    featured: true,
    items: ["无限制视频生成", "4K 超高清质量", "自定义风格训练", "优先渲染", "API 接入权限"],
  },
];

const testimonials = [
  {
    name: "Marcus Chen",
    role: "独立音乐人",
    quote:
      "MeloVision 改变了我 YouTube 频道的运营规则。现在我可以在一小时内为我的新歌制作出高质量的 MV。",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLYZ-UGapWNgXJJC0nJaa3duvU4a5me7yFEXjqRpb2TW9brGcJB-JSti_WEgGjnR2H69o71ns8NF-3uJGOpvNj_lNdzZNCcDpQ8TPPLpkn0OIPZ7ywqvEnCa9ti3z2e1Vx99SDKdIyiwEl9zsxlMdQk2HyB5ZIrne_jv9C7QCNH23IWbBtoEHwbg4_ZaiMGP8MUyQxy0sr4wXM_RscAaTCNA8bEYDyN4-gEifPIiKrAYjVFqLqWdulfDfMwaMGMPi5pZIpIiLbGg",
  },
  {
    name: "Sarah Jenkins",
    role: "视觉总监",
    quote:
      "视觉质量令人难以置信。这不仅仅是随机的 AI 艺术；它真正理解音乐的节奏和灵魂。",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmMrxtprkvL_KbvddtRC3m6gwGOwv9bSR2Q0mSfDNmot_erjEN_eL7tSCVSRAIWP6EVtfUyNLyMbgzOtRbiFfQ4P71wl346rFCiKNK2rIfFAZyX_dejKkw4D7_C1Zw3V7-0fXDBwNeEaxnMZPwvH1KXd6BCkR9nzSj8Rdy3KksH_RVglIrf--4Cy78W2-InTxJSCYzpEJJ30e7xiva4Jo43GY02I2Z1-Qdv-phR2X5mLNT4ne8t66DxPl7px2pSAhrrPqnPwa4fg",
  },
  {
    name: "Leo Rivera",
    role: "TikTok 创作者",
    quote:
      "智能分镜功能就像有一个全天候工作的专业视频编辑在身边。简直太棒了。",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA3vOQR6Z4X8yxXb1uiu7ceD-OQNfb7p-8vmgTc6i5Ai46XJkKyGDxdLWp3rVGl8sdJPCHyyEALmM3foPCX9CrPO-YbMCn2IP7d6Dzg9YhlEkg00J06ClioBTk70UStQWj2iHtu1HIkWwHe9xn2T0X1uipkZHv1ro8oO3-ZcFBE3kCnBXIZ9HdIU09SQtIH2E2c_BhEkw6OcrJO0EWTvMp1Uc9VTMMzPYlKnHiZHBhe_a5nS0a8TYMxD3WjqFHQ-6Qf1WRECWonvg",
  },
];

const footerColumns = [
  {
    title: "平台",
    items: [
      { label: "作品展示", href: "/" },
      { label: "功能特性", href: "/interfaces/create" },
      { label: "价格方案", href: "/interfaces/pricing" },
      { label: "API 文档", href: "/interfaces" },
    ],
  },
  {
    title: "资源",
    items: [
      { label: "教程", href: "/interfaces/create" },
      { label: "创作者博客", href: "/interfaces/explore" },
      { label: "帮助中心", href: "/interfaces/login" },
      { label: "社区", href: "/interfaces/explore" },
    ],
  },
  {
    title: "公司",
    items: [
      { label: "隐私政策", href: "/interfaces/register" },
      { label: "服务条款", href: "/interfaces/register" },
      { label: "Cookie 政策", href: "/interfaces/register" },
      { label: "联系支持", href: "/interfaces/login" },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#14121f] text-[#e5e0f3]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.16),transparent_24%),radial-gradient(circle_at_80%_24%,rgba(3,181,211,0.10),transparent_22%),linear-gradient(180deg,#1c1a27_0%,#14121f_25%,#14121f_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_0.6px,transparent_0.6px)] [background-size:12px_12px]" />

      <div className="relative z-10">
        <MarketingTopbar
          sourcePage="home"
          navItems={[
            { href: "/", label: "产品展示", active: true, sourcePage: "home" },
            { href: "/interfaces/explore", label: "作品广场", sourcePage: "home" },
            { href: "/interfaces/pricing", label: "价格方案", sourcePage: "home" },
            { href: "/interfaces/create", label: "工作台", sourcePage: "home" },
          ]}
          rightSlot={
            <>
              <Link
                href="/interfaces/login"
                className="hidden text-sm text-[#a9a2ba] transition-colors hover:text-[#f5f3ff] sm:block"
              >
                登录
              </Link>
              <Link
                href="/interfaces/register"
                className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.24)] transition hover:scale-[1.02]"
              >
                开始使用
              </Link>
            </>
          }
        />

        <main>
          <section className="relative flex min-h-[760px] items-center overflow-hidden px-6 pt-24 pb-20">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#d2bbff]/20 blur-[120px]" />
              <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#4cd7f6]/20 blur-[120px]" />
            </div>

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
              <div className="text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4a4455]/30 bg-[#363342]/35 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-[#4cd7f6]" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#4cd7f6]">
                    全新发布：歌词转视频引擎 2.0
                  </span>
                </div>

                <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
                  将灵感转化为{" "}
                  <span className="bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] bg-clip-text text-transparent">
                    AI 音乐 MV
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-8 text-[#e5e0f3]/70 md:text-xl">
                  数分钟内创作原创歌曲与惊艳视频。无需乐器，无需相机，只需您的想象力。
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/interfaces/register"
                    className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition hover:scale-[1.02]"
                  >
                    免费开始创作
                  </Link>
                  <Link
                    href="/interfaces/explore"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4a4455]/50 bg-[#363342]/35 px-8 py-4 font-semibold text-[#e5e0f3] backdrop-blur-md transition hover:bg-[#363342]/55"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    观看演示
                  </Link>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {socialProof.map((avatar) => (
                      <img
                        key={avatar}
                        src={avatar}
                        alt="creator"
                        className="h-10 w-10 rounded-full border-2 border-[#14121f] object-cover"
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-[#e5e0f3]/60">
                    深受 <span className="font-bold text-[#e5e0f3]">50,000+ 创作者</span> 的信赖
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#d2bbff]/20 to-[#4cd7f6]/20 blur-2xl transition-all group-hover:blur-3xl" />
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-[#4a4455]/50 bg-[#363342]/35 shadow-[0_0_40px_rgba(210,187,255,0.12)] backdrop-blur-md">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrExC2FI9GKByb2agMDtMFUS4QsLBNoRygdm_NX8YbijHReURvKIALq57JIKSySUkyUwzlhseJVz3uhedzpSr8cAT-DbVlNiS53Pybcgrpmn_7rqtXfcc07IFwUnDeYGbU7PXW4KOf-GmAH78rE6E5Qm9_rtJkkiTvXtR2BJyNMABLqnkL5dB5yharHdq66gpJ5o46LrLnj0u4JjVrgGKX1CAO-_MEK8eBnadtQDr4BnsxSXbolmU3Yyht51oYQgjZIeEqm1oUrQ"
                    alt="AI MV hero preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition group-hover:bg-black/20">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md transition group-hover:scale-110">
                      <Play className="ml-1 h-8 w-8 fill-current text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section id="workflow" className="bg-[#14121f] py-[4.5rem] md:py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-14 text-center md:mb-16">
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  只需三步，打造您的音乐视频
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-[#e5e0f3]/60">
                  从简单的想法到高品质的视觉体验，只需三个流畅的阶段。
                </p>
              </div>

              <div className="relative grid gap-8 md:grid-cols-3">
                <div className="absolute top-1/2 left-0 hidden h-[2px] w-full -translate-y-1/2 border-t-2 border-dashed border-[#4a4455]/40 md:block" />
                {steps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.title}
                      className="relative z-10 flex flex-col items-center rounded-2xl border border-[#4a4455]/40 bg-[#363342]/35 p-8 text-center backdrop-blur-md"
                    >
                      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#0e0c19] shadow-xl">
                        <span
                          className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                          style={{ backgroundColor: step.badgeBg, color: step.badgeText }}
                        >
                          {step.number}
                        </span>
                        <Icon className="h-7 w-7" style={{ color: step.accent }} />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#e5e0f3]/60">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section id="showcase" className="bg-[#0e0c19] py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                    由 MeloVision 创作
                  </h2>
                  <p className="mt-4 text-[#e5e0f3]/60">
                    探索当人类想象力遇到 AI 时的无限可能。
                  </p>
                </div>
                <Link
                  href="/interfaces/explore"
                  className="inline-flex items-center gap-2 self-start font-bold text-[#4cd7f6] transition hover:translate-x-1"
                >
                  探索 10,000+ 社区作品
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {showcases.map((item) => (
                  <Link
                    key={item.title}
                    href="/interfaces/explore"
                    className="group relative block aspect-video overflow-hidden rounded-2xl border border-[#4a4455]/40"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#14121f] to-transparent p-6 opacity-0 transition group-hover:opacity-100">
                      <h4 className="text-xl font-bold">{item.title}</h4>
                      <div className="mt-2 flex gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition delay-75 group-hover:opacity-100">
                        <Play className="ml-0.5 h-5 w-5 fill-current text-white" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section className="bg-[#14121f] py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-bold">现代创作者的强大工具</h2>
                <p className="mt-4 text-[#e5e0f3]/60">
                  为无缝创意流设计的专业级工具。
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-[#4a4455]/20 bg-[#201e2c] p-8 transition hover:bg-[#2b2836]"
                    >
                      <Icon className="mb-4 h-6 w-6" style={{ color: feature.color }} />
                      <h3 className="text-xl font-bold tracking-tight">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-[#e5e0f3]/60">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section id="pricing" className="relative overflow-hidden bg-[#0e0c19] py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  选择您的方案
                </h2>
                <p className="mt-4 text-[#e5e0f3]/60">免费开始，随成长而升级。</p>
              </div>

              <div className="grid items-stretch gap-8 md:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative flex flex-col rounded-2xl p-10 ${
                      plan.featured
                        ? "scale-105 border-2 border-[#d2bbff] bg-[#2b2836] shadow-[0_20px_50px_rgba(124,58,237,0.2)]"
                        : "border border-[#4a4455]/20 bg-[#1c1a27]"
                    }`}
                  >
                    {plan.featured ? (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#d2bbff] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#3f008e]">
                        最受欢迎
                      </div>
                    ) : null}
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <p className="mt-2 text-[#e5e0f3]/60">{plan.subtitle}</p>
                    <div className="mt-6 text-4xl font-bold">
                      {plan.price}
                      <span className="text-lg font-normal text-[#e5e0f3]/40">/月</span>
                    </div>
                    <ul className="mt-8 flex-grow space-y-4">
                      {plan.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <Check
                            className="h-4 w-4"
                            style={{ color: plan.featured ? "#d2bbff" : "#4cd7f6" }}
                          />
                          <span className={plan.featured ? "font-semibold" : ""}>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.featured ? "/interfaces/create" : "/interfaces/register"}
                      className={`mt-10 w-full rounded-xl py-4 font-bold transition ${
                        plan.featured
                          ? "bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] text-white shadow-lg shadow-[#7c3aed]/30 hover:scale-[1.02]"
                          : "border border-[#4a4455]/50 hover:bg-[#363342]/45"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section className="bg-[#14121f] py-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-16 text-center">
                <h2 className="text-4xl font-bold">创作者的心声</h2>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {testimonials.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-[#4a4455]/35 bg-[#363342]/35 p-8 backdrop-blur-md"
                  >
                    <div className="mb-6 flex gap-1 text-[#ffb690]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="mb-8 italic leading-7 text-[#e5e0f3]/80">
                      “{item.quote}”
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs uppercase tracking-widest text-[#e5e0f3]/40">
                          {item.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-[#03b5d3]/30" />

          <section className="overflow-hidden bg-[#14121f] px-6 py-24">
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#4a4455]/35 bg-[#363342]/35 p-12 text-center backdrop-blur-md md:p-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d2bbff]/10 via-transparent to-[#4cd7f6]/10" />
              <div className="relative">
                <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                  您的下一首热门作品从这里开始
                </h2>
                <p className="mx-auto mt-6 mb-12 max-w-2xl text-lg text-[#e5e0f3]/70 md:text-xl">
                  加入 AI 驱动的音乐视觉革命。零经验要求。
                </p>
                <div className="mx-auto flex max-w-lg flex-col gap-4 md:flex-row">
                  <input
                    type="email"
                    placeholder="输入您的电子邮箱"
                    className="flex-grow rounded-xl border border-[#4a4455]/50 bg-[#0e0c19] px-6 py-4 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#d2bbff]"
                  />
                  <Link
                    href="/interfaces/register"
                    className="whitespace-nowrap rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-8 py-4 font-bold text-white shadow-lg shadow-[#7c3aed]/20 transition hover:scale-[1.02]"
                  >
                    免费开始创作
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer id="footer" className="border-t border-[#4a4455]/20 bg-[#0e0c19]">
          <div className="mx-auto grid max-w-7xl gap-12 px-8 py-16 md:grid-cols-4">
            <div className="space-y-6">
              <div className="text-2xl font-bold tracking-tight text-[#d2bbff]">
                MeloVision
              </div>
              <p className="text-sm leading-relaxed text-[#e5e0f3]/50">
                释放 AI 的力量，将音乐创意转化为电影级的视觉体验。
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-[#4cd7f6]">
                  {column.title}
                </h4>
                <ul className="space-y-4">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-[#e5e0f3]/50 transition duration-300 hover:text-[#d2bbff]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-7xl px-8 pb-12">
            <div className="border-t border-[#4a4455]/10 pt-8 text-xs text-[#e5e0f3]/30">
              © 2024 MeloVision. 编排视觉未来。
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
