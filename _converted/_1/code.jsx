export default function Page() {
  return (
    <>

{/* Noise Texture Overlay */}
<div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]" style={{backgroundImage: 'url('data'}}></div>
{/* TopNavBar */}
<nav className="fixed top-0 left-0 w-full grid grid-cols-2 md:grid-cols-3 items-center px-4 md:px-8 h-20 bg-[#14121F]/60 backdrop-blur-xl z-50 shadow-[0_8px_32px_0_rgba(124,58,237,0.1)] font-['Space_Grotesk'] tracking-tight">
<div className="flex justify-start">
<a className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#D2BBFF] to-[#4CD7F6] font-['Space_Grotesk']" href="#">MeloVision</a>
</div>
<div className="hidden md:flex justify-center gap-10 items-center font-['Space_Grotesk']">
<a className="text-slate-200 font-medium hover:text-[#4CD7F6] transition-colors duration-300" href="#">产品展示</a>
<a className="text-white font-bold relative group" href="#">
        作品广场
        <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-[#4CD7F6] shadow-[0_0_8px_rgba(76,215,246,0.6)]"></span>
</a>
<a className="text-slate-200 font-medium hover:text-[#4CD7F6] transition-colors duration-300" href="#">价格方案</a>
<a className="text-slate-200 font-medium hover:text-[#4CD7F6] transition-colors duration-300" href="#">工作台</a></div>
<div className="flex justify-end items-center gap-4 md:gap-8 font-['Space_Grotesk']">
<a className="text-slate-200 font-medium hover:text-[#4CD7F6] transition-colors" href="#">登录</a>
<button className="bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-white font-bold px-8 py-2.5 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95">
        开始使用
    </button>
</div>
</nav>
{/* Mobile Bottom Tab Bar */}
<nav className="fixed bottom-0 left-0 w-full bg-[#14121F]/80 backdrop-blur-xl border-t border-outline-variant/20 z-50 md:hidden flex justify-around items-center h-16 px-2">
<a className="flex flex-col items-center gap-1 text-primary" href="#">
<span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1'}}>explore</span>
<span className="text-[10px] font-medium">Explore</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#4CD7F6] transition-colors" href="#">
<span className="material-symbols-outlined">groups</span>
<span className="text-[10px] font-medium">Community</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#4CD7F6] transition-colors -mt-6" href="#">
<div className="bg-gradient-to-r from-primary-container to-secondary-container p-3 rounded-full shadow-[0_4px_15px_rgba(124,58,237,0.4)] text-on-primary-container">
<span className="material-symbols-outlined">add</span>
</div>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#4CD7F6] transition-colors" href="#">
<span className="material-symbols-outlined">stream</span>
<span className="text-[10px] font-medium">Live</span>
</a>
<a className="flex flex-col items-center gap-1 text-slate-400 hover:text-[#4CD7F6] transition-colors" href="#">
<span className="material-symbols-outlined">account_circle</span>
<span className="text-[10px] font-medium">Profile</span>
</a>
</nav>
<main className="pt-24 pb-24 md:pb-20 px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8 relative">
{/* Main Content Area */}
<div className="flex-1 flex flex-col gap-6 md:gap-8">
{/* Mobile Search Bar */}
<div className="lg:hidden w-full">
<div className="flex items-center bg-surface-container-low rounded-full px-4 py-3 border border-outline-variant/30 w-full">
<span className="material-symbols-outlined text-outline mr-2 text-sm">search</span>
<input className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-full placeholder-outline outline-none" placeholder="搜索 MV、风格或创作人..." type="text"/>
</div>
</div>
{/* Hero Carousel */}
<section className="relative rounded-2xl overflow-hidden h-[300px] md:h-[400px] group ghost-border">
<div className="absolute inset-0 bg-cover bg-center" data-alt="vibrant cyberpunk city street scene at night with neon lights reflecting in puddles after rain, highly detailed, cinematic lighting" style={{backgroundImage: 'url('https'}}>
<div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
</div>
<div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 md:gap-6">
<div className="flex flex-col gap-2 md:gap-3">
<span className="text-secondary font-display text-[10px] md:text-sm tracking-widest uppercase bg-surface-container/80 px-2 md:px-3 py-1 rounded-full w-max backdrop-blur-sm">本周精选作品</span>
<h1 className="text-3xl md:text-5xl font-display font-bold text-on-surface leading-tight">霓虹雨后的街头</h1>
<div className="flex items-center gap-2 md:gap-4 mt-1 md:mt-2">
<div className="flex items-center gap-2">
<img alt="Creator" className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary/50" data-alt="avatar of a digital artist with cool neon lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVWcFgb6dHnuOqsmeFoWY09VFIQAgnQoAUNpOqOw7Nvdal5NN6qCjXXEl0feFE_1TUrLZMZN7TiHM1SalA1b1SmKMBss2usZW9af-oxYzYZHpaPNod9xHlz-Joxhk-QxEB4rI2JdZFalbTJOrd7SHkTe0hg31FlmvkftKaOuHESkuN-pwsWe3myvCeThqqYFLt1WWarADzS3f0UwTPlmHgs5lyGIwVVlblil6yJOIDVPGorZMQxMXvq_QG9SHP-sHVS8yMDq5x-Q"/>
<span className="text-on-surface-variant text-xs md:text-sm font-medium">CyberArtist</span>
</div>
<span className="text-outline text-sm hidden sm:inline">•</span>
<span className="text-outline-variant text-sm flex gap-2">
<span className="bg-surface-container px-2 py-0.5 rounded text-[10px] md:text-xs">Lo-fi</span>
<span className="bg-surface-container px-2 py-0.5 rounded text-[10px] md:text-xs">赛博朋克</span>
</span>
</div>
</div>
<button className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-bold px-4 py-2 md:px-6 md:py-3 rounded-full flex items-center gap-1 md:gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-sm md:text-base whitespace-nowrap">
<span className="material-symbols-outlined text-lg md:text-2xl" style={{fontVariationSettings: ''FILL' 1, 'wght' 200'}}>play_arrow</span>
                        立即播放
                    </button>
</div>
{/* Slide Indicators */}
<div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
<div className="w-6 md:w-8 h-1 bg-primary rounded-full"></div>
<div className="w-2 h-1 bg-outline-variant rounded-full"></div>
<div className="w-2 h-1 bg-outline-variant rounded-full"></div>
</div>
</section>
{/* Gradient Separator */}
<div className="w-full h-px bg-gradient-to-r from-[#7C3AED]/40 via-transparent to-[#4CD7F6]/40 my-1 md:my-2"></div>
{/* Filters */}
<section className="flex gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-4 scrollbar-hide snap-x">
<button className="bg-surface-container-high text-primary px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start border border-primary/30">全部</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">热门 🔥</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">最新</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">最多点赞</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">流行</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">摇滚</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">电子</button>
<button className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap snap-start transition-colors">Lo-fi</button>
</section>
{/* Masonry Grid (Simulated with Flex/Grid for brevity, true masonry needs JS or complex CSS columns) */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Card 1 */}
<div className="bg-surface-container rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:ring-1 hover:ring-primary/50 transition-all duration-300">
<div className="relative aspect-video">
<img alt="Thumbnail" className="w-full h-full object-cover" data-alt="abstract 3d glowing geometric shapes in deep purple and cyan colors, music visualizer style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXCbVQtby41kduKLj83-Yt3skW8Z4RC1JakTAVw6ZIWYeJMrZ-tRyhHm7flidxeogrZLyeqi5TzSdYiJSDFxv98g04fZMHc9tGXFnLEHEfQ-4RPxlNEKfKi1LMYzs5dv9nNv7viipcapyisvs7DDZIh60CPwluCMtnuavPs5KR4CZ0nxgZBy6F0SZLKUnhsxeNBdLLCueGRHZr1ttW2EcXPOikX0gh9e4xMJe7-2jmg4THFV8p9JDvoG6UGpBglYNLt2tqxPybgg"/>
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<button className="bg-primary/90 text-on-primary rounded-full p-3 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
<span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1, 'wght' 200'}}>play_arrow</span>
</button>
</div>
<div className="absolute bottom-2 right-2 bg-surface/80 px-2 py-1 rounded text-xs font-display text-on-surface">3:42</div>
</div>
<div className="p-4 flex flex-col gap-3">
<h3 className="font-bold text-on-surface text-lg leading-tight truncate">Neon Nights: City Pulse</h3>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<img alt="User" className="w-6 h-6 rounded-full" data-alt="avatar of a male creator with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXCbVQtby41kduKLj83-Yt3skW8Z4RC1JakTAVw6ZIWYeJMrZ-tRyhHm7flidxeogrZLyeqi5TzSdYiJSDFxv98g04fZMHc9tGXFnLEHEfQ-4RPxlNEKfKi1LMYzs5dv9nNv7viipcapyisvs7DDZIh60CPwluCMtnuavPs5KR4CZ0nxgZBy6F0SZLKUnhsxeNBdLLCueGRHZr1ttW2EcXPOikX0gh9e4xMJe7-2jmg4THFV8p9JDvoG6UGpBglYNLt2tqxPybgg"/>
<span className="text-xs text-on-surface-variant">RetroVibe_AI</span>
</div>
<span className="text-[10px] text-secondary border border-secondary/30 px-2 py-0.5 rounded-full">电子</span>
</div>
<div className="flex items-center gap-4 text-xs text-outline pt-2 border-t border-surface-container-highest">
<span className="flex items-center gap-1"><span className="text-error text-[10px]">❤️</span> 1.2K</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">play_circle</span> 5.4K</span>
</div>
</div>
</div>
{/* Card 2 */}
<div className="bg-surface-container rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:ring-1 hover:ring-primary/50 transition-all duration-300">
<div className="relative aspect-video">
<img alt="Thumbnail" className="w-full h-full object-cover" data-alt="ethereal dancer in a grand dark hall with beams of light piercing through dust" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzzFMKmXkP5sGifssyHIY1F6K4bd4wptOUSxVTrXaeEV6bw68GoLFR1dcwxqqz8J21ICpV63s50Z6ZGDXGnzbCnXXnskTHa4y2oRR9z0sSLHWOtmdCWjeGTL3QQe7dIOSBW4Kb36F-VADEn0v3Y_h0jqCTpxOBYg5l_J17xc4SCdP9pKh_U8OqIWcQRYiqlMIYHeojprwfuTnY6IMKkme5VK278Yo6c0-E1RqMpmzbzHoha8Xpy00BMB59IpFwhVJ1j2iwQ-44jA"/>
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<button className="bg-primary/90 text-on-primary rounded-full p-3 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
<span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1, 'wght' 200'}}>play_arrow</span>
</button>
</div>
<div className="absolute bottom-2 right-2 bg-surface/80 px-2 py-1 rounded text-xs font-display text-on-surface">4:15</div>
</div>
<div className="p-4 flex flex-col gap-3">
<h3 className="font-bold text-on-surface text-lg leading-tight truncate">Celestial Waltz</h3>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<img alt="User" className="w-6 h-6 rounded-full" data-alt="avatar of a female artist smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzzFMKmXkP5sGifssyHIY1F6K4bd4wptOUSxVTrXaeEV6bw68GoLFR1dcwxqqz8J21ICpV63s50Z6ZGDXGnzbCnXXnskTHa4y2oRR9z0sSLHWOtmdCWjeGTL3QQe7dIOSBW4Kb36F-VADEn0v3Y_h0jqCTpxOBYg5l_J17xc4SCdP9pKh_U8OqIWcQRYiqlMIYHeojprwfuTnY6IMKkme5VK278Yo6c0-E1RqMpmzbzHoha8Xpy00BMB59IpFwhVJ1j2iwQ-44jA"/>
<span className="text-xs text-on-surface-variant">Lumina_Visuals</span>
</div>
<span className="text-[10px] text-tertiary border border-tertiary/30 px-2 py-0.5 rounded-full">古典</span>
</div>
<div className="flex items-center gap-4 text-xs text-outline pt-2 border-t border-surface-container-highest">
<span className="flex items-center gap-1"><span className="text-error text-[10px]">❤️</span> 892</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">play_circle</span> 3.1K</span>
</div>
</div>
</div>
{/* Card 3 */}
<div className="bg-surface-container rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)] hover:ring-1 hover:ring-primary/50 transition-all duration-300">
<div className="relative aspect-video">
<img alt="Thumbnail" className="w-full h-full object-cover" data-alt="close up of a vintage microphone with warm orange stage lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDic7Vv8p5JhP9GeMiboRClT9YsWZreyibc_DMSPG1SgKx7eSA5z8nNVAJ63OIVpLMngB84Smz-b7XQkgsPdZo8-VM1xg0c1boQafmy-FCQFiTIXPe6Cz45KJkXu-cL59o6BHfJB2e8CEhzvjuqjvotPVI8LjwzxIWZhrhlemQOjSps73NHZfp-ZR9KDZDQZPU7As9SsbC3m6syLE5KlCVibG17AuzlNqZo5TfL975Pf_5IvUrX0OVJFNmtEn33u-8pmRSEVKUK5Q"/>
<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
<button className="bg-primary/90 text-on-primary rounded-full p-3 backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
<span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1, 'wght' 200'}}>play_arrow</span>
</button>
</div>
<div className="absolute bottom-2 right-2 bg-surface/80 px-2 py-1 rounded text-xs font-display text-on-surface">2:50</div>
</div>
<div className="p-4 flex flex-col gap-3">
<h3 className="font-bold text-on-surface text-lg leading-tight truncate">Blue Note Sessions</h3>
<div className="flex justify-between items-center">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-[10px] font-bold text-on-primary">M</div>
<span className="text-xs text-on-surface-variant">JazzMaster_Flow</span>
</div>
<span className="text-[10px] text-primary border border-primary/30 px-2 py-0.5 rounded-full">爵士</span>
</div>
<div className="flex items-center gap-4 text-xs text-outline pt-2 border-t border-surface-container-highest">
<span className="flex items-center gap-1"><span className="text-error text-[10px]">❤️</span> 2.4K</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">play_circle</span> 12K</span>
</div>
</div>
</div>
</div>
<div className="flex justify-center mt-2 md:mt-4">
<button className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-medium hover:bg-surface-container-highest transition-all duration-200 hover:scale-[1.02] active:scale-95 ghost-border text-sm md:text-base">加载更多</button>
</div>
</div>
{/* Vertical Separator (Desktop) */}
<div className="hidden xl:block w-px bg-gradient-to-b from-[#7C3AED]/30 via-transparent to-[#4CD7F6]/30 self-stretch"></div>
{/* Sidebar */}
<aside className="w-full xl:w-80 flex flex-col gap-6 md:gap-8 shrink-0">
{/* CTA Card */}
<div className="rounded-2xl p-6 bg-gradient-to-br from-primary-container/40 to-surface-container-lowest border border-primary/20 relative overflow-hidden group">
<div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl group-hover:bg-secondary/30 transition-colors"></div>
<h3 className="font-display font-bold text-xl text-on-surface mb-2 relative z-10">开启你的创作</h3>
<p className="text-sm text-on-surface-variant mb-6 relative z-10">将你的音乐灵感转化为震撼的视觉盛宴。</p>
<button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] text-white font-medium py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 relative z-10 text-sm md:text-base">立即生成 MV</button>
</div>
{/* Top Creators */}
<div className="bg-surface-container-lowest rounded-2xl p-6 ghost-border">
<h3 className="font-display font-bold text-lg text-on-surface mb-6 flex items-center justify-between">
                    本周创作者榜单
                    <span className="material-symbols-outlined text-secondary text-sm">workspace_premium</span>
</h3>
<div className="flex flex-col gap-5">
<div className="flex items-center gap-3">
<span className="text-secondary font-display font-bold w-4 text-center">1</span>
<img alt="Rank 1" className="w-10 h-10 rounded-full border border-secondary/30" data-alt="avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtcum2Pnu4QSpD459rw-V2fFPwWu4azsVyjRiV800Fh-7cFdYtehyXO75Ad34zvUo7YNPsKbqBINLEDMMnlzpIK3Gf_Hi_3-kOb7cctk6QpcAzKiQ5wRhLGYuCRfGK9OYW4TL0VN2imYvDf-o1xQtB662fYwSi_8Ddv0X_6FY4sz_dryh59qfAsihQAUNFC7PBjEvEr_Zs2uCvFmDaqcnzCSrLzptexu4_l4TPVgLaVMahJyO_IzCyCGVQKnROj4VT1Ms2_M49Sw"/>
<div className="flex-1">
<div className="text-sm font-bold text-on-surface">CyberArtist</div>
<div className="text-xs text-outline">142 MV 作品</div>
</div>
</div>
<div className="flex items-center gap-3">
<span className="text-primary font-display font-bold w-4 text-center">2</span>
<img alt="Rank 2" className="w-10 h-10 rounded-full border border-primary/30" data-alt="avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv9LMyAGJGpqOnC0XkI3lhg8_xtFo7jASNEZmm2qw75Lk1MOXOEfJhdXpPl-kj4p_r9NmWnYTDRgrytp4ZOQjqVOA53sZbmRdKAWwXe4IX3Q2fHM2DM9TsSfQAIqsNx2K6cn0K2xRHhg7-DvIL9rpE9MJXqyEx9ug9fAkjyjsguWykQwb0CZUpZs3aPk6KVnDRaq7yeXuz-iVW_uBIcDiNvpdxMmDz9ySxMui-G7qPwTDneYMEStDEWEJHY_BRykPESHtrTq-cPg"/>
<div className="flex-1">
<div className="text-sm font-bold text-on-surface">NovaBeats</div>
<div className="text-xs text-outline">98 MV 作品</div>
</div>
</div>
<div className="flex items-center gap-3">
<span className="text-tertiary font-display font-bold w-4 text-center">3</span>
<img alt="Rank 3" className="w-10 h-10 rounded-full border border-tertiary/30" data-alt="avatar 3" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTUkpivt2-L8RU7zINJ0Ln8i4-6ovT16G_gGontH69J4j0_eo2Nw-U3B3h8N_bd8ujdU15WNwzTe2tmXqY3Zhjxqj-bgqSXFU7XhoKPS45WfxDqgCTurjmkylCk38Ow5UbORqdBk9xilfu6bMsmPSJGDherycSp-V3BZ71viP9F5OzsZUL-lMH_odifTznvQC-QpEjZsaqavbWk2wqKMct4cLPQkCpFSqcpRD03uiFWPWYdUwao0TPKosl2M26MbgVq4oznEiy_g"/>
<div className="flex-1">
<div className="text-sm font-bold text-on-surface">VisualMage</div>
<div className="text-xs text-outline">87 MV 作品</div>
</div>
</div>
<div className="flex items-center gap-3">
<span className="text-outline font-display font-bold w-4 text-center">4</span>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-sm font-bold text-on-surface">E</div>
<div className="flex-1">
<div className="text-sm font-bold text-on-surface">EchoValley</div>
<div className="text-xs text-outline">65 MV 作品</div>
</div>
</div>
</div>
</div>
{/* Trending Tags */}
<div className="bg-surface-container-lowest rounded-2xl p-6 ghost-border">
<h3 className="font-display font-bold text-lg text-on-surface mb-4">热门风格</h3>
<div className="flex flex-wrap gap-2">
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-secondary cursor-pointer transition-colors border border-surface-container-highest">赛博朋克</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-primary cursor-pointer transition-colors border border-surface-container-highest">水墨风</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-on-surface-variant cursor-pointer transition-colors border border-surface-container-highest">二次元</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-on-surface-variant cursor-pointer transition-colors border border-surface-container-highest">像素艺术</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-tertiary cursor-pointer transition-colors border border-surface-container-highest">复古波普</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-on-surface-variant cursor-pointer transition-colors border border-surface-container-highest">3D 渲染</span>
<span className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs md:text-sm text-on-surface-variant cursor-pointer transition-colors border border-surface-container-highest">蒸汽波</span>
</div>
</div>
</aside>
</main>

    </>
  );
}
