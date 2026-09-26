# Recons

`recons.html` 是编号推荐列表，不是大号标题流。视觉以 `assets/style.css` 里的 `.recon` 为准。加一条时复制上一条的 HTML，不要另起一套卡片，也不要改卡片 CSS，除非明确要求改样式。

## 一条里有什么

列表名和卡片是两个链接，href 必须相同，都带 `target="_blank"` 和 `rel="noopener"`。用户给的 URL 含有 `#fragment` 时保留，不要改成网站根路径。

- 列表名：站点或作品的短名，不是口号。
- 卡片标题：对方页面自己的标题。
- 说明：一句。用对方页面上已有的表述来缩，不编内容，不写成介绍文。中文站点用中文，英文站点用英文。
- 底栏：主域名，去掉 `www` 和路径。例如 `huggingface.co`，不要写成整段 URL。
- 色条：取该站点或图标自己的颜色，写成 `style="background:#……"`。不要用本站橙色，除非对方自己就是这个颜色。同一来源可以共用图标和色条，Anthropic 两条即是。

编号接在最后一条后面。不要为了插入而重排已有编号，除非明确要求。

## 图标

文件放在 `assets/img/recon-icon-<短名>.jpg`，256×256，RGB。用对方的头像、标志或站点图标，不用整页截图。卡片右上角和底栏用同一张图。

原图有透明角时，用它自己的背景色填实再存成 JPEG。不要留下黑角。

## 卡片不要改掉的行为

整张卡片是一个 `<a class="recon-card">`，名字链接和卡片都能点。底栏是与卡片同宽的方条：默认浅灰，只有鼠标放在底栏上才加深，文字不变成橙色。卡片近直角、细边、用页面纸色。桌面悬停或键盘聚焦时出现在名字右侧；有一条不可见的桥，鼠标能从名字移进卡片。无悬停的设备不依赖这张浮层，名字链接仍然可点。

## 骨架

```html
<p class="ref-item">[n]. <span class="recon"><a href="URL" target="_blank" rel="noopener">列表名</a>
<a class="recon-card" href="URL" target="_blank" rel="noopener">
  <span class="recon-card-top"><span class="recon-card-name">列表名</span><img class="recon-card-icon" src="assets/img/recon-icon-短名.jpg" alt=""></span>
  <span class="recon-card-bar" style="background:#色"></span>
  <span class="recon-card-title">对方页面标题</span>
  <span class="recon-card-desc">一句说明。</span>
  <span class="recon-card-foot"><img src="assets/img/recon-icon-短名.jpg" alt="">域名 <svg class="recon-ext" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg></span>
</a></span></p>
```

现成条目在 `recons.html`。本文只记内容约定；像素、字号和悬停位置以 CSS 为准。
