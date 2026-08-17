// googleAuth.js
// Integration for Google Identity Services (GIS) & Google OAuth 2.0 API

const GOOGLE_CLIENT_ID_KEY = 'bd_google_client_id'

// Default client ID from environment or storage
export function getGoogleClientId() {
  return (
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    localStorage.getItem(GOOGLE_CLIENT_ID_KEY) ||
    ''
  )
}

export function setGoogleClientId(clientId) {
  if (clientId) {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim())
  } else {
    localStorage.removeItem(GOOGLE_CLIENT_ID_KEY)
  }
}

// Safely decode Google JWT Credential Token
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    console.error('Failed to parse Google JWT', e)
    return null
  }
}

// Check if Google GIS SDK is loaded in window
export function isGoogleGisAvailable() {
  return typeof window !== 'undefined' && !!window.google?.accounts?.id
}

// Initialize Google One Tap / Sign In with Google
export function initGoogleIdentity({ clientId, callback }) {
  const activeClientId = clientId || getGoogleClientId()
  if (!activeClientId || !isGoogleGisAvailable()) return false

  try {
    window.google.accounts.id.initialize({
      client_id: activeClientId,
      callback: (response) => {
        const payload = parseJwt(response.credential)
        if (payload) {
          callback({
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            avatar: payload.picture,
            email_verified: payload.email_verified,
            verified: true,
            method: 'google',
          })
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    })
    return true
  } catch (err) {
    console.error('Error initializing Google Identity:', err)
    return false
  }
}

// Render official Google button into a container element
export function renderGoogleSignInButton(element, options = {}) {
  const clientId = getGoogleClientId()
  if (!clientId || !isGoogleGisAvailable() || !element) return false

  try {
    window.google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      width: '100%',
      ...options,
    })
    return true
  } catch (err) {
    console.error('Failed to render Google button:', err)
    return false
  }
}

// Trigger Google OAuth 2.0 Popup Token Flow
export function triggerGoogleOAuth({ clientId, onSuccess, onError }) {
  const activeClientId = clientId || getGoogleClientId()

  if (!activeClientId) {
    if (onError) onError(new Error('NO_CLIENT_ID'))
    return
  }

  if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
    if (onError) onError(new Error('GIS_NOT_LOADED'))
    return
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: activeClientId,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          if (onError) onError(tokenResponse)
          return
        }

        try {
          // Fetch verified user profile from Google OAuth 2.0 UserInfo endpoint
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          })
          if (!res.ok) throw new Error('Failed to fetch user info from Google')

          const profile = await res.json()
          const verifiedUser = {
            id: profile.sub,
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            email_verified: profile.email_verified,
            verified: true,
            method: 'google',
          }

          if (onSuccess) onSuccess(verifiedUser)
        } catch (err) {
          if (onError) onError(err)
        }
      },
    })

    tokenClient.requestAccessToken()
  } catch (err) {
    console.error('Google OAuth failed to trigger:', err)
    if (onError) onError(err)
  }
}
