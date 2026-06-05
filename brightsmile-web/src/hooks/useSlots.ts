import { useQuery } from '@tanstack/react-query'
import { slotsApi } from '../api/endpoints'

interface SlotResponse {
  datetime: string
  available: boolean
}

export function useSlots(date: string | null, doctorId: number | null) {
  return useQuery<SlotResponse[]>({
    queryKey: ['slots', date, doctorId],
    queryFn: () => slotsApi.get(date!, doctorId!).then(r => r.data),
    enabled: !!date && !!doctorId,
    staleTime: 1000 * 30, // re-fetch after 30s so availability stays fresh
  })
}
