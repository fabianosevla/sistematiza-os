const KEYS = {
  ordens: 'sistematiza_ordens',
  clientes: 'sistematiza_clientes',
}

const dadosIniciaisOS = [
  { id: 1, nome: 'Dr. Carlos Mendes', telefone: '(35) 99111-2233', servico: 'Prontuário digital', descricao: 'Criar sistema de prontuário eletrônico.', observacoes: '', status: 'andamento', data: '27/04/2026', valor: 1500, valorPago: 750, formaPagamento: 'Pix', statusPagamento: 'parcial' },
  { id: 2, nome: 'Adv. Marina Costa', telefone: '(35) 98877-6655', servico: 'Sistema de processos', descricao: 'Controle de processos jurídicos.', observacoes: '', status: 'aberta', data: '26/04/2026', valor: 800, valorPago: 0, formaPagamento: 'Pix', statusPagamento: 'pendente' },
  { id: 3, nome: 'Clínica Bem Estar', telefone: '(35) 3822-1100', servico: 'Agendamento online', descricao: 'Sistema de agendamento para clínica.', observacoes: '', status: 'concluida', data: '24/04/2026', valor: 2000, valorPago: 2000, formaPagamento: 'Transferência', statusPagamento: 'pago' },
]

const dadosIniciaisClientes = [
  { id: 1, nome: 'Dr. Carlos Mendes', telefone: '(35) 99111-2233', email: 'carlos@email.com', empresa: 'Clínica Mendes' },
  { id: 2, nome: 'Adv. Marina Costa', telefone: '(35) 98877-6655', email: 'marina@email.com', empresa: 'Costa Advocacia' },
]

export const getOrdens = () => {
  const salvo = localStorage.getItem(KEYS.ordens)
  return salvo ? JSON.parse(salvo) : dadosIniciaisOS
}

export const saveOrdens = (ordens) => {
  localStorage.setItem(KEYS.ordens, JSON.stringify(ordens))
}

export const getClientes = () => {
  const salvo = localStorage.getItem(KEYS.clientes)
  return salvo ? JSON.parse(salvo) : dadosIniciaisClientes
}

export const saveClientes = (clientes) => {
  localStorage.setItem(KEYS.clientes, JSON.stringify(clientes))
}

export const statusConfig = {
  aberta:    { label: 'Aberta',       cor: '#378ADD', bg: '#E6F1FB', texto: '#185FA5' },
  andamento: { label: 'Em andamento', cor: '#f39c12', bg: '#FEF3C7', texto: '#92400E' },
  concluida: { label: 'Concluída',    cor: '#2ecc71', bg: '#D1FAE5', texto: '#065F46' },
}

export const pagamentoConfig = {
  pendente: { label: 'Pendente', bg: '#FEF2F2', cor: '#DC2626' },
  parcial:  { label: 'Parcial',  bg: '#FEF3C7', cor: '#92400E' },
  pago:     { label: 'Pago',     bg: '#D1FAE5', cor: '#065F46' },
}

export const formasPagamento = ['Pix', 'Dinheiro', 'Cartão de crédito', 'Cartão de débito', 'Transferência', 'Boleto']