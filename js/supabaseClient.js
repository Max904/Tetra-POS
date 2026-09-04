import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://venfrxrsqutlyxhsblbx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmZyeHJzcXV0bHl4aHNibGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzY5ODUsImV4cCI6MjEwMzg1Mjk4NX0.6tmXf2Y1-AZdq4o_9QlFmSjEVddY3n7iNmyJ5uAWUeE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export const MENU_IMAGE_BUCKET = "menu-images";

// Pulls the storage object path back out of one of our own public URLs
// (https://<project>.supabase.co/storage/v1/object/public/menu-images/<path>)
// so we know what to delete. Returns null for anything that isn't a
// menu-images URL — e.g. a manually pasted external image link — since we
// should never try to delete files we didn't upload ourselves.
export function menuImagePathFromUrl(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${MENU_IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function deleteMenuImagePath(path) {
  if (!path) return;
  try {
    await supabase.storage.from(MENU_IMAGE_BUCKET).remove([path]);
  } catch (err) {
    console.warn("Failed to delete menu image:", err);
  }
}

export async function deleteMenuImageByUrl(url) {
  await deleteMenuImagePath(menuImagePathFromUrl(url));
}
