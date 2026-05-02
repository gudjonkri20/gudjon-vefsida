import type { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'icelandia-ai-chatbot',
    title: {
      en: 'Icelandia AI Chatbot',
      is: 'Icelandia spjallmenni',
    },
    tagline: {
      en: 'Multilingual customer-facing AI assistant on icelandia.com.',
      is: 'Fjöltyngt spjallmenni fyrir viðskiptavini á icelandia.com.',
    },
    description: {
      en: 'Tool-using LLM with RAG over Sanity-sourced tour content, real-time tour-status checks (aurora forecast, cancellations), Flybus schedule lookups, secure booking lookup, and seamless human handoff. Around 10 languages, 5 tools, semantic caching, first-party domain locked.',
      is: 'Tólanotandi mállíkan með RAG yfir Sanity-efni, rauntíma stöðuathuganir (norðurljósaspá, afpantanir), Flybus áætlun, örugg bókunarleit og snurðulaus afhending til mannlegrar þjónustu. Um 10 tungumál, 5 verkfæri, semantisk skyndiminni.',
    },
    status: 'public',
    category: 'chatbot',
    tech: ['React', 'Express', 'Azure OpenAI', 'Pinecone', 'Cohere', 'Azure Communication Services'],
    link: 'https://icelandia.com',
    linkLabel: {
      en: 'Try it on icelandia.com',
      is: 'Prófaðu á icelandia.com',
    },
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'chatbot-analytics-mcp',
    title: {
      en: 'Chatbot Analytics MCP Server',
      is: 'Chatbot Analytics MCP-þjónn',
    },
    tagline: {
      en: 'Internal MCP server giving the team natural-language access to chatbot analytics.',
      is: 'Innra MCP-þjónn sem gefur teyminu náttúrulegt málaðgengi að spjallmennisgreiningum.',
    },
    description: {
      en: 'MCP server that lets the team explore chatbot usage and trends in natural language from Claude. Authenticated and scoped to staff.',
      is: 'MCP-þjónn sem leyfir teyminu að skoða notkun og þróun spjallmenna á eðlilegu máli úr Claude. Auðkennt og takmarkað við starfsfólk.',
    },
    status: 'internal',
    category: 'mcp',
    tech: ['Python', 'FastMCP', 'Azure', 'Entra ID'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'prediction-hivemind',
    title: {
      en: 'Demand Forecasting Platform',
      is: 'Eftirspurnarspár',
    },
    tagline: {
      en: 'Internal ML platform with nightly retrain and AI-narrated briefings.',
      is: 'Innri vélnámspallur með næturþjálfun og AI-skýrslum.',
    },
    description: {
      en: 'Internal demand-forecasting platform built around per-tour ML models, automatic nightly retraining, and a daily AI-narrated briefing over the results.',
      is: 'Innri eftirspurnarspárpallur byggður á vélnámslíkönum fyrir hverja ferð, sjálfvirkri næturþjálfun og daglegri AI-skýrslu yfir niðurstöðum.',
    },
    status: 'internal',
    category: 'ml',
    tech: ['Python', 'ML', 'FastAPI', 'React', 'Azure'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'email-booking-automation',
    title: {
      en: 'Email → Booking Automation',
      is: 'Tölvupóstur → bókun sjálfvirkni',
    },
    tagline: {
      en: 'Hands-off pipeline that turns partner booking emails into confirmed reservations.',
      is: 'Sjálfvirkt ferli sem breytir bókunarpóstum frá samstarfsaðilum í staðfestar pantanir.',
    },
    description: {
      en: 'Scheduled pipeline that reads partner booking emails, parses attachments with an LLM, and posts complete bookings into the reservation system — no human in the loop. Production since early 2026.',
      is: 'Tímasett ferli sem les bókunarpósta frá samstarfsaðilum, þættir viðhengi með LLM og skráir heildarbókanir í pöntunarkerfið — án mannlegs inngrips. Í framleiðslu frá byrjun 2026.',
    },
    status: 'internal',
    category: 'automation',
    tech: ['Python', 'Azure Functions', 'LLM', 'Microsoft Graph'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'marketing-dw-mcp',
    title: {
      en: 'Marketing DW MCP Server',
      is: 'Marketing DW MCP-þjónn',
    },
    tagline: {
      en: 'Companion internal MCP over a marketing data warehouse.',
      is: 'Innri MCP-þjónn fyrir markaðsgagnaver.',
    },
    description: {
      en: 'Companion MCP server giving the team natural-language access to the marketing data warehouse — same authenticated pattern as the analytics MCP, applied to a different dataset.',
      is: 'Hliðar MCP-þjónn sem gefur teyminu náttúrulegt málaðgengi að markaðsgagnaverinu — sama auðkenningarmunstur og hjá analytics MCP, annað gagnasafn.',
    },
    status: 'internal',
    category: 'mcp',
    tech: ['Python', 'FastMCP', 'SQL', 'Azure', 'Entra ID'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'flybus-ai-chatbot',
    title: {
      en: 'Flybus AI Chatbot',
      is: 'Flybus spjallmenni',
    },
    tagline: {
      en: 'Airport-transfer assistant on flybus.is with flight-aware schedule logic.',
      is: 'Flughringaaðstoð á flybus.is með flugmiðaðri áætlunarrökfræði.',
    },
    description: {
      en: 'Live on flybus.is. Helps travelers plan KEF airport transfers, infers correct direction (KEF↔BSÍ) from flight time, looks up bookings, and answers schedule questions with future-date safety nets. Same RAG stack as the Icelandia bot.',
      is: 'Í notkun á flybus.is. Hjálpar ferðafólki að skipuleggja flutninga til/frá KEF, áætlar rétta átt út frá flugtíma, flettir upp bókunum og svarar áætlunarspurningum. Sami RAG-stafli og Icelandia-spjallmennið.',
    },
    status: 'public',
    category: 'chatbot',
    tech: ['React', 'Express', 'Azure OpenAI', 'Pinecone', 'Cohere'],
    link: 'https://flybus.is',
    linkLabel: {
      en: 'Try it on flybus.is',
      is: 'Prófaðu á flybus.is',
    },
    isFeatured: false,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'dive-ai-chatbot',
    title: {
      en: 'Dive.is AI Chatbot',
      is: 'Dive.is spjallmenni',
    },
    tagline: {
      en: 'Diving and snorkeling assistant for dive.is.',
      is: 'Aðstoðarmenni fyrir köfun og snorkl á dive.is.',
    },
    description: {
      en: 'Live on dive.is. Answers safety, equipment, and medical-eligibility questions about diving and snorkeling experiences. Content fed by a BeautifulSoup scraper of the live site (dive.is uses Kirby, not Sanity).',
      is: 'Í notkun á dive.is. Svarar spurningum um öryggi, búnað og heilsufarsgildi fyrir köfun og snorkl. Efni fengið úr BeautifulSoup-skrásetjara á síðunni sjálfri (dive.is notar Kirby, ekki Sanity).',
    },
    status: 'public',
    category: 'chatbot',
    tech: ['React', 'Express', 'Azure OpenAI', 'Pinecone', 'Cohere', 'BeautifulSoup'],
    link: 'https://dive.is',
    linkLabel: {
      en: 'Try it on dive.is',
      is: 'Prófaðu á dive.is',
    },
    isFeatured: false,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'offer-creation-engine',
    title: {
      en: 'Offer Creation Engine',
      is: 'Tilboðsvél',
    },
    tagline: {
      en: 'Internal pricing engine for private-tour and transfer offers.',
      is: 'Innri verðlagningarvél fyrir einkaferðir og flutninga.',
    },
    description: {
      en: 'LLM-based pricing engine that turns customer-email requests into structured private-tour and transfer quotes, replacing a manual workflow. Test-backed and aligned to internal pricing rules.',
      is: 'LLM-byggð verðlagningarvél sem breytir fyrirspurnum úr tölvupósti viðskiptavina í skipulögð tilboð fyrir einkaferðir og flutninga, leysir af handvirkt ferli.',
    },
    status: 'internal',
    category: 'automation',
    tech: ['Python', 'LLM', 'pytest'],
    isFeatured: false,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'bot-analytics-dashboards',
    title: {
      en: 'Bot Analytics Dashboards',
      is: 'Mælaborð spjallmenna',
    },
    tagline: {
      en: 'Real-time KPI dashboards for chatbots and operational pipelines.',
      is: 'Rauntíma mælaborð fyrir spjallmenni og rekstrarferli.',
    },
    description: {
      en: 'Real-time dashboards for chatbot conversations and operational pipelines — volume, sentiment, top intents, error rates. Built for both desktop and TV display modes.',
      is: 'Rauntíma mælaborð fyrir spjallmenni og rekstrarferli — umfang, viðhorf, helstu fyrirætlanir og villuhlutfall. Sniðin að bæði tölvuskjá og sjónvarpsskjá.',
    },
    status: 'internal',
    category: 'dashboards',
    tech: ['JavaScript', 'Chart.js', 'Azure'],
    isFeatured: false,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'rag-sync-pipelines',
    title: {
      en: 'RAG Sync Pipelines',
      is: 'RAG samstilling',
    },
    tagline: {
      en: 'Nightly RAG-index rebuilds powering the customer chatbots.',
      is: 'Næturkeyrslur sem byggja RAG-skrár fyrir spjallmennin.',
    },
    description: {
      en: 'Scheduled pipelines that rebuild the vector indexes used by the customer chatbots. Full nightly delete-recreate-upsert pattern.',
      is: 'Tímasettar keðjur sem byggja vektorskrár fyrir spjallmennin. Full næturleg heildareyðing-endursköpun-uppsetning.',
    },
    status: 'internal',
    category: 'data-eng',
    tech: ['Python', 'GitHub Actions', 'Pinecone'],
    isFeatured: false,
    hasDetailPage: false,
    year: 2026,
  },
  {
    slug: 'masters-thesis',
    title: {
      en: 'Master\'s Thesis: Age & Gender Bias in Icelandic ASR',
      is: 'Meistararitgerð: Aldurs- og kynjamisrétti í íslenskri talgreiningu',
    },
    tagline: {
      en: 'MSc Cognitive Science research on demographic bias in speech recognition.',
      is: 'MSc-rannsókn í Cognitive Science á lýðfræðilegu hlutdrægni í talgreiningu.',
    },
    description: {
      en: 'Aarhus University 2024. Investigated whether Icelandic ASR models exhibit bias across age and gender. Fine-tuned wav2vec2-large-xlsr-53 on the Samrómur Milljón dataset and ran statistical significance tests on demographic subgroups.',
      is: 'Aarhus-háskóli 2024. Kannaði hvort íslensk talgreiningarlíkön sýni hlutdrægni eftir aldri og kyni. Fínþjálfaði wav2vec2-large-xlsr-53 á Samrómur Milljón-gagnasafninu og keyrði tölfræðiprófanir á undirhópum.',
    },
    status: 'research',
    category: 'research',
    tech: ['Python', 'PyTorch', 'Transformers', 'wav2vec2', 'HuggingFace'],
    link: 'https://huggingface.co/collections/gudjonk93/masters-project-6790dd537bd0b8ddcd36f95d',
    linkLabel: {
      en: 'View on HuggingFace',
      is: 'Skoða á HuggingFace',
    },
    isFeatured: false,
    hasDetailPage: false,
    year: 2024,
  },
  {
    slug: 'sa-rag-chatbot',
    title: {
      en: 'SA Project — RAG Chatbot over Iceland\'s Labor Agreements',
      is: 'SA-verkefni — RAG-spjallmenni um íslenska kjarasamninga',
    },
    tagline: {
      en: 'Personal RAG build over the SA collective-bargaining agreements.',
      is: 'Persónulegt RAG-verkefni um kjarasamninga SA.',
    },
    description: {
      en: 'Solo build: a RAG chatbot answering questions about Iceland\'s SA (Samtök Atvinnulífsins) labor agreements. Same RAG stack as the Icelandia bots applied to a personal interest — Pinecone retrieval with GPT-4.1-mini synthesis.',
      is: 'Einkaverkefni: RAG-spjallmenni sem svarar spurningum um kjarasamninga SA. Sami RAG-stafli og í Icelandia-spjallmenni — Pinecone með GPT-4.1-mini.',
    },
    status: 'side',
    category: 'side',
    tech: ['TypeScript', 'Azure OpenAI', 'Pinecone'],
    isFeatured: false,
    hasDetailPage: false,
    year: 2026,
  },
  {
    slug: 'em-leikur',
    title: {
      en: 'EM-leikur (Handball Euro Prediction Game)',
      is: 'EM-leikur',
    },
    tagline: {
      en: 'Prediction game for the 2026 Handball Euros.',
      is: 'Spáleikur fyrir EM í handbolta 2026.',
    },
    description: {
      en: 'Web-based prediction game where friends compete to forecast match outcomes during the Handball European Championship. Built as an Azure Static Web App with a small backend.',
      is: 'Vefleikur þar sem vinir keppast við að spá fyrir um úrslit leikja á EM í handbolta. Byggt sem Azure Static Web App með litlu bakenda.',
    },
    status: 'side',
    category: 'side',
    tech: ['TypeScript', 'Azure Static Web Apps', 'Azure Functions'],
    isFeatured: false,
    hasDetailPage: false,
    year: 2026,
  },
  {
    slug: 'icebert-qa',
    title: {
      en: 'IceBERT Question Answering Model',
      is: 'IceBERT spurningasvari',
    },
    tagline: {
      en: 'Fine-tuned IceBERT for Icelandic question answering.',
      is: 'Fínþjálfaður IceBERT fyrir íslenskar spurningar.',
    },
    description: {
      en: 'Fine-tuned IceBERT on Icelandic question-answering data. Earlier coursework demonstrating Icelandic NLP fundamentals.',
      is: 'Fínþjálfaður IceBERT á íslenskum spurningagögnum. Fyrra námsverkefni sem sýnir grunn í íslenskri máltækni.',
    },
    status: 'research',
    category: 'research',
    tech: ['Python', 'PyTorch', 'Transformers', 'BERT'],
    link: 'https://huggingface.co/gudjonk93/IceBERT-finetuned-NQiIv.1.1',
    linkLabel: {
      en: 'View on HuggingFace',
      is: 'Skoða á HuggingFace',
    },
    isFeatured: false,
    hasDetailPage: false,
    year: 2023,
  },
];

export const featuredProjects = projects.filter((p) => p.isFeatured);
