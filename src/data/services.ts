import type { Service } from '../types';

export const services: Service[] = [
  {
    slug: 'advisory',
    title: {
      en: 'Advisory',
      is: 'Ráðgjöf',
    },
    tagline: {
      en: 'A second opinion on what AI can — and cannot — do for your business.',
      is: 'Annað sjónarhorn á hvað gervigreind getur (og getur ekki) gert fyrir reksturinn þinn.',
    },
    description: {
      en: 'Light-touch engagements where I share an honest take on your AI plans — what looks promising, what to be careful of, where to start. Calls, half-days, or short reviews. Not implementation.',
      is: 'Léttar lotur þar sem ég gef heiðarlega sýn á þín gervigreindarverkefni — hvað er álitlegt, við hverju á að gæta og hvar gott er að byrja. Símtöl, hálfir dagar eða stuttar yfirferðir. Ekki innleiðing.',
    },
    bullets: {
      en: [
        'Honest second opinions, not pitches',
        'Helping you separate hype from substance',
        'Guidance on build-vs-buy and what to start with',
      ],
      is: [
        'Heiðarlegt mat, ekki sölufundur',
        'Hjálpa þér að greina raunverulegt gildi frá tísku',
        'Leiðbeiningar um eigin þróun eða kaup og góðan upphafspunkt',
      ],
    },
    format: {
      en: 'Calls, half-day sessions, or short written reviews.',
      is: 'Símtöl, hálfsdags lotur eða stuttar skriflegar yfirferðir.',
    },
    emailSubject: {
      en: 'Advisory inquiry',
      is: 'Fyrirspurn um ráðgjöf',
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
      en: 'Workshops tailored to the audience. For non-technical teams: practical Claude/ChatGPT use, prompt habits, and how to read AI output critically. For technical teams: RAG, agents, MCP, and what holds up in production.',
      is: 'Vinnustofur sniðnar að áheyrendum. Fyrir ekki-tæknifólk: hagnýt notkun Claude/ChatGPT, beiðnavenjur og gagnrýnin lesning á úttak. Fyrir tæknifólk: RAG, umboðsmenni, MCP og hvað virkar í framleiðslu.',
    },
    bullets: {
      en: [
        'For executives & ops: practical AI literacy',
        'For engineers: RAG, agents, MCP in production',
        'In Icelandic or English',
      ],
      is: [
        'Fyrir stjórnendur og rekstrarfólk: hagnýt AI-læsi',
        'Fyrir tæknifólk: RAG, umboðsmenni og MCP í framleiðslu',
        'Á íslensku eða ensku',
      ],
    },
    format: {
      en: 'Half-day to multi-day. On-site in Iceland or remote.',
      is: 'Hálfur dagur til nokkrir dagar. Á staðnum á Íslandi eða í fjarvinnu.',
    },
    emailSubject: {
      en: 'Training inquiry',
      is: 'Fyrirspurn um þjálfun',
    },
  },
];
