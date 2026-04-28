export default function Page() {
  return (
    <>

{/* TopNavBar Component */}
<nav className="sticky top-0 z-50 w-full nav-glass border-b border-outline-variant/20">
<div className="max-w-[1440px] mx-auto">
{/* Top row: Logo and Quick Nav */}
<div className="flex justify-between items-center px-6 md:px-10 h-16 w-full">
<div className="flex items-center gap-12">
<div className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] bg-clip-text text-transparent font-display">
                    MeloVision
                </div>
<div className="hidden md:flex gap-8 items-center h-full">
<a className="text-[#E5E0F3]/60 hover:text-[#E5E0F3] transition-colors text-sm font-medium" href="#">工作台</a>
<a className="text-[#E5E0F3]/60 hover:text-[#E5E0F3] transition-colors text-sm font-medium" href="#">项目</a>
<a className="text-[#E5E0F3]/60 hover:text-[#E5E0F3] transition-colors text-sm font-medium" href="#">素材库</a>
</div>
</div>
<div className="flex items-center gap-4">
<div className="bg-[#1C1A27] px-4 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant/10">
<span className="material-symbols-outlined text-secondary text-sm" style={{fontVariationSettings: ''FILL' 1'}}>star</span>
<span className="text-secondary text-sm font-semibold tracking-wide">50 积分</span>
</div>
<button className="bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] text-white px-5 py-1.5 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:scale-105 transition-transform">
                    升级
                </button>
<div className="relative">
<div className="w-9 h-9 rounded-full border-2 border-primary/40 p-0.5 overflow-hidden">
<img alt="User" className="w-full h-full rounded-full object-cover bg-surface-variant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3n9tS8Tz8B0g4H3n9m3T8B0g4H3n9m3T8B0g4H3n9m3T8B0g4"/>
</div>
<div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(210,187,255,0.3)] pointer-events-none"></div>
</div>
</div>
</div>
{/* Stepper row */}
<div className="px-6 md:px-10 py-6 border-t border-outline-variant/10">
<div className="max-w-4xl mx-auto relative flex justify-between items-center">
{/* Progress Line Background */}
<div className="absolute top-[18px] left-0 w-full h-[2px] bg-outline-variant/20 z-0"></div>
{/* Active Progress Line */}
<div className="absolute top-[18px] left-0 w-full h-[2px] bg-gradient-to-r from-[#4CD7F6] to-[#7C3AED] z-0"></div>
{/* Step 1 */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-9 h-9 rounded-full bg-[#4CD7F6] flex items-center justify-center step-completed-glow">
<span className="material-symbols-outlined text-black font-bold text-lg">check</span>
</div>
<span className="text-xs font-medium text-on-surface-variant">描述</span>
</div>
{/* Step 2 */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-9 h-9 rounded-full bg-[#4CD7F6] flex items-center justify-center step-completed-glow">
<span className="material-symbols-outlined text-black font-bold text-lg">check</span>
</div>
<span className="text-xs font-medium text-on-surface-variant">音乐</span>
</div>
{/* Step 3 */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-9 h-9 rounded-full bg-[#4CD7F6] flex items-center justify-center step-completed-glow">
<span className="material-symbols-outlined text-black font-bold text-lg">check</span>
</div>
<span className="text-xs font-medium text-on-surface-variant">分镜</span>
</div>
{/* Step 4 */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-9 h-9 rounded-full bg-[#4CD7F6] flex items-center justify-center step-completed-glow">
<span className="material-symbols-outlined text-black font-bold text-lg">check</span>
</div>
<span className="text-xs font-medium text-on-surface-variant">生成</span>
</div>
{/* Step 5 (Active) */}
<div className="relative z-10 flex flex-col items-center gap-3">
<div className="w-10 h-10 -mt-0.5 rounded-full bg-[#7C3AED] flex items-center justify-center step-active-glow">
<span className="text-white font-bold text-lg">5</span>
</div>
<span className="text-xs font-bold text-primary">导出</span>
</div>
</div>
</div>
</div>
</nav>
<main className="flex-1 max-w-[1440px] mx-auto w-full px-6 md:px-10 py-8">
{/* Main Content Area */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
{/* Left Column: Video Player & Info */}
<div className="xl:col-span-7 flex flex-col gap-6">
{/* Cinematic Player */}
<div className="relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-[0_20px_40px_rgba(3,181,211,0.05)] group">
{/* Placeholder Image */}
<div className="absolute inset-0 bg-surface-container-highest animate-pulse">
<img alt="Video Preview" className="w-full h-full object-cover opacity-80" data-alt="Futuristic cyberpunk cityscape at night with neon purple and cyan glowing lights, raining softly, cinematic wide shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-IFJF1uA2sILcaHTWcap0b1Zcpwk5NC4kecxksehUJOIY2mTm4AfMyjxhwXj7fUBE2JANz2ZO3xak7gWJfsML9IZK6_b39fpF4QAzQUGCpOzYyXjmr_dmYCCpZuIaaaOjfCv1saQVnQ7iKGTtXSXPzkw8Gwd4OvuYprztZdofzggUDOR2Tt3ycbx28Kv0iTkzrsFYd4nhjPrjZj_NV96lkhrGD45VraA534_5_lcJ7cHZAu4cde-Lmp915cRD5zzefnGrDL-Sqw"/>
</div>
{/* Sync Lyrics Overlay */}
<div className="absolute bottom-20 left-0 w-full text-center px-12 pointer-events-none">
<p className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
<span className="text-secondary">Neon lights</span> reflection on the wet streets
                    </p>
</div>
{/* Custom Player Controls */}
<div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-surface-container-lowest/90 to-transparent flex flex-col justify-end px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
{/* Scrubber */}
<div className="w-full h-1.5 bg-surface-variant rounded-full mb-3 cursor-pointer overflow-hidden flex items-center relative">
<div className="h-full bg-primary w-[75%] rounded-full relative">
<div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-secondary rounded-full shadow-[0_0_10px_rgba(76,215,246,0.8)]"></div>
</div>
</div>
{/* Buttons */}
<div className="flex items-center justify-between text-on-surface">
<div className="flex items-center gap-4">
<button className="hover:text-primary transition-colors"><span className="material-symbols-outlined" style={{fontVariationSettings: ''FILL' 1'}}>play_arrow</span></button>
<button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">skip_next</span></button>
<button className="hover:text-primary transition-colors"><span className="material-symbols-outlined">volume_up</span></button>
<span className="text-sm font-label text-on-surface-variant">2:24 / 3:12</span>
</div>
<div className="flex items-center gap-4">
<button className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">closed_caption</span></button>
<button className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">settings</span></button>
<button className="hover:text-secondary transition-colors"><span className="material-symbols-outlined">fullscreen</span></button>
</div>
</div>
</div>
</div>
{/* Track Info */}
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
<div className="flex items-center gap-5">
<div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant/30 shrink-0">
<img alt="Cover Art" className="w-full h-full object-cover" data-alt="Abstract gradient art with deep violet and bright cyan colors blending smoothly" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnjCa48VY4oBLtSRKRolL4j4E4BhUMAyRxCuuZkYB_ARYYL0ON4LCFtc_Nx9K464But8CBIipe_cgVyTcl1jkh9I_LBHvrxMP5cGBGl82F1oN9Mfv9wfirc8IExooHX2R6es5iU4o5v0FO6DFdfe65HIJT_SX92AZzf1twN6jeK0y09MNI1VrnQHeaWl7pdbOi69rHy-gQuhX9DCPaxnjuW88hG3CvMQjlcPRgqXP10Mayv442fXLy_1xT-kdRqLngrY9RZ_YqLQ"/>
</div>
<div>
<h1 className="text-3xl font-display font-bold text-on-surface mb-2 tracking-tight">午夜漫游者</h1>
<div className="flex flex-wrap items-center gap-2">
<span className="px-2.5 py-1 text-xs font-medium rounded-md bg-surface-container-low text-on-surface-variant border border-outline-variant/10">Lo-fi</span>
<span className="px-2.5 py-1 text-xs font-medium rounded-md bg-surface-container-low text-on-surface-variant border border-outline-variant/10">Cyberpunk</span>
<span className="px-2.5 py-1 text-xs font-medium rounded-md bg-surface-container-low text-on-surface-variant border border-outline-variant/10">3:12</span>
<span className="px-2.5 py-1 text-xs font-medium rounded-md bg-surface-container-low text-secondary border border-secondary/20">1080p HD</span>
</div>
</div>
</div>
</div>
</div>
{/* Right Column: Controls & Export Panel */}
<div className="xl:col-span-5 flex flex-col gap-6">
{/* Customize Section */}
<div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden group">
<div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
<h2 className="text-lg font-display font-bold text-on-surface mb-5 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">tune</span> 个性化设置
                </h2>
<div className="space-y-5">
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2">字幕样式</label>
<div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors">
<span className="text-sm">发光霓虹 (Neon Glow)</span>
<span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
</div>
</div>
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-2 flex justify-between">
<span>字体大小</span>
<span className="text-primary text-xs">大</span>
</label>
<div className="w-full h-1.5 bg-surface-container-lowest rounded-full relative">
<div className="absolute left-0 top-0 h-full w-[70%] bg-gradient-to-r from-primary to-secondary rounded-full"></div>
<div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-secondary"></div>
</div>
</div>
<div className="pt-2 border-t border-surface-container-high">
<label className="block text-sm font-medium text-on-surface-variant mb-3">封面预览</label>
<div className="flex items-center gap-4">
<img alt="Cover Preview" className="w-20 h-20 rounded-lg object-cover border border-outline-variant/30" data-alt="Abstract gradient art with deep violet and bright cyan colors blending smoothly, thumbnail size" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8GP6JfXX-wtKpAvGn5hOTaWk8qrAlZfHiUISnYl_LWupInGkFepg7_eaRMUdufU2BX_1boGe3xnmKgW3LDuMh0SfxjS5kgJ8u_XWa07EG1o8NNri8O2yhxcDScJV8JB1dTgLzanT48aSi5CE4eCY-RMLvQYuzq4h17GJL4wTw5D7hNVaTshtWzTlpwxOiYWUQJ8iiUhgVZQy3EqbBoF421un6jWp_wIk9exz3QWP8IUGlMPQ7s8G1cXIhPLzmnfhe4DPXPS5gXA"/>
<button className="flex-1 py-2 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant/20 text-sm font-medium hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">refresh</span> 重新生成封面
                            </button>
</div>
</div>
</div>
</div>
{/* Export Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
{/* Card 1: Download */}
<div className="bg-surface-container-high/80 backdrop-blur-xl rounded-xl p-6 border border-secondary/10 relative overflow-hidden">
<div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/10 rounded-full blur-[30px] pointer-events-none"></div>
<h2 className="text-lg font-display font-bold text-on-surface mb-4 flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">download</span> 导出视频
                    </h2>
<div className="flex gap-2 mb-6">
<button className="flex-1 py-2 rounded-lg bg-surface-container-lowest text-sm text-on-surface-variant border border-transparent hover:border-outline-variant/30 transition-all">720p</button>
<button className="flex-1 py-2 rounded-lg bg-secondary/10 text-secondary text-sm font-medium border border-secondary/30 shadow-[inset_0_0_10px_rgba(76,215,246,0.1)]">1080p HD</button>
<button className="w-16 py-2 rounded-lg bg-surface-container-lowest text-sm text-on-surface-variant border border-transparent cursor-not-allowed opacity-50">MP4</button>
</div>
<button className="w-full bg-gradient-to-r from-primary-container to-secondary-container text-white font-bold py-3.5 px-6 rounded-lg shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_30px_rgba(3,181,211,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                        下载 MV <span className="material-symbols-outlined text-xl">arrow_downward</span>
</button>
</div>
{/* Card 2: Share */}
<div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
<div className="flex items-center justify-between mb-5">
<h2 className="text-lg font-display font-bold text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary">share</span> 发布与分享
                        </h2>
{/* Toggle */}
<div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer border border-primary/30">
<div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary rounded-full shadow-sm"></div>
</div>
</div>
<p className="text-sm text-on-surface-variant mb-4">一键发布到社区或复制链接分享。</p>
<div className="flex gap-3">
<button className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/10 group">
<span className="material-symbols-outlined group-hover:text-secondary transition-colors">link</span>
</button>
<button className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/10">
<span className="text-sm font-medium px-1">推特</span>
</button>
<button className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/10">
<span className="text-sm font-medium px-1">油管</span>
</button>
<button className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-variant text-on-surface transition-colors border border-outline-variant/10">
<span className="text-sm font-medium px-1">B站</span>
</button>
</div>
</div>
</div>
{/* Project Info */}
<div className="flex justify-between items-center px-2 py-1">
<span className="text-xs text-on-surface-variant/60">创建于: 2023-10-27</span>
<span className="text-xs text-on-surface-variant/60">消耗算力: <strong className="text-primary/80">15 Credits</strong></span>
</div>
</div>
</div>
{/* Success Banner Bottom */}
<div className="mt-12 bg-gradient-to-r from-surface-container to-surface-container-high rounded-2xl p-8 border border-secondary/20 shadow-[0_0_40px_rgba(76,215,246,0.05)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
<div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
<div className="flex items-center gap-4 z-10">
<div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
<div>
<h3 className="text-xl font-display font-bold text-white mb-1">🎉 恭喜！您的 MV 已准备就绪。</h3>
<p className="text-sm text-on-surface-variant">文件已自动保存至你的云端素材库。</p>
</div>
</div>
<div className="flex items-center gap-4 z-10 w-full md:w-auto">
<button className="flex-1 md:flex-none py-2.5 px-6 rounded-lg border border-outline-variant/30 text-sm font-medium hover:bg-surface-variant transition-colors whitespace-nowrap">
                前往我的作品
            </button>
<button className="flex-1 md:flex-none py-2.5 px-6 rounded-lg bg-primary-container text-white text-sm font-bold hover:bg-primary-container/80 transition-colors shadow-[0_0_15px_rgba(124,58,237,0.4)] whitespace-nowrap">
                创建新 MV
            </button>
</div>
</div>
</main>

    </>
  );
}
