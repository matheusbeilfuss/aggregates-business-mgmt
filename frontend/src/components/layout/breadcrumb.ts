import { useLocation } from "react-router-dom";

export type Crumb = { label: string; url: string };

const r = {
  home: { label: "Home", url: "/" },
  orders: { label: "Pedidos", url: "/orders" },
  stocks: { label: "Estoque", url: "/stocks" },
  finance: { label: "Financeiro", url: "/finance" },
  balance: { label: "Balanços", url: "/balance" },
  prices: { label: "Preços", url: "/prices" },
  clients: { label: "Clientes", url: "/clients" },
  receiv: { label: "Cobranças", url: "/receivables" },
  fuel: { label: "Combustível", url: "/fuel" },
  profile: { label: "Meu perfil", url: "/user" },
  admin: { label: "Administração", url: "/admin/users" },
  settings: { label: "Configurações", url: "/admin/settings" },
} satisfies Record<string, Crumb>;

type RouteEntry = {
  pattern: string | RegExp;
  crumbs: Crumb[];
};

const routes: RouteEntry[] = [
  {
    pattern: "/orders/add",
    crumbs: [r.orders, { label: "Novo pedido", url: "/orders/add" }],
  },
  {
    pattern: /^\/orders\/[^/]+$/,
    crumbs: [r.orders, { label: "Editar pedido", url: "" }],
  },
  { pattern: "/orders", crumbs: [r.orders] },

  {
    pattern: /^\/stocks\/[^/]+\/replenish$/,
    crumbs: [r.stocks, { label: "Adicionar estoque", url: "" }],
  },
  {
    pattern: /^\/stocks\/[^/]+$/,
    crumbs: [r.stocks, { label: "Editar produto", url: "" }],
  },
  { pattern: "/stocks", crumbs: [r.stocks] },

  {
    pattern: "/finance/expenses/add",
    crumbs: [r.finance, { label: "Nova saída", url: "/finance/expenses/add" }],
  },
  {
    pattern: /^\/finance\/expenses\/[^/]+\/edit$/,
    crumbs: [r.finance, { label: "Editar saída", url: "" }],
  },
  { pattern: "/finance", crumbs: [r.finance] },

  { pattern: "/balance", crumbs: [r.balance] },

  {
    pattern: /^\/prices\/categories\/[^/]+\/suppliers\/[^/]+\/edit$/,
    crumbs: [
      r.prices,
      { label: "Editar preços", url: "/prices" },
      { label: "Editar fornecedor", url: "" },
    ],
  },
  {
    pattern: /^\/prices\/categories\/[^/]+\/suppliers\/add$/,
    crumbs: [
      r.prices,
      { label: "Editar preços", url: "/prices" },
      { label: "Adicionar fornecedor", url: "" },
    ],
  },
  {
    pattern: /^\/prices\/categories\/[^/]+$/,
    crumbs: [r.prices, { label: "Editar preços", url: "" }],
  },
  { pattern: "/prices", crumbs: [r.prices] },

  {
    pattern: "/clients/add",
    crumbs: [r.clients, { label: "Novo cliente", url: "/clients/add" }],
  },
  {
    pattern: /^\/clients\/[^/]+\/edit$/,
    crumbs: [r.clients, { label: "Editar cliente", url: "" }],
  },
  { pattern: "/clients", crumbs: [r.clients] },

  { pattern: "/receivables", crumbs: [r.receiv] },
  { pattern: "/fuel", crumbs: [r.fuel] },
  { pattern: "/user", crumbs: [r.profile] },
  {
    pattern: "/admin/users/add",
    crumbs: [r.admin, { label: "Novo usuário", url: "/admin/users/add" }],
  },
  { pattern: "/admin/users", crumbs: [r.admin] },
  { pattern: "/admin/settings", crumbs: [r.settings] },
];

function matches(pattern: string | RegExp, pathname: string): boolean {
  if (pattern instanceof RegExp) return pattern.test(pathname);
  return pathname === pattern;
}

function resolve(crumbs: Crumb[], pathname: string): Crumb[] {
  return crumbs.map((c) => (c.url === "" ? { ...c, url: pathname } : c));
}

export function useBreadcrumbs(): Crumb[] {
  const { pathname } = useLocation();
  if (pathname === "/") return [];

  const entry = routes.find(({ pattern }) => matches(pattern, pathname));
  return entry ? resolve(entry.crumbs, pathname) : [];
}
