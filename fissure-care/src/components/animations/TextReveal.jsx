import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

export default function TextReveal({ text, tag = 'div', delay = 0, onMount = false, style, className }) {
  const ref = useRef()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = el.querySelectorAll('.tr-char')

    const tl = gsap.from(chars, {
      opacity: 0,
      y: 22,
      duration: 0.48,
      stagger: 0.022,
      ease: 'power3.out',
      delay,
      paused: !onMount,
      ...(onMount ? {} : {
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      }),
    })

    if (onMount) tl.play()

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => { if (st.trigger === el) st.kill() })
    }
  }, [text, delay, onMount])

  const Tag = tag
  const words = (text || '').split(' ')

  return (
    <Tag ref={ref} style={style} className={className}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => (
            <span key={ci} className="tr-char">{char}</span>
          ))}
          {wi < words.length - 1 && (
            <span className="tr-char">&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  )
}
