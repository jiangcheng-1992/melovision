export default function Page() {
  return (
    <>

<div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03] mix-blend-overlay" style={{backgroundImage: 'url('data'}}></div>
{/* TopNavBar */}
<nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl tonal-transition via surface-container-low shadow-[0_8px_32px_0_rgba(124,58,237,0.1)] border-b border-outline-variant/10">
<div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
<div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-display tracking-tight">
                MeloVision
            </div>
<div className="hidden md:flex items-center gap-8 font-space-grotesk tracking-tight">
<a className="text-on-surface-variant hover:text-on-surface transition-colors hover:scale-105 duration-200" href="#">产品展示</a>
<a className="text-on-surface-variant hover:text-on-surface transition-colors hover:scale-105 duration-200" href="#">作品广场</a>
<a className="text-on-surface font-medium border-b-2 border-secondary pb-1 hover:scale-105 transition-transform duration-200 shadow-[0_4px_10px_rgba(76,215,246,0.1)]" href="#">价格方案</a><a className="text-on-surface-variant hover:text-on-surface transition-colors hover:scale-105 duration-200" href="#">工作台</a>
</div>
<div className="flex items-center gap-6">
<button className="text-on-surface-variant hover:text-on-surface transition-colors hover:scale-105 duration-200 font-label">登录</button>
<button className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-5 py-2 rounded-full font-label font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">开始使用</button>
</div>
</div>
</nav>
{/* Main Content */}
<main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
{/* Header */}
<div className="text-center mb-16 max-w-3xl mx-auto">
<h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface mb-6 tracking-tight">简单透明的定价方案</h1>
<p className="text-xl text-on-surface-variant font-body mb-8">免费开始使用。需要更多功能时随时升级。</p>
{/* Toggle */}
<div className="flex items-center justify-center gap-4 bg-surface-container-lowest inline-flex p-1.5 rounded-full border border-outline-variant/20 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
<button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface transition-colors font-label font-medium">按月支付</button>
<button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface shadow-sm font-label font-medium flex items-center gap-2">
                    按年支付 <span className="text-secondary text-xs bg-secondary/10 px-2 py-0.5 rounded-full">立省 20%</span>
</button>
</div>
</div>
{/* Pricing Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-stretch">
{/* Starter */}
<div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 flex flex-col hover:bg-surface-container-low transition-colors duration-300">
<h3 className="text-2xl font-display font-bold text-on-surface mb-2">入门版</h3>
<div className="text-on-surface-variant font-body text-sm mb-6">适合体验核心功能</div>
<div className="mb-8 flex items-baseline gap-2">
<span className="text-4xl font-display font-bold">¥0</span>
<span className="text-on-surface-variant font-body">/永久免费</span>
</div>
<button className="w-full py-3 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-high hover:border-outline-variant/50 transition-all duration-200 ease-in-out hover:scale-[1.02] font-label font-medium mb-8">免费开始</button>
<ul className="flex-1 space-y-4 font-body text-sm text-on-surface-variant">
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 10 积分/月</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 720p 分辨率</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 基础音乐风格</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 带水印输出</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 社区广场访问</li>
<li className="flex items-start gap-3 opacity-40"><span className="material-symbols-outlined text-outline text-xl">cancel</span> 优先生成队列</li>
<li className="flex items-start gap-3 opacity-40"><span className="material-symbols-outlined text-outline text-xl">cancel</span> API 访问</li>
</ul>
</div>
{/* Creator (Popular) */}
<div className="bg-surface-variant/60 backdrop-blur-[16px] rounded-2xl p-8 border border-primary/50 flex flex-col relative shadow-[0_0_40px_rgba(124,58,237,0.15)] transform md:-translate-y-4">
<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-surface-container-lowest px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    最受欢迎
                </div>
<h3 className="text-2xl font-display font-bold text-primary mb-2">创作者版</h3>
<div className="text-on-surface-variant font-body text-sm mb-6">释放你的无限创意</div>
<div className="mb-8 flex items-baseline gap-2">
<span className="text-4xl font-display font-bold">¥23</span>
<span className="text-on-surface-variant font-body">/月 (按年计费)</span>
</div>
<button className="w-full py-3 rounded-lg bg-gradient-to-r from-primary-container to-secondary-container text-on-primary-container hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-200 ease-in-out hover:scale-[1.02] font-label font-medium mb-8">立即订阅</button>
<ul className="flex-1 space-y-4 font-body text-sm text-on-surface">
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 100 积分/月</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 1080p 分辨率</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 所有音乐风格</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 无水印输出</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 优先队列</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 高级视觉风格</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 字幕自定义</li>
<li className="flex items-start gap-3 opacity-40"><span className="material-symbols-outlined text-outline text-xl">cancel</span> API 访问</li>
</ul>
</div>
{/* Professional */}
<div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/20 flex flex-col hover:border-secondary/30 transition-colors duration-300">
<h3 className="text-2xl font-display font-bold text-secondary mb-2">专业版</h3>
<div className="text-on-surface-variant font-body text-sm mb-6">为商业工作室打造</div>
<div className="mb-8 flex items-baseline gap-2">
<span className="text-4xl font-display font-bold">¥63</span>
<span className="text-on-surface-variant font-body">/月 (按年计费)</span>
</div>
<button className="w-full py-3 rounded-lg bg-surface-container-high text-secondary hover:bg-surface-container-highest transition-all duration-200 ease-in-out hover:scale-[1.02] font-label font-medium border border-secondary/20 mb-8">开启专业版</button>
<ul className="flex-1 space-y-4 font-body text-sm text-on-surface-variant">
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 400 积分/月</li>
<li className="flex items-start gap-3 text-on-surface"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 包含创作者版所有功能</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> API 访问</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 批量生成</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 自定义风格上传</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 最高优先级队列</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 商业使用权</li>
<li className="flex items-start gap-3"><span className="material-symbols-outlined text-secondary text-xl">check_circle</span> 邮件支持</li>
</ul>
</div>
</div>
<div className="h-px w-full bg-gradient-to-r from-primary via-transparent to-secondary opacity-30 my-16"></div>
{/* Enterprise Banner */}
<div className="bg-surface-container-low rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center justify-between border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
<div className="mb-6 md:mb-0 text-center md:text-left">
<h4 className="text-2xl font-display font-bold text-on-surface mb-2">需要更多？联系我们获取企业方案</h4>
<p className="text-on-surface-variant font-body text-sm">定制积分包、专属客户成功经理、私有化部署支持。</p>
</div>
<button className="px-6 py-3 rounded-lg border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-all duration-200 ease-in-out hover:scale-[1.02] font-label font-medium flex items-center gap-2 group">
                联系销售 <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
<div className="h-px w-full bg-gradient-to-r from-primary via-transparent to-secondary opacity-30 my-16"></div>
{/* Table */}
<div className="mb-16">
<h3 className="text-2xl font-display font-bold text-center text-on-surface mb-10">积分消耗一览</h3>
<div className="overflow-x-auto rounded-2xl border border-outline-variant/20 bg-surface-container-lowest">
<table className="w-full text-left font-body">
<thead className="bg-surface-container-low text-on-surface-variant text-sm uppercase tracking-wider">
<tr>
<th className="px-6 py-4 font-medium border-b border-outline-variant/10">创作行为</th>
<th className="px-6 py-4 font-medium border-b border-outline-variant/10 text-right">积分消耗</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/10 text-on-surface">
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-6 py-4">生成音乐 (3个候选)</td>
<td className="px-6 py-4 text-right font-display text-secondary">5 积分</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-6 py-4">生成完整视频 MV</td>
<td className="px-6 py-4 text-right font-display text-secondary">20 积分</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-6 py-4">重新生成单个分镜</td>
<td className="px-6 py-4 text-right font-display text-secondary">2 积分</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-6 py-4">下载 1080p (无水印)</td>
<td className="px-6 py-4 text-right font-display text-secondary">5 积分</td>
</tr>
<tr className="hover:bg-surface-container-low/50 transition-colors">
<td className="px-6 py-4">下载 720p (带水印)</td>
<td className="px-6 py-4 text-right font-display text-on-surface-variant">免费</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="h-px w-full bg-gradient-to-r from-primary via-transparent to-secondary opacity-30 my-16"></div>
{/* FAQ Section */}
<div className="mb-24 max-w-3xl mx-auto">
<h3 className="text-2xl font-display font-bold text-center text-on-surface mb-10">常见问题解答</h3>
<div className="space-y-4">
<details className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 [&amp;_summary::-webkit-details-marker]:hidden">
<summary className="flex cursor-pointer items-center justify-between gap-1.5 text-on-surface font-display font-bold">
<h4 className="text-lg">什么是积分？</h4>
<span className="shrink-0 rounded-full bg-surface-container-low p-1.5 text-on-surface-variant group-open:bg-primary-container group-open:text-on-primary-container">
<svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
</summary>
<p className="mt-4 leading-relaxed text-on-surface-variant font-body">积分是 MeloVision AI 的基础货币。不同的生成任务（如生成音乐、生成视频、重新生成分镜等）会消耗不同数量的积分。积分每月重置。</p>
</details>
<details className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 [&amp;_summary::-webkit-details-marker]:hidden">
<summary className="flex cursor-pointer items-center justify-between gap-1.5 text-on-surface font-display font-bold">
<h4 className="text-lg">我可以随时取消吗？</h4>
<span className="shrink-0 rounded-full bg-surface-container-low p-1.5 text-on-surface-variant group-open:bg-primary-container group-open:text-on-primary-container">
<svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
</summary>
<p className="mt-4 leading-relaxed text-on-surface-variant font-body">是的，您可以随时在账户设置中取消订阅。取消后，您在当前计费周期结束前仍可继续使用高级功能，周期结束后将自动降级为入门版。</p>
</details>
<details className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 [&amp;_summary::-webkit-details-marker]:hidden">
<summary className="flex cursor-pointer items-center justify-between gap-1.5 text-on-surface font-display font-bold">
<h4 className="text-lg">我拥有生成的音乐版权吗？</h4>
<span className="shrink-0 rounded-full bg-surface-container-low p-1.5 text-on-surface-variant group-open:bg-primary-container group-open:text-on-primary-container">
<svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
</summary>
<p className="mt-4 leading-relaxed text-on-surface-variant font-body">使用专业版生成的音乐和视频，您拥有完整的商业使用权。入门版和创作者版生成的作品仅限非商业用途（如个人学习、社交媒体分享）。</p>
</details>
<details className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 [&amp;_summary::-webkit-details-marker]:hidden">
<summary className="flex cursor-pointer items-center justify-between gap-1.5 text-on-surface font-display font-bold">
<h4 className="text-lg">支持哪些支付方式？</h4>
<span className="shrink-0 rounded-full bg-surface-container-low p-1.5 text-on-surface-variant group-open:bg-primary-container group-open:text-on-primary-container">
<svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
</summary>
<p className="mt-4 leading-relaxed text-on-surface-variant font-body">我们支持主流的信用卡（Visa、Mastercard）、PayPal 以及部分地区的本地支付方式。企业方案支持银行转账。</p>
</details>
<details className="group rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 [&amp;_summary::-webkit-details-marker]:hidden">
<summary className="flex cursor-pointer items-center justify-between gap-1.5 text-on-surface font-display font-bold">
<h4 className="text-lg">我可以升级或降级方案吗？</h4>
<span className="shrink-0 rounded-full bg-surface-container-low p-1.5 text-on-surface-variant group-open:bg-primary-container group-open:text-on-primary-container">
<svg className="size-5 shrink-0 transition duration-300 group-open:-rotate-180" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>
</span>
</summary>
<p className="mt-4 leading-relaxed text-on-surface-variant font-body">可以。升级方案会立即生效并按比例收取差价。降级方案将在当前计费周期结束后生效。我们建议根据您的需求灵活调整。</p>
</details>
</div>
</div>
</main>
{/* Footer */}
<footer className="w-full rounded-t-3xl mt-20 bg-surface-container-lowest border-t border-outline-variant/20 tonal-shift-from-surface flat">
<div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-10 py-16 max-w-[1200px] mx-auto font-inter text-sm">
<div className="col-span-1 md:col-span-1">
<span className="font-space-grotesk font-black text-primary text-xl block mb-4">MeloVision AI</span>
<p className="text-on-surface-variant/70 mt-2">Built for the synesthetic canvas.</p>
<p className="text-on-surface-variant/70 mt-4">© 2024 MeloVision AI. All rights reserved.</p>
</div>
<div className="col-span-1 md:col-span-3 flex flex-wrap gap-8 md:justify-end">
<div className="flex flex-col gap-4">
<a className="text-on-surface-variant/70 hover:text-secondary hover:translate-x-1 transition-all" href="#">Product</a>
<a className="text-on-surface-variant/70 hover:text-secondary hover:translate-x-1 transition-all" href="#">API Docs</a>
</div>
<div className="flex flex-col gap-4">
<a className="text-on-surface-variant/70 hover:text-secondary hover:translate-x-1 transition-all" href="#">Privacy Policy</a>
<a className="text-on-surface-variant/70 hover:text-secondary hover:translate-x-1 transition-all" href="#">Terms of Service</a>
</div>
<div className="flex flex-col gap-4">
<a className="text-on-surface-variant/70 hover:text-secondary hover:translate-x-1 transition-all" href="#">Contact Support</a>
</div>
</div>
</div>
</footer>

    </>
  );
}
