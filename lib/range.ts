export const limitRange = (x: number, l?: number, r?: number) => {
  if (l && x < l) return l
  if (r && x > r) return r
  return x
}
