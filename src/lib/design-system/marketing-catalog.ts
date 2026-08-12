import type { PublicCatalog } from "@/types/catalog";

export const marketingCatalog: PublicCatalog = {
  banner_url: null,
  categorias: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      nome: "Destaques",
      ordem: 0,
      produtos: [
        { descricao: "Descrição clara para ajudar na escolha.", id: "22222222-2222-4222-8222-222222222221", imagem_url: null, nome: "Produto especial", ordem: 0, preco: 39.9, variacao_info: "Opções sob consulta" },
        { descricao: "Pronto para pedir pelo WhatsApp.", id: "22222222-2222-4222-8222-222222222222", imagem_url: null, nome: "Novidade da semana", ordem: 1, preco: 54, variacao_info: null },
      ],
    },
  ],
  descricao_curta: "Seu catálogo organizado, bonito e fácil de pedir.",
  endereco: "Atendimento na sua cidade",
  instagram: "sualoja",
  logo_url: null,
  nome_loja: "Sua Loja",
  slug: "sua-loja",
  status: "ativo",
  tema: "natural",
  whatsapp: "5511999999999",
};
