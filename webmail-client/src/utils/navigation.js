export function navigate(path) {
  if (typeof window !== 'undefined') window.location.href = path;
}
