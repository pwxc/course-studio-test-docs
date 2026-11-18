import { defineConfig } from 'vitepress';
export default defineConfig({
  lang: 'zh-CN', title: '课程文档', base: "/course-studio-test-docs/", cleanUrls: true,
  themeConfig: { outline: { label: '本课内容', level: [2, 3] }, sidebar: [{"text":"课程工作台发布验收（虚拟课程）","items":[{"text":"第一章 · 基础概念","items":[{"text":"发布验收示例课：梯度下降","link":"/courses/21dcaaa3-c360-47fc-9bfd-a6ccb0b324a4/d8f35a4a-3f2f-4dfa-bb9c-2f53cbc37805"}]}]}], docFooter: { prev: '上一篇', next: '下一篇' } },
  markdown: { math: true, html: false, config(md) {
    const original = md.renderer.rules.text;
    md.renderer.rules.text = (tokens, index, options, env, renderer) => {
      const rendered = original ? original(tokens, index, options, env, renderer) : md.utils.escapeHtml(tokens[index].content);
      return rendered.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    };
  } }
});
