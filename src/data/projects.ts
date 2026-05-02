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
      en: 'Production MCP server with 22 analytics tools over chatbot telemetry.',
      is: 'MCP-þjónn í framleiðslu með 22 greiningarverkfæri fyrir spjallmenni.',
    },
    description: {
      en: 'Production Model Context Protocol server exposing 22 analytics tools over chatbot telemetry, queryable from Claude Desktop. Entra ID OAuth 2.1 with offline_access refresh tokens and RFC 9728 protected-resource metadata. Lets non-engineers ask questions like "what\'s the satisfaction trend on Flybus this week?" in natural language.',
      is: 'MCP-þjónn í framleiðslu sem afhjúpar 22 greiningarverkfæri yfir spjallmennisgögn, hægt að spyrja úr Claude Desktop. Entra ID OAuth 2.1 með offline_access endurnýjunarmerkjum og RFC 9728 lýsigögnum. Gefur ekki-tæknifólki kost á því að spyrja á eðlilegu máli eins og "hver er ánægjuþróunin á Flybus þessa viku?"',
    },
    status: 'internal',
    category: 'mcp',
    tech: ['Python', 'FastMCP', 'Azure App Service', 'Application Insights', 'Entra ID'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'prediction-hivemind',
    title: {
      en: 'Prediction Hivemind',
      is: 'Prediction Hivemind',
    },
    tagline: {
      en: 'ML demand-forecasting platform with nightly retrain and AI briefings.',
      is: 'Vélnámspallur fyrir eftirspurnarspár með næturþjálfun og AI-skýrslum.',
    },
    description: {
      en: 'Tour-demand forecasting platform. Per-tour CatBoost models with conformal prediction intervals, 19 features (booking pace, fleet capacity, year-over-year, seasonality), nightly retrain via APScheduler, automated WAPE evaluation, and an AI-narrated daily intelligence briefing across six SVG charts. Currently shipping per-tour models with single-digit WAPE on flagship routes.',
      is: 'Vélnámspallur fyrir eftirspurnarspár. CatBoost-líkön fyrir hverja ferð með conformal-spábili, 19 eiginleikar (bókunarhraði, flotagetu, samanburður á milli ára, árstíðasveifla), næturþjálfun með APScheduler, sjálfvirkt WAPE-mat og dagleg AI-greining með sex SVG-myndritum.',
    },
    status: 'internal',
    category: 'ml',
    tech: ['Python', 'CatBoost', 'FastAPI', 'React', 'Azure SQL', 'Azure OpenAI', 'App Service Premium'],
    isFeatured: true,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'sokoni-email-booking',
    title: {
      en: 'Sokoni Email→Booking Automation',
      is: 'Sokoni tölvupóstur→bókun sjálfvirkni',
    },
    tagline: {
      en: 'Hourly Azure Function that turns partner booking emails into confirmed reservations — unattended.',
      is: 'Azure Function sem keyrir á klukkustund og breytir bókunarpóstum í staðfestar pantanir — án mannlegrar inngripa.',
    },
    description: {
      en: 'Hourly Azure Function reads partner booking emails from a shared inbox, parses multi-PDF attachments with GPT-5.4-mini, resolves hotel/age/channel codes, and posts complete bookings into the Sokoni reservation system without human review. Multi-PDF merge per booking, combo-tour code splitting, structured event logging powering a real-time dashboard.',
      is: 'Azure Function sem keyrir á klukkustund les bókunarpósta frá samstarfsaðilum úr sameiginlegu innhólfi, þættir margfalda PDF-viðhengi með GPT-5.4-mini, leysir hótel/aldur/rás kóða og skráir heildarbókanir í Sokoni án mannlegs eftirlits. Sameining margra PDF-skjala, deiliverk fyrir blandaðar ferðir og skipulögð atburðaskráning fyrir mælaborð.',
    },
    status: 'internal',
    category: 'automation',
    tech: ['Python', 'Azure Functions', 'pdfplumber', 'Azure OpenAI', 'Microsoft Graph'],
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
      en: 'Production MCP exposing 14 SQL analytics tools over the marketing data warehouse.',
      is: 'MCP-þjónn í framleiðslu með 14 SQL-greiningarverkfæri fyrir markaðsgögn.',
    },
    description: {
      en: 'Production MCP server with 14 SQL analytics tools over the marketing data warehouse. Lets the team query bookings, revenue trends, anomaly detection, and per-tour performance in natural language from Claude. Same Entra OAuth pattern as the Chatbot Analytics MCP. Replaces a former REST surface with a richer tool-driven interface.',
      is: 'MCP-þjónn í framleiðslu með 14 SQL-greiningarverkfæri fyrir markaðsgagnaver. Teymið getur spurt á eðlilegu máli um bókanir, tekjuþróun, frávik og frammistöðu hverrar ferðar úr Claude. Sami Entra OAuth-háttur og í Chatbot Analytics MCP. Leysir af eldra REST-viðmót með ríkara tólbundnu viðmóti.',
    },
    status: 'internal',
    category: 'mcp',
    tech: ['Python', 'FastMCP', 'pyodbc', 'App Service', 'Entra ID'],
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
      en: 'Three-layer LLM agent for private-tour and transfer pricing.',
      is: 'Þriggja laga LLM-umboðsmaður fyrir verðlagningu einkaferða og flutninga.',
    },
    description: {
      en: 'Pricing engine for private tours and transfers with a three-layer architecture: an LLM agent extracts the request from a customer email, a JSON business-conventions single source of truth supplies the rules, and a deterministic calculator produces the final number. Reaches ±1.5–5% accuracy versus expert human quotes; backed by a 38-test pytest harness.',
      is: 'Verðlagningarvél fyrir einkaferðir og flutninga með þriggja laga byggingu: LLM-umboðsmaður dregur út beiðnina úr tölvupósti viðskiptavinar, JSON-skjal með viðskiptareglum gefur reglurnar og útreikningsvél skilar lokatölunni. Nær ±1.5–5% nákvæmni miðað við handvirk tilboð sérfræðinga.',
    },
    status: 'internal',
    category: 'automation',
    tech: ['Python', 'Azure OpenAI', 'pytest', 'JSON SSoT'],
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
      en: 'Five real-time KPI dashboards over chatbot and booking telemetry.',
      is: 'Fimm rauntíma mælaborð fyrir spjallmenni og bókanir.',
    },
    description: {
      en: 'Suite of five real-time dashboards (Icelandia, Flybus, Dive, an all-bots combined view, and Sokoni) showing volume, sentiment, top intents, and error rates. KQL queries through Azure Functions to Static Web App frontends, 30-second auto-refresh, dark Linear-inspired design.',
      is: 'Fimm rauntíma mælaborð (Icelandia, Flybus, Dive, sameinað yfirlit og Sokoni) sem sýna umfang, viðhorf, helstu fyrirætlanir og villuhlutfall. KQL-fyrirspurnir í gegnum Azure Functions í Static Web App-viðmót, 30 sekúndna sjálfvirk endurnýjun.',
    },
    status: 'internal',
    category: 'dashboards',
    tech: ['JavaScript', 'Chart.js', 'Azure Functions', 'Azure Static Web Apps', 'KQL'],
    isFeatured: false,
    hasDetailPage: true,
    year: 2026,
  },
  {
    slug: 'sanity-pinecone-sync',
    title: {
      en: 'Sanity → Pinecone Sync Pipelines',
      is: 'Sanity → Pinecone samstilling',
    },
    tagline: {
      en: 'Three nightly RAG-index rebuilds powering the customer chatbots.',
      is: 'Þrjár næturkeyrslur sem byggja RAG-skrár fyrir spjallmennin.',
    },
    description: {
      en: 'Three nightly GitHub Actions pipelines that rebuild Pinecone vector indexes for the Icelandia, Flybus, and Dive chatbots. Full delete-recreate-upsert pattern avoids drift; ~3–5 minute runtime; secrets in GitHub Secrets only.',
      is: 'Þrjú GitHub Actions-keðjur sem keyra á hverri nóttu og byggja Pinecone vektorskrár fyrir spjallmennin. Heildareyðing-endursköpun-uppsetning kemur í veg fyrir tæpi; ~3–5 mínútna keyrslutími.',
    },
    status: 'internal',
    category: 'data-eng',
    tech: ['Python', 'GitHub Actions', 'Sanity GROQ', 'Azure OpenAI Embeddings', 'Pinecone'],
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
