export default function Page() {
  return (
    <>

{/* TopNavBar */}
<nav className="bg-[#14121F]/80 backdrop-blur-lg docked full-width top-0 sticky z-40 shadow-[0_8px_32px_rgba(124,58,237,0.1)]">
<div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
<div className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] bg-clip-text text-transparent font-['Space_Grotesk'] tracking-tight" style="">
        MeloVision
      </div>
<div className="hidden md:flex gap-8 items-center">
<a className="text-[#D2BBFF] font-semibold border-b-2 border-[#4CD7F6] font-['Space_Grotesk'] tracking-tight" href="#" style="">产品展示</a>
<a className="text-[#E5E0F3]/70 hover:text-[#E5E0F3] transition-colors font-['Space_Grotesk'] tracking-tight" href="#" style="">作品广场</a>
<a className="text-[#E5E0F3]/70 hover:text-[#E5E0F3] transition-colors font-['Space_Grotesk'] tracking-tight" href="#" style="">价格方案</a><a className="text-[#E5E0F3]/70 hover:text-[#E5E0F3] transition-colors font-['Space_Grotesk'] tracking-tight" href="#">工作台</a>
</div>
<div className="flex items-center gap-4">
<button className="text-[#E5E0F3]/70 hover:text-[#E5E0F3] font-medium hidden sm:block" style="">登录</button>
<button className="bg-gradient-to-r from-primary-container to-secondary-container px-6 py-2.5 rounded-full font-bold text-on-primary hover:scale-[1.02] active:scale-95 duration-200 transition-all hover:shadow-[0_0_20px_rgba(210,187,255,0.3)]" style="">
          开始使用
        </button>
</div>
</div>
</nav>
{/* Hero Section */}
<section className="relative min-h-[921px] flex items-center justify-center overflow-hidden pt-20 pb-32">
<div className="absolute inset-0 bg-gradient-to-b from-[#1c1a27] via-[#14121f] to-[#14121f] z-0"></div>
<div className="absolute inset-0 z-0 opacity-30">
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>
</div>
<div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div className="text-left">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest/50 border border-outline-variant/20 mb-8">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
<span className="text-xs font-bold tracking-widest uppercase text-secondary" style="">全新发布：歌词转视频引擎 2.0</span>
</div>
<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight" style="">
          将灵感转化为 <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" style="">AI 音乐 MV</span>
</h1>
<p className="text-lg md:text-xl text-on-surface/70 mb-10 max-w-xl font-body leading-relaxed" style="">
          数分钟内创作原创歌曲与惊艳视频。无需乐器，无需相机，只需您的想象力。
        </p>
<div className="flex flex-col sm:flex-row gap-4 mb-12">
<button className="bg-gradient-to-r from-primary-container to-secondary-container px-8 py-4 rounded-xl font-bold text-white text-lg shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-200 active:scale-95" style="">
            免费开始创作
          </button>
<button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-outline-variant/30 glass hover:bg-surface-container-highest/50 hover:scale-[1.02] transition-all duration-200 font-semibold" style="">
<span className="material-symbols-outlined" data-icon="play_circle" style="">play_circle</span>
            观看演示
          </button>
</div>
<div className="flex items-center gap-4">
<div className="flex -space-x-3">
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="Portrait of a young creative professional woman with soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTezTOTy401VganBMpZMYokf3xTgNRnnJuYyr_VEKyUQBw_hNVzDExoaP78Edxau0oGBBOJlJR--EFXw4fnQ4gEj_25qyiuCieiz9MWd_lMZhTn56dMq5p4T579-J480KnMLfHw4RqH76JxKp3e1nd_WdWnX0X7WzdBQgi6PBs49hiCrTytBREIm5Z83CfnFXdYdJvXUnMMSksajhvtYuEeH_ElO8dwSQ8FpUop_RnY2UcTgRTIhh7UoUwDdioWQgEAcdcyQkG_Q" style=""/>
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="Portrait of a male artist with urban background in soft focus" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJ3l_xw54uqANnGYLJh-TPgymD4zDeC_JlP_eFrYXmcD4U2dmaHCAyw2t50ytLXqzYhyDrqkhE9EMINr8i2zb-e5HN_E5pztl_P5sjVr0YOdqMmeunMFKtxOWcSnmqsF_6OEEnCLSh_Dnyn5OKcRNzIr4BS8owwA5qt1rJUUyDJ-7JQ1BxSx8N7LO7GTJYHJVtlWeOOR1thFjfk59pF7vI4wZoMDbSZGbVR1cEUJHZemdvyiF_tqchC57_gQKHo1Mth3LzlT_suQ" style=""/>
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="Close up portrait of a content creator smiling in a studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKtRHuvR-AaoDZJBgR4wrVIN0T0l1OnoCC0Oa7gOYc9cbc1GOvMTNk19-yLsQu7Q1ealdAno47Ue-H_kbJobxOiNZZYW5sxUPxlIP1u1J7VllCLj0zjU48_g8VXwzbbavGiZD0-netFusIrN8Z1JjaPevWH4n2dIP8HHkYnKpN2hez1mWNaeJvi1v_111KdBVLGJSoD6kzylFHFmW6CpNHfuvQFIDj-9ljxDACp3bvswoEcz7SxdB9K-5aiDAJX1VPeL5j9YzCOg" style=""/>
</div>
<p className="text-sm text-on-surface/60 font-medium" style="">深受 <span className="text-on-surface font-bold" style="">50,000+ 创作者</span> 的信赖</p>
</div>
</div>
<div className="relative group">
<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all"></div>
<div className="relative rounded-[16px] overflow-hidden border border-outline-variant/30 aspect-video glass spectral-glow">
<img className="w-full h-full object-cover" data-alt="Futuristic neon light installation in a dark room with vibrant pink and blue hues representing creative energy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrExC2FI9GKByb2agMDtMFUS4QsLBNoRygdm_NX8YbijHReURvKIALq57JIKSySUkyUwzlhseJVz3uhedzpSr8cAT-DbVlNiS53Pybcgrpmn_7rqtXfcc07IFwUnDeYGbU7PXW4KOf-GmAH78rE6E5Qm9_rtJkkiTvXtR2BJyNMABLqnkL5dB5yharHdq66gpJ5o46LrLnj0u4JjVrgGKX1CAO-_MEK8eBnadtQDr4BnsxSXbolmU3Yyht51oYQgjZIeEqm1oUrQ" style=""/>
<div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
<div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-4xl text-white" data-icon="play_arrow" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>play_arrow</span>
</div>
</div>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* How It Works Section */}
<section className="py-24 bg-surface relative">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-20">
<h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style="">只需三步，打造您的音乐视频</h2>
<p className="text-on-surface/60 max-w-2xl mx-auto" style="">从简单的想法到高品质的视觉体验，只需三个流畅的阶段。</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
{/* Connecting Line (Desktop) */}
<div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] border-t-2 border-dashed border-outline-variant/20 -translate-y-1/2 z-0"></div>
<div className="relative z-10 glass p-8 rounded-[16px] border border-outline-variant/20 flex flex-col items-center text-center group hover:border-primary/40 transition-colors">
<div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-xl relative">
<span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold" style="">1</span>
<span className="material-symbols-outlined text-primary text-3xl" data-icon="auto_awesome" style="">auto_awesome</span>
</div>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">1. 描述您的愿景</h3>
<p className="text-on-surface/60" style="">输入几句话来描述您想要的情绪、流派和视觉效果。</p>
</div>
<div className="relative z-10 glass p-8 rounded-[16px] border border-outline-variant/20 flex flex-col items-center text-center group hover:border-secondary/40 transition-colors">
<div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-xl relative">
<span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold" style="">2</span>
<span className="material-symbols-outlined text-secondary text-3xl" data-icon="movie_edit" style="">movie_edit</span>
</div>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">2. AI 生成音乐与视觉</h3>
<p className="text-on-surface/60" style="">我们的引擎会自动生成高保真歌词、旋律和电影级镜头。</p>
</div>
<div className="relative z-10 glass p-8 rounded-[16px] border border-outline-variant/20 flex flex-col items-center text-center group hover:border-tertiary/40 transition-colors">
<div className="w-16 h-16 rounded-full bg-surface-container-lowest flex items-center justify-center mb-6 shadow-xl relative">
<span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center font-bold" style="">3</span>
<span className="material-symbols-outlined text-tertiary text-3xl" data-icon="share" style="">share</span>
</div>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">3. 下载与分享</h3>
<p className="text-on-surface/60" style="">导出 4K 视频，在所有社交平台与您的粉丝分享大作。</p>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* Showcase Gallery */}
<section className="py-24 bg-surface-container-lowest">
<div className="max-w-7xl mx-auto px-6">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
<div>
<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style="">由 MeloVision 创作</h2>
<p className="text-on-surface/60" style="">探索当人类想象力遇到 AI 时的无限可能。</p>
</div>
<button className="text-secondary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform" style="">
          探索 10,000+ 社区作品 → <span className="material-symbols-outlined" data-icon="arrow_forward" style="">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Gallery Items */}
