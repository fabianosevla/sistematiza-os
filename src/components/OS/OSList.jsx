import { statusConfig } from '../../data/storage'

export default function OSList({ ordens, onNova, onVer, onEditar, onExcluir }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827' }}>Ordens de Serviço</h2>
        <button onClick={onNova} style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          + Nova OS
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ordens.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '2rem' }}>Nenhuma OS cadastrada.</p>
        )}
        {ordens.map(os => {
          const s = statusConfig[os.status]
          return (
            <div key={os.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onVer(os)}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{os.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{os.servico} · {os.data}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: s.bg, color: s.texto }}>{s.label}</span>
              <button onClick={() => onEditar(os)} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
              <button onClick={() => onExcluir(os)} style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}