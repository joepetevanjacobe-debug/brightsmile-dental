import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { portalApi } from '../api/endpoints'
import toast from 'react-hot-toast'

export function usePortalAppointments() {
  return useQuery({
    queryKey: ['portal-appointments'],
    queryFn: () => portalApi.myAppointments().then(r => r.data),
  })
}

export function useCancelAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => portalApi.cancel(id),
    onSuccess: () => {
      toast.success('Appointment cancelled.')
      qc.invalidateQueries({ queryKey: ['portal-appointments'] })
    },
    onError: () => {
      toast.error('Could not cancel appointment.')
    },
  })
}
