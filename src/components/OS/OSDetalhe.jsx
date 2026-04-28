import { statusConfig, pagamentoConfig } from '../../data/storage'

const fmt = (v) => v ? `R$ ${parseFloat(v).toFixed(2).replace('.', ',')}` : 'R$ 0,00'

export default function OSDetalhe({ os, onVoltar, onEditar, onExcluir, onMudarStatus, onEmitirRecibo }) {
  const s = statusConfig[os.status]
  const p = pagamentoConfig[os.statusPagamento] || pagamentoConfig.pendente

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0, flex: 1 }}>Detalhe da OS</h1>
        <button onClick={onEditar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '13px', color: '#111827' }}>✏️ Editar</button>
        <button onClick={onExcluir} style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '13px', color: '#DC2626' }}>🗑️ Excluir</button>
      </div>

      {/* Info principal */}
      <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{os.nome}</div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{os.telefone}</div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '999px', background: s.bg, color: s.texto }}>{s.label}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'SERVIÇO', valor: os.servico || '—' },
            { label: 'DATA',    valor: os.data    || '—' },
            { label: 'DESCRIÇÃO',   valor: os.descricao   || '—', full: true },
            { label: 'OBSERVAÇÕES', valor: os.observacoes || '—', full: true },
          ].map(item => (
            <div key={item.label} style={{ gridColumn: item.full ? '1 / -1' : 'auto' }}>
              <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>{item.label}</div>
              <div style={{ fontSize: '14px', color: '#111827', lineHeight: '1.5' }}>{item.valor}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Financeiro */}
      <div style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Financeiro</p>
          <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: p.bg, color: p.cor }}>{p.label}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>VALOR TOTAL</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>{fmt(os.valor)}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>VALOR PAGO</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#065F46' }}>{fmt(os.valorPago)}</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.08em', fontWeight: '600' }}>SALDO</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#DC2626' }}>{fmt((os.valor || 0) - (os.valorPago || 0))}</div>
          </div>
        </div>
        {os.formaPagamento && (
          <div style={{ marginTop: '1rem', fontSize: '13px', color: '#6b7280' }}>
            Forma de pagamento: <strong style={{ color: '#111827' }}>{os.formaPagamento}</strong>
          </div>
        )}
      </div>

      {/* Mudar status */}
      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '0.75rem' }}>Mudar status</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
        {Object.entries(statusConfig).map(([key, val]) => (
          <button key={key} onClick={() => onMudarStatus(key)}
            style={{ background: os.status === key ? val.bg : '#f9fafb', border: os.status === key ? `1.5px solid ${val.cor}` : '0.5px solid #e5e7eb', borderRadius: '10px', padding: '0.75rem 1rem', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: val.cor }} />
            <span style={{ fontSize: '14px', fontWeight: os.status === key ? '500' : '400', color: os.status === key ? val.texto : '#6b7280' }}>{val.label}</span>
            {os.status === key && <span style={{ marginLeft: 'auto', fontSize: '12px', color: val.texto }}>✓ atual</span>}
          </button>
        ))}
      </div>

      {/* Emitir recibo */}
      <button onClick={onEmitirRecibo} style={{ width: '100%', background: '#111827', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        🧾 Emitir Recibo
      </button>
    </div>
  )
}