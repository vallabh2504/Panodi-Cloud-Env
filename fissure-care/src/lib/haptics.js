export const haptic = {
  tap:       () => navigator.vibrate?.(10),
  success:   () => navigator.vibrate?.(15),
  milestone: () => navigator.vibrate?.([20, 50, 20]),
  error:     () => navigator.vibrate?.([30, 40, 30]),
}
