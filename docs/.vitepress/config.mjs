import { defineConfig } from 'vitepress';
import directory from '../../course-studio-public.json';

const exampleCourseIds = new Set([]);
const courses = new Map();
const articleContexts = new Map();
for (const lesson of [...directory.lessons].sort((a, b) => a.order - b.order)) {
  if (!courses.has(lesson.courseId)) {
    courses.set(lesson.courseId, {
      title: lesson.courseTitle,
      path: '/courses/' + lesson.courseId + '/',
      chapters: [],
      isExample: exampleCourseIds.has(lesson.courseId),
    });
  }
  const course = courses.get(lesson.courseId);
  const link = course.path + lesson.id;
  course.chapters.push({ text: lesson.title, link });
  articleContexts.set(link.slice(1) + '.md', course);
}

const sidebar = Object.fromEntries([...courses.values()].map((course) => [
  course.path,
  [{
    text: course.title,
    items: course.chapters,
  }],
]));

const literal = (value) => String(value).replace(/\s+/g, ' ').trim()
  .replace(/[\\\x60*_[\]<>#{}!|&$~]/g, '\\$&');

function entry(course, level) {
  const chapters = course.chapters;
  return [
    '#'.repeat(level) + ' [' + literal(course.title) + '](' + chapters[0].link + ')',
    '共 ' + chapters.length + ' 章',
    chapters.map((chapter) => '- [' + literal(chapter.text) + '](' + chapter.link + ')').join('\n'),
  ].join('\n\n');
}

const published = [...courses.values()].filter((course) => !course.isExample);
const examples = [...courses.values()].filter((course) => course.isExample);
const homepage = [
  '# 全部课程',
  ...published.map((course) => entry(course, 2)),
  ...(examples.length ? ['## 发布验收示例', ...examples.map((course) => entry(course, 3))] : []),
  ...(!courses.size ? ['暂无已发布课程'] : []),
].join('\n\n');

export default defineConfig({
  lang: 'zh-CN',
  title: '课程文档',
  base: "/course-studio-test-docs/",
  cleanUrls: true,
  themeConfig: {
    nav: [{ text: '全部课程', link: '/' }],
    sidebar,
    sidebarMenuLabel: '章节目录',
    returnToTopLabel: '回到顶部',
    outline: { label: '本章内容', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
  },
  markdown: { math: true, html: false, config(md) {
    md.core.ruler.before('normalize', 'published-course-navigation', (state) => {
      if (state.env.relativePath === 'index.md') {
        state.env.frontmatter = { ...state.env.frontmatter, outline: false, prev: false, next: false };
        state.src = homepage;
        return;
      }
      const course = articleContexts.get(state.env.relativePath);
      if (course) {
        state.src = '[全部课程](/) / ' + literal(course.title) + '\n\n' + state.src;
      }
    });
    const original = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, index, options, env, renderer) => {
      const rendered = original ? original(tokens, index, options, env, renderer) : md.utils.escapeHtml(tokens[index].content);
      return rendered.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    };
  } },
});
