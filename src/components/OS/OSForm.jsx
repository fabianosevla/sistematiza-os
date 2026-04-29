import { useState } from 'react'
import { formasPagamento } from '../../data/storage'

const field = {
  wrap: { marginBottom: '0' },
  label: { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg-layer-01)', transition: 'border-color 0.15s', fontFamily: 'DM Sans, sans-serif' },
  select: { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg-layer-01)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg-layer-01)', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 },
}

const sectionLabel = { fontSize: '11px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)', marginBottom: '16px' }

export default function OSForm({ os, onSalvar, onVoltar }) {
  const [form, setForm] = useState({
    nome:            os?.nome            || '',
    telefone:        os?.telefone        || '',
    servico:         os?.servico         || '',
    descricao:       os?.descricao       || '',
    observacoes:     os?.observacoes     || '',
    valor:           os?.valor           || '',
    valorPago:       os?.valorPago       || '',
    formaPagamento:  os?.formaPagamento  || 'Pix',
    statusPagamento: os?.statusPagamento || 'pendente',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = () => {
    if (!form.nome || !form.servico) return alert('Preencha nome e serviço!')
    onSalvar({ ...form, valor: parseFloat(form.valor) || 0, valorPago: parseFloat(form.valorPago) || 0 })
  }

  const focus = (e) => e.target.style.borderColor = 'var(--brand)'
  const blur  = (e) => e.target.style.borderColor = 'var(--border-subtle)'

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
          {os ? 'Editar OS' : 'Nova ordem de serviço'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {os ? 'Atualize as informações da ordem de serviço' : 'Preencha os dados para abrir uma nova OS'}
        </p>
      </div>

      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Cliente */}
        <div>
          <p style={sectionLabel}>Cliente</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={field.wrap}>
              <label style={field.label}>Nome *</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Dr. João Silva" style={field.input} onFocus={focus} onBlur={blur} />
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Telefone</label>
              <input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(35) 99999-9999" style={field.input} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>

        {/* Serviço */}
        <div>
          <p style={sectionLabel}>Serviço</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={field.wrap}>
              <label style={field.label}>Tipo de serviço *</label>
              <input value={form.servico} onChange={e => set('servico', e.target.value)} placeholder="Ex: Instalação elétrica, Consultoria jurídica..." style={field.input} onFocus={focus} onBlur={blur} />
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Descrição</label>
              <textarea value={form.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Descreva o que será feito..." rows={3} style={field.textarea} onFocus={focus} onBlur={blur} />
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Observações internas</label>
              <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} placeholder="Anotações internas sobre esta OS..." rows={2} style={field.textarea} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>

        {/* Financeiro */}
        <div>
          <p style={sectionLabel}>Financeiro</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={field.wrap}>
              <label style={field.label}>Valor total (R$)</label>
              <input type="number" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0,00" style={field.input} onFocus={focus} onBlur={blur} />
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Valor pago (R$)</label>
              <input type="number" value={form.valorPago} onChange={e => set('valorPago', e.target.value)} placeholder="0,00" style={field.input} onFocus={focus} onBlur={blur} />
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Forma de pagamento</label>
              <select value={form.formaPagamento} onChange={e => set('formaPagamento', e.target.value)} style={field.select}>
                {formasPagamento.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={field.wrap}>
              <label style={field.label}>Status de pagamento</label>
              <select value={form.statusPagamento} onChange={e => set('statusPagamento', e.target.value)} style={field.select}>
                <option value="pendente">Pendente</option>
                <option value="parcial">Parcial</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botão */}
        <button onClick={salvar} style={{ width: '100%', marginTop: '4px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.01em' }}
          onMouseEnter={e => e.target.style.background = 'var(--brand-hover)'}
          onMouseLeave={e => e.target.style.background = 'var(--brand)'}>
          {os ? 'Salvar alterações' : 'Abrir ordem de serviço'}
        </button>

      </div>
    </div>
  )
}