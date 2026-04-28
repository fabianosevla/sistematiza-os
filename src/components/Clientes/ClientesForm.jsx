import { useState } from 'react'

const campoStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff' }
const labelStyle = { fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }

export default function ClientesForm({ cliente, onSalvar, onVoltar }) {
  const [form, setForm] = useState({
    nome: cliente?.nome || '',
    telefone: cliente?.telefone || '',
    email: cliente?.email || '',
    empresa: cliente?.empresa || '',
  })

  const atualiza = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  const salvar = () => {
    if (!form.nome) return alert('Preencha o nome do cliente!')
    onSalvar(form)
  }

  const isEdicao = !!cliente

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>{isEdicao ? 'Editar cliente' : 'Novo cliente'}</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Nome *</label>
          <input value={form.nome} onChange={e => atualiza('nome', e.target.value)} placeholder="Ex: Dr. João Silva" style={campoStyle} />
        </div>
        <div>
          <label style={labelStyle}>Telefone</label>
          <input value={form.telefone} onChange={e => atualiza('telefone', e.target.value)} placeholder="Ex: (35) 99999-9999" style={campoStyle} />
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input value={form.email} onChange={e => atualiza('email', e.target.value)} placeholder="Ex: joao@email.com" style={campoStyle} />
        </div>
        <div>
          <label style={labelStyle}>Empresa / Clínica</label>
          <input value={form.empresa} onChange={e => atualiza('empresa', e.target.value)} placeholder="Ex: Clínica São Lucas" style={campoStyle} />
        </div>
        <button onClick={salvar} style={{ width: '100%', marginTop: '0.5rem', background: '#2ecc71', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          {isEdicao ? 'Salvar alterações' : 'Salvar cliente'}
        </button>
      </div>
    </div>
  )
}