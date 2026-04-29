const fmt = (v) => `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`

export default function Recibo({ os, onVoltar }) {
  return (
    <div style={{ padding: '32px' }}>

      <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Recibo</h1>
        </div>
        <button onClick={() => window.print()}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🖨️ Imprimir / Salvar PDF
        </button>
      </div>

      <div id="recibo-content" style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>

        {/* Topo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                <g transform="rotate(90,50,50)">
                  <path d="M25 22L8 50L25 78" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M75 22L92 50L75 78" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M63 10L37 90" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round"/>
                </g>
              </svg>
              <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)' }}>
                sistematiza<span style={{ color: 'var(--brand)' }}>.ai</span>
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Recibo de Serviço</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Nº da OS</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>#{os.id}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{os.data}</p>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Cliente</p>
          <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>{os.nome}</p>
          {os.telefone && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{os.telefone}</p>
          )}
        </div>

        {/* Serviço */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Serviço prestado</p>
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{os.servico}</p>
          {os.descricao && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{os.descricao}</p>
          )}
        </div>

        {/* Financeiro */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginBottom: '24px' }}>
          {[
            { label: 'Valor total',    valor: fmt(os.valor),                              cor: 'var(--text-primary)' },
            { label: 'Valor pago',     valor: fmt(os.valorPago),                          cor: 'var(--status-done)' },
            { label: 'Saldo restante', valor: fmt((os.valor || 0) - (os.valorPago || 0)), cor: 'var(--pay-pending)' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.label}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: r.cor }}>{r.valor}</span>
            </div>
          ))}
          {os.formaPagamento && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Forma de pagamento</span>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{os.formaPagamento}</span>
            </div>
          )}
        </div>

        {/* Total destaque */}
        <div style={{ background: 'var(--text-primary)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Total do serviço</span>
          <span style={{ fontSize: '22px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>{fmt(os.valor)}</span>
        </div>

        {/* Rodapé */}
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>Este recibo não possui validade fiscal.</p>
          <p style={{ fontSize: '12px', color: 'var(--text-placeholder)', marginTop: '2px' }}>sistematiza.ai · sistematizaai@gmail.com</p>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #recibo-content { border: none !important; box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

    </div>
  )
}