<div className="relative group rounded-[16px] overflow-hidden aspect-video border border-outline-variant/20">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Dynamic shot of an EDM festival with laser lights and smoke atmosphere in deep purple tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGgQ_KpQ9OF6IgomXM3H7-aMBp9YvZVRGiAsz9nvOlityvapGahYOJ6h23VL0AunrTrqCPrNylPNjoqot5EDwY1qv_gxPxoBw9jViD60yoaCyr-k52MwnUHmJhL-nKpMIGEEcjSg-Hbg0KuxbB2a71DPJchKc1SPcD36qrMgw5idiUyRLnjJDsi40HBvqWMpeXZksKQ4KfqGdlPJl_Z8GiCiAvIpGrpwt643Riq-19Q32HS1lnJM8BCB1z8iKavK8juIaSG6qOYA" style=""/>
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
<h4 className="text-xl font-bold mb-2" style="">霓虹之夜</h4>
<div className="flex gap-2">
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">赛博朋克</span>
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">流行</span>
</div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-75">
<span className="material-symbols-outlined" data-icon="play_arrow" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>play_arrow</span>
</div>
</div>
</div>
<div className="relative group rounded-[16px] overflow-hidden aspect-video border border-outline-variant/20">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Cinematic studio microphone setup with warm vintage lighting and bokeh background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE5EzAMHuYstj7ZcDl4z0waxdxJul3XULFUeq75jukeZ5XBa5X0ikZv3cHUjc438rFK6UwYsainA8gfxnyQzsIUr5Ta98YHMKt34Jbqv_icA2hyZ02O8CIHItugqfvLbmw3Gf-HQvrnDLf_NXC84vPIXaIZeye5a792eRL8SDut6lz5mQlUAz9xGZ2mW2flDrov3XQfmlWRjuoKWGnd5oluUWi0gBligfOnodivQzCtLT8CC_BJ_2w6nuA6b4GSn1fm7B8K-dkTQ" style=""/>
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
<h4 className="text-xl font-bold mb-2" style="">午夜爵士</h4>
<div className="flex gap-2">
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">Lo-Fi</span>
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">爵士</span>
</div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-75">
<span className="material-symbols-outlined" data-icon="play_arrow" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>play_arrow</span>
</div>
</div>
</div>
<div className="relative group rounded-[16px] overflow-hidden aspect-video border border-outline-variant/20">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-alt="Abstract vibrant paint swirls in water with bright pink and yellow highlights" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB28trpvkUDrgp7Hdc25byzQ2dplSn-IXm2pSDBOdIJ5fQrOgzhphOl3TYuj7JZF-mSPcZUsKKyvYN_ecP9fWoEsh7zeLLFqVMoGucD_WGce1572KnucAWDfNsk_4y58_ppd-CeYukavxbjNqSXuzqVm3C57eJzHoqfy-l8RyRjQ8MI5dQrqrt7dAmvBhOkvNarVF7q-LjG1nqALnNLvbHlyVP64KIqx5l1KuNSu_BBbJg7k5YIOAWbrlRfCC6jahRLYP5GlkKKig" style=""/>
<div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
<h4 className="text-xl font-bold mb-2" style="">空灵盛放</h4>
<div className="flex gap-2">
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">抽象</span>
<span className="text-[10px] uppercase tracking-widest font-bold bg-white/10 px-2 py-1 rounded" style="">梦幻流行</span>
</div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity delay-75">
<span className="material-symbols-outlined" data-icon="play_arrow" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>play_arrow</span>
</div>
</div>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* Feature Highlights */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16">
<h2 className="text-4xl font-bold mb-4" style="">现代创作者的强大工具</h2>
<p className="text-on-surface/60" style="">为无缝创意流设计的专业级工具。</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-primary mb-4 block" data-icon="edit_note" style="">edit_note</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">AI 词曲创作</h3>
<p className="text-on-surface/60 text-sm" style="">根据您的独特主题生成朗朗上口的副歌和深情的歌词。</p>
</div>
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-secondary mb-4 block" data-icon="dashboard_customize" style="">dashboard_customize</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">智能分镜</h3>
<p className="text-on-surface/60 text-sm" style="">AI 自动规划视觉序列，与歌曲的能量节奏完美同步。</p>
</div>
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-tertiary mb-4 block" data-icon="palette" style="">palette</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">风格库</h3>
<p className="text-on-surface/60 text-sm" style="">20 多种截然不同的视觉风格可选，从动漫到黑色电影应有尽有。</p>
</div>
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-primary mb-4 block" data-icon="lyrics" style="">lyrics</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">歌词同步</h3>
<p className="text-on-surface/60 text-sm" style="">动态文字排版，能够对音轨的节奏和节拍做出实时反应。</p>
</div>
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-secondary mb-4 block" data-icon="layers" style="">layers</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">多版本生成</h3>
<p className="text-on-surface/60 text-sm" style="">为一首歌生成多个视觉版本，直到找到最完美的那一个。</p>
</div>
<div className="p-8 rounded-[16px] bg-surface-container border border-outline-variant/10 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined text-tertiary mb-4 block" data-icon="ios_share" style="">ios_share</span>
<h3 className="text-xl font-bold mb-3 tracking-tight" style="">一键分享</h3>
<p className="text-on-surface/60 text-sm" style="">立即以正确的格式发布到 YouTube、TikTok 和 Instagram。</p>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* Pricing Section */}
<section className="py-24 bg-surface-container-lowest relative overflow-hidden">
<div className="max-w-7xl mx-auto px-6 relative z-10">
<div className="text-center mb-16">
<h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight" style="">选择您的方案</h2>
<p className="text-on-surface/60" style="">免费开始，随成长而升级。</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
{/* Free Card */}
<div className="p-10 rounded-[16px] bg-surface-container-low border border-outline-variant/10 flex flex-col">
<h3 className="text-2xl font-bold mb-2" style="">免费版</h3>
<p className="text-on-surface/60 mb-6" style="">探索无限可能</p>
<div className="text-4xl font-bold mb-8" style="">¥0<span className="text-lg font-normal text-on-surface/40" style="">/月</span></div>
<ul className="space-y-4 mb-10 flex-grow">
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 每月 3 个视频</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 720p 分辨率</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 标准风格</li>
</ul>
<button className="w-full py-4 rounded-xl font-bold border border-outline-variant/30 hover:bg-surface-container-highest/50 hover:scale-[1.02] transition-all duration-200" style="">开始使用</button>
</div>
{/* Basic Card */}
<div className="p-10 rounded-[16px] bg-surface-container-low border border-outline-variant/10 flex flex-col">
<h3 className="text-2xl font-bold mb-2" style="">基础版</h3>
<p className="text-on-surface/60 mb-6" style="">适合新兴艺人</p>
<div className="text-4xl font-bold mb-8" style="">¥29<span className="text-lg font-normal text-on-surface/40" style="">/月</span></div>
<ul className="space-y-4 mb-10 flex-grow">
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 每月 15 个视频</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 1080p 全高清</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 高级风格</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-secondary text-sm" data-icon="check" style="">check</span> 无水印</li>
</ul>
<button className="w-full py-4 rounded-xl font-bold border border-outline-variant/30 hover:bg-surface-container-highest/50 hover:scale-[1.02] transition-all duration-200" style="">选择基础版</button>
</div>
{/* Pro Card */}
<div className="p-10 rounded-[16px] bg-surface-container-high border-2 border-primary relative flex flex-col scale-105 shadow-[0_20px_50px_rgba(124,58,237,0.2)]">
<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style="">最受欢迎</div>
<h3 className="text-2xl font-bold mb-2" style="">Pro 版</h3>
<p className="text-on-surface/60 mb-6" style="">完全掌握创意控制权</p>
<div className="text-4xl font-bold mb-8" style="">¥79<span className="text-lg font-normal text-on-surface/40" style="">/月</span></div>
<ul className="space-y-4 mb-10 flex-grow">
<li className="flex items-center gap-2 font-semibold" style=""><span className="material-symbols-outlined text-primary text-sm" data-icon="check" style="">check</span> 无限制视频生成</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-primary text-sm" data-icon="check" style="">check</span> 4K 超高清质量</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-primary text-sm" data-icon="check" style="">check</span> 自定义风格训练</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-primary text-sm" data-icon="check" style="">check</span> 优先渲染</li>
<li className="flex items-center gap-2" style=""><span className="material-symbols-outlined text-primary text-sm" data-icon="check" style="">check</span> API 接入权限</li>
</ul>
<button className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-primary-container to-secondary-container text-on-primary shadow-lg shadow-primary/30 hover:scale-[1.02] transition-all duration-200" style="">立即获取 Pro 版</button>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* Testimonials */}
<section className="py-24 bg-surface">
<div className="max-w-7xl mx-auto px-6">
<div className="text-center mb-16">
<h2 className="text-4xl font-bold mb-4" style="">创作者的心声</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="glass p-8 rounded-[16px] border border-outline-variant/20">
<div className="flex gap-1 text-tertiary mb-6">
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
</div>
<p className="text-on-surface/80 mb-8 italic" style="">“MeloVision 改变了我 YouTube 频道的运营规则。现在我可以在一小时内为我的新歌制作出高质量的 MV。”</p>
<div className="flex items-center gap-4">
<img className="w-12 h-12 rounded-full" data-alt="Portrait of a male musician with a creative look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLYZ-UGapWNgXJJC0nJaa3duvU4a5me7yFEXjqRpb2TW9brGcJB-JSti_WEgGjnR2H69o71ns8NF-3uJGOpvNj_lNdzZNCcDpQ8TPPLpkn0OIPZ7ywqvEnCa9ti3z2e1Vx99SDKdIyiwEl9zsxlMdQk2HyB5ZIrne_jv9C7QCNH23IWbBtoEHwbg4_ZaiMGP8MUyQxy0sr4wXM_RscAaTCNA8bEYDyN4-gEifPIiKrAYjVFqLqWdulfDfMwaMGMPi5pZIpIiLbGg" style=""/>
<div>
<div className="font-bold" style="">Marcus Chen</div>
<div className="text-xs text-on-surface/40 uppercase tracking-widest" style="">独立音乐人</div>
</div>
</div>
</div>
<div className="glass p-8 rounded-[16px] border border-outline-variant/20">
<div className="flex gap-1 text-tertiary mb-6">
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
</div>
<p className="text-on-surface/80 mb-8 italic" style="">“视觉质量令人难以置信。这不仅仅是随机的 AI 艺术；它真正理解音乐的节奏和灵魂。”</p>
<div className="flex items-center gap-4">
<img className="w-12 h-12 rounded-full" data-alt="Portrait of a female digital artist smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmMrxtprkvL_KbvddtRC3m6gwGOwv9bSR2Q0mSfDNmot_erjEN_eL7tSCVSRAIWP6EVtfUyNLyMbgzOtRbiFfQ4P71wl346rFCiKNK2rIfFAZyX_dejKkw4D7_C1Zw3V7-0fXDBwNeEaxnMZPwvH1KXd6BCkR9nzSj8Rdy3KksH_RVglIrf--4Cy78W2-InTxJSCYzpEJJ30e7xiva4Jo43GY02I2Z1-Qdv-phR2X5mLNT4ne8t66DxPl7px2pSAhrrPqnPwa4fg" style=""/>
<div>
<div className="font-bold" style="">Sarah Jenkins</div>
<div className="text-xs text-on-surface/40 uppercase tracking-widest" style="">视觉总监</div>
</div>
</div>
</div>
<div className="glass p-8 rounded-[16px] border border-outline-variant/20">
<div className="flex gap-1 text-tertiary mb-6">
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
<span className="material-symbols-outlined text-sm" data-icon="star" data-weight="fill" style='font-variation-settings: "FILL" 1, "wght" 200;'>star</span>
</div>
<p className="text-on-surface/80 mb-8 italic" style="">“智能分镜功能就像有一个全天候工作的专业视频编辑在身边。简直太棒了。”</p>
<div className="flex items-center gap-4">
<img className="w-12 h-12 rounded-full" data-alt="Portrait of a young male content creator" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3vOQR6Z4X8yxXb1uiu7ceD-OQNfb7p-8vmgTc6i5Ai46XJkKyGDxdLWp3rVGl8sdJPCHyyEALmM3foPCX9CrPO-YbMCn2IP7d6Dzg9YhlEkg00J06ClioBTk70UStQWj2iHtu1HIkWwHe9xn2T0X1uipkZHv1ro8oO3-ZcFBE3kCnBXIZ9HdIU09SQtIH2E2c_BhEkw6OcrJO0EWTvMp1Uc9VTMMzPYlKnHiZHBhe_a5nS0a8TYMxD3WjqFHQ-6Qf1WRECWonvg" style=""/>
<div>
<div className="font-bold" style="">Leo Rivera</div>
<div className="text-xs text-on-surface/40 uppercase tracking-widest" style="">TikTok 创作者</div>
</div>
</div>
</div>
</div>
</div>
</section>
<div className="h-px w-full bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-[#03B5D3]/30"></div>
{/* Final CTA */}
<section className="py-24 bg-surface px-6 overflow-hidden">
<div className="max-w-5xl mx-auto glass rounded-[16px] p-12 md:p-20 relative overflow-hidden text-center border border-outline-variant/20">
<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 z-0"></div>
<div className="relative z-10">
<h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight" style="">您的下一首热门作品从这里开始</h2>
<p className="text-on-surface/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto" style="">加入 AI 驱动的音乐视觉革命。零经验要求。</p>
<div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
<input className="flex-grow bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-6 py-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="输入您的电子邮箱" type="email"/>
<button className="bg-gradient-to-r from-primary-container to-secondary-container px-8 py-4 rounded-xl font-bold text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-200 active:scale-95 whitespace-nowrap" style="">
            免费开始创作
          </button>
