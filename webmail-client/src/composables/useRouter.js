import { ref, watch } from 'vue';
import { Local } from '../utils/storage';

export function useRouter() {
  const detectRoute = () => {
    if (window.location.pathname.startsWith('/calendar')) return 'calendar';
    if (window.location.pathname.startsWith('/contacts')) return 'contacts';
    if (window.location.pathname.startsWith('/mailbox/settings')) return 'settings';
    if (window.location.pathname.startsWith('/mailbox')) return 'mailbox';
    return 'login';
  };

  const route = ref(detectRoute());

  const navigate = (path) => {
    if (!path || typeof path !== 'string') return;
    const sameOrigin = path.startsWith('/');
    if (!sameOrigin) {
      window.location.href = path;
      return;
    }

    // Check auth for protected routes
    const targetRoute = path.startsWith('/mailbox/settings') ? 'settings' :
                        path.startsWith('/mailbox') ? 'mailbox' :
                        path.startsWith('/calendar') ? 'calendar' :
                        path.startsWith('/contacts') ? 'contacts' : 'login';

    if (
      (targetRoute === 'mailbox' || targetRoute === 'settings' || targetRoute === 'calendar' || targetRoute === 'contacts') &&
      !Local.get('authToken') &&
      !Local.get('alias_auth')
    ) {
      history.replaceState({}, '', '/');
      route.value = 'login';
      return;
    }

    history.pushState({}, '', path);
    route.value = detectRoute();
  };

  // Handle popstate
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      route.value = detectRoute();
    });
  }

  return {
    route,
    navigate
  };
}
