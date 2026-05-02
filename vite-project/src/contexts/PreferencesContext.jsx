import { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PreferencesContext = createContext()

export const usePreferences = () => useContext(PreferencesContext)

export const PreferencesProvider = ({ children }) => {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState({
    categories: ['general', 'technology', 'business', 'sports', 'health'],
    preferredContentType: 'both'
  })

  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences)
    }
  }, [user])

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  )
}