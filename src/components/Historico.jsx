import { statusConfig } from '../data/storage'

const fmt = (v) => `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`

export default function Historico({ ordens, onVoltar }) {
  const concluidas = ordens.filter(o => o.status === 'concluida')
  const totalFaturado = concluidas.reduce((acc, o) => acc + (o.valor || 0), 0)
  const totalRecebido = concluidas.reduce((acc, o) => acc + (o.valorPago || 0), 0)

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Histórico</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {concluidas.length} OS concluída{concluidas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Resumo financeiro */}
      {concluidas.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--status-done-bg)', border: '1px solid var(--status-done-bg)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--status-done)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>OS Concluídas</p>
            <p style={{ fontSize: '26px', fontWeight: '700', color: 'var(--status-done)', letterSpacing: '-0.5px', lineHeight: 1 }}>{concluidas.length}</p>
          </div>
          <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total Faturado</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1 }}>{fmt(totalFaturado)}</p>
          </div>
          <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Total Recebido</p>
            <p style={{ fontSize: '22px', fontWeight: '700', color: 'var(--status-done)', letterSpacing: '-0.5px', lineHeight: 1 }}>{fmt(totalRecebido)}</p>
          </div>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {concluidas.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            <p style={{ fontWeight: '500' }}>Nenhuma OS concluída ainda</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>As OS marcadas como concluídas aparecerão aqui</p>
          </div>
        )}
        {concluidas.map(os => {
          const s = statusConfig[os.status]
          return (
            <div key={os.id}
              style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.cor, flexShrink: 0 }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{os.nome}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{os.servico} · {os.data}</p>
                {os.descricao && (
                  <p style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{os.descricao}</p>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(os.valor)}</p>
                <p style={{ fontSize: '11px', color: 'var(--status-done)', marginTop: '2px', fontWeight: '500' }}>Recebido: {fmt(os.valorPago)}</p>
              </div>

              <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: s.bg, color: s.texto, whiteSpace: 'nowrap', flexShrink: 0 }}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}