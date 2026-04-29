export default function ClientesList({ clientes, onNovo, onEditar, onExcluir, onVoltar }) {
  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Clientes</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onNovo}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          + Novo cliente
        </button>
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {clientes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👤</div>
            <p style={{ fontWeight: '500' }}>Nenhum cliente cadastrado</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Novo cliente" para começar</p>
          </div>
        )}
        {clientes.map(c => (
          <div key={c.id}
            style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'box-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>

            {/* Avatar */}
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'var(--brand)', flexShrink: 0 }}>
              {c.nome.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.nome}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {[c.empresa, c.telefone, c.email].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* Ações */}
            <button onClick={() => onEditar(c)}
              style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>✏️</button>
            <button onClick={() => onExcluir(c)}
              style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '6px 10px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}