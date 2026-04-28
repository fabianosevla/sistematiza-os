const fmt = (v) => v ? `R$ ${parseFloat(v).toFixed(2).replace('.', ',')}` : 'R$ 0,00'

export default function Recibo({ os, onVoltar }) {
  const imprimir = () => window.print()

  return (
    <div>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0, flex: 1 }}>Recibo</h1>
        <button onClick={imprimir} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>🖨️ Imprimir / Salvar PDF</button>
      </div>

      <div id="recibo-content" style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '2.5rem', maxWidth: '600px', margin: '0 auto' }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #e5e7eb' }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#111827', fontFamily: 'sans-serif' }}>
            sistematiza<span style={{ color: '#00c2cb' }}>.ai</span>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Recibo de Serviço</div>
        </div>

        {/* Número e data */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.08em' }}>Nº DA OS</div>
            <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>#{os.id}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.08em' }}>DATA</div>
            <div style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{os.data}</div>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>CLIENTE</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{os.nome}</div>
          {os.telefone && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{os.telefone}</div>}
        </div>

        {/* Serviço */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>SERVIÇO PRESTADO</div>
          <div style={{ fontSize: '15px', fontWeight: '500', color: '#111827' }}>{os.servico}</div>
          {os.descricao && <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', lineHeight: '1.5' }}>{os.descricao}</div>}
        </div>

        {/* Financeiro */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Valor total</span>
            <span style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{fmt(os.valor)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Valor pago</span>
            <span style={{ fontSize: '14px', color: '#065F46', fontWeight: '500' }}>{fmt(os.valorPago)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Saldo restante</span>
            <span style={{ fontSize: '14px', color: '#DC2626', fontWeight: '500' }}>{fmt((os.valor || 0) - (os.valorPago || 0))}</span>
          </div>
          {os.formaPagamento && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Forma de pagamento</span>
              <span style={{ fontSize: '14px', color: '#111827', fontWeight: '500' }}>{os.formaPagamento}</span>
            </div>
          )}
        </div>

        {/* Total destaque */}
        <div style={{ background: '#111827', borderRadius: '10px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '15px', color: '#fff', fontWeight: '500' }}>Total do serviço</span>
          <span style={{ fontSize: '22px', color: '#fff', fontWeight: '700' }}>{fmt(os.valor)}</span>
        </div>

        {/* Rodapé */}
        <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>Este recibo não possui validade fiscal.</div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>sistematiza.ai · sistematizaai@gmail.com</div>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #recibo-content { border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}