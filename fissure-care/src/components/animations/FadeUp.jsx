import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function FadeUp({ children, delay = 0, distance = 28, style, className }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const anim = gsap.from(el, {
      opacity: 0,
      y: distance,
      duration: 0.55,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true,
      },
    })

    return () => {
      anim.kill()
      ScrollTrigger.getAll().forEach(st => { if (st.trigger === el) st.kill() })
    }
  }, [delay, distance])

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
