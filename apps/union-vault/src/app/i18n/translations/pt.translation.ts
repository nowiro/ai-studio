import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'pt',
  {
    languageSwitcher: {
      ariaLabel: 'Selecionar idioma',
      menuTitle: 'Selecionar idioma (24 línguas da UE)',
      selectedTooltip: 'Idioma selecionado: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — página inicial',
      navigationAriaLabel: 'Navegação principal',
      mobileMenuAriaLabel: 'Abrir menu de navegação',
      mobileCountryLabel: 'País atual',
      navContact: 'Contacto',
      navBanks: 'Ofertas de crédito',
      navCurrencies: 'Taxas de câmbio',
      navRealEstate: 'Imobiliário',
      navDiscover: 'Novas secções',
    },
    footer: {
      rightsReserved: 'Todos os direitos reservados.',
      lastUpdatedLabel: 'Última atualização',
    },
    home: {
      heroSubtitle: 'O seu centro de confiança para dados financeiros da UE',
      heroDescription:
        'Uma plataforma pan-europeia que agrega dados financeiros de 27 países da União Europeia. Compare ofertas de crédito, acompanhe as taxas de câmbio e analise preços imobiliários — tudo num só lugar.',
      currentCountryLabel: 'País atual',
      modulesTitle: 'Módulos da plataforma',
      modules: {
        statusAvailable: 'Disponível',
        banksTitle: 'Ofertas de crédito',
        banksDescription: 'Comparação de créditos habitação, consumo e empresas de bancos em 27 países da UE.',
        banksAction: 'Comparar ofertas',
        currenciesTitle: 'Taxas de câmbio',
        currenciesDescription: 'Taxas de câmbio europeias atualizadas 4 vezes por dia.',
        currenciesAction: 'Ver taxas',
        realEstateTitle: 'Preços do imobiliário',
        realEstateDescription: 'Apartamentos, casas e terrenos de 27 países da UE visualizados no Google Maps.',
        realEstateAction: 'Explorar imóveis',
      },
      features: {
        languages: '24 línguas da UE',
        countries: '27 países',
        cadence: 'Atualização 4×/dia',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Dados de fontes oficiais',
      },
      info: {
        complianceTitle: 'Conformidade regulamentar',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 e AI Act — o desenvolvimento do produto está planeado para garantir total conformidade com a regulamentação da UE.',
        sourcesTitle: 'Fontes de dados fiáveis',
        sourcesDescription: 'Os dados provêm de bancos centrais, da EBA, da ESMA, da EUR-Lex e do BCE.',
        aiTitle: 'Desenvolvido com IA',
        aiDescription: 'Projeto desenvolvido por uma equipa de agentes de IA e por engenharia apoiada por automação.',
      },
      exploreTitle: 'Novas secções e ferramentas de pesquisa',
      exploreDescription:
        'Adicionámos 6 novas secções para ajudar a encontrar mais rapidamente a melhor direção de investimento, o país certo e o melhor cenário de ação.',
    },
    discover: {
      badge: 'Novo',
      title: 'Centro das novas secções do UnionVault',
      description:
        'Explore calculadoras, alertas, rankings, comparadores, guias jurídicos e a zona do investidor. Cada secção tem o seu próprio mini motor de pesquisa e um conjunto de cenários prontos a usar.',
      searchLabel: 'Pesquisar no separador ativo',
      stats: {
        tools: '18 cenários e ferramentas',
        countries: '27 países da UE',
        datasets: 'Dados partilhados para bancos, moedas e imobiliário',
      },
      tabs: {
        calculators: {
          label: 'Calculadoras',
          title: 'Calculadoras para decisões financeiras',
          description:
            'Ferramentas rápidas para calcular prestações, custos de compra e rentabilidade do investimento em diferentes países.',
          searchPlaceholder: 'Pesquisar calculadora, por ex. prestação, ROI, custo de compra',
          emptyTitle: 'Não existem calculadoras para esta pesquisa',
          emptyDescription: 'Experimente uma expressão mais curta ou mude de separador.',
          cards: [
            {
              title: 'Calculadora de prestação do crédito',
              description: 'Compara a prestação em função do país, da entrada inicial e da taxa de juro.',
              metric: 'Cenários de 10, 20 e 30 anos',
              actionLabel: 'Ir para bancos',
            },
            {
              title: 'Calculadora do custo de compra de imóvel',
              description: 'Estima notário, impostos, taxas locais e custo de entrada para o país selecionado.',
              metric: 'Inclui custos de transação',
              actionLabel: 'Ir para imobiliário',
            },
            {
              title: 'Calculadora cambial',
              description:
                'Calcula conversão cambial, spread e variação do custo da prestação em diferentes cenários de taxa de câmbio.',
              metric: 'Várias fontes de taxas',
              actionLabel: 'Ir para moedas',
            },
          ],
        },
        alerts: {
          label: 'Alertas',
          title: 'Alertas e notificações automáticas',
          description:
            'Cenários para utilizadores que querem reagir a mudanças na taxa de câmbio, em ofertas bancárias ou em preços de imóveis.',
          searchPlaceholder: 'Pesquisar alerta, por ex. taxa, preço, oferta',
          emptyTitle: 'Não existem alertas que correspondam ao filtro',
          emptyDescription: 'Remova parte das palavras-chave e tente novamente.',
          cards: [
            {
              title: 'Alerta de taxa de câmbio',
              description: 'Envia um sinal quando a taxa do par selecionado atinge o limite definido.',
              metric: 'Limites superior e inferior',
              actionLabel: 'Ir para moedas',
            },
            {
              title: 'Alerta de nova oferta de crédito',
              description: 'Deteta ofertas novas ou melhoradas no país e segmento de crédito selecionados.',
              metric: 'Filtros por país e produto',
              actionLabel: 'Ir para bancos',
            },
            {
              title: 'Alerta de descida do preço do imóvel',
              description: 'Monitoriza anúncios e indica quando surge uma oportunidade de investimento.',
              metric: 'Sinais para cidades selecionadas',
              actionLabel: 'Ir para imobiliário',
            },
          ],
        },
        rankings: {
          label: 'Rankings',
          title: 'Rankings de países e cidades',
          description: 'Ordene os países pela acessibilidade ao crédito, potencial de investimento e custo de vida.',
          searchPlaceholder: 'Pesquisar ranking, por ex. país, cidade, investimento',
          emptyTitle: 'Não existem rankings para esta pesquisa',
          emptyDescription: 'Volte à vista geral para ver a classificação completa.',
          cards: [
            {
              title: 'Ranking de acessibilidade ao crédito',
              description: 'Combina TAEG, entrada exigida e tempo de decisão num único índice claro por país.',
              metric: 'Pontuação por país',
              actionLabel: 'Ir para bancos',
            },
            {
              title: 'Ranking de cidades para investimento',
              description: 'Compara procura, preço de entrada e potencial de retorno do arrendamento.',
              metric: 'Melhores localizações da UE',
              actionLabel: 'Ir para imobiliário',
            },
            {
              title: 'Ranking de estabilidade cambial',
              description: 'Mostra onde o spread e a volatilidade cambial são mais baixos para o investidor.',
              metric: 'Indicador de volatilidade 30D',
              actionLabel: 'Ir para moedas',
            },
          ],
        },
        comparators: {
          label: 'Comparadores',
          title: 'Comparadores de cenários',
          description: 'Compare país com país, banco com banco ou cidade com cidade sem copiar dados manualmente.',
          searchPlaceholder: 'Pesquisar comparador, por ex. banco vs banco, país vs país',
          emptyTitle: 'Não existem comparações para esta expressão',
          emptyDescription: 'Altere a pesquisa ou escolha outro separador.',
          cards: [
            {
              title: 'País vs país',
              description: 'Compara custos de entrada, crédito e taxas de câmbio para dois países selecionados.',
              metric: 'Vista lado a lado',
              actionLabel: 'Ir para a página inicial',
            },
            {
              title: 'Banco vs banco',
              description: 'Mostra as diferenças em TAEG, prestações e requisitos formais.',
              metric: 'Principais KPI numa única vista',
              actionLabel: 'Ir para bancos',
            },
            {
              title: 'Cidade vs cidade',
              description: 'Compara preços imobiliários, rentabilidade e ritmo de evolução dos preços.',
              metric: 'Análise dos mercados locais',
              actionLabel: 'Ir para imobiliário',
            },
          ],
        },
        lawsTaxes: {
          label: 'Leis e impostos',
          title: 'Guia de leis e impostos',
          description:
            'Checklists práticos para a compra de imóveis, créditos e obrigações locais em diferentes países.',
          searchPlaceholder: 'Pesquisar lei ou imposto, por ex. imposto, notário, registo',
          emptyTitle: 'Não encontrámos o guia',
          emptyDescription: 'Verifique outro nome de imposto ou obrigação.',
          cards: [
            {
              title: 'Custos de entrada e impostos',
              description: 'Explica impostos de compra, despesas notariais e custos de registo.',
              metric: 'Checklists por país de destino',
              actionLabel: 'Ir para contacto',
            },
            {
              title: 'Obrigações do proprietário',
              description: 'Resume comunicações, registo, arrendamento e principais requisitos formais.',
              metric: 'Versão para residentes e não residentes',
              actionLabel: 'Ir para imobiliário',
            },
            {
              title: 'Formalidades do crédito',
              description: 'Explica documentos, scoring e requisitos locais dos bancos.',
              metric: 'Mapa de documentos',
              actionLabel: 'Ir para bancos',
            },
          ],
        },
        investorZone: {
          label: 'Zona do investidor',
          title: 'Zona do investidor',
          description: 'Conjunto de ideias prontas para analisar ROI, risco do país e liquidez do investimento.',
          searchPlaceholder: 'Pesquisar tema de investimento, por ex. ROI, yield, risco',
          emptyTitle: 'Não existem cenários de investimento',
          emptyDescription: 'Alargue a pesquisa ou escolha outra área de dados.',
          cards: [
            {
              title: 'Mapa de ROI',
              description: 'Estima a taxa de retorno potencial para diferentes mercados e tipos de imóvel.',
              metric: 'ROI e yield no mesmo cartão',
              actionLabel: 'Ir para imobiliário',
            },
            {
              title: 'Avaliação do risco do país',
              description: 'Combina volatilidade cambial, custos de financiamento e enquadramento regulatório.',
              metric: 'Pontuação de risco do investidor',
              actionLabel: 'Ir para moedas',
            },
            {
              title: 'Cenários de entrada de capital',
              description: 'Ajuda a escolher entre dinheiro próprio, crédito e estratégia mista.',
              metric: '3 modelos de financiamento',
              actionLabel: 'Ir para bancos',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Erro 404',
      notFoundTitle: 'Não encontrámos esta página',
      notFoundDescription:
        'O endereço pode estar desatualizado ou ter sido introduzido com erro. Volte à página inicial ou aceda diretamente aos módulos mais importantes da plataforma.',
      serverErrorBadge: 'Erro 500',
      serverErrorTitle: 'Ocorreu um problema do nosso lado',
      serverErrorDescription:
        'Não foi possível preparar corretamente esta vista. Tente novamente dentro de instantes ou contacte-nos se o problema persistir.',
      homeAction: 'Voltar à página inicial',
      contactAction: 'Ir para contacto',
      banksAction: 'Ver ofertas de crédito',
      currenciesAction: 'Ver taxas de câmbio',
    },
    legal: {
      disclaimerTitle: 'Informação legal',
      currencyInformationalDisclaimer:
        'As taxas de câmbio para o mercado {country} têm caráter meramente informativo. A vista predefinida mostra a média de várias fontes gratuitas.',
      countryNoticePending:
        'As ressalvas regulamentares detalhadas para este país estão a ser publicadas por fases e serão concluídas antes do lançamento completo em produção.',
    },
  },
  'ready',
);
