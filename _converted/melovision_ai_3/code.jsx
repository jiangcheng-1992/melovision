export default function Page() {
  return (
    <>

{/* Left Side: Branding / Synesthetic Canvas */}
<div className="flex w-full md:w-5/12 lg:w-1/2 relative overflow-hidden flex-col justify-center md:justify-between py-10 px-6 md:p-10 lg:p-20 bg-gradient-to-br from-primary-container via-[#3f008e] to-[#001f26]">
{/* Decorative Ambient Orbs */}
<div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-secondary rounded-full mix-blend-screen filter blur-[120px] opacity-20 float-1"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-tertiary-container rounded-full mix-blend-screen filter blur-[150px] opacity-20 float-2"></div>
{/* Background Patterns / Abstract */}
<div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}}></div>
{/* Top Header area */}
<div className="relative z-10 flex items-center justify-center md:justify-start gap-3">
<span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: ''FILL' 1'}}>play_circle</span>
<h1 className="text-3xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                MeloVision AI
            </h1>
</div>
{/* Middle Value Prop */}
<div className="hidden md:block relative z-10 my-auto pt-20 pb-10">
<h2 className="text-4xl lg:text-6xl xl:text-7xl font-display font-extrabold tracking-tighter leading-tight text-white mb-6 drop-shadow-lg">
                从灵感到<br/>音乐 MV，<br/>
<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">仅需数分钟</span>
</h2>
<p className="text-lg lg:text-xl text-on-primary-container max-w-md font-body font-light leading-relaxed">
                利用人工智能将您的音频转化为视觉震撼的动态影片。探索通感创作的未来。
            </p>
</div>
{/* Bottom Showcase Card */}
<div className="hidden md:block relative z-10">
<div className="glass-panel p-4 rounded-xl flex items-center gap-4 max-w-md transform transition-transform hover:scale-[1.02] duration-300">
<div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
<img alt="Abstract neon fluid art" className="w-full h-full object-cover" data-alt="abstract fluid art with neon violet and cyan glowing lines resembling sound waves in dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUIa2aheblh6oXaMIMkR2AMjclJC2wvuMrquD-l6D9VmbOueNMG57C_hddZWAj2wCEkCvGBuQD8OJWFZT_Yg8wQSBku-zJc-OtxRMk__gBfmrOsJ4cjMsrNOIv1rlSUaMFG8Z5bw_DG2zRj8i56GUBoAgagl6iu4C2Jfg6iEGqJhTjlv5E6Ln_A90cOHywm2BpTfiWtWR_TH0NsIH-5oLrwkgzNt1BaaiXBKwVMNVQfs2mGI3A8xr8gznn9wuq15kR6ZGo7NFm7Q"/>
<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
<span className="material-symbols-outlined text-white/80">play_arrow</span>
</div>
</div>
<div>
<p className="text-sm font-medium text-white mb-1">Cyberpunk Reverie.mp4</p>
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 bg-primary-container/40 text-primary text-[10px] rounded uppercase tracking-wider font-semibold border border-primary/20">由 MeloVision 创作</span>
<span className="text-xs text-on-surface-variant">2:45</span>
</div>
<div className="mt-2 w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full w-2/3 bg-gradient-to-r from-primary to-secondary"></div>
</div>
</div>
</div>
</div>
</div>
{/* Right Side: Login Form */}
<div className="flex-grow w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-surface">
<div className="w-full max-w-md relative z-10">
{/* Form Header */}
<div className="mb-10 text-center md:text-left">
<h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">欢迎回来</h2>
<p className="text-on-surface-variant text-sm md:text-base">登录以继续您的创作之旅</p>
</div>
{/* Main Form Card */}
<div className="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 sm:p-8 spectral-shadow">
<form action="#" className="space-y-5" method="POST">
{/* Email Field */}
<div className="space-y-1.5">
<label className="block text-sm font-medium text-on-surface" htmlFor="email">电子邮箱</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-xl">mail</span>
</div>
<input className="w-full pl-10 pr-4 py-3.5 sm:py-3 bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 input-glow transition-all duration-200" id="email" name="email" placeholder="name@company.com" required="" type="email"/>
</div>
</div>
{/* Password Field */}
<div className="space-y-1.5">
<div className="flex justify-between items-center">
<label className="block text-sm font-medium text-on-surface" htmlFor="password">密码</label>
<a className="text-xs text-secondary hover:text-primary transition-colors" href="#">忘记密码？</a>
</div>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline group-focus-within:text-primary transition-colors text-xl">lock</span>
</div>
<input className="w-full pl-10 pr-12 py-3.5 sm:py-3 bg-surface-container rounded-lg border border-outline-variant/30 text-on-surface placeholder-on-surface-variant/50 input-glow transition-all duration-200" id="password" name="password" placeholder="••••••••" required="" type="password"/>
<button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none" type="button">
<span className="material-symbols-outlined text-xl">visibility</span>
</button>
</div>
</div>
{/* Submit Button */}
<div className="pt-2">
<button className="w-full py-3.5 sm:py-3 px-4 rounded-lg text-white font-medium btn-gradient flex items-center justify-center gap-2" type="submit">
<span>登录</span>
<span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
{/* Divider */}
<div className="relative py-4 flex items-center">
<div className="flex-grow border-t border-outline-variant/30"></div>
<span className="flex-shrink-0 mx-4 text-xs text-outline-variant uppercase tracking-wider">或者使用以下方式继续</span>
<div className="flex-grow border-t border-outline-variant/30"></div>
</div>
{/* OAuth Buttons */}
<div className="grid grid-cols-3 gap-3">
<button className="flex justify-center items-center py-3 sm:py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-lg transition-colors group" type="button">
<svg className="w-5 h-5 text-on-surface group-hover:text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
</svg>
</button>
<button className="flex justify-center items-center py-3 sm:py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-lg transition-colors group" type="button">
<svg className="w-5 h-5 text-on-surface group-hover:text-white" fill="currentColor" viewbox="0 0 24 24">
<path clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill-rule="evenodd"></path>
</svg>
</button>
<button className="flex justify-center items-center py-3 sm:py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 rounded-lg transition-colors group" type="button">
<svg className="w-5 h-5 text-on-surface group-hover:text-white" fill="currentColor" viewbox="0 0 24 24">
<path d="M16.365 7.422c-.046-2.658 2.164-3.957 2.261-4.015-1.238-1.81-3.155-2.053-3.83-2.079-1.637-.165-3.197.965-4.032.965-.835 0-2.115-.945-3.486-.921-1.787.024-3.433.999-4.354 2.604-1.867 3.238-.477 8.031 1.341 10.655.892 1.282 1.94 2.723 3.324 2.67 1.337-.052 1.839-.863 3.454-.863 1.615 0 2.071.863 3.454.838 1.436-.026 2.339-1.306 3.218-2.59 1.018-1.488 1.438-2.929 1.458-3.006-.03-.013-2.822-1.082-2.808-4.258zM14.654 2.845c.739-.894 1.238-2.137 1.103-3.375-1.066.042-2.355.708-3.118 1.603-.683.803-1.285 2.075-1.127 3.292 1.189.092 2.399-.623 3.142-1.52z"></path>
</svg>
</button>
</div>
</form>
</div>
{/* Footer Link */}
<div className="mt-8 text-center">
<p className="text-sm text-on-surface-variant">
                    还没有账号？ 
                    <a className="text-primary hover:text-secondary font-medium transition-colors hover:underline underline-offset-4" href="#">立即注册</a>
</p>
</div>
</div>
</div>

    </>
  );
}
