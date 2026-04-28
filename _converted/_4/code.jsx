export default function Page() {
  return (
    <>

{/* TopNavBar */}
<header className="fixed top-0 w-full z-50 bg-[#14121F]/90 backdrop-blur-xl border-b border-[#4A4455]/20 shadow-sm transition-all duration-300">
<div className="flex items-center justify-between px-6 h-16 w-full">
<div className="flex items-center gap-10">
<span className="text-xl font-bold tracking-tighter text-secondary font-headline">MeloVision</span>
<nav className="hidden md:flex gap-8 items-center h-full">
<div className="flex flex-col justify-center h-16 relative">
<a className="text-[#E5E0F3] font-['Space_Grotesk'] text-sm tracking-tight" href="#">工作台</a>
<div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#7C3AED]"></div>
</div>
<a className="text-[#E5E0F3]/50 hover:text-[#E5E0F3] font-['Space_Grotesk'] text-sm tracking-tight transition-colors" href="#">项目</a>
<a className="text-[#E5E0F3]/50 hover:text-[#E5E0F3] font-['Space_Grotesk'] text-sm tracking-tight transition-colors" href="#">素材库</a>
</nav>
</div>
<div className="flex items-center gap-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]" style={{fontVariationSettings: ''FILL' 1'}}>stars</span>
<span className="text-[#E5E0F3] font-medium text-sm">50 积分</span>
</div>
<button className="px-5 py-1.5 bg-[#2B2836] hover:bg-[#363342] text-[#E5E0F3] text-sm rounded-full transition-colors">
升级
</button>
<div className="p-[2px] rounded-full bg-gradient-to-r from-secondary to-[#7C3AED]">
<img alt="User avatar" className="w-8 h-8 rounded-full border-2 border-[#14121F]" data-alt="Close up portrait of a young woman with natural makeup in soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS3srMndWhw7s3pl6y6pr6rShXwQvdeaq4x7Vnt8wnczqWIjowrNJGha5hKpucyff7ApwNAFr0uGDM8rgPzgH4RZ6tyijp-9Y5tNFhS1NCy-o8kj7VG03prf_o7BQ4Fzt7K-fO8wEn-vxPWsCVuNDRrVDFM-P-Ux4KrGNv0T4pjTkQdXE2Xk4gTrgU4-xP5ureNK22fHwerT6tjAVug5mUVGm-2oChkq6JgR7TeOHTfCl-gG1AgF6UfQJMyc16dOi3d4YPkKPafw"/>
</div>
</div>
</div>
</header>
{/* Main Workspace */}
<div className="flex flex-1 pt-16">
{/* SideNavBar - Concept Summary */}
<aside className="hidden md:flex flex-col w-72 fixed left-0 top-16 bottom-20 bg-surface-container-low border-r border-outline-variant/10 px-6 py-8 overflow-y-auto z-10">
<div className="mb-8">
<h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-2">Project Input</h3>
<h2 className="text-title-lg font-bold text-primary mb-1">星际之旅</h2>
<p className="text-sm text-on-surface-variant">Project Neon • Vibe: Cyberpunk Synth</p>
</div>
<div className="space-y-6">
<div>
<h4 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">Concept Description</h4>
<p className="text-sm text-on-surface leading-relaxed">一段关于深夜都市漫步的梦幻 Lo-fi 音乐，霓虹灯光与雨中倒影，带有轻微的电子合成器跳动感，节奏舒缓，适合独处时光。</p>
</div>
<div>
<h4 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">Style Tags</h4>
<div className="flex flex-wrap gap-2">
<span className="px-2 py-1 rounded bg-surface-variant text-xs text-secondary">Cyberpunk</span>
<span className="px-2 py-1 rounded bg-surface-variant text-xs text-secondary">Lo-fi</span>
<span className="px-2 py-1 rounded bg-surface-variant text-xs text-secondary">Female Vocal</span>
</div>
</div>
</div>
</aside>
{/* Main Content */}
<main className="flex-1 ml-0 md:ml-72 px-6 py-8 md:px-12 md:py-10 max-w-5xl mx-auto w-full">
{/* Stepper */}
<div className="mb-12 flex items-center justify-between w-full max-w-4xl mx-auto px-4">
{/* Step 1 */}
<div className="flex flex-col items-center gap-3 relative z-10">
<div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            1
        </div>
<span className="text-xs text-on-surface-variant font-medium">描述</span>
</div>
{/* Connector 1-2 */}
<div className="flex-1 h-[1px] bg-outline-variant/20 -mt-8"></div>
{/* Step 2 */}
<div className="flex flex-col items-center gap-3 relative z-10">
<div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(124,58,237,0.6)] ring-4 ring-[#7C3AED]/20">
            2
        </div>
<span className="text-xs text-[#D2BBFF] font-bold">音乐</span>
</div>
{/* Connector 2-3 */}
<div className="flex-1 h-[1px] bg-outline-variant/10 -mt-8"></div>
{/* Step 3 */}
<div className="flex flex-col items-center gap-3 relative z-10">
<div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/40 font-bold text-sm">
            3
        </div>
<span className="text-xs text-on-surface-variant/40 font-medium">分镜</span>
</div>
{/* Connector 3-4 */}
<div className="flex-1 h-[1px] bg-outline-variant/10 -mt-8"></div>
{/* Step 4 */}
<div className="flex flex-col items-center gap-3 relative z-10">
<div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/40 font-bold text-sm">
            4
        </div>
<span className="text-xs text-on-surface-variant/40 font-medium">生成</span>
</div>
{/* Connector 4-5 */}
<div className="flex-1 h-[1px] bg-outline-variant/10 -mt-8"></div>
{/* Step 5 */}
<div className="flex flex-col items-center gap-3 relative z-10">
<div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center text-on-surface-variant/40 font-bold text-sm">
            5
        </div>
<span className="text-xs text-on-surface-variant/40 font-medium">导出</span>
</div>
</div>
{/* Header */}
<div className="mb-8">
<h1 className="text-headline-md font-bold mb-2 text-on-surface">选择你最喜欢的曲目</h1>
<p className="text-on-surface-variant text-sm">AI 已基于您的创意生成了 3 个初始版本，请试听并选择最契合的一首进入下一步。</p>
</div>
{/* Candidate Cards List */}
<div className="space-y-6 mb-10">
{/* Card 1 (Active) */}
<div className="relative bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-1 group border border-outline-variant/20 before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-primary before:opacity-100 before:shadow-[0_0_20px_rgba(210,187,255,0.3)] before:pointer-events-none">
<div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(210,187,255,0.5)]">
<span className="material-symbols-outlined text-surface text-sm font-bold">check</span>
</div>
<div className="flex flex-col md:flex-row gap-6">
{/* Play/Artwork */}
<div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-variant group-hover:shadow-[0_0_30px_rgba(76,215,246,0.2)] transition-shadow">
<img alt="Cover Art" className="w-full h-full object-cover opacity-60" data-alt="Abstract liquid neon colors swirling in dark space primarily violet and cyan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC44cA-L1HssGekXJ13GGjzquZm2lA6Nfy0_DrdNmmV_ZKnlxY_jWlvhs8GOI7MKVs5bznAKDd91rDhKYPouAkHOvznkNadiwOuTT8jv3SJgHnGlAy9xMvwU0yr_R8Kcl7rC-k95p3EIubYdfykdukiEzMCEc-D91bWyye1H385x-HcfxfjyfORpYvqw2zdx_nvj7yqNQOgGHXQeFB1MLrfYkxDPB4alDn7kV5NZEb98acIYczC4nV8ZUR3eL5ZaPVXyPd7SavTvw"/>
<button className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors">
<span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings: ''FILL' 1'}}>play_circle</span>
</button>
</div>
{/* Info */}
<div className="flex-1">
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="text-title-lg font-bold text-primary mb-1">版本 A - Midnight Wanderer</h3>
<span className="text-xs text-on-surface-variant font-mono">Duration: 3:12</span>
</div>
</div>
<p className="text-sm text-on-surface-variant italic mb-4">"星光闪烁在无人的街道, 霓虹倒影在雨水里舞蹈..."</p>
<div className="flex gap-2 mb-4">
<span className="px-2 py-1 rounded bg-surface text-xs text-secondary border border-outline-variant/30">Lo-fi</span>
<span className="px-2 py-1 rounded bg-surface text-xs text-secondary border border-outline-variant/30">Dreamy</span>
<span className="px-2 py-1 rounded bg-surface text-xs text-secondary border border-outline-variant/30">Female Vocal</span>
</div>
{/* Waveform Mini */}
<div className="h-8 flex items-center gap-[2px] opacity-80">
{/* Simulated Waveform Bars */}
<div className="w-1 bg-secondary h-2 rounded-full"></div>
<div className="w-1 bg-secondary h-4 rounded-full"></div>
<div className="w-1 bg-secondary h-6 rounded-full"></div>
<div className="w-1 bg-secondary h-3 rounded-full"></div>
<div className="w-1 bg-secondary h-8 rounded-full"></div>
<div className="w-1 bg-secondary h-5 rounded-full shadow-[0_0_8px_rgba(76,215,246,0.8)]"></div>
<div className="w-1 bg-outline-variant h-2 rounded-full"></div>
<div className="w-1 bg-outline-variant h-4 rounded-full"></div>
<div className="w-1 bg-outline-variant h-3 rounded-full"></div>
<div className="w-1 bg-outline-variant h-6 rounded-full"></div>
<div className="w-1 bg-outline-variant h-2 rounded-full"></div>
</div>
</div>
</div>
</div>
{/* Card 2 */}
<div className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-1 group border border-outline-variant/20">
<div className="flex flex-col md:flex-row gap-6 items-center">
<div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img alt="Cover Art" className="w-full h-full object-cover opacity-40" data-alt="Dark moody abstract gradient mesh background with subtle purple and dark blue tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFYgeSnUToWcpAw7Ip8WyDwEnVlyl-ZPwu13vnsLygppUtaIC-QLOiOOOhqFFnY9gNs7x7nn81YE9vzJzxmONd3G9rR-eQngQManszFb1ICZt9fYXp8IAXnQAqAq4eNfEsOOyEcYLB7Fcc51aXeu70LYcPWD7TjWfRM6iJyns-sAg_sL8LVaKEigGzSgSGgD-L6Ba_VHeP2vANFgx6RSA4cChOC_xyO4wJIh-lbozprIlePl6LymtxCkPTrqjpFBT8bA1dJ9HuQA"/>
<button className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors">
<span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary">play_arrow</span>
</button>
</div>
<div className="flex-1 text-left w-full">
<h3 className="text-lg font-semibold text-on-surface mb-1">版本 B - Neon Reflections</h3>
<span className="text-xs text-on-surface-variant font-mono">Duration: 2:45</span>
</div>
<button className="w-full md:w-auto px-6 py-2 rounded-lg border border-outline-variant/50 text-sm font-medium hover:bg-surface-variant hover:text-primary transition-colors">选择此项</button>
</div>
</div>
{/* Card 3 */}
<div className="bg-surface-container-lowest rounded-xl p-6 transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-1 group border border-outline-variant/20">
<div className="flex flex-col md:flex-row gap-6 items-center">
<div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-variant">
<img alt="Cover Art" className="w-full h-full object-cover opacity-40 grayscale" data-alt="Abstract dark surface with faint cyan glowing lines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeeyhg_XsGLk5TZvHv33JheIOIHk9Fu0RB90XpGrshALLf_IhGmKsxT85rvMbhIdjTU16z1crKDyrMIEpS8eyWpJa129vhyh61DD8AICoZ3ULkSvByO3I3QNOBEsJl0S23pnrWsxtbX8cnqYlk5ZD04z4Q5u4LGC21fWH7BPJodoyoQeUwz1I6Ji1rud245r3agMvjCQxFficNQkhDvoT1EPaOFipI32009lCCQXvuw_8ZpIavBr0k2jE6zo8ybYUXrS06aQrQwQ"/>
<button className="absolute inset-0 flex items-center justify-center hover:bg-black/20 transition-colors">
<span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary">play_arrow</span>
</button>
</div>
<div className="flex-1 text-left w-full">
<h3 className="text-lg font-semibold text-on-surface mb-1">版本 C - City Pulse</h3>
<span className="text-xs text-on-surface-variant font-mono">Duration: 3:05</span>
</div>
<button className="w-full md:w-auto px-6 py-2 rounded-lg border border-outline-variant/50 text-sm font-medium hover:bg-surface-variant hover:text-primary transition-colors">选择此项</button>
</div>
</div>
</div>
{/* Regenerate Action */}
<div className="flex justify-center mb-8">
<button className="group flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant/20 text-sm font-medium text-on-surface-variant hover:text-secondary hover:border-secondary/50 transition-all relative overflow-hidden">
<span className="material-symbols-outlined text-sm group-hover:animate-spin">sync</span>
                    重新生成 (消耗 5 积分)
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-300"></div>
</button>
</div>
</main>
</div>
{/* BottomNavBar */}
<div className="fixed bottom-0 left-0 md:left-72 right-0 h-20 bg-[#14121F]/90 backdrop-blur-lg border-t border-[#4A4455]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
<div className="flex justify-between items-center px-6 md:px-12 h-full">
<button className="text-[#E5E0F3] border border-[#4A4455]/40 rounded-lg px-6 py-3 font-['Space_Grotesk'] font-bold uppercase tracking-widest text-xs hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-sm">arrow_back</span>
                返回修改创意
            </button>
<button className="bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] text-white rounded-lg px-8 py-3 font-['Space_Grotesk'] font-bold uppercase tracking-widest text-xs hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
                继续下一步
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>

    </>
  );
}
