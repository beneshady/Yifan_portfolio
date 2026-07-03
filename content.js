/**
 * content.js — 全局文案数据 + hydrate 逻辑
 *
 * 所有页面文字集中在此，HTML 通过 data-text / data-attr 引用。
 * 改这里 → 保存 → F5 刷新，文字即生效。
 */
window.SITE_CONTENT = {
  home: {
    pageTitle: "张逸凡 · 研发型产品经理",
    nav: {
      projects: "项目案例",
      experience: "经历",
      skills: "能力栈",
      life: "场外一面",
    },
    hero: {
      eyebrow: "Hello, I am Yifan Zhang",
      h1: "研发体系里的产品交付者",
      lead: "8 年软件研发、云服务运维与产品交付经验，近年聚焦流程管理中台、AI 应用落地、需求治理和跨部门项目推进。",
      ctaPrimary: "看项目案例",
      ctaExperience: "看经历",
      ctaLife: "场外一面",
      imgAlt: "AI 工单分析平台示意图",
    },
    metrics: [
      {
        value: "8+",
        label: "研发与交付经验",
      },
      {
        value: "70+",
        label: "人工变更自动化",
      },
      {
        value: "30+",
        label: "边缘站点运维",
      },
    ],
    skillsH2: "能力栈",
    skillsIntro: "masterPortfolio 风格适合把技能显式铺开，但这里将\"技术栈\"服务于产品交付叙事。",
    skills: ["需求分析", "版本交付", "AI 应用", "数据分析", "BPMN / Figma", "Python / Java", "RAG / Agent", "跨团队协同"],
    experienceH2: "经历",
    timeline: [
      {
        range: "2023 至今",
        title: "流程 IT / 研发效能部门 · 版本需求分析师 / 项目经理 / 运营经理",
        desc: "管理 20+ 开发人力需求管道，负责流程管理中台版本交付；孵化流程智能问答助手与 AI 工单分析平台。",
      },
      {
        range: "2018 - 2023",
        title: "某头部云厂商 · 软件工程师 / 运维工程师",
        desc: "负责分布式云服务运维体系、自动化交付专项、统一身份认证与企业云解决方案交付。",
      },
    ],
    projectsH2: "项目案例",
    projects: [
      {
        imgAlt: "流程管理 SaaS 中台示意图",
        title: "流程管理 SaaS 中台",
        desc: "用需求治理和版本机制支撑多业务域流程落地，保持 30+ 版本稳定交付。",
      },
      {
        imgAlt: "AI 工单分析平台示意图",
        title: "AI 工单分析平台",
        desc: "将运营分析效率从 1 天提升至 10 分钟，让用户反馈进入产品迭代闭环。",
      },
      {
        imgAlt: "分布式云自动化交付示意图",
        title: "自动化交付专项",
        desc: "协调 5 个服务域，把 70+ 人工变更编排为自动化流程，支撑边缘站点稳定运行。",
      },
    ],
    awardsH2: "荣誉与可信度",
    awards: ["部门级卓越个人奖", "部门负责人奖", "事业群总裁嘉奖", "公司级明日之星", "UC Irvine Dean's Honor List"],
    lifePreview: {
      eyebrow: "Beyond Work",
      h2: "场外一面",
      lead: "简历讲交付结果，这一页补充更立体的个人侧面：篮球队长与组织者、年会唱歌和 rap、以及家里的猫。",
      chips: ["篮球队长", "舞台表达", "家里的猫"],
      cta: "进入兴趣页",
    },
    footer: "张逸凡 · 研发型产品经理 · 脱敏案例复盘",
  },
  shared: {
    brand: {
      mark: "张",
      home: "张逸凡 · 个人主页",
      life: "场外一面",
    },
  },
  life: {
    pageTitle: "张逸凡 · 场外一面",
    nav: {
      home: "职业主页",
      game: "游戏",
      basketball: "篮球",
      music: "音乐",
      cat: "猫",
    },
    hero: {
      label: "Beyond Work · 克制二次元番外篇",
      h1: "项目之外，我也在游戏、球场、舞台和家里补能。",
      lead: "简历讲交付结果，这一页讲更立体的一面：我是游戏动漫爱好者，会自己动手做小游戏；也组织队伍、站上舞台，并在高强度工作之外保持热情、松弛感和观察力。",
      nav: ["Player Mode", "Captain Mode", "Stage Mode", "Home Mode"],
      heroImgAlt: "场外一面主视觉",
    },
    game: {
      label: "01 · Game & Anime",
      h2: "游戏动漫爱好者 · 自己做小游戏",
      lead: "我是游戏动漫爱好者，喜欢从玩家视角拆解玩法，也忍不住自己动手实现。抽空开发了一个小程序游戏，把想玩的点子做成了能跑起来的东西——欢迎来玩。",
      stats: [
        {
          value: "Indie",
          label: "独立开发",
        },
        {
          value: "Mini",
          label: "小程序游戏",
        },
        {
          value: "Play",
          label: "可玩 Demo",
        },
      ],
      ctaHref: "https://beneshady.github.io/Project_XILI/",
      ctaTitle: "Project XILI · 试玩",
      ctaSub: "beneshady.github.io/Project_XILI/ ↗",
    },
    basketball: {
      label: "02 · Basketball",
      h2: "队长兼组织者",
      lead: "连续三年代表所在公司参加内部篮球联赛，最高名次第四名。对我来说，篮球不是简历之外的装饰，它是长期组织、临场判断和团队信任的训练场。",
      stats: [
        {
          value: "3",
          label: "连续参赛年份",
        },
        {
          value: "#4",
          label: "最高名次",
        },
        {
          value: "C",
          label: "队长 / 组织者",
        },
      ],
      imgAlt1: "篮球比赛照片 1",
      imgAlt2: "篮球比赛照片 2",
    },
    music: {
      label: "03 · Music",
      h2: "舞台表达",
      lead: "连续两年在公司年会上唱歌、rap。这首歌我负责 Verse 的作词和表演，平时喜欢把心里的东西写成节奏，再带到台上。",
      stats: [
        {
          value: "Verse",
          label: "作词",
        },
        {
          value: "Rap",
          label: "表演",
        },
        {
          value: "Live",
          label: "现场呈现",
        },
      ],
      videoSrc: "https://player.bilibili.com/player.html?bvid=BV1sB4y1w7dh&page=1&high_quality=1&danmaku=0&autoplay=0",
      videoTitle: "《Riding Through this Wave》：再来亿遍",
      videoCaption: "《Riding Through this Wave》：再来亿遍 ·",
      videoLinkText: "在 B 站打开",
      videoLinkHref: "https://www.bilibili.com/video/BV1sB4y1w7dh/",
    },
    cat: {
      label: "04 · Cat",
      h2: "家里的猫",
      lead: "工作之外，我喜欢记录家里猫的日常。它算是生活里的稳定器，也提醒我在高强度项目节奏里保留一点松弛感和观察力。",
      tags: ["Mood Manager", "Home QA Lead", "Stress Reducer"],
      mediaSlots: ["cat-hero.jpg", "cat-01.jpg", "cat-02.jpg", "cat-03.jpg / cat-04.jpg"],
    },
    footer: "张逸凡 · 场外一面",
  },
};

/* ══════════════════════════════════════
   hydrate：把文字注入 DOM
   两个页面共用，由 <script defer> 载入
   ══════════════════════════════════════ */

function pick(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[/^\d+$/.test(k) ? Number(k) : k]), obj);
}

document.addEventListener("DOMContentLoaded", () => {
  const data = window.SITE_CONTENT;

  // 1) data-text → textContent (或 innerHTML 当 data-html="true")
  document.querySelectorAll("[data-text]").forEach((el) => {
    const value = pick(data, el.dataset.text);
    if (value == null) return;
    if (el.dataset.html === "true") {
      el.innerHTML = String(value).replace(/\n/g, "<br>");
    } else {
      el.textContent = value;
    }
  });

  // 2) data-attr → setAttribute  (语法: "attrName:path;attrName2:path2")
  document.querySelectorAll("[data-attr]").forEach((el) => {
    el.dataset.attr.split(";").forEach((pair) => {
      const colon = pair.indexOf(":");
      if (colon === -1) return;
      const attrName = pair.slice(0, colon).trim();
      const path = pair.slice(colon + 1).trim();
      const value = pick(data, path);
      if (value != null) el.setAttribute(attrName, value);
    });
  });
});
