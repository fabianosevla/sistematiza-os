import { useState } from 'react'

const field = {
  label: { fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '14px', color: 'var(--text-primary)', outline: 'none', background: 'var(--bg-layer-01)', transition: 'border-color 0.15s', fontFamily: 'DM Sans, sans-serif' },
}

const focus = (e) => e.target.style.borderColor = 'var(--brand)'
const blur  = (e) => e.target.style.borderColor = 'var(--border-subtle)'

export default function ClientesForm({ cliente, onSalvar, onVoltar }) {
  const [form, setForm] = useState({
    nome:     cliente?.nome     || '',
    telefone: cliente?.telefone || '',
    email:    cliente?.email    || '',
    empresa:  cliente?.empresa  || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const salvar = () => {
    if (!form.nome) return alert('Preencha o nome do cliente!')
    onSalvar(form)
  }

  const isEdicao = !!cliente

  return (
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span style={{ cursor: 'pointer', color: 'var(--brand)' }} onClick={onVoltar}>← Voltar</span>
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
          {isEdicao ? 'Editar cliente' : 'Novo cliente'}
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {isEdicao ? 'Atualize os dados do cliente' : 'Preencha os dados para cadastrar um novo cliente'}
        </p>
      </div>

      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-subtle)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={field.label}>Nome *</label>
            <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: Dr. João Silva" style={field.input} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={field.label}>Telefone</label>
            <input value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(35) 99999-9999" style={field.input} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={field.label}>E-mail</label>
            <input value={form.email} onChange={e => set('email', e.target.value)} placeholder="joao@email.com" style={field.input} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={field.label}>Empresa / Clínica</label>
            <input value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Ex: Clínica São Lucas" style={field.input} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <button onClick={salvar}
          style={{ width: '100%', marginTop: '4px', background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          onMouseEnter={e => e.target.style.background = 'var(--brand-hover)'}
          onMouseLeave={e => e.target.style.background = 'var(--brand)'}>
          {isEdicao ? 'Salvar alterações' : 'Cadastrar cliente'}
        </button>

      </div>
    </div>
  )
}