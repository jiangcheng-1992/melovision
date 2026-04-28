export default function Page() {
  return (
    <>

{/* TopNavBar Shell */}
<nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#14121F]/60 backdrop-blur-lg border-b border-white/5 shadow-[0_8px_32px_rgba(124,58,237,0.1)]">
<div className="flex items-center gap-8">
<span className="text-2xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] bg-clip-text text-transparent font-['Space_Grotesk']">MeloVision</span>
<div className="flex items-center gap-6 font-['Space_Grotesk'] text-sm tracking-wide">
<a className="text-slate-400 hover:text-slate-200 transition-colors hover:bg-white/5 px-3 py-1 rounded-lg" href="#">工作台</a>
<a className="text-slate-400 hover:text-slate-200 transition-colors hover:bg-white/5 px-3 py-1 rounded-lg" href="#">项目</a>
<a className="text-slate-400 hover:text-slate-200 transition-colors hover:bg-white/5 px-3 py-1 rounded-lg" href="#">素材库</a>
</div>
</div>
<div className="flex items-center gap-4">
<span className="text-secondary text-sm font-medium px-3 py-1 bg-secondary/10 rounded-full">50 积分</span>
<button className="bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container px-4 py-1.5 rounded-lg text-sm font-bold active:scale-95 transition-transform">升级</button>
<div className="w-8 h-8 rounded-full border-2 border-primary/50 overflow-hidden">
<img alt="User profile" data-alt="Close up of a stylized user avatar with futuristic neon lighting and vibrant colors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeZ0Ss3OrOomoDxRYxunKQfp6SV4ah0FxZVfuALitjdMdEJwAek3EJMwCAI2qpkyTyfvvQLMzhkoxPxlGGVU_IIrX2pQWRRJ8cq7wHqLHVEp81Q5jUJZonz3rkhQD-HX-M8SxRRecPCHSDEl4yIOYOzoVhVotPcOxvtNJuugEjcaCMf64XFig3b6f6fHcKQMUOyJR_X7DlyF0p25bKiyUP37MOAMg6IX5wMll0kU6GssX8l5AWbcJbq4bEpGAWQSvL8B_WP6S66Q"/>
</div>
</div>
</nav>
<main className="pt-24 pb-32 max-w-6xl mx-auto px-6">
{/* 5-Step Stepper */}
<div className="mb-16">
<div className="flex justify-between items-center relative">
{/* Progress Line Background */}
<div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -z-10 transform -translate-y-1/2"></div>
{/* Progress Line Active */}
<div className="absolute top-1/2 left-0 w-3/4 h-[2px] bg-gradient-to-r from-secondary to-primary-container -z-10 transform -translate-y-1/2"></div>
{/* Step 1 */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_15px_rgba(76,215,246,0.4)]">
<span className="material-symbols-outlined text-xl">check</span>
</div>
<span className="text-sm font-medium text-on-surface-variant">描述</span>
</div>
{/* Step 2 */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_15px_rgba(76,215,246,0.4)]">
<span className="material-symbols-outlined text-xl">check</span>
</div>
<span className="text-sm font-medium text-on-surface-variant">音乐</span>
</div>
{/* Step 3 */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-[0_0_15px_rgba(76,215,246,0.4)]">
<span className="material-symbols-outlined text-xl">check</span>
</div>
<span className="text-sm font-medium text-on-surface-variant">分镜</span>
</div>
{/* Step 4 Active */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.6)] ring-4 ring-primary-container/20">
<span className="font-headline font-bold text-lg">4</span>
</div>
<span className="text-sm font-bold text-primary">生成</span>
</div>
{/* Step 5 */}
<div className="flex flex-col items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-highest text-outline flex items-center justify-center">
<span className="font-headline font-bold text-lg">5</span>
</div>
<span className="text-sm font-medium text-outline">导出</span>
</div>
</div>
</div>
{/* Progress Overview */}
<div className="flex flex-col items-center mb-16 text-center">
<div className="relative w-52 h-52 flex items-center justify-center mb-8">
<svg className="w-full h-full">
<circle className="text-surface-container-highest" cx="104" cy="104" fill="transparent" r="90" stroke="currentColor" stroke-width="8"></circle>
<circle className="text-primary progress-ring-circle" cx="104" cy="104" fill="transparent" r="90" stroke="currentColor" stroke-dasharray="565.48" stroke-dashoffset="180.95" stroke-linecap="round" stroke-width="8"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-5xl font-headline font-bold text-on-surface">68%</span>
<span className="text-secondary text-sm font-medium mt-2 flex items-center gap-1">
                        正在生成...
                    </span>
</div>
</div>
<h2 className="text-2xl font-headline font-bold mb-2">正在合成您的视觉杰作</h2>
<p className="text-on-surface-variant max-w-md">预计剩余时间：~2分30秒<br/>正在生成第 11/16 个分镜...</p>
</div>
{/* Scene Grid */}
<div className="glass-panel rounded-2xl p-8 mb-8 border border-outline-variant/10">
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
{/* Scene 1-10 (Done) */}
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 1" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Cinematic wide shot of a futuristic neon city street with reflections on wet pavement, synthwave aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI-VeUKjOqqvu-3HceV8bvmbQuPazBsVvI1rzGxKG8Tg4OMBihdSeC8zcHKiPuXSFDQ9PNPoVMmwQ49gbmrfAZhfon7-bZiBJjr6a031wVCiLnhejAsNy9oDXsQ-cshUgsiNhvEYWxnmoO2JHNhz8dPqSRhcvrE7x35VrZZskruz4yyouzZEPv3jzz4wVGJomWuddSMVqFGpX7AkLThI5MuHv0o3ICHdpSsd9nfUd5cMZFcw0VXK4x3kRVqhsiqsq-Q1BguFVKpQ"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 2" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Extreme close up of a glowing synthetic eye with intricate circuits, macro photography, electric cyan lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJHwLbxELyTyIAeJpsrbT3xbXHUl4I18zv3vD30IHUFUONCxAb-kXGSH3LxbnGmxslZUU60yzbvGNtswNb4aw-rQCXaJoj_OqmlTlcz0UwjrMyf_7jgWxyEKY7XczcXNLqXSiM9IyKO6yV8L09OR5-Qi1p8sPg0ErwSP2wZD4kR0r_Vg5L6p9IGbq4M_05Jpg4_4VW72W_YK3QKsV3FXNEl5S1Xw6xdzxGhxRQLPsdQ6z58T6U0Z7rbUkMmRySqSwWnF3Gxw4XDA"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 3" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Abstract digital waves flowing through a void, purple and blue light trails, long exposure feel" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgyWVa-IKNPTOVS3ZWC17OKexpZcLCVDbUb4bYQvG9D9LxUfSMlK3DevCrjgee0fG70e9RrzECixPifl4XVXIC_SyR8ZUbzwh5YCyj49Lw6xRBXOYXmLCbrkOdzNjfKNUwVM3i3YmH-V9eMAk4FeA6Qij-Bfx8Gg6lFfaq1YjM1hRLlh1R0ECrcw-0ojGVhWCTuEVlLTYuLUXcv-nNL6LwhWkTCVPt5mdTSLkSKBIN4e1qI0PwvcaNYKDwhjdbPXXPHeCNHZGeFA"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 4" className="w-full h-full object-cover grayscale-[0.5]" data-alt="A lone figure standing on a balcony overlooking a vast megacity at dusk, cinematic composition" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUR2_Q5OeIlfNN6QG2r7hbgkYFHgASKhdo1V0Jws5j8nxNLX0gE97-NTE6WQtrvb60XYPKo9ouHfdMKLXxXqFu7bqiIz5PWIduAuh5USH2L7EY2lYgNJS9qcOC2hD6uPmrGjMk4CuT8UPNDeT-3mZernb0JlK5sslDTQPeXbKBOtda5EPkmGmxtS3l-z2nvg0_y8AKwACp8uQ2P4zaQ34CAw3cFLk3mWbAwWOONpG_amaGUV9YA_IniQK6ton0KXL2C05g6IWbtA"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
{/* ... Repeat for 5-10 for brevity */}
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 5" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Cybernetic hand reaching towards a floating holographic sphere, particles in the air" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVcb2biyWD-9UJ8uuWaAVrvX4WKyB3LmDVbaJF1lk7hlGeZtRR3eitbTtO6vfB9iAX5otKSKKzCNI3PyuHXh2MJuwHbjUjMfIRc79tFEx7t1eY45NhOcO9NErH8Q7qs-biAudulR9_reoTCnlZk811_nXhFkWQtpdey4b14n224KIbfnWY4PDeKgcjEw9w8Wbpw5vjglL8gGqV8jnMAegh8-P-s5hJMJBBXL-N_bFbr5Z02WDYJzxAHaIxQFeoO2Nj4bRHBnqoRg"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 6" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Neon grid floor extending to a digital horizon, sunset colors, vaporwave aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcoAg9140IUUcuMP_PomO68kYGbJmrUGAbEcgwy8hen-MTH0UpFsYmei81efmv3fQXRuOeVL1dNfMFPAc0eaUujSL60GVGCQj1t29Deua8ZCflAjCZ_d5zGKTSX9xQiip5IiEa8EysCADVqNV6h6esZQSmWm3AkXOf2qV9ZaBc3qhoeAy9dB0mHVbZ91Y2YWXdJ6dsZoF00O2f029TpB5_omeXR6ImZ1ECnKBiguoG3Ii2WvSNjoVANOj0Hhee09jbhmoZSEjGTw"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 7" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Flying vehicles cruising through skyscrapers, misty atmosphere, moody cool lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcfnhua1OGpxIoMoXVUh75jN4aCk1hUE1FxP-nxbmbNVp97f0DoQeeJoZbeSU_blzVZQ_l44E6oZjuDEO7Gv2rxCu7oaAioKoF-Ws5aZhPc9wwIHjNbg38cfE5vsRvNnWnWPDivDDytHh64bTrcmCRQPREOlpt8p-k-T-Z-QNSXcffFruMsh5_sMORL-ms5X6kkHZupT-e3J3lvUKjKp30kVj2A7uIsI6ulLDl2f0NGO8EBbrfSDGdqLva7FeKIdkaZm1EJ6fYhQ"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 8" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Glitch effect on a high-tech console screen, data streams, green and violet tones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvYrAUZZiUyQCUiOz6e068ee8-pgjt2i07XssO2k7ydRUND6o_8KP_bpeF_fdXa2Lb6NWQ_Dy2pL_m15TX5EQSFzPAB7N8hnXinr4YArIRzM1DYdw3vwMxwL5RH2gh78cc656Y2UuK_kr82GNq4ic8ikxrGFd7SKNxVYnzI4Cpoc-4N3ZPoCZJtx_XDaXKPEfPEcjjEwuL-jrlSSVJSQcaBx4ZbD93PRaIHw5BdxUuHkxAS0eyIwjBYl7fz4NArU5mt9YkHcXHLg"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 9" className="w-full h-full object-cover grayscale-[0.5]" data-alt="A robot head with glowing sensors, industrial sci-fi setting, cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApTUUNuvOuNHnWKa5NepArOWa45FNM1OmbrecjJAAZuMHwFMdAX3molPlhImEKPwGX3vzFAJI2I5R4qKyNvJjnF2O3xSG_ALg8lk03r0cVzNkOhKxu_Ez9YYpIacAeTA7VD2iWp7mPaKkZ6J8tvaXu4uWu0qFtQ1xo7AnNUnNGa6pWyywV4KD9akOKdKqWa_yzihRd5-E8rIdlxvxj5zpq6dALHHR79xiM9siJtQdLEtki7Pn7rO9KPzvLRfb0979I_CyC1HmNFQ"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-secondary/30">
<img alt="Scene 10" className="w-full h-full object-cover grayscale-[0.5]" data-alt="Interstellar travel through a wormhole, light warping, cosmic dust, deep purples" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATSQ0F3x3wkgbhXzWtPZuDCpThEuezQN1cF3RZ33BqSlnrd7uFKJUevr4RzL_wJHtXOyfJMHju-A9gOOVdri6mzo7C1RbnVYrmUC01Tch_meFwix7VVygOX7iLxGYlLPSmhE5BonCu0DebECSs3lGfrfgUUGGTTH6O8UbKea2zSKo5xdlJq78C646YYt4KWTg88WIE_IQiB3s73fjc3pXA6OjkblkLpibi9pH3WDGRoZ5oqSIIgY_7fr2yokJZ0qeHngfe0aBN7w"/>
<div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-2xl" style={{fontVariationSettings: ''FILL' 1'}}>check_circle</span>
</div>
</div>
{/* Scene 11 (Active) */}
<div className="relative aspect-square rounded-xl overflow-hidden border-2 pulse-active flex items-center justify-center bg-surface-container-high">
<div className="flex flex-col items-center gap-2">
<span className="material-symbols-outlined text-primary text-3xl animate-spin">refresh</span>
<span className="text-[10px] uppercase tracking-widest text-primary font-bold">Gen S11</span>
</div>
</div>
{/* Scene 12-16 (Pending) */}
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
<div className="relative aspect-square rounded-xl overflow-hidden border border-white/5 flex items-center justify-center bg-surface-container-lowest">
<span className="material-symbols-outlined text-outline/30 text-2xl">schedule</span>
</div>
</div>
</div>
{/* Action Log */}
<div className="glass-panel rounded-2xl p-6 border border-outline-variant/10 max-w-2xl mx-auto">
<div className="flex items-center justify-between mb-4">
<h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    实时生成日志
                </h3>
<span className="text-[10px] text-outline font-mono">v2.4.0-STABLE</span>
</div>
<div className="space-y-2 font-mono text-xs overflow-y-auto max-h-32 pr-2 scrollbar-hide">
<div className="flex gap-3 text-secondary">
<span className="opacity-50">[14:20:01]</span>
<span>✓ 分镜 1 已生成 (0:00-0:03)</span>
</div>
<div className="flex gap-3 text-secondary">
<span className="opacity-50">[14:21:45]</span>
<span>✓ 分镜 10 已生成 (0:27-0:30)</span>
</div>
<div className="flex gap-3 text-primary font-bold">
<span className="opacity-50">[14:22:12]</span>
<span className="flex items-center gap-2">
<span className="material-symbols-outlined text-xs">sync</span>
                        正在生成分镜 11 (0:30-0:33)...
                    </span>
</div>
<div className="flex gap-3 text-outline/40">
<span className="opacity-50">[--:--:--]</span>
<span>等待生成分镜 12...</span>
</div>
</div>
</div>
</main>
{/* Bottom Actions */}
<div className="fixed bottom-0 w-full p-8 flex justify-center bg-gradient-to-t from-background to-transparent pointer-events-none">
<button className="pointer-events-auto px-12 py-3 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error/50 hover:bg-error/5 transition-all duration-300 backdrop-blur-md font-medium">
            取消生成
        </button>
</div>

    </>
  );
}
