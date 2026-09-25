// Page registry: every page the build produces.
export default [
  {
    id: 'home', module: 'home', splash: true, file: 'index.html', path: '/', current: 'home', priority: 1.0,
    title: { key: 'meta.home.title' }, desc: { key: 'meta.home.desc' },
    css: ['scenes', 'home'], scripts: ['scenes', 'home'],
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', name: 'Click T Pvt. Ltd.', url: 'https://click-t.com', logo: 'https://click-t.com/assets/img/brand/logo.png', email: 'clickt@click-t.com', address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' } },
        { '@type': 'SoftwareApplication', name: 'Clickt', applicationCategory: 'BusinessApplication', operatingSystem: 'iOS, iPadOS, macOS', url: 'https://apps.apple.com/us/app/clickt/id6759891499', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      ],
    },
  },
  {
    id: 'teams', module: 'product', module_key: 'teams', file: 'pages/teams.html', path: '/pages/teams.html', current: 'teams', priority: 0.8,
    title: { key: 'meta.teams.title' }, desc: { key: 'meta.teams.desc' },
    css: ['scenes'], scripts: ['scenes'],
  },
  {
    id: 'checklist', module: 'product', module_key: 'checklist', file: 'pages/checklist.html', path: '/pages/checklist.html', current: 'checklist', priority: 0.8,
    title: { key: 'meta.checklist.title' }, desc: { key: 'meta.checklist.desc' },
    css: ['scenes'], scripts: ['scenes'],
  },
  {
    id: 'builder', module: 'product', module_key: 'builder', file: 'pages/builder.html', path: '/pages/builder.html', current: 'builder', priority: 0.8,
    title: { key: 'meta.builder.title' }, desc: { key: 'meta.builder.desc' },
    css: ['scenes'], scripts: ['scenes'],
  },
  {
    id: 'presentation', module: 'product', module_key: 'presentation', file: 'pages/presentation.html', path: '/pages/presentation.html', current: 'presentation', priority: 0.8,
    title: { key: 'meta.presentation.title' }, desc: { key: 'meta.presentation.desc' },
    css: ['scenes'], scripts: ['scenes'],
  },
  {
    id: 'clicktai', module: 'clicktai', file: 'pages/clicktai.html', path: '/pages/clicktai.html', current: 'clicktai', priority: 0.8,
    title: { key: 'meta.clicktai.title' }, desc: { key: 'meta.clicktai.desc' },
    css: ['scenes'], scripts: ['scenes'],
  },
  {
    id: 'pricing', module: 'pricing', file: 'pages/pricing.html', path: '/pages/pricing.html', current: 'pricing', priority: 0.8,
    title: { key: 'meta.pricing.title' }, desc: { key: 'meta.pricing.desc' },
    css: ['pages'], scripts: ['pricing'],
  },
  {
    id: 'solutions', module: 'solutions', file: 'pages/solutions.html', path: '/pages/solutions.html', current: 'solutions', priority: 0.8,
    title: { key: 'meta.solutions.title' }, desc: { key: 'meta.solutions.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-schools', module: 'industry', industry: 'schools', file: 'pages/solutions-schools.html', path: '/pages/solutions-schools.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-schools.title' }, desc: { key: 'meta.solutions-schools.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-healthcare', module: 'industry', industry: 'healthcare', file: 'pages/solutions-healthcare.html', path: '/pages/solutions-healthcare.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-healthcare.title' }, desc: { key: 'meta.solutions-healthcare.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-banks', module: 'industry', industry: 'banks', file: 'pages/solutions-banks.html', path: '/pages/solutions-banks.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-banks.title' }, desc: { key: 'meta.solutions-banks.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-ngos', module: 'industry', industry: 'ngos', file: 'pages/solutions-ngos.html', path: '/pages/solutions-ngos.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-ngos.title' }, desc: { key: 'meta.solutions-ngos.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-hotels', module: 'industry', industry: 'hotels', file: 'pages/solutions-hotels.html', path: '/pages/solutions-hotels.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-hotels.title' }, desc: { key: 'meta.solutions-hotels.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-restaurants', module: 'industry', industry: 'restaurants', file: 'pages/solutions-restaurants.html', path: '/pages/solutions-restaurants.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-restaurants.title' }, desc: { key: 'meta.solutions-restaurants.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'solutions-construction', module: 'industry', industry: 'construction', file: 'pages/solutions-construction.html', path: '/pages/solutions-construction.html', current: 'solutions', priority: 0.7,
    title: { key: 'meta.solutions-construction.title' }, desc: { key: 'meta.solutions-construction.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'services', module: 'services', file: 'pages/services.html', path: '/pages/services.html', current: 'services', priority: 0.7,
    title: { key: 'meta.services.title' }, desc: { key: 'meta.services.desc' },
    css: ['pages'], scripts: ['services'],
  },
  {
    id: 'about', module: 'about', file: 'pages/about.html', path: '/pages/about.html', current: 'about', priority: 0.7,
    title: { key: 'meta.about.title' }, desc: { key: 'meta.about.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'contact', module: 'contact', file: 'pages/contact.html', path: '/pages/contact.html', current: 'contact', priority: 0.7,
    title: { key: 'meta.contact.title' }, desc: { key: 'meta.contact.desc' },
    css: ['pages'], scripts: ['contact'],
  },
  {
    id: 'support', module: 'support', file: 'pages/support.html', path: '/pages/support.html', current: 'support', priority: 0.7,
    title: { key: 'meta.support.title' }, desc: { key: 'meta.support.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'security', module: 'security', file: 'pages/security.html', path: '/pages/security.html', current: 'security', priority: 0.7,
    title: { key: 'meta.security.title' }, desc: { key: 'meta.security.desc' },
    css: ['pages'], scripts: [],
  },
  {
    id: 'android', module: 'android', file: 'pages/android.html', path: '/pages/android.html', current: 'android', priority: 0.7,
    title: { key: 'meta.android.title' }, desc: { key: 'meta.android.desc' },
    css: ['pages', 'scenes'], scripts: ['android'],
  },
  {
    id: 'privacy', module: 'legal', file: 'pages/privacy.html', path: '/pages/privacy.html', current: 'privacy', priority: 0.4,
    title: { key: 'meta.privacy.title' }, desc: { key: 'meta.privacy.desc' }, css: ['pages'], scripts: [],
  },
  {
    id: 'terms', module: 'legal', file: 'pages/terms.html', path: '/pages/terms.html', current: 'terms', priority: 0.4,
    title: { key: 'meta.terms.title' }, desc: { key: 'meta.terms.desc' }, css: ['pages'], scripts: [],
  },
  {
    id: 'user-guide', module: 'guide', file: 'pages/user-guide.html', path: '/pages/user-guide.html', current: 'user-guide', priority: 0.6,
    title: { key: 'meta.user-guide.title' }, desc: { key: 'meta.user-guide.desc' }, css: ['pages'], scripts: ['guide'],
  },
  {
    id: 'not-found', module: 'notfound', file: '404.html', path: '/404.html', current: '', noindex: true,
    title: { key: 'meta.not-found.title' }, desc: { key: 'meta.not-found.desc' }, css: ['pages'], scripts: ['redirect'],
  },
];
