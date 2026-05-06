// storage.js — sistematiza.os v2.0
// Modelo de dados expandido conforme Especificação Funcional v2.0

const KEYS = {
  ordens:   'sistematiza_ordens_v2',
  clientes: 'sistematiza_clientes_v2',
}

// ─── Dados iniciais ───────────────────────────────────────────────────────────
const dadosIniciaisOS = [
  {
    id: 1,
    nome: 'Dr. Carlos Mendes',
    telefone: '(35) 99111-2233',
    servico: 'Prontuário digital',
    descricao: 'Criar sistema de prontuário eletrônico para clínica.',
    observacoes: '',
    status: 'em_execucao',
    statusPagamento: 'parcial',
    data: '27/04/2026',
    abertaEm: '2026-04-27T09:00:00Z',
    fechadaEm: null,
    valorOrcado: 1500,
    valorFinal: 1500,
    valorRecebido: 750,
    custoInsumos: 0,
    formaPagamento: 'Pix',
    enderecoExecucao: '',
    latAbertura: null, lngAbertura: null,
    latFechamento: null, lngFechamento: null,
    assinaturaUrl: null, assinaturaMeta: null,
    orcamentoToken: null, orcamentoExpiraEm: null, orcamentoStatus: null,
    pdfUrl: null,
    fotos: [],
    checklist: [
      { id: 1, descricao: 'Levantar requisitos com o cliente', obrigatorio: true, status: 'feito', observacao: '' },
      { id: 2, descricao: 'Desenvolver protótipo', obrigatorio: true, status: 'feito', observacao: '' },
      { id: 3, descricao: 'Validar com usuários', obrigatorio: true, status: 'pendente', observacao: '' },
      { id: 4, descricao: 'Entregar documentação', obrigatorio: false, status: 'pendente', observacao: '' },
    ],
    insumos: [],
    pagamentos: [
      { id: 1, valor: 750, forma: 'Pix', dataRecebimento: '27/04/2026', observacao: 'Entrada 50%' }
    ],
    metadados: {},
  },
  {
    id: 2,
    nome: 'Adv. Marina Costa',
    telefone: '(35) 98877-6655',
    servico: 'Sistema de processos',
    descricao: 'Controle de processos jurídicos e gestão de prazos.',
    observacoes: '',
    status: 'aberta',
    statusPagamento: 'pendente',
    data: '26/04/2026',
    abertaEm: '2026-04-26T14:00:00Z',
    fechadaEm: null,
    valorOrcado: 800,
    valorFinal: 800,
    valorRecebido: 0,
    custoInsumos: 0,
    formaPagamento: 'Pix',
    enderecoExecucao: '',
    latAbertura: null, lngAbertura: null,
    latFechamento: null, lngFechamento: null,
    assinaturaUrl: null, assinaturaMeta: null,
    orcamentoToken: null, orcamentoExpiraEm: null, orcamentoStatus: 'enviado',
    pdfUrl: null,
    fotos: [],
    checklist: [],
    insumos: [],
    pagamentos: [],
    metadados: {},
  },
  {
    id: 3,
    nome: 'Clínica Bem Estar',
    telefone: '(35) 3822-1100',
    servico: 'Agendamento online',
    descricao: 'Sistema de agendamento para clínica médica.',
    observacoes: 'Cliente muito satisfeito com o resultado.',
    status: 'concluida',
    statusPagamento: 'pago',
    data: '24/04/2026',
    abertaEm: '2026-04-20T08:00:00Z',
    fechadaEm: '2026-04-24T17:00:00Z',
    valorOrcado: 2000,
    valorFinal: 2000,
    valorRecebido: 2000,
    custoInsumos: 0,
    formaPagamento: 'Transferência',
    enderecoExecucao: 'Rua das Flores, 100 — Itaú de Minas',
    latAbertura: -20.73, lngAbertura: -46.85,
    latFechamento: -20.73, lngFechamento: -46.85,
    assinaturaUrl: null, assinaturaMeta: null,
    orcamentoToken: null, orcamentoExpiraEm: null, orcamentoStatus: 'aprovado',
    pdfUrl: null,
    fotos: [],
    checklist: [
      { id: 1, descricao: 'Configurar servidor', obrigatorio: true, status: 'feito', observacao: '' },
      { id: 2, descricao: 'Testar agendamentos', obrigatorio: true, status: 'feito', observacao: '' },
      { id: 3, descricao: 'Treinar equipe', obrigatorio: true, status: 'feito', observacao: '' },
    ],
    insumos: [],
    pagamentos: [
      { id: 1, valor: 1000, forma: 'Transferência', dataRecebimento: '20/04/2026', observacao: 'Entrada' },
      { id: 2, valor: 1000, forma: 'Transferência', dataRecebimento: '24/04/2026', observacao: 'Saldo final' },
    ],
    metadados: {},
  },
]

const dadosIniciaisClientes = [
  { id: 1, nome: 'Dr. Carlos Mendes', telefone: '(35) 99111-2233', email: 'carlos@email.com', empresa: 'Clínica Mendes', endereco: '', cpfCnpj: '' },
  { id: 2, nome: 'Adv. Marina Costa', telefone: '(35) 98877-6655', email: 'marina@email.com', empresa: 'Costa Advocacia', endereco: '', cpfCnpj: '' },
]

