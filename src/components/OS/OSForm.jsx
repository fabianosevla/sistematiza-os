import { useState } from 'react'
import { formasPagamento } from '../../data/storage'

const campoStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff' }
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }

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

  const atualiza = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  const salvar = () => {
    if (!form.nome || !form.servico) return alert('Preencha nome e serviço!')
    onSalvar({
      ...form,
      valor:     parseFloat(form.valor)     || 0,
      valorPago: parseFloat(form.valorPago) || 0,
    })
  }

  const isEdicao = !!os

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>{isEdicao ? 'Editar OS' : 'Nova OS'}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dados do cliente</p>

        <div>
          <label style={labelStyle}>Nome do cliente *</label>
          <input value={form.nome} onChange={e => atualiza('nome', e.target.value)} placeholder="Ex: Dr. João Silva" style={campoStyle} />
        </div>
        <div>
          <label style={labelStyle}>Telefone</label>
          <input value={form.telefone} onChange={e => atualiza('telefone', e.target.value)} placeholder="Ex: (35) 99999-9999" style={campoStyle} />
        </div>

        <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem' }}>Serviço</p>

        <div>
          <label style={labelStyle}>Tipo de serviço *</label>
          <input value={form.servico} onChange={e => atualiza('servico', e.target.value)} placeholder="Ex: Prontuário digital, Site, OS..." style={campoStyle} />
        </div>
        <div>
          <label style={labelStyle}>Descrição</label>
          <textarea value={form.descricao} onChange={e => atualiza('descricao', e.target.value)} placeholder="Descreva o que será feito..." rows={3} style={{ ...campoStyle, resize: 'vertical', fontFamily: 'sans-serif' }} />
        </div>
        <div>
          <label style={labelStyle}>Observações</label>
          <textarea value={form.observacoes} onChange={e => atualiza('observacoes', e.target.value)} placeholder="Observações internas..." rows={2} style={{ ...campoStyle, resize: 'vertical', fontFamily: 'sans-serif' }} />
        </div>

        <p style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.5rem' }}>Financeiro</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Valor total (R$)</label>
            <input type="number" value={form.valor} onChange={e => atualiza('valor', e.target.value)} placeholder="0,00" style={campoStyle} />
          </div>
          <div>
            <label style={labelStyle}>Valor pago (R$)</label>
            <input type="number" value={form.valorPago} onChange={e => atualiza('valorPago', e.target.value)} placeholder="0,00" style={campoStyle} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Forma de pagamento</label>
            <select value={form.formaPagamento} onChange={e => atualiza('formaPagamento', e.target.value)} style={campoStyle}>
              {formasPagamento.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status de pagamento</label>
            <select value={form.statusPagamento} onChange={e => atualiza('statusPagamento', e.target.value)} style={campoStyle}>
              <option value="pendente">Pendente</option>
              <option value="parcial">Parcial</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>

        <button onClick={salvar} style={{ width: '100%', marginTop: '0.5rem', background: '#378ADD', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          {isEdicao ? 'Salvar alterações' : 'Salvar OS'}
        </button>
      </div>
    </div>
  )
}