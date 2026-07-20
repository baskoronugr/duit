import { createContext, useContext, useState, type ReactNode } from 'react'

export type ActiveMember = 'Bas' | 'Tere'

interface ProfileContextValue {
  active: ActiveMember
  setActive: (m: ActiveMember) => void
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined)

const STORAGE_KEY = 'duit-active-member'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<ActiveMember>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'Tere' ? 'Tere' : 'Bas'
  })

  const setActive = (m: ActiveMember) => {
    setActiveState(m)
    localStorage.setItem(STORAGE_KEY, m)
  }

  return <ProfileContext.Provider value={{ active, setActive }}>{children}</ProfileContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
