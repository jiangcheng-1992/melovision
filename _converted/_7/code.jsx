export default function Page() {
  return (
    <>

{/* TopNavBar */}
<nav className="fixed top-0 w-full bg-[#0e0c19]/90 backdrop-blur-2xl border-b border-outline-variant/10 z-50">
<div className="flex justify-between items-center w-full px-6 py-3 max-w-[1200px] mx-auto">
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
<img alt="User profile avatar" className="w-full h-full object-cover" data-alt="Portrait of a young woman with neon lighting reflecting on her face, cyberpunk aesthetic, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7uv5T6w7-SSm-SPqLc1lWayLuRDFd9-NHRRc40PqOD2qRHoC9IRBj-qStXWAfEs8Jd6tSLNTOCAOhdEKUWptbVJ-CRGm3YN4TvYs6e1cZsj2nehlAsROW8LkfRhxP2BGZzm0G8qV2Ni886tVPk5xlqG1196KgUavylEk9gxxwxFIJJFA6iLz0Ayo_-rGjFrj-RxqTTaMI2PctADmbTMvzAJC-uwm-BRND9eOSl_e01VvdBIBTzdX8RD0uQnwsuvOwpWdAWiYPfQ"/>
</div>
</div>
</div>
</div>
</nav>
<main className="md:pt-20">
{/* Profile Banner */}
<div className="relative h-64 md:h-80 overflow-hidden rounded-b-3xl">
<div className="absolute inset-0 bg-cover bg-center" data-alt="Abstract liquid gradient background with deep violet, cyan, and dark purple hues, flowing smooth textures" style={{backgroundImage: 'url('https'}}></div>
<div className="absolute inset-0 bg-surface/40 backdrop-blur-md"></div>
<div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
</div>
<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 mb-12">
<div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
{/* User Info */}
<div className="flex flex-col md:flex-row items-center md:items-end gap-6 z-10 w-full md:w-auto text-center md:text-left">
<div className="relative">
<img alt="StardustCreator Profile" className="w-32 h-32 rounded-full border-4 border-surface shadow-[0_0_30px_rgba(124,58,237,0.4)] object-cover bg-surface-container" data-alt="Portrait of a young woman with neon lighting reflecting on her face, cyberpunk aesthetic, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfP0bPmajt3yED20k9FKlq6RLNrSflAfX3QAvzyWChBG_j3pmgfv4Id-8aRTWccES-vRxwZFK8oGxDtVJ_k6bdSZIsfTf-2eRVmfkfX9kUqblybwLSRg9Zz-UkCQFNHNs3Vq4GWXBEGi1yO0ZCpJqveHWmw5N_VitzrjKKN5ya_vb7h0K6MxeKDAe3vGPEHXXTH8G8xjbj8KvNUJ7WuNkILw1C6zcosc38_BPTnt4FQtQ7GMrTxvQ0oPYpEdu5sh_4oh_4W3HQQA"/>
<div className="absolute bottom-2 right-2 w-4 h-4 bg-secondary rounded-full border-2 border-surface animate-pulse"></div>
</div>
<div className="mb-2">
<div className="flex items-center justify-center md:justify-start gap-3 mb-1">
<h1 className="text-3xl font-display font-bold text-on-surface">StardustCreator</h1>
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-primary-container to-secondary-container text-white uppercase tracking-wider">PRO 会员</span>
</div>
<p className="text-on-surface-variant text-sm mb-3">用 AI 编织音乐与视觉的梦想 🎵✨</p>
<div className="flex items-center justify-center md:justify-start gap-4 text-xs text-outline font-medium">
<span><strong className="text-primary">23</strong> 作品</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span><strong className="text-primary">1.2K</strong> 获赞</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span><strong className="text-primary">8.5K</strong> 播放</span>
</div>
</div>
</div>
{/* Action & Credits */}
<div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full md:w-auto mt-4 md:mt-0">
<button className="px-6 py-2 rounded-lg border border-outline-variant/30 bg-surface-variant/40 backdrop-blur-md text-on-surface text-sm font-medium hover:bg-surface-variant/60 transition-colors w-full sm:w-auto whitespace-nowrap">
                        编辑资料
                    </button>
<div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-4 w-full sm:w-64">
<div className="flex justify-between items-center mb-2">
<span className="text-sm font-medium text-on-surface">✨ 剩余积分</span>
<span className="text-lg font-display font-bold text-secondary">47</span>
</div>
<div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
<div className="h-full bg-gradient-to-r from-primary to-secondary w-3/4 rounded-full"></div>
</div>
<a className="text-xs text-primary hover:text-secondary transition-colors inline-block text-right w-full" href="#">购买积分 →</a>
</div>
</div>
</div>
</div>
{/* Tabs */}
<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
<div className="flex space-x-1 border-b border-outline-variant/20">
<button className="px-6 py-3 text-sm font-medium text-primary border-b-2 border-primary">我的作品</button>
<button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">我喜欢的</button>
<button className="px-6 py-3 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">个人设置</button>
</div>
</div>
{/* Tab Content: My MVs */}
<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{/* Card 1 */}
<div className="group relative rounded-xl bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:bg-surface-container-low transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(124,58,237,0.1)] hover:-translate-y-1 flex flex-col">
<div className="relative aspect-video overflow-hidden">
<img alt="MV Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Futuristic neon cityscape at night with glowing pink and blue lights, cyberpunk style, high detail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUaDYv_mg6ym_Z9gm7xvd_OOnYEImoaR9G7titsxOfKNBwatR52Eh-Ijl69jYQgZTkJuuSnM1C23WsN1VhQNsEqk6Gejtoo8smb83bl5E-pFHrWiQN5laBgpy4WBT9PcVn2kR3Y9JrszgXWLYBJ6r8X1OJ2FsvVlQqywIKbblqHR3YIbBzQI-fUJuW1c1dk4h_p4MIiIqiNmu29xlUKhW0FF8sNC6BEPhR-MiL_hoA2kvs1M7mexFA4Kb6kF68fh78qASdNz0W_A"/>
<div className="absolute top-3 left-3 px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold rounded backdrop-blur-md uppercase tracking-wide">
                            已发布
                        </div>
<div className="absolute bottom-3 right-3 px-2 py-1 bg-surface/80 text-on-surface text-xs rounded font-mono backdrop-blur-md">
                            03:42
                        </div>
</div>
<div className="p-4 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-2">
<h3 className="text-base font-medium text-on-surface line-clamp-1 group-hover:text-primary transition-colors">Neon Nights in Neo-Tokyo</h3>
<button className="text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="more_vert">more_vert</span>
</button>
</div>
<p className="text-xs text-outline mb-4">2023-10-24</p>
<div className="mt-auto flex items-center gap-4 text-xs text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" data-icon="visibility">visibility</span> 2.4K</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" data-icon="favorite">favorite</span> 342</span>
</div>
</div>
</div>
{/* Card 2 */}
<div className="group relative rounded-xl bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:bg-surface-container-low transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(124,58,237,0.1)] hover:-translate-y-1 flex flex-col">
<div className="relative aspect-video overflow-hidden">
<img alt="MV Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Abstract fluid art with swirling deep purples, vibrant blues, and gold accents, ethereal mood" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhFhSsqvPiXpeyO6tvNfiV1L9D5q_c7kYiZrJ5NoX3e45Y2eEM_Wm_ouOw2sqIfzPflevqy6T3q8cIENT079SDxYcUnPNFvZhEcwmySaaEsCsdAmu6iHduZbMXudQErdf4k0KiSf4JlWLdkwfLODiOhBk-47-rST2M1Cc2rw4q61GDurz3obNr77mq4RgVq8PO1aIJ6dzM7XBDETjdsgYWVRTwjj8WpvRJOpmaFp2DKKx98-8c3hWwTKG6zgJPg8GQJ1clIghrsQ"/>
<div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-[10px] font-bold rounded backdrop-blur-md uppercase tracking-wide">
                            草稿
                        </div>
</div>
<div className="p-4 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-2">
<h3 className="text-base font-medium text-on-surface line-clamp-1 group-hover:text-primary transition-colors">Ethereal Soundscapes Vol. 2</h3>
<button className="text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="more_vert">more_vert</span>
</button>
</div>
<p className="text-xs text-outline mb-4">2023-11-02</p>
<div className="mt-auto flex items-center gap-4 text-xs text-on-surface-variant opacity-50">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" data-icon="visibility">visibility</span> --</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]" data-icon="favorite">favorite</span> --</span>
</div>
</div>
</div>
{/* Card 3 */}
<div className="group relative rounded-xl bg-surface-container-lowest border border-outline-variant/10 overflow-hidden hover:bg-surface-container-low transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_10px_40px_rgba(124,58,237,0.1)] hover:-translate-y-1 flex flex-col">
<div className="relative aspect-video overflow-hidden bg-surface-container-high flex items-center justify-center">
<div className="absolute inset-0 bg-gradient-to-br from-surface-container-low to-surface-container-highest"></div>
<div className="w-16 h-16 rounded-full border-2 border-secondary/20 border-t-secondary animate-spin z-10"></div>
<div className="absolute top-3 left-3 px-2 py-1 bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold rounded backdrop-blur-md uppercase tracking-wide flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                            生成中
                        </div>
</div>
<div className="p-4 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-2">
<h3 className="text-base font-medium text-on-surface line-clamp-1 group-hover:text-primary transition-colors">Cybernetic Lullaby</h3>
<button className="text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="more_vert">more_vert</span>
</button>
</div>
<p className="text-xs text-outline mb-4">刚刚</p>
<div className="mt-auto">
<div className="h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-secondary w-2/3 rounded-full"></div>
</div>
<p className="text-[10px] text-secondary mt-1 text-right">67%</p>
</div>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
