import { useQuery } from "@tanstack/vue-query";
import { unref, computed } from "vue";
import { fetchCalendar } from "@/services/calendar";

/**
 * Fetch calendar by user and yearMonth.
 * @param {string} userId
 * @param {string} yearMonth - e.g. '2025-10'
 */
export function useCalendar(userId, yearMonth) {
  const uid = computed(() => unref(userId));
  const ym = computed(() => unref(yearMonth));
  return useQuery({
    queryKey: computed(() => ["calendar", { userId: uid.value, yearMonth: ym.value }]),
    queryFn: () => fetchCalendar({ userId: uid.value, yearMonth: ym.value }),
    enabled: computed(() => Boolean(uid.value && ym.value)),
    staleTime: 5 * 60 * 1000,
  });
}
