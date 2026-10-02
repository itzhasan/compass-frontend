import type { Locale } from "@/lib/api/types";

/**
 * Static content for the Al-Bawsala (Compass) landing page — a faithful replica
 * of the reference one-pager (al-bawsala-compass-guide.lovable.app). Kept as a
 * typed, locale-keyed module rather than i18n JSON because the page is made of
 * structured arrays (strategy points, services, sectors, team, clients …) that
 * read far more cleanly here than as deeply-nested message keys.
 */

export interface Stat {
  value: string;
  label: string;
}

export interface LandingContent {
  hero: {
    badge: string;
    titleLines: string[];
    highlightFirst: boolean;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    stats: Stat[];
  };
  about: { label: string; index: string; title: string; body: string };
  mission: { label: string; index: string; title: string; body: string };
  strategy: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    centerTitle: string;
    centerSub: string;
    points: { num: string; title: string; tagline: string; body: string }[];
  };
  services: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    items: { title: string; tagline: string; points: string[] }[];
  };
  sectors: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    items: string[];
  };
  team: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    items: { num: string; title: string; body: string }[];
  };
  clients: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    badge: string;
    stats: Stat[];
    clientsLabel: string;
    clients: string[];
    partnersLabel: string;
    partners: string[];
  };
  founders: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    items: { name: string; role: string; body: string }[];
  };
  partnership: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    items: { num: string; title: string; value: string; body: string }[];
    cta: string;
  };
  contact: {
    label: string;
    index: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      sent: string;
    };
    whatsapp: string;
    phones: string[];
    email: string;
    website: string;
    tagline: string;
    copyright: string;
  };
}

