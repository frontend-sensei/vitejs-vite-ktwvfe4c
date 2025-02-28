export function getTreeData() {
  return new Array(1000)
    .fill(null)
    .map((_, index) => ({ title: `auto ${index}`, key: `auto-${index}` }));
}
