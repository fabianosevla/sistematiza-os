import { useState } from 'react'
import { getOrdens, saveOrdens, getClientes, saveClientes, statusConfig } from './data/storage'
import OSDetalhe from './components/OS/OSDetalhe'
import OSForm from './components/OS/OSForm'
import Recibo from './components/OS/Recibo'
import ClientesList from './components/Clientes/ClientesList'
import ClientesForm from './components/Clientes/ClientesForm'
import Relatorios from './components/Relatorios'
import Historico from './components/Historico'

function Modal({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗑️</div>
        <p style={{ fontSize: '15px', color: '#111827', fontWeight: '500', marginBottom: '0.5rem' }}>Confirmar exclusão</p>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '1.5rem' }}>{mensagem}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} style={{ flex: 1, background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#111827' }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '14px', cursor: 'pointer', color: '#fff', fontWeight: '500' }}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ ordens, onNavegar, onVerOS, onEditarOS, onExcluirOS }) {
  const contagem = {
    abertas: ordens.filter(o => o.status === 'aberta').length,
    andamento: ordens.filter(o => o.status === 'andamento').length,
    concluidas: ordens.filter(o => o.status === 'concluida').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#111827', margin: 0 }}>Sistematiza OS</h1>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>Olá, Cliente 👋</p>        </div>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', color: '#0C447C' }}>CL</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.75rem' }}>
        {[
          { label: 'Abertas', valor: contagem.abertas, bg: '#E6F1FB', cor: '#185FA5' },
          { label: 'Em andamento', valor: contagem.andamento, bg: '#FEF3C7', cor: '#92400E' },
          { label: 'Concluídas', valor: contagem.concluidas, bg: '#D1FAE5', cor: '#065F46' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '600', color: s.cor }}>{s.valor}</div>
            <div style={{ fontSize: '11px', color: s.cor, marginTop: '2px', opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '0.75rem' }}>Ações rápidas</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1.75rem' }}>
        {[
          { icon: '👤', label: 'Clientes', sub: 'Ver ou cadastrar', cor: '#2ecc71', tela: 'clientes' },
          { icon: '📊', label: 'Relatórios', sub: 'Resumo por status', cor: '#f39c12', tela: 'relatorios' },
          { icon: '📋', label: 'Histórico', sub: 'OS concluídas', cor: '#1D9E75', tela: 'historico' },
        ].map(a => (
          <button key={a.label} onClick={() => onNavegar(a.tela)} style={{ background: a.cor, border: 'none', borderRadius: '12px', padding: '1rem', textAlign: 'left', cursor: 'pointer' }}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '0.4rem' }}>{a.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#fff', display: 'block' }}>{a.label}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', display: 'block', marginTop: '2px' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>Ordens de serviço</p>
        <button onClick={() => onNavegar('os-nova')} style={{ background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>+ Nova OS</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {ordens.length === 0 && (
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '2rem' }}>Nenhuma OS cadastrada.</p>
        )}
        {ordens.map(os => {
          const s = statusConfig[os.status]
          return (
            <div key={os.id} style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.cor, flexShrink: 0 }} />
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => onVerOS(os)}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{os.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{os.servico} · {os.data}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 10px', borderRadius: '999px', background: s.bg, color: s.texto, whiteSpace: 'nowrap' }}>{s.label}</span>
              <button onClick={() => onEditarOS(os)} style={{ background: '#f9fafb', border: '0.5px solid #e5e7eb', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>✏️</button>
              <button onClick={() => onExcluirOS(os)} style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', borderRadius: '6px', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [tela, setTela] = useState('dashboard')
  const [ordens, setOrdens] = useState(getOrdens)
  const [clientes, setClientes] = useState(getClientes)
  const [osSelecionada, setOsSelecionada] = useState(null)
  const [clienteSelecionado, setClienteSelecionado] = useState(null)
  const [modal, setModal] = useState(null)

  const salvarOS = (form) => {
    let novasOrdens
    if (osSelecionada) {
      novasOrdens = ordens.map(o => o.id === osSelecionada.id ? { ...o, ...form } : o)
    } else {
      const nova = { id: Date.now(), ...form, status: 'aberta', data: new Date().toLocaleDateString('pt-BR') }
      novasOrdens = [nova, ...ordens]
    }
    setOrdens(novasOrdens)
    saveOrdens(novasOrdens)
    setOsSelecionada(null)
    setTela('dashboard')
  }

  const excluirOS = (os) => {
    setModal({
      mensagem: `Deseja excluir a OS de "${os.nome}"?`,
      onConfirmar: () => {
        const novasOrdens = ordens.filter(o => o.id !== os.id)
        setOrdens(novasOrdens)
        saveOrdens(novasOrdens)
        setModal(null)
        setTela('dashboard')
      }
    })
  }

  const mudarStatus = (novoStatus) => {
    const novasOrdens = ordens.map(o => o.id === osSelecionada.id ? { ...o, status: novoStatus } : o)
    setOrdens(novasOrdens)
    saveOrdens(novasOrdens)
    setOsSelecionada(prev => ({ ...prev, status: novoStatus }))
  }

  const salvarCliente = (form) => {
    let novosClientes
    if (clienteSelecionado) {
      novosClientes = clientes.map(c => c.id === clienteSelecionado.id ? { ...c, ...form } : c)
    } else {
      const novo = { id: Date.now(), ...form }
      novosClientes = [novo, ...clientes]
    }
    setClientes(novosClientes)
    saveClientes(novosClientes)
    setClienteSelecionado(null)
    setTela('clientes')
  }

  const excluirCliente = (cliente) => {
    setModal({
      mensagem: `Deseja excluir o cliente "${cliente.nome}"?`,
      onConfirmar: () => {
        const novosClientes = clientes.filter(c => c.id !== cliente.id)
        setClientes(novosClientes)
        saveClientes(novosClientes)
        setModal(null)
      }
    })
  }

  const navegar = (destino) => {
    setOsSelecionada(null)
    setClienteSelecionado(null)
    setTela(destino)
  }

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#ffffff', maxWidth: '960px', margin: '0 auto', minHeight: '100vh', padding: '1.5rem 2rem', boxShadow: '0 0 40px rgba(0,0,0,0.06)' }}>

        {modal && <Modal mensagem={modal.mensagem} onConfirmar={modal.onConfirmar} onCancelar={() => setModal(null)} />}

        {tela === 'dashboard' && (
          <Dashboard
            ordens={ordens}
            onNavegar={navegar}
            onVerOS={(os) => { setOsSelecionada(os); setTela('os-detalhe') }}
            onEditarOS={(os) => { setOsSelecionada(os); setTela('os-nova') }}
            onExcluirOS={excluirOS}
          />
        )}

        {tela === 'os-nova' && (
          <OSForm
            os={osSelecionada}
            onSalvar={salvarOS}
            onVoltar={() => setTela('dashboard')}
          />
        )}

        {tela === 'os-detalhe' && osSelecionada && (
          <OSDetalhe
            os={osSelecionada}
            onVoltar={() => setTela('dashboard')}
            onEditar={() => setTela('os-nova')}
            onExcluir={() => excluirOS(osSelecionada)}
            onMudarStatus={mudarStatus}
            onEmitirRecibo={() => setTela('recibo')}
          />
        )}

        {tela === 'recibo' && osSelecionada && (
          <Recibo
            os={osSelecionada}
            onVoltar={() => setTela('os-detalhe')}
          />
        )}

        {tela === 'clientes' && (
          <ClientesList
            clientes={clientes}
            onNovo={() => { setClienteSelecionado(null); setTela('cliente-form') }}
            onEditar={(c) => { setClienteSelecionado(c); setTela('cliente-form') }}
            onExcluir={excluirCliente}
            onVoltar={() => setTela('dashboard')}
          />
        )}

        {tela === 'cliente-form' && (
          <ClientesForm
            cliente={clienteSelecionado}
            onSalvar={salvarCliente}
            onVoltar={() => setTela('clientes')}
          />
        )}

        {tela === 'relatorios' && <Relatorios ordens={ordens} onVoltar={() => setTela('dashboard')} />}
        {tela === 'historico' && <Historico ordens={ordens} onVoltar={() => setTela('dashboard')} />}

      </div>
    </div>
  )
}