import { defineConfig } from 'vitepress';
import directory from '../../course-studio-public.json';

const courses = new Map();
for (const lesson of [...directory.lessons].sort((a, b) => a.order - b.order)) {
  if (!courses.has(lesson.courseId)) {
    courses.set(lesson.courseId, { text: lesson.courseTitle, chapters: new Map() });
  }
  const { chapters } = courses.get(lesson.courseId);
  if (!chapters.has(lesson.sectionId)) {
    chapters.set(lesson.sectionId, { text: lesson.sectionTitle, items: [] });
  }
  chapters.get(lesson.sectionId).items.push({
    text: lesson.title,
    link: '/courses/' + lesson.courseId + '/' + lesson.id,
  });
}

const sidebar = [...courses.values()].map(({ text, chapters }) => ({
  text,
  items: [...chapters.values()],
}));

export default defineConfig({
  lang: 'zh-CN', title: '课程文档', base: "/course-studio-test-docs/", cleanUrls: true,
  themeConfig: { outline: { label: '本课内容', level: [2, 3] }, sidebar, docFooter: { prev: '上一篇', next: '下一篇' } },
  markdown: { math: true, html: false, config(md) {
    const original = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, index, options, env, renderer) => {
      const rendered = original ? original(tokens, index, options, env, renderer) : md.utils.escapeHtml(tokens[index].content);
      return rendered.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    };
  } }
});
