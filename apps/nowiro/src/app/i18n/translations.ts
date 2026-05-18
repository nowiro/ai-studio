export type Lang = 'pl' | 'en';

export interface AppTranslations {
  header: {
    about: string;
    services: string;
    experience: string;
    contact: string;
  };
  hero: {
    tag: string;
    titleLine1: string;
    titlePre: string;
    titleHighlight: string;
    titlePost: string;
    description: string;
    ctaContact: string;
    ctaServices: string;
  };
  about: {
    sectionTitle: string;
    sectionSubtitle: string;
    p1: string;
    p2: string;
    p3: string;
    stats: { value: string; label: string; icon: string }[];
  };
  services: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  experience: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: {
      period: string;
      service: string;
      sector: string;
      description: string;
      technologies: string[];
    }[];
  };
  contact: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: { icon: string; label: string; value: string; href: string }[];
    companyCardTitle: string;
    labels: {
      company: string;
      nip: string;
      regon: string;
      address: string;
      province: string;
      activeSince: string;
      activeSinceSuffix: string;
      voivodeship: string;
    };
  };
  footer: {
    tagline: string;
    legal: string;
  };
}

export const translations: Record<Lang, AppTranslations> = {
  pl: {
    header: {
      about: 'O nas',
      services: 'Usługi',
      experience: 'Doświadczenie',
      contact: 'Kontakt',
    },
    hero: {
      tag: 'Konsulting IT & Inżynieria Oprogramowania · Wrocław',
      titleLine1: 'Doradztwo IT,',
      titlePre: 'które',
      titleHighlight: 'działa',
      titlePost: '.',
      description:
        'Od 2010 roku pomagamy firmom podejmować lepsze decyzje technologiczne. Konsulting IT, audyt architektury, full-stack development.',
      ctaContact: 'Skontaktuj się',
      ctaServices: 'Zobacz usługi',
    },
    about: {
      sectionTitle: 'O firmie',
      sectionSubtitle: 'Konsulting IT i inżynieria oprogramowania to nasza specjalizacja od ponad dekady.',
      p1: '<strong>NOWIRO</strong> to firma założona w 2010 roku — specjalizujemy się w doradztwie technologicznym, audycie architektury oraz tworzeniu nowoczesnych aplikacji webowych, mobilnych i systemów enterprise.',
      p2: 'Współpracowaliśmy z klientami z <strong>sektora bankowego</strong>, <strong>branży farmaceutycznej</strong>, e-commerce i technologii. Doradzamy w zakresie architektury systemów, modernizacji legacy i wdrażania najlepszych praktyk inżynieryjnych.',
      p3: 'Posiadamy bogate doświadczenie w <strong>migracjach systemów</strong> i ich długoterminowym utrzymaniu. Od 2 lat aktywnie wykorzystujemy <strong>AI</strong> w codziennej pracy — od wspomagania code review, przez generowanie kodu, po automatyzację procesów.',
      stats: [
        { value: '15+', label: 'lat doświadczenia', icon: 'calendar_today' },
        {
          value: '50+',
          label: 'zrealizowanych projektów',
          icon: 'rocket_launch',
        },
        { value: '20+', label: 'technologii', icon: 'code' },
        { value: '100%', label: 'zaangażowania', icon: 'favorite' },
      ],
    },
    services: {
      sectionTitle: 'Usługi',
      sectionSubtitle: 'Kompleksowe rozwiązania IT dopasowane do Twoich potrzeb.',
      items: [
        {
          icon: 'groups',
          title: 'Konsulting IT',
          description:
            'Audyt kodu, przegląd architektury, mentoring zespołów. Doświadczenie w sektorze bankowym i farmaceutycznym. Doradztwo technologiczne i transformacja cyfrowa.',
        },
        {
          icon: 'web',
          title: 'Aplikacje webowe',
          description:
            'Nowoczesne SPA i PWA w Angular, React. Responsywne, wydajne, dostępne. Od prototypu do wdrożenia produkcyjnego.',
        },
        {
          icon: 'phone_iphone',
          title: 'Aplikacje mobilne',
          description: 'Cross-platform z Ionic/Capacitor lub natywne rozwiązania. Gry mobilne na silniku Phaser.js.',
        },
        {
          icon: 'cloud',
          title: 'Systemy enterprise & cloud',
          description:
            'Mikroserwisy, REST API, integracje. Migracje systemów, utrzymanie i modernizacja platform legacy. Java, .NET, Node.js.',
        },
        {
          icon: 'storage',
          title: 'Bazy danych & backend',
          description: 'Projektowanie schematów, optymalizacja zapytań. SQL Server, PostgreSQL, MongoDB, Oracle.',
        },
        {
          icon: 'integration_instructions',
          title: 'DevOps & CI/CD',
          description: 'Automatyzacja wdrożeń, pipelines CI/CD, Docker, Kubernetes. Monitoring i observability.',
        },
        {
          icon: 'smart_toy',
          title: 'AI w praktyce',
          description:
            'Wspomaganie procesu wytwarzania oprogramowania z użyciem AI. Code review, generowanie kodu, automatyzacja zadań, integracja narzędzi AI z workflow zespołu.',
        },
      ],
    },
    experience: {
      sectionTitle: 'Doświadczenie',
      sectionSubtitle: 'Ponad 15 lat w branży IT — konsulting dla sektora bankowego i farmaceutycznego.',
      items: [
        {
          period: '2022 – obecnie',
          service: 'Konsulting IT & Development',
          sector: 'Sektor bankowy',
          description:
            'Dostarczanie usług konsultingowych i rozwój aplikacji bankowych nowej generacji. Doradztwo architektoniczne, mikrofrontendy, modernizacja systemów legacy.',
          technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Nx', 'Material', 'CI/CD', 'AI'],
        },
        {
          period: '2017 – 2021',
          service: 'Full-Stack Development & Wdrażanie CI/CD',
          sector: 'Sektor bankowy & finansowy',
          description:
            'Współpraca z instytucjami bankowymi i finansowymi w Polsce. Budowa aplikacji SharePoint, wdrożenie procesów CI/CD, koordynacja wytwarzania oprogramowania, rozwój front-endu.',
          technologies: ['Angular', 'SharePoint', '.NET', 'CI/CD', 'TypeScript', 'Azure'],
        },
        {
          period: '2013 – 2017',
          service: 'Rozwój Front-End & Zarządzanie zespołem',
          sector: 'Branża farmaceutyczna',
          description:
            'Wieloletnia współpraca z globalnym liderem branży farmaceutycznej. Prowadzenie zespołu front-endowego, rozwój systemów klinicznych i regulacyjnych, modernizacja platform enterprise.',
          technologies: ['Angular', 'JavaScript', 'TypeScript', '.NET', 'SQL Server', 'HTML/CSS'],
        },
        {
          period: '2010 – 2013',
          service: 'Założenie firmy & E-commerce',
          sector: 'NOWIRO',
          description:
            'Powstanie NOWIRO. Projektowanie i dostarczanie rozwiązań e-commerce — sklepy internetowe, systemy bazodanowe, strony www.',
          technologies: ['C#', 'JavaScript', 'PHP', 'MySQL', 'HTML/CSS'],
        },
      ],
    },
    contact: {
      sectionTitle: 'Kontakt',
      sectionSubtitle: 'Porozmawiajmy o Twoim projekcie.',
      items: [
        {
          icon: 'email',
          label: 'E-mail',
          value: 'kontakt@nowiro.eu',
          href: 'mailto:kontakt@nowiro.eu',
        },
        {
          icon: 'language',
          label: 'WWW',
          value: 'nowiro.eu',
          href: 'https://nowiro.eu',
        },
        {
          icon: 'place',
          label: 'Lokalizacja',
          value: 'Wrocław, Polska',
          href: '',
        },
      ],
      companyCardTitle: 'Dane firmy',
      labels: {
        company: 'Firma',
        nip: 'NIP',
        regon: 'REGON',
        address: 'Adres',
        province: 'Województwo',
        activeSince: 'Działalność od',
        activeSinceSuffix: ' roku',
        voivodeship: 'dolnośląskie',
      },
    },
    footer: {
      tagline: 'Konsulting IT · Wrocław',
      legal: 'NOWIRO. Wszelkie prawa zastrzeżone.',
    },
  },

  en: {
    header: {
      about: 'About',
      services: 'Services',
      experience: 'Experience',
      contact: 'Contact',
    },
    hero: {
      tag: 'IT Consulting & Software Engineering · Wrocław',
      titleLine1: 'IT Consulting,',
      titlePre: 'that',
      titleHighlight: 'works',
      titlePost: '.',
      description:
        'Since 2010, we help companies make better technology decisions. IT consulting, architecture audits, full-stack development.',
      ctaContact: 'Get in touch',
      ctaServices: 'Our services',
    },
    about: {
      sectionTitle: 'About us',
      sectionSubtitle: 'IT consulting and software engineering have been our speciality for over a decade.',
      p1: '<strong>NOWIRO</strong> is a company founded in 2010 — we specialise in technology advisory, architecture audits and building modern web applications, mobile apps and enterprise systems.',
      p2: 'We have worked with clients from the <strong>banking sector</strong>, <strong>pharmaceutical industry</strong>, e-commerce and technology. We advise on system architecture, legacy modernisation and engineering best practices.',
      p3: 'We have extensive experience in <strong>system migrations</strong> and long-term maintenance. For the past 2 years we have actively used <strong>AI</strong> in our daily work — from supporting code reviews and generating code to automating processes.',
      stats: [
        { value: '15+', label: 'years of experience', icon: 'calendar_today' },
        { value: '50+', label: 'completed projects', icon: 'rocket_launch' },
        { value: '20+', label: 'technologies', icon: 'code' },
        { value: '100%', label: 'commitment', icon: 'favorite' },
      ],
    },
    services: {
      sectionTitle: 'Services',
      sectionSubtitle: 'Comprehensive IT solutions tailored to your needs.',
      items: [
        {
          icon: 'groups',
          title: 'IT Consulting',
          description:
            'Code audits, architecture reviews, team mentoring. Experience in the banking and pharmaceutical sectors. Technology advisory and digital transformation.',
        },
        {
          icon: 'web',
          title: 'Web applications',
          description:
            'Modern SPA and PWA in Angular, React. Responsive, performant, accessible. From prototype to production deployment.',
        },
        {
          icon: 'phone_iphone',
          title: 'Mobile applications',
          description: 'Cross-platform with Ionic/Capacitor or native solutions. Mobile games on the Phaser.js engine.',
        },
        {
          icon: 'cloud',
          title: 'Enterprise & cloud systems',
          description:
            'Microservices, REST APIs, integrations. System migrations, maintenance and modernisation of legacy platforms. Java, .NET, Node.js.',
        },
        {
          icon: 'storage',
          title: 'Databases & backend',
          description: 'Schema design, query optimisation. SQL Server, PostgreSQL, MongoDB, Oracle.',
        },
        {
          icon: 'integration_instructions',
          title: 'DevOps & CI/CD',
          description: 'Deployment automation, CI/CD pipelines, Docker, Kubernetes. Monitoring and observability.',
        },
        {
          icon: 'smart_toy',
          title: 'AI in practice',
          description:
            'Supporting software development with AI. Code reviews, code generation, task automation, integrating AI tools into team workflow.',
        },
      ],
    },
    experience: {
      sectionTitle: 'Experience',
      sectionSubtitle: 'Over 15 years in IT — consulting for the banking and pharmaceutical sectors.',
      items: [
        {
          period: '2022 – present',
          service: 'IT Consulting & Development',
          sector: 'Banking sector',
          description:
            'Providing consulting services and development of next-generation banking applications. Architecture advisory, micro-frontends, legacy system modernisation.',
          technologies: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Nx', 'Material', 'CI/CD', 'AI'],
        },
        {
          period: '2017 – 2021',
          service: 'Full-Stack Development & CI/CD Implementation',
          sector: 'Banking & financial sector',
          description:
            'Collaboration with banking and financial institutions in Poland. Building SharePoint applications, implementing CI/CD processes, coordinating software development, front-end engineering.',
          technologies: ['Angular', 'SharePoint', '.NET', 'CI/CD', 'TypeScript', 'Azure'],
        },
        {
          period: '2013 – 2017',
          service: 'Front-End Development & Team Management',
          sector: 'Pharmaceutical industry',
          description:
            'Long-term collaboration with a global leader in the pharmaceutical industry. Leading the front-end team, development of clinical and regulatory systems, enterprise platform modernisation.',
          technologies: ['Angular', 'JavaScript', 'TypeScript', '.NET', 'SQL Server', 'HTML/CSS'],
        },
        {
          period: '2010 – 2013',
          service: 'Company founded & E-commerce',
          sector: 'NOWIRO',
          description:
            'NOWIRO was established. Designing and delivering e-commerce solutions — online stores, database systems, websites.',
          technologies: ['C#', 'JavaScript', 'PHP', 'MySQL', 'HTML/CSS'],
        },
      ],
    },
    contact: {
      sectionTitle: 'Contact',
      sectionSubtitle: "Let's talk about your project.",
      items: [
        {
          icon: 'email',
          label: 'E-mail',
          value: 'kontakt@nowiro.eu',
          href: 'mailto:kontakt@nowiro.eu',
        },
        {
          icon: 'language',
          label: 'Website',
          value: 'nowiro.eu',
          href: 'https://nowiro.eu',
        },
        {
          icon: 'place',
          label: 'Location',
          value: 'Wrocław, Poland',
          href: '',
        },
      ],
      companyCardTitle: 'Company details',
      labels: {
        company: 'Company',
        nip: 'Tax ID (NIP)',
        regon: 'REGON',
        address: 'Address',
        province: 'Province',
        activeSince: 'Active since',
        activeSinceSuffix: '',
        voivodeship: 'Lower Silesian',
      },
    },
    footer: {
      tagline: 'IT Consulting · Wrocław',
      legal: 'NOWIRO. All rights reserved.',
    },
  },
};
