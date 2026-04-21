import { useState, useEffect, useCallback } from 'react'

/**
 * useDevice — Smart device detection hook
 * Provides:
 *  - isMobile / isTablet / isDesktop based on width breakpoints
 *  - isTouch — true if device supports touch
 *  - orientation — 'portrait' | 'landscape'
 *  - width / height — current viewport dimensions
 *  - deviceClass — CSS class string to apply to root element
 *  - isSmallPhone — true for very small screens (< 360px)
 */
export function useDevice() {
  const getState = useCallback(() => {
    if (typeof window === 'undefined') return defaultState()

    const w = window.innerWidth
    const h = window.innerHeight
    const isTouch = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    )

    // Check UA for mobile hint (supplement width check)
    const ua = navigator.userAgent || ''
    const uaMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS/i.test(ua)

    const isSmallPhone = w < 360
    const isMobile    = w < 768 || (uaMobile && w < 900)
    const isTablet    = !isMobile && w < 1024
    const isDesktop   = !isMobile && !isTablet
    const orientation = h > w ? 'portrait' : 'landscape'

    // Build device class string
    const classes = [
      isMobile    ? 'is-mobile'    : '',
      isTablet    ? 'is-tablet'    : '',
      isDesktop   ? 'is-desktop'   : '',
      isTouch     ? 'is-touch'     : 'is-mouse',
      isSmallPhone? 'is-small-phone' : '',
      orientation === 'portrait' ? 'orient-portrait' : 'orient-landscape',
    ].filter(Boolean).join(' ')

    return { w, h, isTouch, uaMobile, isSmallPhone, isMobile, isTablet, isDesktop, orientation, classes }
  }, [])

  const [device, setDevice] = useState(() => getState())

  useEffect(() => {
    let raf
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setDevice(getState()))
    }

    window.addEventListener('resize', update, { passive: true })
    window.addEventListener('orientationchange', update, { passive: true })

    // Screen.orientation API (modern)
    if (screen.orientation) {
      screen.orientation.addEventListener('change', update)
    }

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      if (screen.orientation) screen.orientation.removeEventListener('change', update)
      cancelAnimationFrame(raf)
    }
  }, [getState])

  return device
}

function defaultState() {
  return {
    w: 1024, h: 768,
    isTouch: false, uaMobile: false, isSmallPhone: false,
    isMobile: false, isTablet: false, isDesktop: true,
    orientation: 'landscape',
    classes: 'is-desktop is-mouse orient-landscape'
  }
}
