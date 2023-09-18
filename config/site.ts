export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "李佳琦吹羽毛",
  description:
    "吹啊吹啊 我的驕傲放縱 吹啊吹不毀我純淨花園 任風吹 任它亂 毀不滅是我 盡頭的展望",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    github: "https://github.com/cs-magic/ljq-feather",
  },
}

export const SOCKET_IO_URL =
  process.env.NODE_ENV === "production"
    ? "https://ljq.cs-magic.cn"
    : "http://localhost:3000"
export const SOCKET_IO_ENDPOINT = undefined
// "/api/socket"
