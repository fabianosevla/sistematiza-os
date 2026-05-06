import { useState } from 'react'
import { statusConfig, pagamentoConfig, transicoesStatus, statusTerminal, calcFinanceiro, calcChecklist, fmt } from '../../data/storage'

const infoBlock = (label, valor) => (
  <div key={label}>
    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</p>
    <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.5 }}>{valor || '—'}</p>
  </div>
)

const card = (children, opts = {}) => (
  <div style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '24px', ...opts }}>
    {children}
  </div>
)

const sectionLabel = (text) => (
  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>{text}</p>
)

export default function OSDetalhe({ os, onVoltar, onEditar, onExcluir, onMudarStatus, onAtualizar, onEmitirRecibo }) {
  const [abaAtiva, setAbaAtiva] = useState('info') // info | financeiro | checklist | insumos | fotos
  const [novoPag, setNovoPag] = useState({ valor: '', forma: 'Pix', dataRecebimento: new Date().toLocaleDateString('pt-BR'), observacao: '' })
  const [novoItem, setNovoItem] = useState('')
  const [novoInsumo, setNovoInsumo] = useState({ nome: '', quantidade: '', unidade: 'un', custoUnitario: '', repassarCliente: false })

  const st  = statusConfig[os.status] || statusConfig.aberta
  const fin = calcFinanceiro(os)
  const ck  = calcChecklist(os.checklist)
  const isTerminal = statusTerminal.includes(os.status)
  const transicoesDisponiveis = transicoesStatus[os.status] || []

  // ── Pagamentos ──
  const adicionarPagamento = () => {
    if (!novoPag.valor || parseFloat(novoPag.valor) <= 0) return alert('Informe um valor válido.')
    const pag = { id: Date.now(), ...novoPag, valor: parseFloat(novoPag.valor) }
    const osAtualizada = { ...os, pagamentos: [...(os.pagamentos || []), pag] }
    onAtualizar(osAtualizada)
    setNovoPag({ valor: '', forma: 'Pix', dataRecebimento: new Date().toLocaleDateString('pt-BR'), observacao: '' })
  }

  const removerPagamento = (id) => {
    const osAtualizada = { ...os, pagamentos: os.pagamentos.filter(p => p.id !== id) }
    onAtualizar(osAtualizada)
  }

  // ── Checklist ──
  const adicionarItem = () => {
    if (!novoItem.trim()) return
    const item = { id: Date.now(), descricao: novoItem.trim(), obrigatorio: false, status: 'pendente', observacao: '' }
    onAtualizar({ ...os, checklist: [...(os.checklist || []), item] })
    setNovoItem('')
  }

  const toggleItem = (id) => {
    const checklist = os.checklist.map(i => i.id === id
      ? { ...i, status: i.status === 'feito' ? 'pendente' : 'feito' }
      : i)
    onAtualizar({ ...os, checklist })
  }

  const removerItem = (id) => {
    onAtualizar({ ...os, checklist: os.checklist.filter(i => i.id !== id) })
  }

  // ── Insumos ──
  const adicionarInsumo = () => {
    if (!novoInsumo.nome.trim() || !novoInsumo.quantidade) return alert('Informe nome e quantidade.')
    const ins = { id: Date.now(), ...novoInsumo, quantidade: parseFloat(novoInsumo.quantidade), custoUnitario: parseFloat(novoInsumo.custoUnitario) || 0 }
    onAtualizar({ ...os, insumos: [...(os.insumos || []), ins] })
    setNovoInsumo({ nome: '', quantidade: '', unidade: 'un', custoUnitario: '', repassarCliente: false })
  }

  const removerInsumo = (id) => {
    onAtualizar({ ...os, insumos: os.insumos.filter(i => i.id !== id) })
  }

  const ABAS = [
    { id: 'info',       label: 'Informações' },
    { id: 'financeiro', label: `Financeiro${fin.saldo > 0 ? ' ⚠️' : ''}` },
    { id: 'checklist',  label: `Checklist${ck.total > 0 ? ` ${ck.pct}%` : ''}` },
    { id: 'insumos',    label: `Insumos${(os.insumos||[]).length > 0 ? ` (${os.insumos.length})` : ''}` },
    { id: 'fotos',      label: `Fotos${(os.fotos||[]).length > 0 ? ` (${os.fotos.length})` : ''}` },
  ]

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '13px', color: 'var(--text-primary)', background: 'var(--bg-primary)', fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box' }
  const selectStyle = { ...inputStyle, cursor: 'pointer' }

  return (
    <div style={{ padding: '28px' }}>

      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>{os.nome}</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>{os.servico} · {os.data}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
          {!isTerminal && (
            <button onClick={onEditar}
              style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✏️ Editar
            </button>
          )}
          <button onClick={onExcluir}
            style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'var(--pay-pending)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🗑️ Excluir
          </button>
        </div>
      </div>

      {/* Badges de status */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: st.bg, color: st.texto }}>{st.label}</span>
        <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: pagamentoConfig[os.statusPagamento]?.bg || '#F3F4F6', color: pagamentoConfig[os.statusPagamento]?.cor || '#374151' }}>
          {pagamentoConfig[os.statusPagamento]?.label || 'Pendente'}
        </span>
        {ck.total > 0 && (
          <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: ck.pct === 100 ? 'var(--status-done-bg)' : 'var(--bg-layer-02)', color: ck.pct === 100 ? 'var(--status-done)' : 'var(--text-secondary)' }}>
            ✓ {ck.feitos}/{ck.total} itens
          </span>
        )}
      </div>

      {/* Resumo financeiro rápido */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Valor final',  valor: fmt(fin.valorFinal),    bg: 'var(--bg-layer-01)',     cor: 'var(--text-primary)' },
          { label: 'Recebido',     valor: fmt(fin.valorRecebido), bg: 'var(--status-done-bg)',  cor: 'var(--status-done)' },
          { label: 'Saldo',        valor: fmt(fin.saldo),         bg: fin.saldo > 0 ? 'var(--pay-pending-bg)' : 'var(--status-done-bg)', cor: fin.saldo > 0 ? 'var(--pay-pending)' : 'var(--status-done)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 'var(--radius-md)', padding: '12px 16px', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '10px', fontWeight: '700', color: c.cor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', opacity: 0.8 }}>{c.label}</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: c.cor }}>{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Abas */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px', gap: '2px', overflowX: 'auto' }}>
        {ABAS.map(a => (
          <button key={a.id} onClick={() => setAbaAtiva(a.id)}
            style={{ padding: '10px 16px', fontSize: '13px', fontWeight: abaAtiva === a.id ? '700' : '500', color: abaAtiva === a.id ? 'var(--brand)' : 'var(--text-secondary)', background: 'none', border: 'none', borderBottom: abaAtiva === a.id ? '2px solid var(--brand)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap', marginBottom: '-1px', transition: 'color 0.15s' }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* ── ABA: INFORMAÇÕES ── */}
      {abaAtiva === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {card(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {sectionLabel('Dados do cliente')}
              {infoBlock('Telefone', os.telefone)}
              {infoBlock('Descrição', os.descricao)}
              {infoBlock('Observações internas', os.observacoes)}
              {infoBlock('Endereço de execução', os.enderecoExecucao)}
            </div>
          )}

          {/* Mudança de status */}
          {!isTerminal && (
            card(
              <>
                {sectionLabel('Avançar status')}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {transicoesDisponiveis.map(key => {
                    const s = statusConfig[key]
                    return (
                      <button key={key} onClick={() => onMudarStatus(key)}
                        style={{ background: s.bg, border: `1.5px solid ${s.cor}`, borderRadius: 'var(--radius-md)', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'DM Sans, sans-serif', transition: 'all 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.cor }} />
                        <span style={{ fontSize: '13px', fontWeight: '600', color: s.texto }}>{s.label}</span>
                      </button>
                    )
                  })}
                </div>
                {transicoesDisponiveis.length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--text-placeholder)', fontStyle: 'italic' }}>Nenhuma transição disponível para o status atual.</p>
                )}
              </>
            )
          )}

          {/* Emitir recibo */}
          <button onClick={onEmitirRecibo}
            style={{ width: '100%', background: 'var(--text-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '13px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            🧾 Emitir Recibo
          </button>
        </div>
      )}

      {/* ── ABA: FINANCEIRO ── */}
      {abaAtiva === 'financeiro' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Resumo detalhado */}
          {card(
            <>
              {sectionLabel('Resumo financeiro')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {[
                  { label: 'Valor orçado',    valor: fmt(os.valorOrcado),     cor: 'var(--text-secondary)' },
                  { label: 'Valor final',     valor: fmt(fin.valorFinal),     cor: 'var(--text-primary)',  bold: true },
                  { label: 'Custo insumos',   valor: fmt(fin.custoInsumos),   cor: 'var(--pay-pending)' },
                  { label: 'Lucro bruto',     valor: fmt(fin.lucroBruto),     cor: 'var(--status-done)',   bold: true },
                  { label: `Margem (${fin.margem}%)`, valor: `${fin.margem}%`,  cor: fin.margem >= 50 ? 'var(--status-done)' : 'var(--status-progress)' },
                  { label: 'Total recebido',  valor: fmt(fin.valorRecebido),  cor: 'var(--status-done)' },
                  { label: 'Saldo a receber', valor: fmt(fin.saldo),          cor: fin.saldo > 0 ? 'var(--pay-pending)' : 'var(--status-done)', bold: true },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: r.bold ? '700' : '500', color: r.cor }}>{r.valor}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagamentos registrados */}
          {card(
            <>
              {sectionLabel(`Pagamentos registrados (${(os.pagamentos||[]).length})`)}
              {(os.pagamentos || []).length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--text-placeholder)', fontStyle: 'italic', marginBottom: '16px' }}>Nenhum pagamento registrado ainda.</p>
              )}
              {(os.pagamentos || []).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--status-done)' }}>{fmt(p.valor)}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{p.forma} · {p.dataRecebimento}{p.observacao ? ` · ${p.observacao}` : ''}</p>
                  </div>
                  <button onClick={() => removerPagamento(p.id)}
                    style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '5px 7px', cursor: 'pointer', color: 'var(--pay-pending)', display: 'flex', alignItems: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}

              {/* Adicionar pagamento */}
              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Registrar pagamento</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Valor (R$)</label>
                    <input type="number" value={novoPag.valor} onChange={e => setNovoPag(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Forma</label>
                    <select value={novoPag.forma} onChange={e => setNovoPag(p => ({ ...p, forma: e.target.value }))} style={selectStyle}>
                      {['Pix','Dinheiro','Cartão de crédito','Cartão de débito','Transferência','Boleto'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Data</label>
                    <input value={novoPag.dataRecebimento} onChange={e => setNovoPag(p => ({ ...p, dataRecebimento: e.target.value }))} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Observação</label>
                    <input value={novoPag.observacao} onChange={e => setNovoPag(p => ({ ...p, observacao: e.target.value }))} placeholder="Ex: entrada, parcela 1..." style={inputStyle} />
                  </div>
                </div>
                <button onClick={adicionarPagamento}
                  style={{ width: '100%', background: 'var(--status-done-bg)', color: 'var(--status-done)', border: '1px solid var(--status-done)', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  + Registrar pagamento
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── ABA: CHECKLIST ── */}
      {abaAtiva === 'checklist' && (
        card(
          <>
            {sectionLabel('Checklist de execução')}

            {/* Barra de progresso */}
            {ck.total > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ck.feitos} de {ck.total} concluídos</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: ck.pct === 100 ? 'var(--status-done)' : 'var(--brand)' }}>{ck.pct}%</span>
                </div>
                <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', height: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${ck.pct}%`, height: '100%', background: ck.pct === 100 ? 'var(--status-done)' : 'var(--brand)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
                </div>
                {ck.bloqueado && (
                  <p style={{ fontSize: '11px', color: 'var(--pay-pending)', marginTop: '6px', fontWeight: '600' }}>⚠️ Itens obrigatórios pendentes — fechamento bloqueado</p>
                )}
              </div>
            )}

            {/* Itens */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              {(os.checklist || []).length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--text-placeholder)', fontStyle: 'italic' }}>Nenhum item adicionado ainda.</p>
              )}
              {(os.checklist || []).map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: item.status === 'feito' ? 'var(--status-done-bg)' : 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <button onClick={() => toggleItem(item.id)}
                    style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${item.status === 'feito' ? 'var(--status-done)' : 'var(--border-strong)'}`, background: item.status === 'feito' ? 'var(--status-done)' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }}>
                    {item.status === 'feito' && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                  <span style={{ flex: 1, fontSize: '13px', color: item.status === 'feito' ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: item.status === 'feito' ? 'line-through' : 'none' }}>
                    {item.descricao}
                    {item.obrigatorio && <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--pay-pending)', fontWeight: '700' }}>*</span>}
                  </span>
                  <button onClick={() => removerItem(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-placeholder)', display: 'flex', alignItems: 'center', padding: '2px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Adicionar item */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={novoItem} onChange={e => setNovoItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && adicionarItem()}
                placeholder="Adicionar item ao checklist..." style={{ ...inputStyle, flex: 1 }} />
              <button onClick={adicionarItem}
                style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'DM Sans, sans-serif' }}>
                + Adicionar
              </button>
            </div>
          </>
        )
      )}

      {/* ── ABA: INSUMOS ── */}
      {abaAtiva === 'insumos' && (
        card(
          <>
            {sectionLabel('Insumos utilizados')}

            {/* Lista */}
            {(os.insumos || []).length === 0 && (
              <p style={{ fontSize: '13px', color: 'var(--text-placeholder)', fontStyle: 'italic', marginBottom: '16px' }}>Nenhum insumo registrado.</p>
            )}
            {(os.insumos || []).length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '6px 8px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', marginBottom: '4px' }}>
                  {['Material','Qtd','Custo unit.','Total',''].map(h => (
                    <p key={h} style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</p>
                  ))}
                </div>
                {(os.insumos || []).map(ins => {
                  const total = (parseFloat(ins.quantidade) || 0) * (parseFloat(ins.custoUnitario) || 0)
                  return (
                    <div key={ins.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '8px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}>{ins.nome}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ins.quantidade} {ins.unidade}</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{ins.custoUnitario > 0 ? fmt(ins.custoUnitario) : '—'}</p>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: total > 0 ? 'var(--pay-pending)' : 'var(--text-secondary)' }}>{total > 0 ? fmt(total) : '—'}</p>
                      <button onClick={() => removerInsumo(ins.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-placeholder)', display: 'flex', padding: '2px' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  )
                })}
                {/* Total insumos */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 8px', borderTop: '2px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--pay-pending)' }}>
                    Total insumos: {fmt(fin.custoInsumos)}
                  </span>
                </div>
              </div>
            )}

            {/* Adicionar insumo */}
            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Adicionar insumo</p>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                {[
                  { label: 'Material', key: 'nome', placeholder: 'Ex: Cabo elétrico', type: 'text' },
                  { label: 'Quantidade', key: 'quantidade', placeholder: '1', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{f.label}</label>
                    <input type={f.type} value={novoInsumo[f.key]} onChange={e => setNovoInsumo(i => ({ ...i, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Unidade</label>
                  <select value={novoInsumo.unidade} onChange={e => setNovoInsumo(i => ({ ...i, unidade: e.target.value }))} style={selectStyle}>
                    {['un','m','m²','m³','kg','g','L','ml','h'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Custo unit. (R$)</label>
                  <input type="number" value={novoInsumo.custoUnitario} onChange={e => setNovoInsumo(i => ({ ...i, custoUnitario: e.target.value }))} placeholder="0,00" style={inputStyle} />
                </div>
              </div>
              <button onClick={adicionarInsumo}
                style={{ width: '100%', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                + Adicionar insumo
              </button>
            </div>
          </>
        )
      )}

      {/* ── ABA: FOTOS ── */}
      {abaAtiva === 'fotos' && (
        card(
          <>
            {sectionLabel('Registro fotográfico')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {['entrada', 'execucao', 'saida'].map(momento => {
                const fotos = (os.fotos || []).filter(f => f.momento === momento)
                const labels = { entrada: '📷 Entrada', execucao: '🔧 Execução', saida: '✅ Saída' }
                return (
                  <div key={momento}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{labels[momento]} ({fotos.length})</p>
                    {fotos.length === 0 ? (
                      <div style={{ height: '80px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-placeholder)' }}>Sem fotos</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {fotos.map(f => (
                          <div key={f.id} style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '8px', border: '1px solid var(--border-subtle)' }}>
                            {f.url && <img src={f.url} alt={f.descricao || momento} style={{ width: '100%', borderRadius: '6px', objectFit: 'cover', maxHeight: '120px' }} />}
                            {f.descricao && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{f.descricao}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center', border: '1px dashed var(--border-strong)' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>📸 Upload de fotos disponível na versão mobile do app</p>
              <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', marginTop: '4px' }}>Acesse pelo celular para tirar fotos diretamente da câmera</p>
            </div>
          </>
        )
      )}

    </div>
  )
}