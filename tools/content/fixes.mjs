// Overrides that reconcile older copy with what is true today:
// Clickt ships on iPhone, iPad and Mac; the free Android app is in invite-only testing.
// Business organisations get their own app, which is available on Android too.
const mods = ['teams', 'checklist', 'builder', 'presentation'];
const enFinal = (m) => `${m.charAt(0).toUpperCase() + m.slice(1)} is in Clickt on iPhone, iPad and Mac, with Android in private testing.`;
const neFinal = (m) => `${m.charAt(0).toUpperCase() + m.slice(1)} Clickt मा iPhone, iPad र Mac मा उपलब्ध छ, Android निजी परीक्षणमा छ।`;
export default {
  en: {
    modulePages: Object.fromEntries(mods.map((m) => [m, { finalLead: enFinal(m) }])),
    clicktai: { finalCta: { body: 'ClicktAI is inside Clickt on iPhone, iPad and Mac, with Android in private testing.' } },
    pricing: {
      hero: { lead: 'Every plan includes Teams, Builder, Presentation and Checklist on iPhone, iPad and Mac. Android is in private testing.' },
      companyEdition: { note: 'Separate branding, dedicated infrastructure, and custom integrations are optional services quoted only when your organisation needs them.' },
      tiers: { business: { feature3: 'Company workspace on Apple and Android' } },
      faq: {
        q2: { answer: 'Business gives your organisation its own Clickt app and shared workspace, with company administration and one connected workflow across Apple devices and Android, at any team size. The one-time initial setup covers onboarding and workspace preparation. Separate branding or dedicated infrastructure is optional custom scope, not a requirement to begin.' },
        q7: { question: 'Is Clickt available on Android?', answer: 'Business organisations get their own app, which is available on Android. The free Clickt app on Android is in invite-only testing on Google Play: request access from the Android page and we will add your Google account as a tester.' },
      },
    },
  },
  ne: {
    modulePages: Object.fromEntries(mods.map((m) => [m, { finalLead: neFinal(m) }])),
    clicktai: { finalCta: { body: 'ClicktAI Clickt भित्र iPhone, iPad र Mac मा उपलब्ध छ, Android निजी परीक्षणमा छ।' } },
    pricing: {
      hero: { lead: 'हरेक योजनामा iPhone, iPad र Mac मा Teams, Builder, Presentation र Checklist समावेश छ। Android निजी परीक्षणमा छ।' },
      companyEdition: { note: 'अलग ब्रान्डिङ, समर्पित पूर्वाधार, र अनुकूलित एकीकरणहरू वैकल्पिक सेवाहरू हुन् जुन तपाईंको संस्थालाई आवश्यक परेमा मात्र उद्धृत गरिन्छ।' },
      tiers: { business: { feature3: 'Apple र Android मा कम्पनी कार्यक्षेत्र' } },
      faq: {
        q2: { answer: 'Business ले तपाईंको संस्थालाई आफ्नै Clickt एप र साझा कार्यक्षेत्र दिन्छ, कम्पनी प्रशासन र Apple उपकरण र Android भरि एउटै जोडिएको कार्यप्रवाहसहित, कुनै पनि टोली आकारमा। एकपटकको प्रारम्भिक सेटअपले अनबोर्डिङ र कार्यक्षेत्र तयारी समेट्छ। अलग ब्रान्डिङ वा समर्पित पूर्वाधार वैकल्पिक अनुकूलित दायरा हो, सुरु गर्न आवश्यक होइन।' },
        q7: { question: 'के Clickt Android मा उपलब्ध छ?', answer: 'Business संस्थाहरूले आफ्नै एप पाउँछन्, जुन Android मा उपलब्ध छ। नि:शुल्क Clickt एप Android मा Google Play मा निमन्त्रणा-आधारित परीक्षणमा छ: Android पृष्ठबाट पहुँच अनुरोध गर्नुहोस्, हामी तपाईंको Google खातालाई परीक्षकको रूपमा थप्नेछौं।' },
      },
    },
  },
};
