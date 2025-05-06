function convertToNumber(value: string | undefined): number | 0 {
  return value !== undefined ? +value : 0;
}