// ─── CRUD ─────────────────────────────────────────────────────────────────────
export const getOrdens  = () => { try { const s = localStorage.getItem(KEYS.ordens);   return s ? JSON.parse(s) : dadosIniciaisOS } catch { return dadosIniciaisOS } }
export const saveOrdens = (o) => { try { localStorage.setItem(KEYS.ordens, JSON.stringify(o)) } catch(e) { console.error(e) } }

export const getClientes  = () => { try { const s = localStorage.getItem(KEYS.clientes); return s ? JSON.parse(s) : dadosIniciaisClientes } catch { return dadosIniciaisClientes } }
export const saveClientes = (c) => { try { localStorage.setItem(KEYS.clientes, JSON.stringify(c)) } catch(e) { console.error(e) } }

// ─── Configs de status ────────────────────────────────────────────────────────
export const statusConfig = {
  aberta:       { label: 'Aberta',        cor: '#378ADD', bg: '#EEF4FF', texto: '#003A99' },
  aprovada:     { label: 'Aprovada',      cor: '#7C3AED', bg: '#F5F3FF', texto: '#4C1D95' },
  em_execucao:  { label: 'Em execução',   cor: '#D97706', bg: '#FFFBEB', texto: '#92400E' },
  pausada:      { label: 'Pausada',       cor: '#6B7280', bg: '#F3F4F6', texto: '#374151' },
  concluida:    { label: 'Concluída',     cor: '#059669', bg: '#ECFDF5', texto: '#065F46' },
  cancelada:    { label: 'Cancelada',     cor: '#DC2626', bg: '#FEF2F2', texto: '#991B1B' },
  recusada:     { label: 'Recusada',      cor: '#DC2626', bg: '#FEF2F2', texto: '#991B1B' },
}

export const pagamentoConfig = {
  pendente: { label: 'Pendente', bg: '#FEF2F2', cor: '#DC2626' },
  parcial:  { label: 'Parcial',  bg: '#FEF3C7', cor: '#92400E' },
  pago:     { label: 'Pago',     bg: '#D1FAE5', cor: '#065F46' },
  isento:   { label: 'Isento',   bg: '#F3F4F6', cor: '#374151' },
}

export const formasPagamento = [
  'Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Transferência', 'Boleto',
]

// Transições de status permitidas
export const transicoesStatus = {
  aberta:      ['em_execucao', 'aprovada', 'cancelada'],
  aprovada:    ['em_execucao', 'cancelada'],
  em_execucao: ['pausada', 'concluida', 'cancelada'],
  pausada:     ['em_execucao', 'cancelada'],
  concluida:   [],
  cancelada:   [],
  recusada:    [],
}

// Status que são "terminais" (não podem mais mudar)
export const statusTerminal = ['concluida', 'cancelada', 'recusada']

// ─── Helpers financeiros ──────────────────────────────────────────────────────
export const calcFinanceiro = (os) => {
  const valorFinal    = parseFloat(os.valorFinal || os.valorOrcado || 0)
  const valorRecebido = (os.pagamentos || []).reduce((acc, p) => acc + parseFloat(p.valor || 0), 0)
  const custoInsumos  = (os.insumos || []).reduce((acc, i) => acc + (parseFloat(i.quantidade || 0) * parseFloat(i.custoUnitario || 0)), 0)
  const saldo         = valorFinal - valorRecebido
  const lucroBruto    = valorFinal - custoInsumos
  const margem        = valorFinal > 0 ? ((lucroBruto / valorFinal) * 100).toFixed(1) : 0

  return { valorFinal, valorRecebido, custoInsumos, saldo, lucroBruto, margem }
}

export const fmt = (v) => `R$ ${parseFloat(v || 0).toFixed(2).replace('.', ',')}`

// Progresso do checklist
export const calcChecklist = (checklist = []) => {
  if (checklist.length === 0) return { total: 0, feitos: 0, pct: 0, bloqueado: false }
  const feitos    = checklist.filter(i => i.status === 'feito').length
  const bloqueado = checklist.some(i => i.obrigatorio && i.status === 'pendente')
  return { total: checklist.length, feitos, pct: Math.round((feitos / checklist.length) * 100), bloqueado }
}

// Gera OS vazia com defaults
export const novaOSDefault = () => ({
  id: Date.now(),
  nome: '', telefone: '', servico: '', descricao: '', observacoes: '',
  status: 'aberta', statusPagamento: 'pendente',
  data: new Date().toLocaleDateString('pt-BR'),
  abertaEm: new Date().toISOString(),
  fechadaEm: null,
  valorOrcado: 0, valorFinal: 0, valorRecebido: 0, custoInsumos: 0,
  formaPagamento: 'Pix',
  enderecoExecucao: '',
  latAbertura: null, lngAbertura: null,
  latFechamento: null, lngFechamento: null,
  assinaturaUrl: null, assinaturaMeta: null,
  orcamentoToken: null, orcamentoExpiraEm: null, orcamentoStatus: null,
  pdfUrl: null,
  fotos: [], checklist: [], insumos: [], pagamentos: [],
  metadados: {},
})