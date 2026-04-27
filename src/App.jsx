import { useState } from 'react'

const statusConfig = {
  aberta: { label: 'Aberta', cor: '#378ADD', bg: '#E6F1FB', texto: '#185FA5' },
  andamento: { label: 'Em andamento', cor: '#f39c12', bg: '#FEF3C7', texto: '#92400E' },
  concluida: { label: 'Concluída', cor: '#2ecc71', bg: '#D1FAE5', texto: '#065F46' },
}

const dadosIniciais = [
  { id: 1, nome: 'Dr. Carlos Mendes', servico: 'Prontuário digital', descricao: '', status: 'andamento', data: 'Hoje' },
  { id: 2, nome: 'Adv. Marina Costa', servico: 'Sistema de processos', descricao: '', status: 'aberta', data: 'Ontem' },
  { id: 3, nome: 'Clínica Bem Estar', servico: 'Agendamento online', descricao: '', status: 'concluida', data: '3 dias atrás' },
]

function Dashboard({ ordens, onNova }) {
  const contagem = {
    abertas: ordens.filter(o => o.status === 'aberta').length,
    andamento: ordens.filter(o => o.status === 'andamento').length,
    concluidas: ordens.filter(o => o.status === 'concluida').length,
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#111827', margin: 0 }}>Sistematiza OS</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>Olá, Fabiano 👋</p>
        </div>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#0C447C' }}>FA</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.75rem' }}>
        {[
          { label: 'Abertas', valor: contagem.abertas },
          { label: 'Em andamento', valor: contagem.andamento },
          { label: 'Concluídas', valor: contagem.concluidas },
        ].map(s => (
          <div key={s.label} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '10px', padding: '0.85rem 0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#111827' }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Ações rápidas */}
      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '0.75rem' }}>Ações rápidas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1.75rem' }}>
        {[
          { icon: '＋', label: 'Nova OS', sub: 'Abrir ordem de serviço', cor: '#378ADD', acao: onNova },
          { icon: '👤', label: 'Clientes', sub: 'Ver ou cadastrar', cor: '#2ecc71', acao: () => { } },
          { icon: '📊', label: 'Relatórios', sub: 'Resumo do período', cor: '#f39c12', acao: () => { } },
          { icon: '📋', label: 'Histórico', sub: 'OS concluídas', cor: '#1D9E75', acao: () => { } },
        ].map(a => (
          <button key={a.label} onClick={a.acao} style={{ background: a.cor, border: 'none', borderRadius: '12px', padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px', display: 'block', marginBottom: '0.5rem' }}>{a.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'block' }}>{a.label}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.85)', display: 'block', marginTop: '2px' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      {/* OS Recentes */}
      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '0.75rem' }}>OS recentes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ordens.map(os => {
          const s = statusConfig[os.status]
          return (
            <div key={os.id} style={{ background: '#ffffff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{os.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{os.servico} · {os.data}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: s.bg, color: s.texto }}>{s.label}</span>
            </div>
          )
        })}
      </div>

      {/* Botão principal */}
      <button onClick={onNova} style={{ width: '100%', marginTop: '1.5rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        + Nova ordem de serviço
      </button>
    </div>
  )
}

function NovaOS({ onSalvar, onVoltar }) {
  const [form, setForm] = useState({ nome: '', telefone: '', servico: '', descricao: '' })

  const atualiza = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }))

  const salvar = () => {
    if (!form.nome || !form.servico) return alert('Preencha nome e serviço!')
    onSalvar(form)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
        <button onClick={onVoltar} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontSize: '14px', color: '#111827' }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', fontWeight: '500', color: '#111827', margin: 0 }}>Nova OS</h1>
      </div>

      {/* Formulário */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Nome do cliente *</label>
          <input
            value={form.nome}
            onChange={e => atualiza('nome', e.target.value)}
            placeholder="Ex: Dr. João Silva"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Telefone do cliente</label>
          <input
            value={form.telefone}
            onChange={e => atualiza('telefone', e.target.value)}
            placeholder="Ex: (35) 99999-9999"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Tipo de serviço *</label>
          <input
            value={form.servico}
            onChange={e => atualiza('servico', e.target.value)}
            placeholder="Ex: Prontuário digital, Site, OS..."
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', display: 'block', marginBottom: '0.4rem' }}>Descrição</label>
          <textarea
            value={form.descricao}
            onChange={e => atualiza('descricao', e.target.value)}
            placeholder="Descreva o que será feito..."
            rows={4}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '0.5px solid #e5e7eb', fontSize: '14px', color: '#111827', outline: 'none', background: '#fff', resize: 'vertical', fontFamily: 'sans-serif' }}
          />
        </div>

        <button onClick={salvar} style={{ width: '100%', marginTop: '0.5rem', background: '#378ADD', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.9rem', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
          Salvar OS
        </button>

      </div>
    </div>
  )
}

export default function App() {
  const [tela, setTela] = useState('dashboard')
  const [ordens, setOrdens] = useState(dadosIniciais)

  const salvarOS = (form) => {
    const nova = {
      id: ordens.length + 1,
      nome: form.nome,
      telefone: form.telefone,
      servico: form.servico,
      descricao: form.descricao,
      status: 'aberta',
      data: 'Agora',
    }
    setOrdens(prev => [nova, ...prev])
    setTela('dashboard')
  }

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '1.5rem 1rem', maxWidth: '420px', margin: '0 auto' }}>
      {tela === 'dashboard' && <Dashboard ordens={ordens} onNova={() => setTela('nova')} />}
      {tela === 'nova' && <NovaOS onSalvar={salvarOS} onVoltar={() => setTela('dashboard')} />}
    </div>
  )
}