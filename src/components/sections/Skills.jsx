import { SITE_CONFIG } from '../../config/siteConfig.js'
import useInView from '../../hooks/useInView.js'
import useCountUp from '../../hooks/useCountUp.js'

function SkillBar({ skill, inView, index }) {
  const [barRef, barInView] = useInView({ threshold: 0.3 })
  const count = useCountUp(skill.value, 1500, barInView)

  return (
    <div ref={barRef} className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-white text-sm"
          style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.03em' }}
        >
          {skill.name}
        </span>
        <span className="text-white/50 text-xs font-mono">{count}%</span>
      </div>
      <div className="relative h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
          style={{
            width: barInView ? `${skill.value}%` : '0%',
            background: 'linear-gradient(90deg, #5ed29c, #3da872)',
            transitionDelay: `${index * 100}ms`,
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ threshold: 0.2 })

  return (
    <section
      id="skills"
      ref={ref}
      className="relative px-5 sm:px-8 lg:px-10 py-24"
    >
      <div className="max-w-[600px] mx-auto">
        <p
          className={`mb-4 ${inView ? 'animate-fade-in' : 'opacity-0'}`}
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            color: '#5ed29c',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Core Skills
        </p>

        <h2
          className={`mb-12 ${inView ? 'animate-word-reveal' : 'opacity-0'}`}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 400,
            letterSpacing: '-0.05em',
            fontSize: 'clamp(32px, 6vw, 56px)',
            lineHeight: 1.1,
          }}
        >
          <span style={{ animationDelay: '0.1s' }}>核心</span>{' '}
          <span style={{ animationDelay: '0.2s', color: 'rgba(255,255,255,0.45)' }}>技能</span>
        </h2>

        <div className={`${inView ? 'animate-fade-up delay-400' : 'opacity-0'}`}>
          {SITE_CONFIG.skills.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} inView={inView} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
