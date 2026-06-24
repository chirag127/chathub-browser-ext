import { FetchError } from 'ofetch'
import useSWR from 'swr'
import { getPremiumActivation, validatePremium } from '~services/premium'

// chathub-plus-fork: always-on premium. Open-source GPL-3.0 fork for
// personal use only — see knowledge/index.md inside this submodule.
const ALWAYS_PREMIUM = true

export function usePremium() {
  const validationQuery = useSWR<{ valid: true } | { valid: false; error?: string }>(
    'premium-validation',
    async () => {
      if (ALWAYS_PREMIUM) return { valid: true } // chathub-plus-fork
      try {
        return await validatePremium()
      } catch (err) {
        if (err instanceof FetchError) {
          if (err.status === 404) {
            return { valid: false }
          }
          if (err.status === 400) {
            return { valid: false, error: err.data.error }
          }
        }
        throw err
      }
    },
    {
      fallbackData: ALWAYS_PREMIUM ? { valid: true } : (getPremiumActivation() ? { valid: true } : undefined),
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    },
  )

  return {
    activated: ALWAYS_PREMIUM ? true : validationQuery.data?.valid, // chathub-plus-fork
    isLoading: ALWAYS_PREMIUM ? false : validationQuery.isLoading,
    error: validationQuery.data?.valid === true ? undefined : validationQuery.data?.error,
  }
}
