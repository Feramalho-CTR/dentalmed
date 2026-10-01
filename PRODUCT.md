# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pacientes locais de Joinville/SC, principalmente do bairro Anita Garibaldi e entorno, buscando um dentista para avaliação, tratamento ou acompanhamento contínuo. Chegam via busca local/Google ou indicação e decidem rápido se vale a pena entrar em contato.

## Product Purpose

Site institucional de uma clínica odontológica (DentalMed — Clínica Integrada) cujo único objetivo de conversão é levar o visitante a agendar uma avaliação, majoritariamente pelo WhatsApp (CTA "Agende sua avaliação") ou por telefone. Sucesso = contato iniciado, não uma transação no próprio site.

## Positioning

Não confirmado. O texto atual destaca "avaliação, tratamento e acompanhamento com quem cuida de você, de pertinho" (clínica local, acompanhamento contínuo, não só procedimento avulso), mas nenhum mecanismo ou diferencial competitivo explícito frente a outras clínicas de Joinville foi validado com a cliente. Não inventar diferenciais — campo `## Capabilities and Constraints` abaixo já registra que a lista de "diferenciais" do site está com placeholders vazios aguardando esse conteúdo.

## Operating Context

- Contato primário: WhatsApp (wa.me, mensagens pré-preenchidas por seção) e telefone (47) 3804-2104.
- Endereço: Rua Dr. Plácido Olímpio de Oliveira, 1390, Anita Garibaldi, Joinville/SC.
- Responsável técnica: Dra. Elizabeth Berkenbrock Niemeyer — CRO/SC 19885 / EPAO 3835.
- Atende planos e convênios odontológicos (logos de operadoras exibidos no site); confirmação de cobertura é feita manualmente via WhatsApp, não há checagem automática no site.
- Deploy: Netlify, produção em https://dentalmedjoinville.netlify.app.

## Capabilities and Constraints

- Site estático (HTML/CSS/JS vanilla, sem framework/build step), hospedado na Netlify.
- Procedimentos listados (dados estruturados em JSON-LD): Avaliação, Limpeza, Restaurações, Extração, Tratamento de canal, Clareamento dental, Próteses, Implantes, Aparelho ortodôntico.
- FAQ e dados de contato já estruturados em Schema.org (Dentist, Service, FAQPage).
- Lacunas de conteúdo real pendentes de confirmação com a cliente, marcadas como `<!-- TROCAR -->` no HTML — **não preencher com texto inventado**:
  - Lista de diferenciais da clínica (seção "Como trabalhamos").
  - Bio curta da Dra. Elizabeth, lista de demais dentistas e funcionários (modal "Nossa Equipe").
  - Nota média e número de avaliações do Google (seção "Avaliações no Google").
  - `og:image` com foto real da clínica e `og:url` com domínio definitivo.
- Link "Ver mais no Google →" atualmente aponta para `#` (âncora vazia) — precisa do link real do perfil no Google Meu Negócio.
- Paleta de marca já definida em `css/style.css` (`--azul-escuro: #0B4F7A`, `--azul-marca: #3AB0FF`, `--azul-claro: #F4FAFE`, `--azul-claro-banda: #E4F4FD`).

## Brand Commitments

- Azul claro é a cor principal e deve ser preservado como tal — pedido explícito da cliente (dona da clínica), não negociável na repaginada.
- Botão "Agende sua avaliação" deve continuar em destaque visual como CTA principal em toda a página.
- Nome e identidade: "DentalMed — Clínica Integrada".

## Evidence on Hand

- Procedimentos, FAQ, endereço, telefone e nome/CRO da responsável técnica são dados reais já presentes no HTML/JSON-LD — usar como fonte de verdade.
- Depoimentos/avaliações: há 2 imagens de avaliação já publicadas (`assets/avaliacao-*.png`) no carrossel "Avaliações no Google", mas o resumo (nota média / contagem) está vazio. Não inventar números nem novos depoimentos — apenas os que já existem como imagem real.
- Sem fotos reais da clínica confirmadas para `og:image` (placeholder pendente).

## Product Principles

1. Cada seção existe para empurrar o visitante a um dos CTAs de WhatsApp/telefone — nada deve competir com essa ação.
2. Não inventar prova social, números ou promessas; onde falta conteúdo real, sinalizar a lacuna em vez de preencher.
3. Clínica local e de bairro: tom próximo, direto, sem jargão clínico desnecessário — já refletido na copy atual ("dói?", "estraga o dente?").
4. Acessível a quem busca pelo celular primeiro (grande parte do tráfego local de WhatsApp é mobile).

## Accessibility & Inclusion

Nenhum requisito específico levantado pela cliente até o momento. JS existente já respeita `prefers-reduced-motion` nas animações de revelar ao rolar — manter esse padrão em qualquer animação nova.
