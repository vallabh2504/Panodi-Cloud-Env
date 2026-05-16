export const hapticLight = () => navigator.vibrate?.(10)
export const hapticMedium = () => navigator.vibrate?.(25)
export const hapticSuccess = () => navigator.vibrate?.([10, 50, 10])
export const hapticError = () => navigator.vibrate?.([50, 30, 50])
export const hapticCelebration = () => navigator.vibrate?.([30, 20, 30, 20, 100])
export const hapticSelect = () => navigator.vibrate?.(8)

const canVibrate = () => typeof navigator !== 'undefined' && 'vibrate' in navigator

export const haptics = {
  light: () => canVibrate() && navigator.vibrate([15]),
  medium: () => canVibrate() && navigator.vibrate([30]),
  success: () => canVibrate() && navigator.vibrate([30]),
  celebrate: () => canVibrate() && navigator.vibrate([60, 20, 60]),
  warning: () => canVibrate() && navigator.vibrate([10, 10, 10]),
  tap: () => canVibrate() && navigator.vibrate([10]),
}
