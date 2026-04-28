import { statusConfig } from '../data/storage'

export default function Historico({ ordens, onVoltar }) {
  const concluidas = ordens.filter(o => o.status === 'concluida')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>Histórico</h1>
      </div>

      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '1.25rem' }}>
        {concluidas.length} OS concluída{concluidas.length !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {concluidas.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '2rem' }}>Nenhuma OS concluída ainda.</p>
        )}
        {concluidas.map(os => {
          const s = statusConfig[os.status]
          return (
            <div key={os.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{os.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{os.servico} · {os.data}</div>
                {os.descricao && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{os.descricao}</div>}
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: s.bg, color: s.texto, whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}