</div>
</div>
</div>
</section>
{/* Footer */}
<footer className="bg-[#0E0C19] border-t border-outline-variant/10">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-8 py-16">
<div className="space-y-6">
<div className="font-['Space_Grotesk'] font-bold text-[#D2BBFF] text-2xl tracking-tight" style="">MeloVision</div>
<p className="text-[#E5E0F3]/50 text-sm font-['Inter'] leading-relaxed" style="">
          释放 AI 的力量，将音乐创意转化为电影级的视觉体验。
        </p>
</div>
<div>
<h4 className="text-[#4CD7F6] font-bold mb-6 uppercase tracking-widest text-xs" style="">平台</h4>
<ul className="space-y-4">
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">作品展示</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">功能特性</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">价格方案</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">API 文档</a></li>
</ul>
</div>
<div>
<h4 className="text-[#4CD7F6] font-bold mb-6 uppercase tracking-widest text-xs" style="">资源</h4>
<ul className="space-y-4">
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">教程</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">创作者博客</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">帮助中心</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">社区</a></li>
</ul>
</div>
<div>
<h4 className="text-[#4CD7F6] font-bold mb-6 uppercase tracking-widest text-xs" style="">公司</h4>
<ul className="space-y-4">
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">隐私政策</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">服务条款</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">Cookie 政策</a></li>
<li className="" style=""><a className="text-[#E5E0F3]/50 hover:text-[#D2BBFF] transition-colors duration-300 text-sm font-['Inter']" href="#" style="">联系支持</a></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-8 pb-12 text-center md:text-left">
<div className="pt-8 border-t border-outline-variant/5 text-[#E5E0F3]/30 text-xs font-['Inter']" style="">
        © 2024 MeloVision AI. 编排视觉未来。
      </div>
</div>
</footer>

    </>
  );
}