const ar: LandingContent = {
  hero: {
    badge: "استشارات أعمال في العراق",
    titleLines: ["«البوصلة» ترشد الشركات", "من التأسيس إلى النمو المستدام", "في السوق العراقية"],
    highlightFirst: true,
    subtitle:
      "نرسم مع القيادات اتجاهًا واضحًا للأعمال: تشخيص دقيق للواقع، وبناء أنظمة تجارية وهياكل مؤسسية قابلة للقياس، ثم مرافقة التنفيذ حتى تتحول الخطة إلى نتائج ملموسة.",
    primaryCta: "احجز استشارة",
    secondaryCta: "تعرّف على خدماتنا",
    stats: [
      { value: "35+", label: "مستشارًا متخصصًا" },
      { value: "1500+", label: "ساعة استشارية" },
      { value: "10+", label: "قطاعات نخدمها" },
    ],
  },
  about: {
    label: "ABOUT",
    index: "01",
    title: "من نحن",
    body: "«البوصلة» شركة عراقية للاستشارات الإدارية والتجارية مقرّها بغداد، تأسست لتكون مرجعًا موثوقًا لشركات القطاع الخاص المحلية والشركات الدولية العاملة في العراق. نجمع بين معرفة عميقة بالسياق العراقي ومنهجيات إدارية عالمية مُختبَرة. يضم فريقنا أكثر من خمسة وثلاثين مستشارًا في التخطيط والتطوير المؤسسي والمالية والتسويق والشؤون القانونية. نعمل مع القيادات لا نيابةً عنها، ونقيس أثر عملنا بنتائج الأعمال لا بعدد التقارير.",
  },
  mission: {
    label: "MISSION",
    index: "02",
    title: "مهمتنا",
    body: "مهمتنا تمكين الشركات من التأسيس السليم والنمو المستدام عبر خدمات تطوير الأعمال والاستشارات الاستراتيجية. نساعد المؤسسات على بناء أنظمة تجارية واضحة وهياكل تنظيمية قادرة على التوسع، وعلى اتخاذ قراراتها استنادًا إلى البيانات لا الانطباعات. ونستثمر في بناء قدرات الكوادر المحلية حتى تستمر النتائج بعد انتهاء مهمتنا، إسهامًا في اقتصاد عراقي أكثر تنافسية وانفتاحًا.",
  },
  strategy: {
    label: "METHODOLOGY",
    index: "03",
    title: "استراتيجيتنا",
    subtitle: "ستة اتجاهات نعمل بها في كل مهمة استشارية، كما تُقرأ الاتجاهات على وجه البوصلة.",
    centerTitle: "استراتيجيتنا",
    centerSub: "6 POINTS",
    points: [
      {
        num: "01",
        title: "تحديد الموقع بدقة",
        tagline: "ملاءمة السياق العراقي",
        body: "نبدأ بقراءة واقعية للسوق العراقي: المنافسة، التشريعات، سلاسل التوريد وسلوك المشتري، لنحدد موقعًا تنافسيًا قابلًا للدفاع عنه.",
      },
      {
        num: "02",
        title: "التحول القائم على النظام",
        tagline: "أنظمة قبل الأشخاص",
        body: "نحوّل الممارسات الفردية إلى أنظمة موثّقة: سياسات، مسارات عمل، ومؤشرات أداء، بحيث تعتمد المؤسسة على نظامها لا على أشخاص بعينهم.",
      },
      {
        num: "03",
        title: "بناء القدرات أولًا",
        tagline: "تمكين الكوادر",
        body: "ندرّب فرق العمل والإدارة الوسطى أثناء التنفيذ عبر ورش وتوجيه ميداني، لتصبح الكفاءة الداخلية قادرة على إدارة التغيير واستدامته.",
      },
      {
        num: "04",
        title: "استشارات مع دعم تنفيذي",
        tagline: "من التوصية إلى التطبيق",
        body: "لا نكتفي بتسليم التوصيات؛ نرافق الإدارة في التنفيذ بخطط تشغيلية ومراجعات دورية حتى تتحول الاستراتيجية إلى نتائج قابلة للقياس.",
      },
      {
        num: "05",
        title: "التعاون بين القطاعات",
        tagline: "شبكة خبرات متعددة",
        body: "نوظّف خبرات متقاطعة بين القطاع الخاص والمؤسسات المالية والمنظمات والجهات الحكومية، لفتح فرص شراكة وتمويل ونفاذ إلى السوق.",
      },
      {
        num: "06",
        title: "قرارات قائمة على البيانات",
        tagline: "قياس ومؤشرات",
        body: "نبني لوحات مؤشرات ونماذج مالية وتحليلات سوق تجعل كل قرار مسنودًا برقم واضح، مع مراجعة دورية للفرضيات كلما تغيّر السوق.",
      },
    ],
  },
  services: {
    label: "SERVICES",
    index: "04",
    title: "خدماتنا الأساسية",
    subtitle: "أربع خدمات مترابطة تُقدَّم منفردة أو ضمن برنامج تحول متكامل.",
    items: [
      {
        title: "تطوير الأنظمة التجارية",
        tagline:
          "نصمّم دورة تجارية متكاملة من التسعير إلى التحصيل، بأدوات ومسارات عمل واضحة تضمن انتظام الإيراد.",
        points: [
          "هندسة نموذج الإيراد وسياسات التسعير والهوامش",
          "بناء دورة المبيعات وإدارة علاقات العملاء وقاعدة بياناتهم",
          "تنظيم سلسلة التوريد والمخزون ومؤشرات الأداء التشغيلية",
        ],
      },
      {
        title: "الهيكلة التنظيمية",
        tagline: "نعيد ترتيب المؤسسة حول أهدافها: أدوار محددة، صلاحيات متوازنة، ومسارات مساءلة لا تتداخل.",
        points: [
          "تصميم الهيكل التنظيمي وتوصيف الوظائف والصلاحيات",
          "أنظمة تقييم الأداء والحوافز والتدرج الوظيفي",
          "أدلة السياسات والإجراءات وحوكمة اتخاذ القرار",
        ],
      },
      {
        title: "التخطيط الاستراتيجي",
        tagline: "نحوّل طموح الملّاك إلى خطة ثلاثية واقعية بمبادرات مُسعّرة زمنيًا وماليًا وقابلة للمتابعة.",
        points: [
          "تحليل السوق والمنافسين وقراءة فرص النمو",
          "صياغة الرؤية والأهداف ومؤشرات الأداء الرئيسية",
          "نمذجة مالية وسيناريوهات مخاطر وخطة تنفيذ ربعية",
        ],
      },
      {
        title: "استشارات التسويق والمبيعات",
        tagline: "نبني حضورًا تجاريًا مبنيًا على فهم المشتري العراقي، ونربط كل حملة بأثرها على المبيعات.",
        points: [
          "بناء العلامة التجارية ورسائلها وتموضعها في السوق",
          "خطط تسويق رقمي وقنوات توزيع وتفعيل نقاط البيع",
          "تأهيل فرق المبيعات وأنظمة الأهداف والمتابعة",
        ],
      },
    ],
  },
  sectors: {
    label: "SECTORS",
    index: "05",
    title: "القطاعات التي نخدمها",
    subtitle: "خبرة تراكمية في عشرة قطاعات رئيسية داخل السوق العراقية.",
    items: [
      "الاتصالات والتكنولوجيا",
      "النقل واللوجستيات",
      "العقارات والإنشاءات",
      "تجارة التجزئة",
      "المصارف والتمويل",
      "المشاريع الطبية",
      "المنظمات غير الربحية",
      "التعليم والتدريب",
      "الطاقة والمناخ",
      "الصناعات الإبداعية",
    ],
  },
  team: {
    label: "TEAM",
    index: "06",
    title: "أكثر من 35 مستشارًا",
    subtitle: "اختصاصات متكاملة تُشكَّل منها فرق مخصّصة لكل مشروع بحسب طبيعة التحدي.",
    items: [
      { num: "01", title: "التخطيط الاستراتيجي", body: "صياغة الرؤية والأهداف بعيدة المدى، وترجمتها إلى مبادرات ربعية قابلة للقياس." },
      { num: "02", title: "التطوير المؤسسي", body: "إعادة تصميم الهياكل والسياسات، وترسيخ الحوكمة وثقافة الأداء." },
      { num: "03", title: "الموارد البشرية", body: "استقطاب الكفاءات وتوصيف الوظائف، وبناء أنظمة الرواتب والتقييم والحوافز." },
      { num: "04", title: "إدارة العمليات", body: "تحسين مسارات العمل وخفض الهدر، وضبط الجودة وزمن الاستجابة." },
      { num: "05", title: "بناء القدرات والتدريب", body: "برامج تدريب ميدانية للإدارة الوسطى، وتوجيه مباشر أثناء التنفيذ." },
      { num: "06", title: "الاستشارات المالية", body: "النمذجة المالية وإدارة التدفق النقدي، ودراسات الجدوى وهيكلة التمويل." },
      { num: "07", title: "المبيعات والتسويق", body: "بناء قنوات البيع وخطط النمو، وقياس أثر التسويق على الإيراد." },
      { num: "08", title: "الإعلام والعلاقات العامة", body: "إدارة السمعة والرسائل المؤسسية، والتواصل مع الشركاء ووسائل الإعلام." },
      { num: "09", title: "الشؤون القانونية", body: "تأسيس الشركات والامتثال التنظيمي، ومراجعة العقود وإدارة المخاطر." },
    ],
  },
  clients: {
    label: "CLIENTS",
    index: "07",
    title: "عملاؤنا وشركاؤنا",
    subtitle:
      "نعمل مع شركات محلية ودولية ومؤسسات تنموية، وتُبنى علاقاتنا على استمرارية التعاون لا على المشروع الواحد.",
    badge: "الشريك الرسمي للنمو",
    stats: [
      { value: "18+", label: "شريكًا ومطوّرًا" },
      { value: "92%", label: "نسبة استمرار العملاء" },
      { value: "120+", label: "مشروع استشاري منجز" },
    ],
    clientsLabel: "عملاء دوليون ومحليون",
    clients: [
      "كرخ للتجزئة",
      "زين العراق",
      "مصرف الرشيد",
      "الوركاء للإنشاءات",
      "دجلة للطاقة",
      "بغداد مول",
      "الرافدين للنقل",
      "مجموعة السلام الطبية",
      "منظمة نماء",
      "أكاديمية الرافدين",
      "أور للتقنية",
      "بابل للصناعات الغذائية",
      "سومر للتأمين",
      "النهرين للمقاولات",
    ],
    partnersLabel: "شركاء ومطورون",
    partners: [
      "بيت الحكمة للاستشارات",
      "مركز بغداد للأعمال",
      "شبكة المستثمرين العراقيين",
      "حاضنة إبداع",
      "مجموعة الفرات للتطوير",
      "معهد الإدارة الحديثة",
      "شركاء الخليج للتنمية",
      "منصة رواد",
      "مجلس الأعمال العراقي",
      "أكاديمية القيادة التنفيذية",
      "صندوق تمويل المشاريع",
      "شبكة مستشاري المنطقة",
    ],
  },
  founders: {
    label: "FOUNDERS",
    index: "08",
    title: "المؤسسون",
    subtitle: "خبرة قيادية جمعت بين الإدارة التنفيذية والتحليل الاقتصادي.",
    items: [
      {
        name: "قيصر الوردي",
        role: "المؤسس والرئيس التنفيذي لشركة البوصلة",
        body: "قاد برامج تحول مؤسسي لشركات عراقية رائدة في التجزئة والاتصالات والإنشاءات. يؤمن بأن الاستشارة تُقاس بأثرها التشغيلي على أرض الواقع لا بحجم تقاريرها.",
      },
      {
        name: "د. ضياء قدو",
        role: "الشريك المؤسس للاستشارات الاقتصادية والمالية",
        body: "خبير في التحليل الاقتصادي والنمذجة المالية ودراسات الجدوى وهيكلة التمويل. رافق مؤسسات مالية ومنظمات تنموية في بناء قراراتها الاستثمارية داخل العراق.",
      },
    ],
  },
  partnership: {
    label: "PARTNERSHIP",
    index: "09",
    title: "كن شريكنا القادم في توسيع بوصلة الأعمال",
    subtitle:
      "نفتح باب الشراكة أمام قيادات تمتلك خبرة ميدانية وشبكة علاقات، لتأسيس مكاتب «البوصلة» في محافظات العراق والأسواق المجاورة وفق أربعة متطلبات أساسية.",
    items: [
      { num: "01", title: "خبرة مهنية راسخة", value: "10 سنوات", body: "سجل مهني لا يقل عن عشر سنوات في الإدارة أو الاستشارات." },
      { num: "02", title: "قيادة مؤسسات", value: "فرق وإدارات", body: "تجربة مثبتة في قيادة فرق ومؤسسات وإدارة التغيير فيها." },
      { num: "03", title: "قدرة تنفيذية على التأسيس", value: "مكتب محلي", body: "جاهزية لتأسيس مكتب البوصلة وإدارته في نطاقك الجغرافي." },
      { num: "04", title: "استعداد مالي", value: "15,000 دولار", body: "مساهمة تأسيسية لانطلاق الشراكة وتجهيز المكتب." },
    ],
    cta: "تواصل معنا للشراكة",
  },
  contact: {
    label: "CONTACT",
    index: "10",
    title: "لنحدد اتجاه شركتك القادم",
    subtitle:
      "اترك بياناتك وسيتواصل معك أحد مستشارينا خلال يوم عمل واحد لتحديد موعد استشارة أولية.",
    form: {
      name: "الاسم",
      namePlaceholder: "اسمك الكامل",
      email: "البريد الإلكتروني",
      emailPlaceholder: "name@company.com",
      message: "الرسالة",
      messagePlaceholder: "اكتب لنا عن شركتك والتحدي الذي تواجهه",
      submit: "احجز استشارة",
      sent: "شكرًا لك — سيتواصل معك أحد مستشارينا قريبًا.",
    },
    whatsapp: "واتساب",
    phones: ["+964 785 33 99 333", "+964 771 22 06 847"],
    email: "ceo@compass-iraq.net",
    website: "www.compass-iraq.net",
    tagline: "COMPASS IRAQ",
    copyright: "© 2026 شركة البوصلة للاستشارات — بغداد، العراق",
  },
};

