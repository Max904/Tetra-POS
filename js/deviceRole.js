// The "role" of THIS physical device/browser — waiter (floor staff), kitchen,
// or bar. Stored in localStorage only, so it's never synced through Supabase:
// every tablet/terminal picks its own role independently, which is what lets
// the app tell a waiter's device apart from a kitchen or bar display.
//
// Defaults to "waiter" since that's the app's default landing view
// (Floor Plan / Register) — kitchen and bar stations opt in explicitly from
// the header switch (or from Settings) once they set up that device.

const STORAGE_KEY = "tetra:deviceRole";
const VALID_ROLES = ["waiter", "kitchen", "bar"];

function getDeviceRole() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return VALID_ROLES.includes(stored) ? stored : "waiter";
  } catch {
    return "waiter";
  }
}

function setDeviceRole(role) {
  if (!VALID_ROLES.includes(role)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
    // localStorage unavailable (e.g. private mode) — role just won't persist.
  }
}

export { getDeviceRole, setDeviceRole, VALID_ROLES };
