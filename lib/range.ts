export const limitRange = (x: number, range: { l?: number; r?: number }) => {
  if (range.l && x < range.l) return range.l
  if (range.r && x > range.r) return range.r
  return x
}
