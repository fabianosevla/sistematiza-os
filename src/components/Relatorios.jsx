import { statusConfig } from '../data/storage'

export default function Relatorios({ ordens, onVoltar }) {
  const total = ordens.length
  const abertas = ordens.filter(o => o.status === 'aberta').length
  const andamento = ordens.filter(o => o.status === 'andamento').length
  const concluidas = ordens.filter(o => o.status === 'concluida').length

  const pct = (n) => total === 0 ? 0 : Math.round((n / total) * 100)

  const raio = 80
  const cx = 120
  const cy = 120
  const espessura = 32
  const raioInterno = raio - espessura

  const dados = [
    { key: 'aberta',    valor: abertas },
    { key: 'andamento', valor: andamento },
    { key: 'concluida', valor: concluidas },
  ]

  let acumulado = -90
  const segmentos = dados.map(({ key, valor }) => {
    const s = statusConfig[key]
    const graus = total === 0 ? 0 : (valor / total) * 360
    const inicio = acumulado
    acumulado += graus
    if (graus === 0) return null
    const toRad = (g) => (g * Math.PI) / 180
    const x1  = cx + raio       * Math.cos(toRad(inicio))
    const y1  = cy + raio       * Math.sin(toRad(inicio))
    const x2  = cx + raio       * Math.cos(toRad(acumulado - 0.5))
    const y2  = cy + raio       * Math.sin(toRad(acumulado - 0.5))
    const xi1 = cx + raioInterno * Math.cos(toRad(inicio))
    const yi1 = cy + raioInterno * Math.sin(toRad(inicio))
    const xi2 = cx + raioInterno * Math.cos(toRad(acumulado - 0.5))
    const yi2 = cy + raioInterno * Math.sin(toRad(acumulado - 0.5))
    const largeArc = graus > 180 ? 1 : 0
    const d = [
      `M ${x1} ${y1}`,
      `A ${raio} ${raio} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi2} ${yi2}`,
      `A ${raioInterno} ${raioInterno} 0 ${largeArc} 0 ${xi1} ${yi1}`,
      'Z'
    ].join(' ')
    return { d, cor: s.cor, key }
  }).filter(Boolean)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>Relatórios</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '2rem' }}>
        {[
          { label: 'Total',        valor: total,      bg: '#f9fafb', cor: '#111827' },
          { label: 'Abertas',      valor: abertas,    bg: '#E6F1FB', cor: '#185FA5' },
          { label: 'Em andamento', valor: andamento,  bg: '#FEF3C7', cor: '#92400E' },
          { label: 'Concluídas',   valor: concluidas, bg: '#D1FAE5', cor: '#065F46' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '600', color: s.cor }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: s.cor, marginTop: '4px', opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '1rem' }}>Distribuição por status</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {dados.map(({ key, valor }) => {
          const s = statusConfig[key]
          return (
            <div key={key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#111827', fontWeight: '500' }}>{s.label}</span>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{valor} OS · {pct(valor)}%</span>
              </div>
              <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: `${pct(valor)}%`, height: '100%', background: s.cor, borderRadius: '999px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '1rem' }}>Gráfico por status</p>
      <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {total === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Nenhuma OS cadastrada ainda.</p>
        ) : (
          <>
            <svg width="240" height="240" viewBox="0 0 240 240">
              {segmentos.map(seg => (
                <path key={seg.key} d={seg.d} fill={seg.cor} />
              ))}
              <text x="120" y="115" textAnchor="middle" fontSize="28" fontWeight="600" fill="#111827">{total}</text>
              <text x="120" y="135" textAnchor="middle" fontSize="12" fill="#6b7280">total</text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dados.map(({ key, valor }) => {
                const s = statusConfig[key]
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: s.cor, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#111827' }}>{s.label}</span>
                    <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: 'auto', paddingLeft: '1rem' }}>{valor} ({pct(valor)}%)</span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}