import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { listMealCards, getMealCard, createMealCard, updateMealCard, deleteMealCard } from '@/services/mealCard'
import { unref, computed } from 'vue'

export function useMealCards(calendarIdRef) {
  const cid = computed(() => unref(calendarIdRef))
  return useQuery({
    queryKey: computed(() => ['mealCards', { calendarId: cid.value }]),
    queryFn: () => listMealCards({ calendarId: cid.value }),
    enabled: computed(() => Boolean(cid.value)),
    staleTime: 5 * 60 * 1000,
  })
}

export function useMealCard(mealCardIdRef) {
  const id = computed(() => unref(mealCardIdRef))
  return useQuery({
    queryKey: computed(() => ['mealCard', { mealCardId: id.value }]),
    queryFn: () => getMealCard(id.value),
    enabled: computed(() => Boolean(id.value)),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateMealCard(invalidateKey) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => createMealCard(body),
    onSuccess: () => {
      if (invalidateKey) qc.invalidateQueries({ queryKey: invalidateKey })
    },
  })
}

export function useUpdateMealCard(invalidateKey) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ mealCardId, body }) => updateMealCard(mealCardId, body),
    onSuccess: () => {
      if (invalidateKey) qc.invalidateQueries({ queryKey: invalidateKey })
    },
  })
}

export function useDeleteMealCard(invalidateKey) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mealCardId) => deleteMealCard(mealCardId),
    onSuccess: () => {
      if (invalidateKey) qc.invalidateQueries({ queryKey: invalidateKey })
    },
  })
}
