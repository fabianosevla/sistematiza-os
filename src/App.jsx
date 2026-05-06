import { useState } from 'react'
import {
  getOrdens, saveOrdens, getClientes, saveClientes,
  statusConfig, pagamentoConfig, transicoesStatus, statusTerminal,
  calcFinanceiro, calcChecklist, fmt, novaOSDefault,
} from './data/storage'
import OSDetalhe  from './components/OS/OSDetalhe'
import OSForm     from './components/OS/OSForm'
import Recibo     from './components/OS/Recibo'
import ClientesList  from './components/Clientes/ClientesList'
import ClientesForm  from './components/Clientes/ClientesForm'
import Relatorios from './components/Relatorios'
import Historico  from './components/Historico'

// ─── Ícones SVG ───────────────────────────────────────────────────────────────
const Icon = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  os:        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  clientes:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  relat:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
  historico: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 0 .5-4.5"/><polyline points="3 3 3 7 7 7"/></svg>,
  plus:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  edit:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  money:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'dashboard',  label: 'Dashboard',  icon: Icon.dashboard },
  { id: 'os-nova',    label: 'Nova OS',    icon: Icon.os },
  { id: 'clientes',   label: 'Clientes',   icon: Icon.clientes },
  { id: 'relatorios', label: 'Relatórios', icon: Icon.relat },
  { id: 'historico',  label: 'Histórico',  icon: Icon.historico },
]

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ tela, onNavegar, ordens }) {
  const abertas  = ordens.filter(o => o.status === 'aberta').length
  const execucao = ordens.filter(o => o.status === 'em_execucao').length

  return (
    <aside style={{
      width: '220px', flexShrink: 0,
      background: 'var(--bg-layer-01)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3" width="14" height="18" rx="2" fill="#2ecc71" fillOpacity="0.15"/>
          <rect x="5" y="3" width="14" height="18" rx="2" stroke="#2ecc71" strokeWidth="1.8"/>
          <path d="M9 3.5h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z" fill="#2ecc71"/>
          <path d="M8.5 11.5l2 2 4-4" stroke="#2ecc71" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="8.5" y1="16" x2="15.5" y2="16" stroke="#2ecc71" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            sistematiza<span style={{ color: '#2ecc71' }}>.os</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '700', marginTop: '3px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Ordens de Serviço
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-placeholder)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', marginBottom: '4px' }}>Menu</p>
        {NAV.map(item => {
          const isActive =
            tela === item.id ||
            (item.id === 'dashboard' && ['os-detalhe','recibo'].includes(tela)) ||
            (item.id === 'clientes'  && tela === 'cliente-form') ||
            (item.id === 'os-nova'   && tela === 'os-nova')

          return (
            <button key={item.id} onClick={() => onNavegar(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: 'var(--radius-md)', border: 'none',
                background: isActive ? 'var(--brand)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontSize: '13px', fontWeight: isActive ? '600' : '500',
                cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                marginBottom: '2px', fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-layer-02)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}>
              <span style={{ opacity: isActive ? 1 : 0.65, flexShrink: 0, display: 'flex' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'dashboard' && abertas > 0 && (
                <span style={{ fontSize: '10px', fontWeight: '700', background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--brand)', color: '#fff', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>{abertas}</span>
              )}
              {item.id === 'os-nova' && execucao > 0 && (
                <span style={{ fontSize: '10px', fontWeight: '700', background: isActive ? 'rgba(255,255,255,0.25)' : '#FEF3C7', color: isActive ? '#fff' : '#92400E', borderRadius: 'var(--radius-full)', padding: '1px 7px' }}>{execucao}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <p style={{ fontSize: '10px', color: 'var(--text-placeholder)', lineHeight: 1.5 }}>sistematiza.ia · v2.0.0</p>
      </div>
    </aside>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ titulo, subtitulo }) {
  return (
    <header style={{
      height: '56px', background: 'var(--bg-layer-01)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', flexShrink: 0,
    }}>
      <div>
        <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.2px', lineHeight: 1.2 }}>{titulo}</p>
        {subtitulo && <p style={{ fontSize: '11px', color: 'var(--text-placeholder)', marginTop: '1px' }}>{subtitulo}</p>}
      </div>
      <div style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-full)', background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--brand)', border: '1.5px solid rgba(0,82,204,0.2)' }}>ST</div>
    </header>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ mensagem, onConfirmar, onCancelar }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(22,22,22,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(2px)' }}>
      <div style={{ background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-xl)', padding: '32px', maxWidth: '380px', width: '90%', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
        <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>Confirmar exclusão</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>{mensagem}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onCancelar} style={{ flex: 1, background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', color: 'var(--text-primary)', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: 'var(--radius-md)', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Excluir</button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ ordens, onNavegar, onVerOS, onEditarOS, onExcluirOS }) {
  const stats = [
    { label: 'Abertas',     valor: ordens.filter(o => o.status === 'aberta').length,      bg: 'var(--status-open-bg)',      cor: 'var(--status-open)',      dot: '#378ADD' },
    { label: 'Em execução', valor: ordens.filter(o => o.status === 'em_execucao').length, bg: 'var(--status-progress-bg)',  cor: 'var(--status-progress)',  dot: '#D97706' },
    { label: 'Concluídas',  valor: ordens.filter(o => o.status === 'concluida').length,   bg: 'var(--status-done-bg)',      cor: 'var(--status-done)',      dot: '#059669' },
  ]

  // Painel financeiro rápido
  const totalFaturar  = ordens.filter(o => !['cancelada','recusada'].includes(o.status)).reduce((a, o) => a + (o.valorFinal || 0), 0)
  const totalRecebido = ordens.reduce((a, o) => a + (o.pagamentos || []).reduce((s, p) => s + parseFloat(p.valor || 0), 0), 0)
  const aReceber      = totalFaturar - totalRecebido

  return (
    <div style={{ padding: '28px' }}>

      {/* Stats OS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
        {stats.map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.dot }} />
              <span style={{ fontSize: '11px', fontWeight: '700', color: c.cor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.label}</span>
            </div>
            <div style={{ fontSize: '30px', fontWeight: '700', color: c.cor, lineHeight: 1, letterSpacing: '-0.5px' }}>{c.valor}</div>
          </div>
        ))}
      </div>

      {/* Painel financeiro rápido */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total faturável', valor: fmt(totalFaturar),  cor: 'var(--text-primary)',   bg: 'var(--bg-layer-01)' },
          { label: 'Recebido',        valor: fmt(totalRecebido), cor: 'var(--status-done)',    bg: 'var(--status-done-bg)' },
          { label: 'A receber',       valor: fmt(aReceber),      cor: aReceber > 0 ? 'var(--pay-pending)' : 'var(--status-done)', bg: aReceber > 0 ? 'var(--pay-pending-bg)' : 'var(--status-done-bg)' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 'var(--radius-lg)', padding: '14px 20px', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{c.label}</p>
            <p style={{ fontSize: '18px', fontWeight: '700', color: c.cor, letterSpacing: '-0.3px' }}>{c.valor}</p>
          </div>
        ))}
      </div>

      {/* Atalhos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '28px' }}>
        {[
          { icon: '👤', label: 'Clientes',   sub: 'Ver ou cadastrar',  bg: '#EEF4FF', tela: 'clientes' },
          { icon: '📊', label: 'Relatórios', sub: 'Resumo por status', bg: '#FFFBEB', tela: 'relatorios' },
          { icon: '📋', label: 'Histórico',  sub: 'OS concluídas',     bg: '#ECFDF5', tela: 'historico' },
        ].map(a => (
          <button key={a.label} onClick={() => onNavegar(a.tela)}
            style={{ background: a.bg, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', textAlign: 'left', cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s', fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>
            <span style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }}>{a.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>{a.label}</span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>{a.sub}</span>
          </button>
        ))}
      </div>

      {/* Lista OS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ordens de serviço</p>
        <button onClick={() => onNavegar('os-nova')}
          style={{ background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Sans, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--brand)'}>
          {Icon.plus} Nova OS
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {ordens.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)', background: 'var(--bg-layer-01)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-strong)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📋</div>
            <p style={{ fontWeight: '600' }}>Nenhuma OS cadastrada</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>Clique em "Nova OS" para começar</p>
          </div>
        )}
        {ordens.map(os => {
          const st = statusConfig[os.status] || statusConfig.aberta
          const fin = calcFinanceiro(os)
          const ck  = calcChecklist(os.checklist)

          return (
            <div key={os.id}
              style={{ background: 'var(--bg-layer-01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'box-shadow 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)' }}>

              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.cor, flexShrink: 0 }} />

              <div style={{ flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => onVerOS(os)}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{os.nome}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {os.servico} · {os.data}
                  {ck.total > 0 && <span style={{ marginLeft: '8px', fontSize: '11px', color: ck.pct === 100 ? 'var(--status-done)' : 'var(--text-placeholder)' }}>✓ {ck.pct}%</span>}
                </p>
              </div>

              {/* Valor */}
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', flexShrink: 0 }}>{fmt(fin.valorFinal)}</span>

              <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: 'var(--radius-full)', background: st.bg, color: st.texto, whiteSpace: 'nowrap', flexShrink: 0 }}>{st.label}</span>

              <button onClick={() => onEditarOS(os)}
                style={{ background: 'var(--bg-layer-02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', flexShrink: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8F0FE'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-layer-02)'}>
                {Icon.edit}
              </button>

              <button onClick={() => onExcluirOS(os)}
                style={{ background: 'var(--pay-pending-bg)', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '6px 8px', cursor: 'pointer', flexShrink: 0, color: 'var(--pay-pending)', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--pay-pending-bg)'}>
                {Icon.trash}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Topbar info dinâmica ─────────────────────────────────────────────────────
function getTopbarInfo(tela, osSel, clienteSel) {
  const map = {
    'dashboard':    { titulo: 'Dashboard',    subtitulo: 'Visão geral das ordens de serviço' },
    'os-nova':      { titulo: osSel ? 'Editar OS' : 'Nova OS', subtitulo: osSel ? 'Atualizando ordem de serviço' : 'Abrindo nova ordem de serviço' },
    'os-detalhe':   { titulo: osSel?.nome || 'Detalhe da OS', subtitulo: osSel?.servico || '' },
    'recibo':       { titulo: 'Recibo', subtitulo: `OS #${osSel?.id || ''}` },
    'clientes':     { titulo: 'Clientes', subtitulo: 'Cadastro e gerenciamento de clientes' },
    'cliente-form': { titulo: clienteSel ? 'Editar cliente' : 'Novo cliente', subtitulo: 'Dados do cliente' },
    'relatorios':   { titulo: 'Relatórios', subtitulo: 'Visão geral das ordens de serviço' },
    'historico':    { titulo: 'Histórico', subtitulo: 'OS concluídas' },
  }
  return map[tela] || { titulo: 'sistematiza.os', subtitulo: '' }
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tela, setTela]                     = useState('dashboard')
  const [ordens, setOrdens]                 = useState(getOrdens)
  const [clientes, setClientes]             = useState(getClientes)
  const [osSelecionada, setOsSelecionada]   = useState(null)
  const [clienteSelecionado, setClienteSel] = useState(null)
  const [modal, setModal]                   = useState(null)

  // ── OS handlers ──
  const salvarOS = (form) => {
    let novas
    if (osSelecionada) {
      novas = ordens.map(o => o.id === osSelecionada.id ? { ...o, ...form } : o)
    } else {
      novas = [{ ...novaOSDefault(), ...form }, ...ordens]
    }
    setOrdens(novas); saveOrdens(novas)
    setOsSelecionada(null); setTela('dashboard')
  }

  const excluirOS = (os) => {
    setModal({
      mensagem: `Deseja excluir a OS de "${os.nome}"?`,
      onConfirmar: () => {
        const novas = ordens.filter(o => o.id !== os.id)
        setOrdens(novas); saveOrdens(novas)
        setModal(null); setTela('dashboard')
      }
    })
  }

  const mudarStatus = (novoStatus) => {
    const novas = ordens.map(o => o.id === osSelecionada.id ? { ...o, status: novoStatus } : o)
    setOrdens(novas); saveOrdens(novas)
    setOsSelecionada(prev => ({ ...prev, status: novoStatus }))
  }

  const atualizarOS = (osAtualizada) => {
    const novas = ordens.map(o => o.id === osAtualizada.id ? osAtualizada : o)
    setOrdens(novas); saveOrdens(novas)
    setOsSelecionada(osAtualizada)
  }

  // ── Clientes handlers ──
  const salvarCliente = (form) => {
    let novos
    if (clienteSelecionado) {
      novos = clientes.map(c => c.id === clienteSelecionado.id ? { ...c, ...form } : c)
    } else {
      novos = [{ id: Date.now(), ...form }, ...clientes]
    }
    setClientes(novos); saveClientes(novos)
    setClienteSel(null); setTela('clientes')
  }

  const excluirCliente = (cliente) => {
    setModal({
      mensagem: `Deseja excluir o cliente "${cliente.nome}"?`,
      onConfirmar: () => {
        const novos = clientes.filter(c => c.id !== cliente.id)
        setClientes(novos); saveClientes(novos)
        setModal(null)
      }
    })
  }

  const navegar = (destino) => {
    setOsSelecionada(null); setClienteSel(null); setTela(destino)
  }

  const { titulo, subtitulo } = getTopbarInfo(tela, osSelecionada, clienteSelecionado)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      <Sidebar tela={tela} onNavegar={navegar} ordens={ordens} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar titulo={titulo} subtitulo={subtitulo} />

        <main style={{ flex: 1, overflowY: 'auto' }}>

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
              onVoltar={() => { setOsSelecionada(null); setTela('dashboard') }}
            />
          )}

          {tela === 'os-detalhe' && osSelecionada && (
            <OSDetalhe
              os={osSelecionada}
              onVoltar={() => { setOsSelecionada(null); setTela('dashboard') }}
              onEditar={() => setTela('os-nova')}
              onExcluir={() => excluirOS(osSelecionada)}
              onMudarStatus={mudarStatus}
              onAtualizar={atualizarOS}
              onEmitirRecibo={() => setTela('recibo')}
            />
          )}

          {tela === 'recibo' && osSelecionada && (
            <Recibo os={osSelecionada} onVoltar={() => setTela('os-detalhe')} />
          )}

          {tela === 'clientes' && (
            <ClientesList
              clientes={clientes}
              onNovo={() => { setClienteSel(null); setTela('cliente-form') }}
              onEditar={(c) => { setClienteSel(c); setTela('cliente-form') }}
              onExcluir={excluirCliente}
              onVoltar={() => navegar('dashboard')}
            />
          )}

          {tela === 'cliente-form' && (
            <ClientesForm
              cliente={clienteSelecionado}
              onSalvar={salvarCliente}
              onVoltar={() => setTela('clientes')}
            />
          )}

          {tela === 'relatorios' && <Relatorios ordens={ordens} onVoltar={() => navegar('dashboard')} />}
          {tela === 'historico'  && <Historico  ordens={ordens} onVoltar={() => navegar('dashboard')} />}

        </main>
      </div>
    </div>
  )
}