import { useState } from 'react'
import { getOrdens, saveOrdens, getClientes, saveClientes, statusConfig, pagamentoConfig } from './data/storage'
import OSDetalhe from './components/OS/OSDetalhe'
import OSForm from './components/OS/OSForm'
import Recibo from './components/OS/Recibo'
import ClientesList from './components/Clientes/ClientesList'
import ClientesForm from './components/Clientes/ClientesForm'
import Relatorios from './components/Relatorios'
import Historico from './components/Historico'

const s = {
  app: { background: 'var(--bg-primary)', minHeight: '100vh' },
  wrap: { maxWidth: '1080px', margin: '0 auto', minHeight: '100vh', padding: '0' },

  /* topbar */
  topbar: { background: 'var(--bg-layer-01)', borderBottom: '1px solid var(--border-subtle)', padding: '0 32px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  topbarLogo: { display: 'flex', alignItems: 'center', gap: '8px' },
  topbarLogoText: { fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.3px' },
  topbarLogoAccent: { color: 'var(--brand)' },
  topbarAvatar: { width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: 'var(--brand)' },

  /* page */
  page: { padding: '32px' },

  /* stat cards */
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' },
  statCard: (bg, cor) => ({ background: bg, borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid var(--border-subtle)' }),
  statNum: (cor) => ({ fontSize: '28px', fontWeight: '700', color: cor, lineHeight: 1, letterSpacing: '-0.5px' }),
  statLabel: { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' },

  /* quick actions */
  actionsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' },
  actionBtn: (bg) => ({ background: bg, border: 'none', borderRadius: 'var(--radius-lg)', padding: '18px 20px', textAlign: 'left', cursor: 'pointer', transition: 'filter 0.15s, transform 0.1s' }),

  /* section header */
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  sectionTitle: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' },

  /* new os btn */
  newBtn: { background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },

  /* os list */
  osList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  osCard: { background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'box-shadow 0.15s, border-color 0.15s' },
  osDot: (cor) => ({ width: '8px', height: '8px', borderRadius: '50%', background: cor, flexShrink: 0 }),
  osInfo: { flex: 1, cursor: 'pointer', minWidth: 0 },
  osName: { fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  osSub: { fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' },
  osBadge: (bg, cor) => ({ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: bg, color: cor, whiteSpace: 'nowrap', flexShrink: 0 }),
  iconBtn: (bg, border) => ({ background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', fontSize: '13px', flexShrink: 0, transition: 'background 0.15s' }),

  /* modal */
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' },
  modalBox: { background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '32px', maxWidth: '380px', width: '90%', boxShadow: 'var(--shadow-lg)', textAlign: 'center' },
  modalTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' },
  modalSub: { fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 },
  modalBtns: { display: 'flex', gap: '10px' },
  modalCancel: { flex: 1, background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-primary)' },
  modalConfirm: { flex: 1, background: '#DC2626', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff' },
}

function Modal({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div style={s.modalOverlay}>
      <div style={s.modalBox}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
        <p style={s.modalTitle}>Confirmar exclusão</p>
        <p style={s.modalSub}>{mensagem}</p>
        <div style={s.modalBtns}>
          <button onClick={onCancelar} style={s.modalCancel}>Cancelar</button>
          <button onClick={onConfirmar} style={s.modalConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ ordens, onNavegar, onVerOS, onEditarOS, onExcluirOS }) {
  const abertas    = ordens.filter(o => o.status === 'aberta').length
  const andamento  = ordens.filter(o => o.status === 'andamento').length
  const concluidas = ordens.filter(o => o.status === 'concluida').length

  return (
    <div style={s.page}>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard('var(--status-open-bg)')}>
          <div style={s.statNum('var(--status-open)')}>{abertas}</div>
          <div style={s.statLabel}>Abertas</div>
        </div>
        <div style={s.statCard('var(--status-progress-bg)')}>
          <div style={s.statNum('var(--status-progress)')}>{andamento}</div>
          <div style={s.statLabel}>Em andamento</div>
        </div>
        <div style={s.statCard('var(--status-done-bg)')}>
          <div style={s.statNum('var(--status-done)')}>{concluidas}</div>
          <div style={s.statLabel}>Concluídas</div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={s.actionsRow}>
        {[
          { icon: '👤', label: 'Clientes',   sub: 'Ver ou cadastrar',  bg: '#EEF4FF', tela: 'clientes' },
          { icon: '📊', label: 'Relatórios', sub: 'Resumo por status', bg: '#FFFBEB', tela: 'relatorios' },
          { icon: '📋', label: 'Histórico',  sub: 'OS concluídas',     bg: '#ECFDF5', tela: 'historico' },
        ].map(a => (
          <button key={a.label} onClick={() => onNavegar(a.tela)} style={s.actionBtn(a.bg)}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.96)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '6px' }}>{a.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>{a.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      {/* OS List */}
      <div style={s.sectionHeader}>
        <span style={s.sectionTitle}>Ordens de serviço</span>
        <button onClick={() => onNavegar('os-nova')} style={s.newBtn}>
          <span>+</span> Nova OS
        </button>
      </div>

      <div style={s.osList}>
        {ordens.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            <p style={{ fontWeight: '500' }}>Nenhuma OS cadastrada</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Nova OS" para começar</p>
          </div>
        )}
        {ordens.map(os => {
          const st = statusConfig[os.status]
          return (
            <div key={os.id} style={s.osCard}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
              <div style={s.osDot(st.cor)} />
              <div style={s.osInfo} onClick={() => onVerOS(os)}>
                <div style={s.osName}>{os.nome}</div>
                <div style={s.osSub}>{os.servico} · {os.data}</div>
              </div>
              <span style={s.osBadge(st.bg, st.texto)}>{st.label}</span>
              <button onClick={() => onEditarOS(os)} style={s.iconBtn('var(--bg-layer-02)', 'var(--border-subtle)')}>✏️</button>
              <button onClick={() => onExcluirOS(os)} style={s.iconBtn('var(--pay-pending-bg)', '#FECACA')}>🗑️</button>
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
    setOrdens(novasOrdens); saveOrdens(novasOrdens)
    setOsSelecionada(null); setTela('dashboard')
  }

  const excluirOS = (os) => {
    setModal({
      mensagem: `Deseja excluir a OS de "${os.nome}"?`,
      onConfirmar: () => {
        const novasOrdens = ordens.filter(o => o.id !== os.id)
        setOrdens(novasOrdens); saveOrdens(novasOrdens)
        setModal(null); setTela('dashboard')
      }
    })
  }

  const mudarStatus = (novoStatus) => {
    const novasOrdens = ordens.map(o => o.id === osSelecionada.id ? { ...o, status: novoStatus } : o)
    setOrdens(novasOrdens); saveOrdens(novasOrdens)
    setOsSelecionada(prev => ({ ...prev, status: novoStatus }))
  }

  const salvarCliente = (form) => {
    let novosClientes
    if (clienteSelecionado) {
      novosClientes = clientes.map(c => c.id === clienteSelecionado.id ? { ...c, ...form } : c)
    } else {
      novosClientes = [{ id: Date.now(), ...form }, ...clientes]
    }
    setClientes(novosClientes); saveClientes(novosClientes)
    setClienteSelecionado(null); setTela('clientes')
  }

  const excluirCliente = (cliente) => {
    setModal({
      mensagem: `Deseja excluir o cliente "${cliente.nome}"?`,
      onConfirmar: () => {
        const novosClientes = clientes.filter(c => c.id !== cliente.id)
        setClientes(novosClientes); saveClientes(novosClientes)
        setModal(null)
      }
    })
  }

  const navegar = (destino) => { setOsSelecionada(null); setClienteSelecionado(null); setTela(destino) }

  return (
    <div style={s.app}>
      <div style={s.wrap}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <div style={s.topbarLogo}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <g transform="rotate(90,50,50)">
                  <path d="M25 22L8 50L25 78" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M75 22L92 50L75 78" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M63 10L37 90" stroke="#2ecc71" strokeWidth="11" strokeLinecap="round"/>
                </g>
              </svg>
              <span style={s.topbarLogoText}>sistematiza<span style={s.topbarLogoAccent}>.ai</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {tela !== 'dashboard' && (
              <button onClick={() => navegar('dashboard')}
                style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 14px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ← Início
              </button>
            )}
            <div style={s.topbarAvatar}>CL</div>
          </div>
        </div>

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
          <OSForm os={osSelecionada} onSalvar={salvarOS} onVoltar={() => setTela('dashboard')} />
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
          <Recibo os={osSelecionada} onVoltar={() => setTela('os-detalhe')} />
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
          <ClientesForm cliente={clienteSelecionado} onSalvar={salvarCliente} onVoltar={() => setTela('clientes')} />
        )}

        {tela === 'relatorios' && <Relatorios ordens={ordens} onVoltar={() => setTela('dashboard')} />}
        {tela === 'historico'  && <Historico  ordens={ordens} onVoltar={() => setTela('dashboard')} />}

      </div>
    </div>
  )
}