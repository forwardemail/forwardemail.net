import { watch } from 'vue';
import { Local } from '../utils/storage';

export function useTheme() {
  const applyTheme = (pref) => {
    const theme = pref || Local.get('theme') || 'system';
    const prefersDark =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.remove('light-mode', 'dark-mode');
    if (theme === 'light' || (theme === 'system' && !prefersDark)) {
      document.body.classList.add('light-mode');
    } else if (theme === 'dark' || (theme === 'system' && prefersDark)) {
      document.body.classList.add('dark-mode');
    }
  };

  return {
    applyTheme
  };
}
