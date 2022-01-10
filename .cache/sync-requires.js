const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/koushikaravalli/work-stuff/koushik-aravalli.github.io/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/koushikaravalli/work-stuff/koushik-aravalli.github.io/src/pages/404.js"))),
  "component---src-templates-blog-list-tsx": hot(preferDefault(require("/Users/koushikaravalli/work-stuff/koushik-aravalli.github.io/src/templates/blog-list.tsx"))),
  "component---src-templates-blog-post-js": hot(preferDefault(require("/Users/koushikaravalli/work-stuff/koushik-aravalli.github.io/src/templates/blog-post.js")))
}