const en: LandingContent = {
  hero: {
    badge: "Business consulting in Iraq",
    titleLines: ["Compass guides companies", "from founding to sustainable growth", "in the Iraqi market"],
    highlightFirst: true,
    subtitle:
      "We chart a clear direction with leadership teams: a precise reading of reality, measurable commercial systems and institutional structures, then hands-on support through execution until the plan turns into tangible results.",
    primaryCta: "Book a consultation",
    secondaryCta: "Explore our services",
    stats: [
      { value: "35+", label: "specialist consultants" },
      { value: "1500+", label: "consulting hours" },
      { value: "10+", label: "sectors served" },
    ],
  },
  about: {
    label: "ABOUT",
    index: "01",
    title: "Who we are",
    body: "Compass is an Iraqi management and commercial consulting firm based in Baghdad, founded to be a trusted reference for local private-sector companies and international firms operating in Iraq. We combine a deep understanding of the Iraqi context with proven global management methodologies. Our team includes more than thirty-five consultants across strategy, institutional development, finance, marketing and legal affairs. We work with leaders, not on their behalf, and we measure our impact by business results — not by the number of reports.",
  },
  mission: {
    label: "MISSION",
    index: "02",
    title: "Our mission",
    body: "Our mission is to enable companies to found themselves soundly and grow sustainably through business-development services and strategic consulting. We help organizations build clear commercial systems and scalable structures, and make decisions based on data rather than impressions. We invest in building the capabilities of local talent so results endure beyond our engagement — contributing to a more competitive and open Iraqi economy.",
  },
  strategy: {
    label: "METHODOLOGY",
    index: "03",
    title: "Our strategy",
    subtitle: "Six bearings we work by in every engagement — read like the points on a compass face.",
    centerTitle: "Our strategy",
    centerSub: "6 POINTS",
    points: [
      {
        num: "01",
        title: "Precise positioning",
        tagline: "Fit to the Iraqi context",
        body: "We start with a realistic reading of the Iraqi market: competition, regulation, supply chains and buyer behaviour — to define a defensible competitive position.",
      },
      {
        num: "02",
        title: "System-led transformation",
        tagline: "Systems before people",
        body: "We turn individual practices into documented systems — policies, workflows and KPIs — so the organization relies on its system, not on particular individuals.",
      },
      {
        num: "03",
        title: "Capability first",
        tagline: "Empowering the team",
        body: "We train staff and middle management during execution through workshops and on-the-ground coaching, so internal capability can lead and sustain change.",
      },
      {
        num: "04",
        title: "Consulting with execution support",
        tagline: "From recommendation to application",
        body: "We don't just hand over recommendations; we accompany management through execution with operating plans and periodic reviews until strategy becomes measurable results.",
      },
      {
        num: "05",
        title: "Cross-sector collaboration",
        tagline: "A network of expertise",
        body: "We bring cross-cutting expertise across the private sector, financial institutions, NGOs and government — opening opportunities for partnership, funding and market access.",
      },
      {
        num: "06",
        title: "Data-driven decisions",
        tagline: "Measurement & metrics",
        body: "We build dashboards, financial models and market analytics that back every decision with a clear number, reviewing assumptions whenever the market shifts.",
      },
    ],
  },
  services: {
    label: "SERVICES",
    index: "04",
    title: "Our core services",
    subtitle: "Four connected services, delivered on their own or as part of an integrated transformation program.",
    items: [
      {
        title: "Commercial systems development",
        tagline: "We design a complete commercial cycle from pricing to collection, with clear tools and workflows that keep revenue steady.",
        points: [
          "Revenue-model engineering, pricing and margin policy",
          "Building the sales cycle, CRM and customer database",
          "Organizing supply chain, inventory and operational KPIs",
        ],
      },
      {
        title: "Organizational structuring",
        tagline: "We re-arrange the organization around its goals: defined roles, balanced authority and clear, non-overlapping lines of accountability.",
        points: [
          "Org-structure design, job descriptions and authorities",
          "Performance-evaluation, incentive and career-progression systems",
          "Policy and procedure manuals and decision-making governance",
        ],
      },
      {
        title: "Strategic planning",
        tagline: "We turn owners' ambition into a realistic three-year plan with time- and cost-priced initiatives that are easy to track.",
        points: [
          "Market and competitor analysis and growth-opportunity reading",
          "Vision, objectives and key performance indicators",
          "Financial modelling, risk scenarios and a quarterly execution plan",
        ],
      },
      {
        title: "Marketing & sales consulting",
        tagline: "We build a commercial presence grounded in understanding the Iraqi buyer, linking every campaign to its impact on sales.",
        points: [
          "Brand building, messaging and market positioning",
          "Digital-marketing plans, distribution channels and point-of-sale activation",
          "Sales-team enablement and target and tracking systems",
        ],
      },
    ],
  },
  sectors: {
    label: "SECTORS",
    index: "05",
    title: "The sectors we serve",
    subtitle: "Accumulated experience across ten key sectors within the Iraqi market.",
    items: [
      "Telecom & technology",
      "Transport & logistics",
      "Real estate & construction",
      "Retail",
      "Banking & finance",
      "Medical projects",
      "Non-profit organizations",
      "Education & training",
      "Energy & climate",
      "Creative industries",
    ],
  },
  team: {
    label: "TEAM",
    index: "06",
    title: "More than 35 consultants",
    subtitle: "Complementary specialties from which dedicated teams are formed for each project by the nature of the challenge.",
    items: [
      { num: "01", title: "Strategic planning", body: "Shaping long-term vision and objectives, and translating them into measurable quarterly initiatives." },
      { num: "02", title: "Institutional development", body: "Redesigning structures and policies, and embedding governance and a performance culture." },
      { num: "03", title: "Human resources", body: "Attracting talent and defining roles, and building payroll, evaluation and incentive systems." },
      { num: "04", title: "Operations management", body: "Improving workflows and cutting waste, and tightening quality and response time." },
      { num: "05", title: "Capability building & training", body: "Field training programs for middle management, with direct coaching during execution." },
      { num: "06", title: "Financial consulting", body: "Financial modelling and cash-flow management, feasibility studies and financing structuring." },
      { num: "07", title: "Sales & marketing", body: "Building sales channels and growth plans, and measuring marketing's impact on revenue." },
      { num: "08", title: "Media & public relations", body: "Managing reputation and institutional messaging, and liaising with partners and media." },
      { num: "09", title: "Legal affairs", body: "Company formation and regulatory compliance, contract review and risk management." },
    ],
  },
  clients: {
    label: "CLIENTS",
    index: "07",
    title: "Our clients & partners",
    subtitle:
      "We work with local and international companies and development organizations, building our relationships on continuity of collaboration rather than a single project.",
    badge: "The official growth partner",
    stats: [
      { value: "18+", label: "partners & developers" },
      { value: "92%", label: "client retention rate" },
      { value: "120+", label: "consulting projects delivered" },
    ],
    clientsLabel: "International & local clients",
    clients: [
      "Karkh Retail",
      "Zain Iraq",
      "Al-Rasheed Bank",
      "Al-Warka Construction",
      "Dijla Energy",
      "Baghdad Mall",
      "Al-Rafidain Transport",
      "Al-Salam Medical Group",
      "Namaa Organization",
      "Al-Rafidain Academy",
      "Ur Technology",
      "Babel Food Industries",
      "Sumer Insurance",
      "Al-Nahrain Contracting",
    ],
    partnersLabel: "Partners & developers",
    partners: [
      "Bayt Al-Hikma Consulting",
      "Baghdad Business Center",
      "Iraqi Investors Network",
      "Ibda' Incubator",
      "Al-Furat Development Group",
      "Modern Management Institute",
      "Gulf Partners for Development",
      "Ruwad Platform",
      "Iraqi Business Council",
      "Executive Leadership Academy",
      "Project Financing Fund",
      "Regional Consultants Network",
    ],
  },
  founders: {
    label: "FOUNDERS",
    index: "08",
    title: "The founders",
    subtitle: "Leadership experience that brings together executive management and economic analysis.",
    items: [
      {
        name: "Qaisar Al-Wardi",
        role: "Founder & CEO of Compass",
        body: "Led institutional-transformation programs for leading Iraqi companies in retail, telecom and construction. He believes consulting is measured by its operational impact on the ground — not by the size of its reports.",
      },
      {
        name: "Dr. Dhiaa Qaddu",
        role: "Co-founder for economic & financial consulting",
        body: "An expert in economic analysis, financial modelling, feasibility studies and financing structuring. He has guided financial institutions and development organizations in shaping their investment decisions inside Iraq.",
      },
    ],
  },
  partnership: {
    label: "PARTNERSHIP",
    index: "09",
    title: "Be our next partner in expanding the business compass",
    subtitle:
      "We open the door to partnership for leaders with field experience and a strong network, to establish Compass offices across Iraq's provinces and neighbouring markets — against four core requirements.",
    items: [
      { num: "01", title: "Established professional experience", value: "10 years", body: "A professional record of no less than ten years in management or consulting." },
      { num: "02", title: "Institutional leadership", value: "Teams & departments", body: "Proven experience leading teams and organizations and managing change within them." },
      { num: "03", title: "Capacity to establish", value: "Local office", body: "Readiness to establish and run the Compass office in your geographic area." },
      { num: "04", title: "Financial readiness", value: "$15,000", body: "A founding contribution to launch the partnership and equip the office." },
    ],
    cta: "Contact us about partnership",
  },
  contact: {
    label: "CONTACT",
    index: "10",
    title: "Let's set your company's next direction",
    subtitle:
      "Leave your details and one of our consultants will reach out within one business day to schedule an initial consultation.",
    form: {
      name: "Name",
      namePlaceholder: "Your full name",
      email: "Email",
      emailPlaceholder: "name@company.com",
      message: "Message",
      messagePlaceholder: "Tell us about your company and the challenge you're facing",
      submit: "Book a consultation",
      sent: "Thank you — one of our consultants will be in touch shortly.",
    },
    whatsapp: "WhatsApp",
    phones: ["+964 785 33 99 333", "+964 771 22 06 847"],
    email: "ceo@compass-iraq.net",
    website: "www.compass-iraq.net",
    tagline: "COMPASS IRAQ",
    copyright: "© 2026 Compass Consulting — Baghdad, Iraq",
  },
};

const content: Record<Locale, LandingContent> = { ar, en };

export function getLandingContent(locale: Locale): LandingContent {
  return content[locale] ?? content.ar;
}
