import { statusConfig } from '../data/storage'

export default function Relatorios({ ordens, onVoltar }) {
  const total     = ordens.length
  const abertas   = ordens.filter(o => o.status === 'aberta').length
  const andamento = ordens.filter(o => o.status === 'andamento').length
  const concluidas = ordens.filter(o => o.status === 'concluida').length
  const pct = (n) => total === 0 ? 0 : Math.round((n / total) * 100)

  const raio = 80
  const cx = 120, cy = 120
  const ri = raio - 32
  const dados = [
    { key: 'aberta',    valor: abertas },
    { key: 'andamento', valor: andamento },
    { key: 'concluida', valor: concluidas },
  ]

  let acum = -90
  const segmentos = dados.map(({ key, valor }) => {
    const s = statusConfig[key]
    const graus = total === 0 ? 0 : (valor / total) * 360
    const ini = acum
    acum += graus
    if (graus === 0) return null
    const r2d = (g) => (g * Math.PI) / 180
    const x1 = cx + raio * Math.cos(r2d(ini))
    const y1 = cy + raio * Math.sin(r2d(ini))
    const x2 = cx + raio * Math.cos(r2d(acum - 0.5))
    const y2 = cy + raio * Math.sin(r2d(acum - 0.5))
    const xi1 = cx + ri * Math.cos(r2d(ini))
    const yi1 = cy + ri * Math.sin(r2d(ini))
    const xi2 = cx + ri * Math.cos(r2d(acum - 0.5))
    const yi2 = cy + ri * Math.sin(r2d(acum - 0.5))
    const la = graus > 180 ? 1 : 0
    const d = `M ${x1} ${y1} A ${raio} ${raio} 0 ${la} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${ri} ${ri} 0 ${la} 0 ${xi1} ${yi1} Z`
    return { d, cor: s.cor, key }
  }).filter(Boolean)

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Relatórios</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Visão geral das ordens de serviço</p>
      </div>

      {/* Cards de totais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total',        valor: total,      bg: 'var(--bg-layer-01)', cor: 'var(--text-primary)', border: 'var(--border-subtle)' },
          { label: 'Abertas',      valor: abertas,    bg: 'var(--status-open-bg)',     cor: 'var(--status-open)',     border: 'var(--status-open-bg)' },
          { label: 'Em andamento', valor: andamento,  bg: 'var(--status-progress-bg)', cor: 'var(--status-progress)', border: 'var(--status-progress-bg)' },
          { label: 'Concluídas',   valor: concluidas, bg: 'var(--status-done-bg)',     cor: 'var(--status-done)',     border: 'var(--status-done-bg)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '26px', fontWeight: '700', color: c.cor, letterSpacing: '-0.5px', lineHeight: 1 }}>{c.valor}</p>
            <p style={{ fontSize: '11px', fontWeight: '600', color: c.cor, marginTop: '6px', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.8 }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Barras */}
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>Distribuição por status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {dados.map(({ key, valor }) => {
              const s = statusConfig[key]
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{s.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{valor} · {pct(valor)}%</span>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', height: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct(valor)}%`, height: '100%', background: s.cor, borderRadius: 'var(--radius-full)', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Gráfico rosca */}
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>Gráfico por status</p>
          {total === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Nenhuma OS cadastrada.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <svg width="240" height="240" viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
                {segmentos.map(seg => (
                  <path key={seg.key} d={seg.d} fill={seg.cor} />
                ))}
                <text x="120" y="114" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--text-primary)" fontFamily="DM Sans, sans-serif">{total}</text>
                <text x="120" y="134" textAnchor="middle" fontSize="11" fill="var(--text-secondary)" fontFamily="DM Sans, sans-serif" textTransform="uppercase">total</text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dados.map(({ key, valor }) => {
                  const s = statusConfig[key]
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: '500' }}>{s.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto', paddingLeft: '12px' }}>{pct(valor)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}