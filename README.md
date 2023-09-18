# 李佳琦吹羽毛

## Usage

```bash
yarn && yarn dev
```

## notes

- 要安装 `next@13.4.12`，否则会出现 `Error: Ensure bailed, found path does not match ensure type (pages/app)
`，这是 nextjs 最新版本的一个已知问题
- nextjs13 集成 socket.io 时需要额外加 `addTrailingSlash: false`，参考：https://github.com/vercel/next.js/issues/49334#issuecomment-1539268823
- zustand 的 ssr 问题依旧还没能解决，参考：zustand persist with ssr, see: https://github.com/pmndrs/zustand/issues/938
  - 不过有一种办法可以简单避免 hydration error，具体参考：https://nextjs.org/docs/messages/react-hydration-error#solution-3-using-suppresshydrationwarning
    - 详见 `components/game/main-player.tsx`

## ref

- template: https://github.com/shadcn/next-template

## License

None
