export function triggerLogout() {
  window.dispatchEvent(new Event("auth:logout"));
}
