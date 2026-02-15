type LogoutListener = () => void;

let logoutListener: LogoutListener | null = null;

export function setLogoutListener(listener: LogoutListener) {
  logoutListener = listener;
}

export function triggerLogout() {
  if (logoutListener) {
    logoutListener();
  }
}
