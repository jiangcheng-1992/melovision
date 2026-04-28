export default function Page() {
  return (
    <>

{/* Left Branding Section */}
<div className="flex w-full h-40 md:h-auto md:w-5/12 lg:w-1/2 relative flex-col justify-center md:justify-between p-6 md:p-12 overflow-hidden bg-surface-container-lowest shrink-0">
{/* Abstract Background Effects */}
<div className="absolute inset-0 z-0">
<div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 via-surface-container-lowest to-secondary-container/10"></div>
{/* Glass/Glow Orbs */}
<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/30 rounded-full blur-[100px]"></div>
<div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-container/20 rounded-full blur-[100px]"></div>
{/* Abstract Synesthetic Image */}
<img alt="Abstract Background" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" data-alt="abstract flowing colorful waves representing sound and light synesthesia, deep purples and bright cyans, smooth rendering" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaal9UU4z8tBsNH4cgTOdsoWK97mb17fQUNrPl4MkqvRP_fMEN1SBEGRBL_7ZEREsIcDwbsNiSl_XBU4z72dK1CBkft4FVZFt0KITi0EHju2QYHhoid66uf2GfeP4Wktsoge9HuA8NbGyLL3sYUdz7FdoPAAv5uIk4opOCHapGB3l8cDYOd4omb5SAMbbibNRMR3lVqOHts6rfczNLo1-FKDYyF9tVCrH81W2XSJbwH7Z0hTVX8YzYs5Fjiomgiz5vj6Qov_bJlw"/>
</div>
{/* Content (z-10 for layering) */}
<div className="relative z-10 flex items-center justify-center md:justify-start gap-3">
<span className="material-symbols-outlined text-4xl text-primary" data-weight="fill" style={{fontVariationSettings: ''FILL' 1'}}>graphic_eq</span>
<span className="font-display text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-secondary">MeloVision AI</span>
</div>
<div className="relative z-10 max-w-md hidden md:block">
<h1 className="font-display text-5xl lg:text-5xl md:text-4xl font-bold leading-tight mb-6">
                听见色彩<br/>
<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">看见声音</span>
</h1>
<p className="text-on-surface-variant text-lg leading-relaxed">
                加入我们的突触画板，在这里，您的音乐节奏将转化为令人惊叹的视觉动效。突破传统模板的界限。
            </p>
{/* Mini decorative element */}
<div className="mt-8 flex gap-2">
<div className="h-1 w-8 bg-primary rounded-full"></div>
<div className="h-1 w-4 bg-surface-container-highest rounded-full"></div>
<div className="h-1 w-2 bg-surface-container-highest rounded-full"></div>
</div>
</div>
{/* Testimonial/Social proof */}
<div className="relative z-10 backdrop-blur-md bg-surface-variant/40 border border-outline-variant/20 p-6 rounded-xl max-w-md hidden md:block">
<p className="text-sm italic text-on-surface-variant mb-4">"MeloVision 完全改变了我们构思音乐视频的方式。它感觉就像拥有了一个懂通感的 AI 联合导演。"</p>
<div className="flex items-center gap-3">
<img alt="User Avatar" className="w-10 h-10 rounded-full object-cover border border-outline-variant/30" data-alt="portrait of a young female creative director with vibrant neon lighting reflections" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxwB3wDW0ZFIYv6I-NDIeF2f6ikCLvpP10B7gzNUWeaIbW-VD8uTPzIWoTA3WfzBq19vkpFRur3CnweCwcbEoSpr05O6MNm83XVu3rcokvyQLpwfZoCSG_LCxwuumFjFQLBo-kBeQTHAdo3ovPmhPpSu00L0rx-LsW2SE6EDFzGvFupRiQTjJGNHwHBkFurAudgCu3fPahqTLR6LXjqSj7KvpwcHIFoKcEqJ_0og10lBARZnQTmNlN_TYCIu-yMkk3C97PbmhWA"/>
<div>
<div className="text-sm font-semibold text-on-surface">Elena R.</div>
<div className="text-xs text-on-surface-variant">视觉艺术家</div>
</div>
</div>
</div>
</div>
{/* Right Form Section */}
<div className="w-full md:w-7/12 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative flex-1 overflow-y-auto">
{/* Mobile Background Glow */}
<div className="absolute inset-0 bg-surface md:hidden z-0">
<div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full blur-[80px]"></div>
</div>
<div className="w-full max-w-md relative z-10">
{/* Form Card */}
<div className="bg-surface-variant/60 backdrop-blur-xl border border-outline-variant/20 rounded-xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(20,18,31,0.5)]">
<div className="text-center mb-8">
<h2 className="font-headline text-2xl font-bold text-on-surface mb-2">创建您的账号</h2>
<p className="text-on-surface-variant text-sm">免费开启 AI 音乐视频创作</p>
</div>
<form className="space-y-5">
{/* Display Name */}
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-1.5" htmlFor="displayName">显示名称</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">person</span>
</div>
<input className="block w-full pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface placeholder-outline focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors py-3 md:py-2.5 text-base md:text-sm" id="displayName" name="displayName" placeholder="输入您的昵称" type="text"/>
</div>
</div>
{/* Email */}
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-1.5" htmlFor="email">电子邮箱</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">mail</span>
</div>
<input className="block w-full pl-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface placeholder-outline focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors py-3 md:py-2.5 text-base md:text-sm" id="email" name="email" placeholder="name@example.com" type="email"/>
</div>
</div>
{/* Password */}
<div>
<label className="block text-sm font-medium text-on-surface-variant mb-1.5" htmlFor="password">密码</label>
<div className="relative mb-2">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined text-[20px]">lock</span>
</div>
<input className="block w-full pl-10 pr-10 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface placeholder-outline focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors py-3 md:py-2.5 text-base md:text-sm" id="password" name="password" placeholder="••••••••" type="password"/>
<button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
</div>
{/* Password Strength Bar */}
<div className="flex gap-1 h-1.5 mt-2">
{/* Weak (Red/Error) */}
<div className="flex-1 bg-error rounded-full opacity-50"></div>
{/* Medium (Tertiary/Orange) */}
<div className="flex-1 bg-surface-container-highest rounded-full"></div>
{/* Strong (Secondary/Cyan) */}
<div className="flex-1 bg-surface-container-highest rounded-full"></div>
</div>
<p className="text-xs text-outline mt-1 text-right">密码强度：弱</p>
</div>
{/* Terms Checkbox */}
<div className="flex items-start pt-2">
<div className="flex items-center h-5">
<input className="w-5 h-5 md:w-4 md:h-4 rounded border-outline-variant bg-surface-container-lowest text-primary-container focus:ring-primary/50 focus:ring-offset-surface-variant focus:ring-offset-2" id="terms" name="terms" type="checkbox"/>
</div>
<div className="ml-3 text-sm">
<label className="font-medium text-on-surface-variant" htmlFor="terms">
                                我已阅读并同意 <a className="text-secondary hover:underline underline-offset-2" href="#">服务条款</a> 和 <a className="text-secondary hover:underline underline-offset-2" href="#">隐私政策</a>
</label>
</div>
</div>
{/* Submit Button */}
<button className="w-full flex justify-center py-3.5 md:py-3 px-4 rounded-lg font-medium text-base text-on-primary-container bg-gradient-to-r from-primary-container to-secondary-container hover:shadow-[0_0_20px_rgba(210,187,255,0.3)] transition-all duration-300 transform active:scale-[0.98] mt-6" type="submit">
                        创建账号
                    </button>
</form>
{/* Divider */}
<div className="mt-8 mb-6 relative">
<div className="absolute inset-0 flex items-center">
<div className="w-full border-t border-outline-variant/30"></div>
</div>
<div className="relative flex justify-center text-sm">
<span className="px-2 bg-surface-variant text-outline">或通过以下方式注册</span>
</div>
</div>
{/* OAuth Buttons */}
<div className="grid grid-cols-3 gap-3">
<button className="flex justify-center items-center py-3 md:py-2.5 px-4 border border-outline-variant/20 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
<svg className="w-5 h-5" fill="none" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
</button>
<button className="flex justify-center items-center py-3 md:py-2.5 px-4 border border-outline-variant/20 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
<svg aria-hidden="true" className="w-5 h-5 text-on-surface" fill="currentColor" viewbox="0 0 24 24"><path clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" fill-rule="evenodd"></path></svg>
</button>
<button className="flex justify-center items-center py-3 md:py-2.5 px-4 border border-outline-variant/20 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
<svg aria-hidden="true" className="w-5 h-5 text-on-surface" fill="currentColor" viewbox="0 0 24 24"><path d="M16.365 7.143c-.021-2.022 1.636-3.178 1.724-3.232-1.027-1.503-2.616-1.708-3.178-1.73-1.354-.136-2.645.795-3.332.795-.688 0-1.758-.773-2.883-.75-1.468.021-2.822.853-3.58 2.164-1.528 2.651-.39 6.574 1.107 8.739.73 1.05 1.59 2.227 2.73 2.186 1.1-.043 1.523-.709 2.852-.709 1.328 0 1.71.71 2.853.688 1.185-.022 1.932-1.071 2.656-2.128.84-1.226 1.188-2.415 1.206-2.478-.027-.01-2.324-.892-2.34-3.545h.185zM14.28 4.316c.616-.745 1.031-1.78 1.031-2.815 0-.116-.011-.231-.032-.344-.94.043-2.043.631-2.683 1.383-.564.654-1.053 1.704-.902 2.732.127.011.254.021.36.021.848 0 1.635-.246 2.226-.977z"></path></svg>
</button>
</div>
{/* Footer Link */}
<p className="mt-8 text-center text-sm text-on-surface-variant">
                    已有账号？ <a className="font-medium text-primary hover:text-primary-fixed-dim transition-colors" href="#">立即登录</a>
</p>
</div>
</div>
</div>

    </>
  );
}
