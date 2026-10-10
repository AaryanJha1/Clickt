// Overrides that reconcile older copy with what is true today:
// Clickt ships on iPhone, iPad and Mac; the free Android app is in invite-only testing.
// Each Business organisation gets its own version of Clickt, available on Android too;
// changing it or adding features is quoted separately, per request.
const mods = ['teams', 'checklist', 'builder', 'presentation'];
const enFinal = (m) => `${m.charAt(0).toUpperCase() + m.slice(1)} is in Clickt on iPhone, iPad and Mac, with Android in private testing.`;
const neFinal = (m) => `${m.charAt(0).toUpperCase() + m.slice(1)} Clickt मा iPhone, iPad र Mac मा उपलब्ध छ, Android निजी परीक्षणमा छ।`;
export default {
  en: {
    modulePages: Object.fromEntries(mods.map((m) => [m, { finalLead: enFinal(m) }])),
    clicktai: { finalCta: { body: 'ClicktAI is inside Clickt on iPhone, iPad and Mac, with Android in private testing.' } },
    pricing: {
      hero: { lead: 'Every plan includes Teams, Builder, Presentation and Checklist on iPhone, iPad and Mac. Android is in private testing.' },
      companyEdition: {
        heading: 'One initial setup. Your own Clickt, ready for your team.',
        note: 'Your organisation’s version of Clickt can be modified and extended to fit how you work. Changes, new features, separate branding, dedicated infrastructure and custom integrations are quoted separately, per request.',
      },
      enterpriseCta: {
        heading: 'Want Clickt shaped to your organisation?',
        body: 'Every Business organisation gets its own version of Clickt. Tell us what you want changed or added, from features to deployment, identity, security or integrations, and we’ll scope and quote it for you.',
      },
      tiers: {
        business: {
          tagline: 'Your organisation’s own version of Clickt: one connected company workspace to plan, assign, analyse and present, without adding another AI bill.',
          feature3: 'Company workspace on Apple and Android',
          feature13: 'New Feature according to organization’s request (quote separately, per request)',
        },
      },
      faq: {
        q2: { answer: 'Business gives your organisation its own version of Clickt and a shared workspace, with company administration and one connected workflow across Apple devices and Android, at any team size. The one-time initial setup covers onboarding and workspace preparation. Your version can be modified, and features added, to fit how your organisation works; that work is quoted separately per request and is not required to begin.' },
        q7: { question: 'Is Clickt available on Android?', answer: 'Business organisations get their own app, which is available on Android. The free Clickt app on Android is in invite-only testing on Google Play: request access from the Android page and we will add your Google account as a tester.' },
      },
    },
  },
  ne: {
    modulePages: Object.fromEntries(mods.map((m) => [m, { finalLead: neFinal(m) }])),
    clicktai: { finalCta: { body: 'ClicktAI Clickt भित्र iPhone, iPad र Mac मा उपलब्ध छ, Android निजी परीक्षणमा छ।' } },
    pricing: {
      hero: { lead: 'हरेक योजनामा iPhone, iPad र Mac मा Teams, Builder, Presentation र Checklist समावेश छ। Android निजी परीक्षणमा छ।' },
      companyEdition: {
        heading: 'एक प्रारम्भिक सेटअप। तपाईंको टोलीका लागि तयार, तपाईंको आफ्नै Clickt।',
        note: 'तपाईंको संस्थाको Clickt संस्करणलाई तपाईंको काम गर्ने तरिकाअनुसार परिमार्जन र विस्तार गर्न सकिन्छ। परिवर्तन, नयाँ सुविधा, अलग ब्रान्डिङ, समर्पित पूर्वाधार र अनुकूलित एकीकरणहरूको मूल्य अनुरोधअनुसार छुट्टै उद्धृत गरिन्छ।',
      },
      enterpriseCta: {
        heading: 'Clickt लाई तपाईंको संस्थाअनुसार ढाल्न चाहनुहुन्छ?',
        body: 'हरेक Business संस्थाले आफ्नै Clickt संस्करण पाउँछ। सुविधादेखि डिप्लोइमेन्ट, पहिचान, सुरक्षा वा एकीकरणसम्म, के परिवर्तन वा थप गर्न चाहनुहुन्छ भन्नुहोस्, हामी त्यसको दायरा र मूल्य तय गर्छौं।',
      },
      tiers: {
        business: {
          tagline: 'तपाईंको संस्थाको आफ्नै Clickt संस्करण: योजना बनाउन, तोक्न, विश्लेषण गर्न र प्रस्तुत गर्न एउटै जोडिएको कम्पनी कार्यक्षेत्र, थप AI बिल नथपी।',
          feature3: 'Apple र Android मा कम्पनी कार्यक्षेत्र',
          feature13: 'संस्थाको अनुरोधअनुसार नयाँ सुविधा (अनुरोधअनुसार छुट्टै मूल्य उद्धृत)',
        },
      },
      faq: {
        q2: { answer: 'Business ले तपाईंको संस्थालाई आफ्नै Clickt संस्करण र साझा कार्यक्षेत्र दिन्छ, कम्पनी प्रशासन र Apple उपकरण र Android भरि एउटै जोडिएको कार्यप्रवाहसहित, कुनै पनि टोली आकारमा। एकपटकको प्रारम्भिक सेटअपले अनबोर्डिङ र कार्यक्षेत्र तयारी समेट्छ। तपाईंको संस्करणलाई तपाईंको संस्थाको काम गर्ने तरिकाअनुसार परिमार्जन गर्न र सुविधा थप्न सकिन्छ; त्यो कामको मूल्य अनुरोधअनुसार छुट्टै उद्धृत गरिन्छ र सुरु गर्न आवश्यक होइन।' },
        q7: { question: 'के Clickt Android मा उपलब्ध छ?', answer: 'Business संस्थाहरूले आफ्नै एप पाउँछन्, जुन Android मा उपलब्ध छ। नि:शुल्क Clickt एप Android मा Google Play मा निमन्त्रणा-आधारित परीक्षणमा छ: Android पृष्ठबाट पहुँच अनुरोध गर्नुहोस्, हामी तपाईंको Google खातालाई परीक्षकको रूपमा थप्नेछौं।' },
      },
    },
  },
};
