export function prefersDarkTheme() {
  return (
    "matchMedia" in window && matchMedia("(prefers-color-scheme: dark)").matches
  );
}
