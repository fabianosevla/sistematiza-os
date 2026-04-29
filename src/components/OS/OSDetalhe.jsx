import { statusConfig, pagamentoConfig } from '../../data/storage'

const fmt = (v) => `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`

const infoBlock = (label, valor) => (
  <div key={label}>
    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</p>
    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{valor || '—'}</p>
  </div>
)

export default function OSDetalhe({ os, onVoltar, onEditar, onExcluir, onMudarStatus, onEmitirRecibo }) {
  const st = statusConfig[os.status]
  const pg = pagamentoConfig[os.statusPagamento] || pagamentoConfig.pendente
  const saldo = (os.valor || 0) - (os.valorPago || 0)

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{os.nome}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{os.servico} · {os.data}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={onEditar}
            style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✏️ Editar
          </button>
          <button onClick={onExcluir}
            style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'var(--pay-pending)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🗑️ Excluir
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* Info principal */}
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detalhes</p>
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: st.bg, color: st.texto }}>{st.label}</span>
          </div>
          {infoBlock('Telefone', os.telefone)}
          {infoBlock('Descrição', os.descricao)}
          {infoBlock('Observações', os.observacoes)}
        </div>

        {/* Financeiro */}
        <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Financeiro</p>
            <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: pg.bg, color: pg.cor }}>{pg.label}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{fmt(os.valor)}</p>
            </div>
            <div style={{ background: 'var(--status-done-bg)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--status-done)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Pago</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--status-done)' }}>{fmt(os.valorPago)}</p>
            </div>
            <div style={{ background: saldo > 0 ? 'var(--pay-pending-bg)' : 'var(--status-done-bg)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
              <p style={{ fontSize: '10px', fontWeight: '700', color: saldo > 0 ? 'var(--pay-pending)' : 'var(--status-done)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Saldo</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: saldo > 0 ? 'var(--pay-pending)' : 'var(--status-done)' }}>{fmt(saldo)}</p>
            </div>
          </div>

          {os.formaPagamento && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Forma de pagamento: <strong style={{ color: 'var(--text-primary)' }}>{os.formaPagamento}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Mudar status */}
      <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', marginBottom: '16px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Status da OS</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {Object.entries(statusConfig).map(([key, val]) => {
            const ativo = os.status === key
            return (
              <button key={key} onClick={() => onMudarStatus(key)}
                style={{ background: ativo ? val.bg : 'var(--bg-primary)', border: ativo ? `1.5px solid ${val.cor}` : '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!ativo) e.currentTarget.style.borderColor = 'var(--border-strong)' }}
                onMouseLeave={e => { if (!ativo) e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: val.cor, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: ativo ? '600' : '400', color: ativo ? val.texto : 'var(--text-secondary)' }}>{val.label}</span>
                {ativo && <span style={{ marginLeft: 'auto', fontSize: '11px', color: val.texto, fontWeight: '600' }}>✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Emitir recibo */}
      <button onClick={onEmitirRecibo}
        style={{ width: '100%', background: 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
        🧾 Emitir Recibo
      </button>
    </div>
  )
}