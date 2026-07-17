/**
 * content.js — 全局文案数据 + hydrate 逻辑
 *
 * 所有页面文字集中在此，HTML 通过 data-text / data-attr 引用。
 * 改这里 → 保存 → F5 刷新，文字即生效。
 */
window.SITE_CONTENT = {
  site: {
    meta: {
      description: "张逸凡的场外主页：篮球队长、音乐与 Rap、独立游戏，以及家里的猫。",
      title: "张逸凡 · 场外主页",
    },
    a11y: {
      skip: "跳到主要内容",
    },
    brand: {
      mark: "张",
      name: "张逸凡 / YIFAN",
      status: "OFF WORK · ON LIFE",
    },
    nav: {
      basketball: "01 篮球",
      music: "02 音乐",
      game: "03 游戏",
      cat: "04 猫",
    },
    hero: {
      imageSrc: "./assets/life/basketball/hero.jpg",
      signal: "B-SIDE SIGNAL ONLINE",
      titleSolid: "张逸凡，",
      titleOutline: "场外见。",
      lead: "简历已经讲完我如何工作。这里留给球场、舞台、游戏和家里的猫，也留给那个更鲜活、更松弛的我。",
      modes: ["CAPTAIN / 队长", "RAPPER / 表达者", "PLAYER / 玩家", "CAT STAFF / 铲屎官"],
    },
    manifesto: {
      kicker: "Beyond the resume",
      title: "工作之外，我喜欢把人聚起来，把想法做出来，也把日子过得有声有色。",
      copy: "篮球让我理解团队和临场判断，音乐让我练习真诚表达，游戏让我保持好奇，猫则负责提醒我慢下来。它们不是简历的注脚，而是我看待生活的方式。",
    },
    basketball: {
      kicker: "01 / Basketball",
      title: "先把人聚到一起，再把球打好。",
      copy: "连续三年代表华为云参加公司一层篮球比赛，最高名次第四名。作为队长兼组织者，我负责的不只是场上的一回合，也包括把一群人真正组织成一支队伍。",
      stats: [
        {
          value: "3 YEARS",
          label: "连续代表团队参赛",
        },
        {
          value: "TOP 4",
          label: "公司一层比赛最高名次",
        },
        {
          value: "CAPTAIN",
          label: "队长兼组织者",
        },
      ],
      media: [
        {
          src: "./assets/life/basketball/篮球1.jpg",
          alt: "张逸凡参加篮球比赛的现场照片",
          caption: "比赛日 / 和队友并肩上场",
        },
        {
          src: "./assets/life/basketball/篮球2.jpg",
          alt: "篮球队比赛后的合影",
          caption: "终场之后 / 排名之外还有彼此",
        },
      ],
    },
    music: {
      kicker: "02 / Music & Rap",
      title: "把心里的话，写进节拍里。",
      copy: "连续两年在华为云年会上唱歌、Rap。这首歌里，我负责 Verse 的作词和演唱。舞台对我来说不是表演勇气，而是把真实感受交给更多人。",
      tags: ["2× ANNUAL PARTY", "LYRICS", "RAP / LIVE"],
      video: {
        src: "https://player.bilibili.com/player.html?bvid=BV1sB4y1w7dh&page=1&high_quality=1&danmaku=0&autoplay=0",
        title: "《Riding Through this Wave》：再来亿遍",
        caption: "《Riding Through this Wave》/ 再来亿遍",
        cta: "在 B 站打开 ↗",
        link: "https://www.bilibili.com/video/BV1sB4y1w7dh/",
      },
    },
    game: {
      kicker: "03 / Game & ACG",
      title: "喜欢玩，也忍不住自己做。",
      copy: "我喜欢游戏和 ACG 文化，也习惯从玩家视角拆解体验。后来干脆把一个点子做成了能运行、能试玩的小项目 Project XILI，让兴趣从喜欢走到了创造。",
      link: "https://beneshady.github.io/Project_XILI/",
      ticket: {
        title: "PROJECT XILI",
        copy: "一个由兴趣驱动、自己动手完成的小游戏。",
        cta: "ENTER GAME",
      },
    },
    cat: {
      kicker: "04 / Home Operator",
      title: "最后，向真正的负责人汇报。",
      copy: "家里的猫是日常节奏的最高负责人。它不关心项目排期，只负责让我准时回家、认真观察生活，并在忙碌之后恢复一点柔软。",
      role: "ROLE: HOME QA LEAD / MOOD MANAGER / PRIORITY: P0",
      media: [
        {
          src: "./assets/life/cat/cat-hero.jpg",
          alt: "家里的猫的主照片",
          placeholder: "等待 cat-hero.jpg 接入",
        },
        {
          src: "./assets/life/cat/cat-01.jpg",
          alt: "家里的猫的日常照片一",
          placeholder: "cat-01.jpg",
        },
        {
          src: "./assets/life/cat/cat-02.jpg",
          alt: "家里的猫的日常照片二",
          placeholder: "cat-02.jpg",
        },
        {
          src: "./assets/life/cat/cat-03.jpg",
          alt: "家里的猫的日常照片三",
          placeholder: "cat-03.jpg",
        },
      ],
    },
    footer: {
      name: "张逸凡 / YIFAN ZHANG",
      tagline: "OFF WORK · ON LIFE",
      backTop: "BACK TO TOP ↑",
    },
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
