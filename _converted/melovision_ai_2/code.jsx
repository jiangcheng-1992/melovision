export default function Page() {
  return (
    <>

{/* Top Navigation (Shell) */}
<header className="fixed top-0 w-full flex justify-between items-center px-6 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] z-50">
<div className="flex items-center gap-8">
<div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-headline">
                MeloVision
            </div>
<nav className="hidden md:flex gap-6">
<a className="text-slate-400 hover:text-violet-300 transition-colors font-medium" href="#">工作台</a>
<a className="text-violet-400 font-bold transition-colors font-medium" href="#">项目</a>
<a className="text-slate-400 hover:text-violet-300 transition-colors font-medium" href="#">素材库</a>
</nav>
</div>
<div className="flex items-center gap-4">
<div className="text-violet-400 font-medium font-headline">50 积分</div>
<button className="px-4 py-1.5 rounded-full border border-outline-variant/20 glass-panel hover:bg-white/5 text-sm font-medium transition-colors">
                升级
            </button>
<div className="flex gap-3 text-slate-400">
<button className="hover:text-violet-300 transition-colors"><span className="material-symbols-outlined">notifications</span></button>
<button className="hover:text-violet-300 transition-colors"><span className="material-symbols-outlined">help</span></button>
</div>
<img alt="User avatar" className="w-8 h-8 rounded-full border border-white/10" data-alt="close-up portrait of a person with neon purple and cyan lighting in a futuristic cyberpunk style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz6zuK0EVnWnsMpRaoxHdZPBvmTF_9pvZ5dlbjeuCe_pE69Pw0_NZXJAE2BrQbC8xZuBYee8E3AgG10a4E-LKY2CkB5OEJ1-9cDTFzoXV9vFDT4A-xwPv8Mp1fJEPOZWuYojDQpSGTHDYitpi8kvoadbOJlj6IsOboKqkyFuwoLN0OtED_ezVdgHgt7clo3--7ZpAI-IkD0UdV3tQY-63j8oBETQ06M3zFzzqvYrlML9ZI-EVIuJmW8MBc-rcCYFLz8ouDQYYxGg"/>
</div>
</header>
{/* Main Content Canvas */}
<main className="flex-1 mt-16 p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
{/* Header Section */}
<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
<div>
<h1 className="text-4xl font-headline tracking-tight">我的项目 <span className="text-on-surface-variant text-2xl font-normal">(23)</span></h1>
</div>
<button className="bg-gradient-to-r from-primary-container to-secondary-container hover:shadow-[0_0_20px_rgba(210,187,255,0.3)] text-white px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2">
<span className="material-symbols-outlined">add</span>
                创建新 MV
            </button>
</div>
{/* Toolbar Section */}
<div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-surface-container-low p-4 rounded-xl">
<div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
<div className="relative flex-1 lg:w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
<input className="w-full bg-surface-container-lowest border-none outline-none focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant rounded-lg pl-10 pr-4 py-2 text-sm transition-all shadow-[inset_0_0_10px_rgba(124,58,237,0.05)]" placeholder="搜索项目..." type="text"/>
</div>
<div className="flex gap-1 p-1 bg-surface-container-lowest rounded-lg overflow-x-auto">
<button className="px-3 py-1.5 rounded-md bg-surface-variant text-on-surface text-sm whitespace-nowrap">全部</button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface text-sm whitespace-nowrap transition-colors">草稿</button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface text-sm whitespace-nowrap transition-colors">生成中</button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface text-sm whitespace-nowrap transition-colors">已完成</button>
<button className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface text-sm whitespace-nowrap transition-colors">失败</button>
</div>
</div>
<div className="flex items-center gap-3">
<button className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/50 flex items-center gap-2 text-sm text-on-surface-variant transition-colors">
<span className="material-symbols-outlined text-[18px]">tune</span>
                    风格筛选
                </button>
<button className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/50 flex items-center gap-2 text-sm text-on-surface-variant transition-colors">
<span className="material-symbols-outlined text-[18px]">sort</span>
                    最近更新
                </button>
<div className="flex bg-surface-container-lowest rounded-lg p-1 border border-outline-variant/20">
<button className="p-1 rounded-md bg-surface-variant text-primary transition-colors"><span className="material-symbols-outlined">grid_view</span></button>
<button className="p-1 rounded-md text-on-surface-variant hover:text-on-surface transition-colors"><span className="material-symbols-outlined">view_list</span></button>
</div>
</div>
</div>
{/* Grid View */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{/* Card 1: Completed */}
<div className="group relative bg-surface-container rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(210,187,255,0.1)]">
<div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
<img alt="午夜漫游者" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" data-alt="neon glowing city street at night in a moody cyberpunk style with deep purple and cyan reflections on wet pavement" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPVl_vpL5BCVTCh1ygohCwp1dcYVNRiP16-2dxXI-18dcKbINjbZ_n5uhaUea_HmTzNPJMxsOY-GcZJnk66uFySKM6GBjg-yLRyt23aDYRk0hF7uJx2RuLDuqOTHFj4-KphKthHu-vn2VPSD2glyGt5yrlCF7oZt2iTHxKvKxRpuYaKq8QtUx8G4p6iNvpPwlq4PVn04lwipzacbC2s1htNhzzwzEFdsSIyao_ZkzTX-FVw8gVsXy98Lp-RgJxk_q3JiUy4Rm7ig"/>
<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
<div className="absolute top-3 left-3 bg-surface-container/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
<span className="text-[10px] text-secondary">✅ 已完成</span>
</div>
<button className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
<div className="absolute bottom-3 left-3 flex gap-2">
<span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[10px] text-on-surface font-medium border border-white/10">Lo-fi</span>
<span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[10px] text-on-surface font-medium border border-white/10">赛博朋克</span>
</div>
<div className="absolute bottom-3 right-3 flex gap-3 text-xs text-on-surface/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded border border-white/10">
<span>❤️ 234</span>
<span>▶️ 1.2K</span>
</div>
</div>
<div className="p-4">
<h3 className="text-lg font-medium text-on-surface mb-1 truncate">午夜漫游者</h3>
<p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 2小时前更新</p>
</div>
</div>
{/* Card 2: Generating */}
<div className="group relative bg-surface-container rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300">
<div className="aspect-video relative overflow-hidden bg-surface-container-lowest">
<img alt="星际之旅" className="w-full h-full object-cover opacity-30 blur-sm" data-alt="abstract swirling galaxy with vibrant purple and blue cosmic dust and distant stars" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMZh159quZ5-GPK4tAOzXp-jaZp2X-0sAiUI1lqDUXXbYTimlD2mTnDVBrxtm7EpRWnsfRM9MYD3yE2w5xC6F0tiGnyI2iWBdoxdIMTxCPzGVUGCwYR1WfQ1lW3aJpWHCITBwhbEdR6o2_bs4Jqldzd_V65Kf7AeaELY2-i51Dt3ZLAF4XrNkscBu5v8cohhB-K9MupZzS_bfPSl5KdYE2JC16Uuq4dUa-6My1ItGV8AK98kVy10QSqcdSEuVG14C5OY-yZA07Rw"/>
<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[2px]">
<div className="text-secondary font-headline text-2xl font-bold mb-2">68%</div>
<div className="w-1/2 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-gradient-to-r from-primary to-secondary w-[68%] relative">
<div className="absolute inset-0 bg-white/20 animate-pulse"></div>
</div>
</div>
</div>
<div className="absolute top-3 left-3 bg-surface-container/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
<span className="material-symbols-outlined text-[12px] text-primary animate-spin">sync</span>
<span className="text-[10px] text-primary">正在生成...</span>
</div>
<button className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
<div className="absolute bottom-3 left-3 flex gap-2">
<span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[10px] text-on-surface font-medium border border-white/10">电子</span>
<span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[10px] text-on-surface font-medium border border-white/10">科幻</span>
</div>
</div>
<div className="p-4">
<h3 className="text-lg font-medium text-on-surface mb-1 truncate">星际之旅</h3>
<p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 10分钟前更新</p>
</div>
</div>
{/* Card 3: Draft */}
<div className="group relative bg-surface-container rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300 border border-dashed border-outline-variant/30">
<div className="aspect-video relative overflow-hidden bg-surface-container-lowest flex items-center justify-center group-hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50">edit</span>
<div className="absolute top-3 left-3 bg-surface-container/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
<span className="text-[10px] text-on-surface-variant">📝 草稿</span>
</div>
<button className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
<div className="p-4">
<h3 className="text-lg font-medium text-on-surface-variant mb-1 truncate group-hover:text-on-surface transition-colors">未命名创意</h3>
<p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 1天前创建</p>
</div>
</div>
{/* Card 4: Failed */}
<div className="group relative bg-surface-container rounded-2xl overflow-hidden hover:bg-surface-container-high transition-all duration-300">
<div className="aspect-video relative overflow-hidden bg-error/5 flex flex-col items-center justify-center border-b border-error/10">
<span className="material-symbols-outlined text-3xl text-error mb-2">warning</span>
<span className="text-sm text-error/80">渲染引擎错误</span>
<div className="absolute top-3 left-3 bg-error/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-error/20 flex items-center gap-1.5">
<span className="text-[10px] text-error">❌ 生成失败</span>
</div>
<button className="absolute top-3 right-3 text-white/50 hover:text-white p-1 rounded-full bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">more_vert</span>
</button>
<button className="absolute bottom-3 right-3 px-3 py-1 bg-surface-container-high hover:bg-surface-variant text-xs text-on-surface rounded border border-white/10 transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">refresh</span> 重试
                    </button>
</div>
<div className="p-4">
<h3 className="text-lg font-medium text-on-surface mb-1 truncate">失败的尝试</h3>
<p className="text-xs text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 2天前</p>
</div>
</div>
</div>
</main>

    </>
  );
}
