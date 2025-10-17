import { useQuery } from "@tanstack/vue-query";
import { fetchCurrentUser } from "@/services/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
