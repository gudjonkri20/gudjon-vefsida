import type { Service } from '../types';

export const services: Service[] = [
  {
    slug: 'audit',
    title: {
      en: 'AI Audit & Strategy',
      is: 'AI-úttekt og stefnumótun',
    },
    tagline: {
      en: 'A clear-eyed look at where AI moves the needle for your business.',
      is: 'Skýr sýn á hvar gervigreindin skiptir mestu máli fyrir reksturinn.',
    },
    description: {
      en: 'A focused engagement (typically one week) to review your stack, processes, and data, identify the highest-ROI AI opportunities, and deliver a prioritized roadmap with build-or-buy guidance.',
      is: 'Markviss vinna (yfirleitt ein vika) þar sem ég fer yfir tæknistafla, ferla og gögn, greini bestu tækifærin fyrir gervigreind og skila forgangsröðuðu vegakorti með ráðgjöf um eigin þróun eða kaup.',
    },
    bullets: {
      en: [
        'Stack, process, and data review',
        'Prioritized opportunities ranked by ROI and risk',
        'Build-or-buy recommendation per opportunity',
        'Concrete roadmap with effort estimates',
      ],
      is: [
        'Yfirferð á tæknistafla, ferlum og gögnum',
        'Forgangsröðuð tækifæri eftir ávöxtun og áhættu',
        'Tillaga um eigin þróun eða kaup á hverju verkefni',
        'Áþreifanlegt vegakort með áætluðum vinnuframlögum',
      ],
    },
    format: {
      en: 'One week. Remote or on-site in Iceland.',
      is: 'Ein vika. Fjarvinna eða á staðnum á Íslandi.',
    },
    emailSubject: {
      en: 'Consulting inquiry — AI Audit & Strategy',
      is: 'Ráðgjafarfyrirspurn — AI-úttekt og stefnumótun',
    },
  },
  {
    slug: 'implementation',
    title: {
      en: 'AI Implementation',
      is: 'AI-innleiðing',
    },
    tagline: {
      en: 'Production-grade AI systems, designed and shipped.',
      is: 'Framleiðsluhæf gervigreindarkerfi, hönnuð og afhent.',
    },
    description: {
      en: 'Project-based engagement to design and build production AI systems end-to-end — chatbots, MCP servers, agentic workflows, and ML pipelines. I\'ve shipped all of these at scale at Icelandia ehf. Sweet spot: solo-engineer builds where speed and clarity matter.',
      is: 'Verkefnamiðuð vinna þar sem ég hanna og smíða gervigreindarkerfi frá hugmynd að framleiðslu — spjallmenni, MCP-þjóna, sjálfvirka vinnuferla og vélnámskeðjur. Hef afhent öll þessi við Icelandia ehf. Best þegar hraði og skýr stefna skipta máli.',
    },
    bullets: {
      en: [
        'Customer-facing chatbots with RAG, tool use, and human handoff',
        'MCP servers with proper auth (Entra OAuth + refresh tokens)',
        'ML pipelines with retraining, evaluation, and monitoring',
        'Email- and document-processing automation',
      ],
      is: [
        'Spjallmenni fyrir viðskiptavini með RAG, tólanotkun og afhendingu til mannlegra',
        'MCP-þjónar með réttri auðkenningu (Entra OAuth + endurnýjunarmerkjum)',
        'Vélnámskeðjur með endurþjálfun, mati og eftirliti',
        'Sjálfvirkni fyrir tölvupóst og skjalavinnslu',
      ],
    },
    format: {
      en: 'Project-based. Fixed scope or rolling engagement.',
      is: 'Verkefnamiðað. Fast umfang eða viðvarandi samstarf.',
    },
    emailSubject: {
      en: 'Consulting inquiry — AI Implementation',
      is: 'Ráðgjafarfyrirspurn — AI-innleiðing',
    },
  },
  {
    slug: 'training',
    title: {
      en: 'Training & Workshops',
      is: 'Þjálfun og vinnustofur',
    },
    tagline: {
      en: 'Hands-on AI sessions for engineers and non-engineers alike.',
      is: 'Verklegar AI-vinnustofur fyrir tæknifólk og aðra.',
    },
    description: {
      en: 'Half-day to multi-day workshops, tailored to the audience. For executives and ops: practical Claude/ChatGPT use, prompt engineering, and how to evaluate AI products. For engineers: RAG systems, MCP integration, agentic patterns, and production deployment.',
      is: 'Hálfsdags- til fleiri daga vinnustofur, sniðnar að áheyrendum. Fyrir stjórnendur og rekstrarfólk: hagnýt notkun Claude/ChatGPT, beiðnaverkfræði og hvernig á að meta AI-vörur. Fyrir tæknifólk: RAG-kerfi, MCP-tenging, umboðsmiðuð munstur og uppsetning í framleiðslu.',
    },
    bullets: {
      en: [
        'For executives: AI literacy and decision-making',
        'For ops/marketing/HR teams: hands-on Claude and ChatGPT',
        'For engineers: RAG, MCP, agentic systems',
        'In Icelandic or English',
      ],
      is: [
        'Fyrir stjórnendur: AI-læsi og ákvarðanataka',
        'Fyrir rekstrar-, markaðs- og mannauðsteymi: hagnýt notkun Claude og ChatGPT',
        'Fyrir tæknifólk: RAG, MCP, umboðsmenni',
        'Á íslensku eða ensku',
      ],
    },
    format: {
      en: 'Half-day to multi-day. On-site in Iceland or remote.',
      is: 'Hálfur dagur til nokkrir dagar. Á staðnum á Íslandi eða í fjarvinnu.',
    },
    emailSubject: {
      en: 'Consulting inquiry — Training & Workshops',
      is: 'Ráðgjafarfyrirspurn — Þjálfun og vinnustofur',
    },
  },
];
