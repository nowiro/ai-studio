import { defineTranslationResource } from '../i18n.types';

export default defineTranslationResource(
  'es',
  {
    languageSwitcher: {
      ariaLabel: 'Elegir idioma',
      menuTitle: 'Elegir idioma (24 idiomas de la UE)',
      selectedTooltip: 'Idioma seleccionado: {language}',
    },
    header: {
      brandAriaLabel: 'UnionVault.eu — página de inicio',
      navigationAriaLabel: 'Navegación principal',
      mobileMenuAriaLabel: 'Abrir menú de navegación',
      mobileCountryLabel: 'País actual',
      navContact: 'Contacto',
      navBanks: 'Ofertas de crédito',
      navCurrencies: 'Tipos de cambio',
      navRealEstate: 'Inmuebles',
      navDiscover: 'Nuevas secciones',
    },
    footer: {
      rightsReserved: 'Todos los derechos reservados.',
      lastUpdatedLabel: 'Última actualización',
    },
    home: {
      heroSubtitle: 'Tu centro de confianza para los datos financieros de la UE',
      heroDescription:
        'Una plataforma paneuropea que agrega datos financieros de 27 países de la Unión Europea. Compara ofertas de crédito, sigue los tipos de cambio y analiza precios inmobiliarios, todo en un solo lugar.',
      currentCountryLabel: 'País actual',
      modulesTitle: 'Módulos de la plataforma',
      modules: {
        statusAvailable: 'Disponible',
        banksTitle: 'Ofertas de crédito',
        banksDescription:
          'Comparación de hipotecas y préstamos al consumo y para empresas de bancos de 27 países de la UE.',
        banksAction: 'Comparar ofertas',
        currenciesTitle: 'Tipos de cambio',
        currenciesDescription: 'Tipos de cambio europeos actualizados 4 veces al día.',
        currenciesAction: 'Ver tipos',
        realEstateTitle: 'Precios inmobiliarios',
        realEstateDescription: 'Pisos, casas y terrenos de 27 países de la UE visualizados en Google Maps.',
        realEstateAction: 'Explorar inmuebles',
      },
      features: {
        languages: '24 idiomas de la UE',
        countries: '27 países',
        cadence: 'Actualización 4× al día',
        compliance: 'GDPR / PSD2 / MiFID II',
        maps: 'Google Maps',
        sources: 'Datos de fuentes oficiales',
      },
      info: {
        complianceTitle: 'Cumplimiento normativo',
        complianceDescription:
          'GDPR, PSD2, MiFID II, DAC7 y AI Act: el desarrollo del producto está planificado para cumplir plenamente la normativa de la UE.',
        sourcesTitle: 'Fuentes de datos de confianza',
        sourcesDescription: 'Los datos proceden de bancos centrales, la EBA, la ESMA, EUR-Lex y el BCE.',
        aiTitle: 'Desarrollado con IA',
        aiDescription:
          'El proyecto se desarrolla mediante un equipo de agentes de IA y una ingeniería apoyada por automatización.',
      },
      exploreTitle: 'Nuevas secciones y buscadores',
      exploreDescription:
        'Hemos añadido 6 nuevas secciones que ayudan a encontrar más rápido la dirección de inversión, el país y el mejor escenario de actuación.',
    },
    discover: {
      badge: 'Novedad',
      title: 'Centro de nuevas secciones de UnionVault',
      description:
        'Explora calculadoras, alertas, rankings, comparadores, guías legales y la zona del inversor. Cada sección incluye su propio mini buscador y un conjunto de escenarios listos para usar.',
      searchLabel: 'Buscar en la pestaña activa',
      stats: {
        tools: '18 escenarios y herramientas',
        countries: '27 países de la UE',
        datasets: 'Datos compartidos para banca, divisas e inmuebles',
      },
      tabs: {
        calculators: {
          label: 'Calculadoras',
          title: 'Calculadoras para decisiones financieras',
          description:
            'Herramientas rápidas para calcular cuotas, costes de compra y rentabilidad de inversión en distintos países.',
          searchPlaceholder: 'Buscar calculadora, p. ej. cuota, ROI, coste de compra',
          emptyTitle: 'No hay calculadoras para esta búsqueda',
          emptyDescription: 'Prueba con una expresión más corta o cambia de pestaña.',
          cards: [
            {
              title: 'Calculadora de cuota de préstamo',
              description: 'Compara la cuota según el país, la aportación inicial y el tipo de interés.',
              metric: 'Escenarios de 10, 20 y 30 años',
              actionLabel: 'Ir a bancos',
            },
            {
              title: 'Calculadora del coste de compra de un inmueble',
              description: 'Estima notaría, impuestos, tasas locales y coste de entrada para el país seleccionado.',
              metric: 'Incluye costes de transacción',
              actionLabel: 'Ir a inmuebles',
            },
            {
              title: 'Calculadora de divisas',
              description:
                'Calcula conversión, diferencial y variación del coste de la cuota con distintos tipos de cambio.',
              metric: 'Múltiples fuentes de cotización',
              actionLabel: 'Ir a divisas',
            },
          ],
        },
        alerts: {
          label: 'Alertas',
          title: 'Alertas y notificaciones automáticas',
          description:
            'Escenarios para usuarios que quieren reaccionar a cambios en el tipo de cambio, una oferta bancaria o el precio de un inmueble.',
          searchPlaceholder: 'Buscar alerta, p. ej. cambio, precio, oferta',
          emptyTitle: 'No hay alertas que coincidan con el filtro',
          emptyDescription: 'Elimina parte de las palabras clave y vuelve a intentarlo.',
          cards: [
            {
              title: 'Alerta de tipo de cambio',
              description: 'Envía una señal cuando el par seleccionado alcance el umbral indicado.',
              metric: 'Umbrales superior e inferior',
              actionLabel: 'Ir a divisas',
            },
            {
              title: 'Alerta de nueva oferta de crédito',
              description: 'Detecta ofertas nuevas o mejoradas en el país y segmento de crédito seleccionados.',
              metric: 'Filtros por país y producto',
              actionLabel: 'Ir a bancos',
            },
            {
              title: 'Alerta de bajada del precio de un inmueble',
              description: 'Monitoriza anuncios y avisa cuando aparece una oportunidad de inversión.',
              metric: 'Señales para ciudades seleccionadas',
              actionLabel: 'Ir a inmuebles',
            },
          ],
        },
        rankings: {
          label: 'Rankings',
          title: 'Rankings de países y ciudades',
          description:
            'Ordena los países según la accesibilidad del crédito, el potencial de inversión y el coste de vida.',
          searchPlaceholder: 'Buscar ranking, p. ej. país, ciudad, inversión',
          emptyTitle: 'No hay rankings para esta búsqueda',
          emptyDescription: 'Vuelve a la vista general para ver la clasificación completa.',
          cards: [
            {
              title: 'Ranking de accesibilidad al crédito',
              description:
                'Combina TAE, aportación inicial requerida y tiempo de decisión en una puntuación clara por país.',
              metric: 'Puntuación por país',
              actionLabel: 'Ir a bancos',
            },
            {
              title: 'Ranking de ciudades para invertir',
              description: 'Compara demanda, precio de entrada y rentabilidad potencial del alquiler.',
              metric: 'Principales ubicaciones de la UE',
              actionLabel: 'Ir a inmuebles',
            },
            {
              title: 'Ranking de estabilidad cambiaria',
              description: 'Muestra dónde el diferencial y la volatilidad son más bajos para el inversor.',
              metric: 'Indicador de volatilidad a 30 días',
              actionLabel: 'Ir a divisas',
            },
          ],
        },
        comparators: {
          label: 'Comparadores',
          title: 'Comparadores de escenarios',
          description: 'Compara país con país, banco con banco o ciudad con ciudad sin copiar datos manualmente.',
          searchPlaceholder: 'Buscar comparador, p. ej. banco vs banco, país vs país',
          emptyTitle: 'No hay comparaciones para esta búsqueda',
          emptyDescription: 'Cambia la consulta o elige otra pestaña.',
          cards: [
            {
              title: 'País vs país',
              description: 'Compara costes de entrada, crédito y tipo de cambio para dos países seleccionados.',
              metric: 'Vista lado a lado',
              actionLabel: 'Ir a la página principal',
            },
            {
              title: 'Banco vs banco',
              description: 'Muestra las diferencias en TAE, cuotas y requisitos formales.',
              metric: 'KPI clave en una sola vista',
              actionLabel: 'Ir a bancos',
            },
            {
              title: 'Ciudad vs ciudad',
              description: 'Compara precios inmobiliarios, rentabilidad y ritmo de variación de precios.',
              metric: 'Análisis de mercados locales',
              actionLabel: 'Ir a inmuebles',
            },
          ],
        },
        lawsTaxes: {
          label: 'Normativa e impuestos',
          title: 'Guía de normativa e impuestos',
          description:
            'Listas prácticas para la compra de inmuebles, créditos y obligaciones locales en distintos países.',
          searchPlaceholder: 'Buscar norma o impuesto, p. ej. ITP, notario, empadronamiento',
          emptyTitle: 'No hemos encontrado ninguna guía',
          emptyDescription: 'Prueba con otro nombre del impuesto o de la obligación.',
          cards: [
            {
              title: 'Costes de entrada e impuestos',
              description: 'Describe los impuestos de compra, los gastos notariales y los costes de registro.',
              metric: 'Checklists por país de destino',
              actionLabel: 'Ir a contacto',
            },
            {
              title: 'Obligaciones del propietario',
              description: 'Resume declaraciones, empadronamiento, alquiler y requisitos formales básicos.',
              metric: 'Versión para residentes y no residentes',
              actionLabel: 'Ir a inmuebles',
            },
            {
              title: 'Trámites del crédito',
              description: 'Explica la documentación, la evaluación y los requisitos locales de los bancos.',
              metric: 'Mapa documental',
              actionLabel: 'Ir a bancos',
            },
          ],
        },
        investorZone: {
          label: 'Zona del inversor',
          title: 'Zona del inversor',
          description: 'Conjunto de ideas listas para analizar ROI, riesgo país y liquidez de la inversión.',
          searchPlaceholder: 'Buscar tema de inversión, p. ej. ROI, yield, riesgo',
          emptyTitle: 'No hay escenarios de inversión',
          emptyDescription: 'Amplía la búsqueda o selecciona otra área de datos.',
          cards: [
            {
              title: 'Mapa de ROI',
              description: 'Estima la rentabilidad potencial para distintos mercados y tipos de inmueble.',
              metric: 'ROI y yield en una sola tarjeta',
              actionLabel: 'Ir a inmuebles',
            },
            {
              title: 'Evaluación del riesgo país',
              description: 'Combina volatilidad cambiaria, costes de financiación y entorno regulatorio.',
              metric: 'Puntuación de riesgo para el inversor',
              actionLabel: 'Ir a divisas',
            },
            {
              title: 'Escenarios de entrada de capital',
              description: 'Ayuda a elegir entre efectivo, crédito y una estrategia mixta.',
              metric: '3 modelos de financiación',
              actionLabel: 'Ir a bancos',
            },
          ],
        },
      },
    },
    errors: {
      notFoundBadge: 'Error 404',
      notFoundTitle: 'No hemos encontrado esta página',
      notFoundDescription:
        'La dirección puede estar desactualizada o contener un error. Vuelve a la página principal o entra en los módulos más importantes de la plataforma.',
      serverErrorBadge: 'Error 500',
      serverErrorTitle: 'Ha surgido un problema por nuestra parte',
      serverErrorDescription:
        'No se ha podido preparar la vista correctamente. Inténtalo de nuevo dentro de un momento o ponte en contacto con nosotros si el problema persiste.',
      homeAction: 'Volver a la página principal',
      contactAction: 'Ir a contacto',
      banksAction: 'Ver ofertas de crédito',
      currenciesAction: 'Consultar tipos de cambio',
    },
    legal: {
      disclaimerTitle: 'Aviso legal',
      currencyInformationalDisclaimer:
        'Los tipos de cambio para el mercado de {country} son solo informativos. La vista predeterminada muestra una media de varias fuentes gratuitas.',
      countryNoticePending:
        'Las advertencias regulatorias detalladas para este país se publican por fases y se completarán antes del lanzamiento total en producción.',
    },
  },
  'ready',
);
