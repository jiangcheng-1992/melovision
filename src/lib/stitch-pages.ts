export type StitchPage = {
  slug: string;
  title: string;
  description: string;
  sourceDir: string;
  frameHeight: number;
};

export const stitchPages: StitchPage[] = [
  {
    slug: "landing",
    title: "官网首页",
    description: "MeloVision 落地页",
    sourceDir: "melovision",
    frameHeight: 3800,
  },
  {
    slug: "register",
    title: "注册页",
    description: "创建账号",
    sourceDir: "melovision_ai_1",
    frameHeight: 980,
  },
  {
    slug: "projects",
    title: "项目页",
    description: "我的项目列表",
    sourceDir: "melovision_ai_2",
    frameHeight: 1100,
  },
  {
    slug: "login",
    title: "登录页",
    description: "欢迎回来",
    sourceDir: "melovision_ai_3",
    frameHeight: 980,
  },
  {
    slug: "explore",
    title: "作品广场",
    description: "探索作品与风格榜单",
    sourceDir: "_1",
    frameHeight: 1500,
  },
  {
    slug: "pricing",
    title: "定价页",
    description: "套餐、积分与 FAQ",
    sourceDir: "_2",
    frameHeight: 2200,
  },
  {
    slug: "create",
    title: "创建页",
    description: "描述、视觉风格与音乐风格配置",
    sourceDir: "_3",
    frameHeight: 980,
  },
  {
    slug: "music",
    title: "音乐选择页",
    description: "试听并选择 AI 生成曲目",
    sourceDir: "_4",
    frameHeight: 980,
  },
  {
    slug: "workbench",
    title: "分镜工作台",
    description: "编辑分镜与生成 MV",
    sourceDir: "_5",
    frameHeight: 1240,
  },
  {
    slug: "export",
    title: "导出页",
    description: "预览、个性化设置与导出",
    sourceDir: "_6",
    frameHeight: 1040,
  },
  {
    slug: "profile",
    title: "个人主页",
    description: "作品、喜欢与个人设置",
    sourceDir: "_7",
    frameHeight: 980,
  },
  {
    slug: "generation",
    title: "生成进度页",
    description: "实时生成日志与分镜进度",
    sourceDir: "mv",
    frameHeight: 1120,
  },
];

// These pages have been rebuilt as native Next.js routes and must not be
// prerendered again through the legacy stitch preview route in production.
export const nativeInterfaceSlugs = new Set([
  "register",
  "projects",
  "login",
  "explore",
  "pricing",
  "create",
  "music",
  "workbench",
  "export",
  "generation",
  "terms",
  "privacy",
  "forgot-password",
]);

export const stitchPreviewPages = stitchPages.filter(
  (page) => !nativeInterfaceSlugs.has(page.slug),
);

export const stitchPageMap = new Map(
  stitchPreviewPages.map((page) => [page.slug, page]),
);
