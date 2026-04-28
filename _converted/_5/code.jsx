export default function Page() {
  return (
    <>

{/* TopNavBar (Updated to match IMAGE_8) */}
<nav className="bg-[#0e0c19]/90 backdrop-blur-2xl border-b border-outline-variant/10 z-50">
<div className="flex justify-between items-center w-full px-6 py-3">
{/* Brand */}
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary-container text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>graphic_eq</span>
<span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] font-headline">MeloVision AI</span>
<div className="ml-10 hidden lg:flex items-center space-x-6">
<a className="text-primary font-bold border-b-2 border-primary pb-1 text-sm font-label" href="#">工作台</a>
<a className="text-on-surface-variant hover:text-on-surface text-sm font-label transition-colors" href="#">项目</a>
<a className="text-on-surface-variant hover:text-on-surface text-sm font-label transition-colors" href="#">素材库</a>
</div>
</div>
{/* Right Actions */}
<div className="flex items-center space-x-6">
<div className="flex items-center space-x-2 text-on-surface-variant bg-surface-container-highest/30 px-3 py-1.5 rounded-full border border-outline-variant/10">
<span className="material-symbols-outlined text-[18px] text-secondary" style={{fontVariationSettings: ''FILL' 1'}}>stars</span>
<span className="text-xs font-bold">50 积分</span>
</div>
<button className="bg-[#2b2836] hover:bg-[#363342] text-on-surface px-5 py-1.5 rounded-full font-medium text-xs border border-outline-variant/20 transition-all">
                    升级
                </button>
<div className="flex items-center space-x-4">
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-xl">notifications</span>
</button>
<button className="text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-xl">settings</span>
</button>
<div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/40 shadow-[0_0_10px_rgba(210,187,255,0.3)]">
<img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmNO51OFOncDAyCmtuq8s4s8swUJZsfDeRWQcXoFJzJx7reSQzq2SKxthRh3CcZ677KR-N-rvdmcToowAC8TfDWxUKuQNfUa5dnjOqx4Q2c032Co_S1P9As_m1OsWjOFXQy8ay1q11ybpWuu4YPf6McWQAtOqM90KeMWB774_Kuu3fFw-RjYLQyDutlQtl7mNgflOrvjTLfIY-XSxEF7qjstQRSaVtm11XBIqTEeEK6q32DwT9MPFgKxMgYMoCiSckCmbTR8AAng"/>
</div>
</div>
</div>
</div>
</nav>
{/* Main Workspace Area */}
<main className="flex-1 flex flex-col relative overflow-hidden">
{/* Horizontal Stepper Header (Updated to match IMAGE_8) */}
<header className="bg-[#0e0c19]/60 border-b border-outline-variant/10 px-8 py-8 shrink-0 z-10 relative">
<div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2">
<span className="text-sm font-label text-on-surface/80">创作工作台</span>
<span className="text-sm text-outline-variant">/ 午夜漫游者</span>
</div>
<div className="max-w-4xl mx-auto flex justify-between items-start relative px-12">
{/* Progress Line Background */}
<div className="absolute left-[12%] right-[12%] top-6 h-[1px] bg-outline-variant/20 -z-10"></div>
{/* Progress Line Active (Partially filled) */}
<div className="absolute left-[12%] w-[42%] top-6 h-[1px] bg-primary/60 -z-10"></div>
{/* Step 1: Done */}
<div className="flex flex-col items-center gap-3">
<div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-headline relative">
<span className="material-symbols-outlined text-xl">check</span>
</div>
<span className="text-sm font-label text-on-surface-variant">描述</span>
</div>
{/* Step 2: Done */}
<div className="flex flex-col items-center gap-3">
<div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white text-lg font-headline relative">
<span className="material-symbols-outlined text-xl">check</span>
</div>
<span className="text-sm font-label text-on-surface-variant">音乐</span>
</div>
{/* Step 3: Active */}
<div className="flex flex-col items-center gap-3">
<div className="w-14 h-14 -mt-1 rounded-full bg-primary-container flex items-center justify-center text-white text-xl font-bold shadow-[0_0_30px_rgba(124,58,237,0.7)] ring-4 ring-primary-container/20 relative">
                        3
                    </div>
<span className="text-sm font-label font-bold text-on-surface">分镜</span>
</div>
{/* Step 4: Upcoming */}
<div className="flex flex-col items-center gap-3">
<div className="w-12 h-12 rounded-full bg-[#1c1a27] border border-outline-variant/30 flex items-center justify-center text-on-surface-variant text-lg font-headline">
                        4
                    </div>
<span className="text-sm font-label text-outline-variant">生成</span>
</div>
{/* Step 5: Upcoming */}
<div className="flex flex-col items-center gap-3">
<div className="w-12 h-12 rounded-full bg-[#1c1a27] border border-outline-variant/30 flex items-center justify-center text-on-surface-variant text-lg font-headline">
                        5
                    </div>
<span className="text-sm font-label text-outline-variant">导出</span>
</div>
</div>
</header>
{/* Split Layout Workspace */}
<div className="flex-1 flex overflow-hidden">
{/* LEFT PANEL: Storyboard List (60%) */}
<section className="w-[60%] overflow-y-auto px-8 py-8 pb-32">
<div className="flex items-center justify-between mb-8">
<h1 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-3">
<span className="material-symbols-outlined text-primary-container">movie</span>
                        您的 MV 分镜
                    </h1>
<span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-medium text-on-surface-variant border border-outline-variant/20">
                        自动生成完成
                    </span>
</div>
<div className="flex flex-col gap-6">
{/* Scene Card 1 */}
<div className="group relative bg-surface-container rounded-2xl p-5 transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-1">
<div className="flex gap-4">
<div className="text-outline-variant cursor-grab pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">drag_indicator</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-3">
<div className="flex items-center gap-3">
<span className="font-headline font-bold text-lg text-secondary">#1</span>
<span className="text-xs font-mono bg-surface-container-lowest px-2 py-1 rounded text-on-surface-variant">0:00 - 0:15</span>
</div>
<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-1.5 text-on-surface-variant hover:text-secondary bg-surface-container-lowest rounded-lg transition-colors">
<span className="material-symbols-outlined text-sm">autorenew</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error bg-surface-container-lowest rounded-lg transition-colors">
<span className="material-symbols-outlined text-sm">delete</span>
</button>
</div>
</div>
<div className="mb-4 pl-4 border-l-2 border-outline-variant/30 text-on-surface-variant/80 italic text-sm">
                                    "霓虹闪烁的街道，雨滴倒映着未来的轮廓..."
                                </div>
<div className="relative">
<textarea className="w-full bg-surface-container-lowest border-0 rounded-xl p-4 text-sm text-on-surface resize-none focus:ring-1 focus:ring-primary/50 transition-shadow h-24" readonly="">Cinematic establishing shot of a futuristic cyberpunk city street at night, neon lights reflecting in puddles, cinematic lighting, 8k resolution, highly detailed, photorealistic.</textarea>
<button className="absolute top-2 right-2 p-2 text-outline-variant hover:text-primary transition-colors bg-surface-container-lowest rounded-lg">
<span className="material-symbols-outlined text-sm">edit</span>
</button>
</div>
</div>
</div>
</div>
{/* Scene Card 2 (ACTIVE STATE) */}
<div className="group relative bg-surface-container-high rounded-2xl p-5 shadow-[0_0_30px_rgba(124,58,237,0.1)] ring-1 ring-primary/40 overflow-hidden">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-container to-secondary-container"></div>
<div className="flex gap-4">
<div className="text-primary-container cursor-grab pt-2">
<span className="material-symbols-outlined">drag_indicator</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-3">
<div className="flex items-center gap-3">
<span className="font-headline font-bold text-lg text-primary">#2</span>
<span className="text-xs font-mono bg-surface-container-lowest px-2 py-1 rounded text-primary border border-primary/20">0:15 - 0:32</span>
<span className="flex items-center gap-1 text-[10px] text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span> 当前编辑
                                        </span>
</div>
<div className="flex gap-2">
<button className="p-1.5 text-secondary bg-surface-container-lowest rounded-lg hover:bg-surface-variant transition-colors group/btn relative">
<span className="material-symbols-outlined text-sm">autorenew</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error bg-surface-container-lowest rounded-lg transition-colors">
<span className="material-symbols-outlined text-sm">delete</span>
</button>
</div>
</div>
<div className="mb-4 pl-4 border-l-2 border-primary/50 text-on-surface italic text-sm">
                                    "她穿过拥挤的人潮，寻找那个遗失的信号..."
                                </div>
<div className="relative">
<textarea className="w-full bg-surface-container-lowest border border-primary/30 rounded-xl p-4 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] h-32 leading-relaxed">Medium close-up of a young woman with glowing cybernetic implants walking through a crowded neon-lit market, looking determined, holding a mysterious glowing device, cinematic teal and orange color grading, dramatic shadows.</textarea>
<button className="absolute bottom-3 right-3 px-3 py-1.5 bg-primary-container hover:bg-primary text-white text-xs rounded-lg transition-colors flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">magic_button</span>
                                        AI 优化
                                    </button>
</div>
</div>
</div>
</div>
{/* Scene Card 3 */}
<div className="group relative bg-surface-container rounded-2xl p-5 transition-all duration-300 hover:bg-surface-container-high hover:-translate-y-1">
<div className="flex gap-4">
<div className="text-outline-variant cursor-grab pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined">drag_indicator</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-center mb-3">
<div className="flex items-center gap-3">
<span className="font-headline font-bold text-lg text-secondary">#3</span>
<span className="text-xs font-mono bg-surface-container-lowest px-2 py-1 rounded text-on-surface-variant">0:32 - 0:48</span>
</div>
</div>
<div className="mb-4 pl-4 border-l-2 border-outline-variant/30 text-on-surface-variant/80 italic text-sm">
                                    "数据流在夜空中爆炸，照亮了虚拟的王座..."
                                </div>
<div className="relative">
<textarea className="w-full bg-surface-container-lowest border-0 rounded-xl p-4 text-sm text-on-surface resize-none focus:ring-1 focus:ring-primary/50 transition-shadow h-24" readonly="">Wide shot, low angle, massive digital data streams erupting into the night sky over a futuristic metropolis, forming an abstract throne shape, highly energetic, vibrant glowing colors, octane render.</textarea>
</div>
</div>
</div>
</div>
{/* Add Scene Button */}
<button className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-2xl text-outline-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-2 font-medium bg-surface-container-lowest/50">
<span className="material-symbols-outlined">add_circle</span>
                        添加新场景
                    </button>
</div>
</section>
{/* RIGHT PANEL: Preview & Tools (40% Sticky) */}
<aside className="w-[40%] bg-surface-container-low border-l border-outline-variant/20 flex flex-col relative">
<div className="p-6 flex flex-col gap-6 h-full overflow-y-auto pb-32">
{/* Preview Area */}
<div className="flex flex-col gap-3">
<h2 className="text-sm font-label font-medium text-on-surface-variant flex items-center gap-2 uppercase tracking-widest">
<span className="material-symbols-outlined text-[16px]">visibility</span>
                            场景 #2 概念预览
                        </h2>
<div className="aspect-video bg-surface-container-lowest rounded-xl relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.3)] border border-outline-variant/20">
<img alt="Concept art preview" className="w-full h-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnwnKYLQ4d02jCoEsFSchKuA_j0D6oQ_6McYi7bEp_GtR0FnJD-nKWU_ysI5vF9B6lZqhVyHQ0PHhtaYqFUhuUMJ6eIe-wlCDUIlgGk5LLcIdo9-M-GrNnwIhModWRfabLNSo1kbKTUbjWs3tPmZmHrvOfwvr2Vz8X0mvYQ5vWae3GVjgUbACjpZeFWvemn8km4V3tbUxLw0vZUStrTDlcD0tcVfkScKFxvbqlU-Mf6jIzN0wWDUOOb9oyVv8LwLg5Vjvps8rA3g"/>
<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent flex flex-col justify-end p-4">
<div className="flex justify-between items-end">
<span className="bg-surface-variant/80 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-secondary">0:15 / 3:12</span>
<button className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:scale-110 transition-transform">
<span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1'}}>play_arrow</span>
</button>
</div>
</div>
</div>
</div>
{/* Mini Audio Player */}
<div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">music_note</span>
</div>
<div>
<p className="text-sm font-medium text-on-surface truncate w-48">Neon Echoes (AI Generated)</p>
<p className="text-xs text-on-surface-variant">BPM: 120 · Synthwave</p>
</div>
</div>
<span className="material-symbols-outlined text-outline-variant hover:text-on-surface cursor-pointer">volume_up</span>
</div>
<div className="h-8 flex items-end gap-[2px] w-full mt-2 relative">
<div className="w-[15%] h-full flex items-end gap-[2px] absolute left-0 overflow-hidden">
<div className="w-1 h-[40%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[60%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[30%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[80%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[50%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[90%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[100%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[70%] bg-secondary rounded-t-sm"></div>
<div className="w-1 h-[40%] bg-secondary rounded-t-sm"></div>
</div>
<div className="w-full h-full flex items-end gap-[2px]">
<div className="w-1 h-[40%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[60%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[30%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[80%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[50%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[90%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[100%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[70%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[40%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[60%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[80%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[50%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[30%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[70%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[90%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[60%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[40%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[20%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[50%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[80%] bg-outline-variant/50 rounded-t-sm"></div>
<div className="w-1 h-[100%] bg-outline-variant/50 rounded-t-sm"></div>
</div>
<div className="absolute left-[15%] top-0 bottom-0 w-px bg-primary shadow-[0_0_10px_rgba(210,187,255,1)]"></div>
</div>
</div>
{/* Style Controls */}
<div className="flex flex-col gap-4">
<h2 className="text-sm font-label font-medium text-on-surface-variant flex items-center gap-2 uppercase tracking-widest border-b border-outline-variant/20 pb-2">
<span className="material-symbols-outlined text-[16px]">palette</span>
                            全局视觉风格
                        </h2>
<div>
<span className="text-xs text-on-surface-variant mb-2 block">当前主风格</span>
<div className="flex flex-wrap gap-2">
<div className="px-3 py-1.5 bg-surface-container-high border border-primary/40 rounded-full text-sm text-primary flex items-center gap-1 shadow-[0_0_10px_rgba(124,58,237,0.1)]">
                                    赛博朋克霓虹
                                    <span className="material-symbols-outlined text-[14px] ml-1 cursor-pointer hover:text-white">close</span>
</div>
<div className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant/30 rounded-full text-sm text-on-surface-variant cursor-pointer hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-[14px] mr-1">add</span> 添加标签
                                </div>
</div>
</div>
<div className="bg-surface-container rounded-xl p-4 flex flex-col gap-4">
<div className="flex items-center justify-between">
<div>
<p className="text-sm font-medium text-on-surface">角色一致性</p>
<p className="text-xs text-on-surface-variant">保持跨场景的人物特征</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox" value=""/>
<div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<hr className="border-outline-variant/10"/>
<div>
<label className="block text-xs text-on-surface-variant mb-2">默认过渡风格</label>
<div className="relative">
<select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-2 pl-3 pr-10 text-sm text-on-surface appearance-none focus:ring-1 focus:ring-primary focus:border-primary">
<option>平滑淡入淡出 (Crossfade)</option>
<option>硬切 (Hard Cut)</option>
<option>动感缩放 (Dynamic Zoom)</option>
<option>光效闪白 (Flash)</option>
</select>
<div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-outline-variant">
<span className="material-symbols-outlined">expand_more</span>
</div>
</div>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
{/* Bottom Action Bar */}
<div className="fixed bottom-0 w-full bg-[#14121f]/80 backdrop-blur-2xl border-t border-outline-variant/10 flex justify-between items-center px-8 py-5 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
<button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium">
<span className="material-symbols-outlined">arrow_back</span>
            返回音乐设定
        </button>
<div className="text-sm font-label text-on-surface-variant bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant/10">
            共 <span className="text-on-surface font-bold">16</span> 个场景 · 预计视频时长 <span className="text-secondary font-mono">3:12</span>
</div>
<div className="flex items-center gap-4">
<span className="text-xs text-outline-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">monetization_on</span>
                消耗 20 积分
            </span>
<button className="bg-gradient-to-r from-primary-container to-secondary-container hover:from-primary hover:to-secondary text-white px-8 py-3 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(76,215,246,0.6)] hover:-translate-y-0.5 transition-all flex items-center gap-2 group">
<span className="material-symbols-outlined group-hover:animate-spin-slow">auto_awesome</span>
                生成 MV 视频
            </button>
</div>
</div>

    </>
  );
}
