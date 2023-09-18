# 李佳琦吹羽毛

## Usage

```bash
yarn && yarn dev
```

## notes

- 要安装 `next@13.4.12`，否则会出现 `Error: Ensure bailed, found path does not match ensure type (pages/app)
`，这是 nextjs 最新版本的一个已知问题
- nextjs13 集成 socket.io 时需要额外加 `addTrailingSlash: false`，参考：https://github.com/vercel/next.js/issues/49334#issuecomment-1539268823

## ref

- template: https://github.com/shadcn/next-template

## License

None
