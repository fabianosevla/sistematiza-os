export default function ClientesList({ clientes, onNovo, onEditar, onExcluir, onVoltar }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h2 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', flex: 1, margin: 0 }}>Clientes</h2>
        <button onClick={onNovo} style={{ background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
          + Novo cliente
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {clientes.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '2rem' }}>Nenhum cliente cadastrado.</p>
        )}
        {clientes.map(c => (
          <div key={c.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#0C447C', flexShrink: 0 }}>
              {c.nome.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{c.nome}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {[c.empresa, c.telefone, c.email].filter(Boolean).join(' · ')}
              </div>
            </div>
            <button onClick={() => onEditar(c)} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
            <button onClick={() => onExcluir(c)} style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}