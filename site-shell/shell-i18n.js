/*
 * Shared-shell translations.
 *
 * Load this after i18n/en.js and i18n/ne.js, but before i18n.js. Keeping the
 * shell vocabulary here prevents every page from carrying a copied navigation
 * dictionary.
 */
(function () {
    "use strict";

    var dicts = window.ClicktI18nDict = window.ClicktI18nDict || {};
    var translations = {
        en: {
            siteShell: {
                brand: { logoAlt: "Clickt Logo" },
                utility: {
                    ariaLabel: "Clickt platform and language options",
                    platform: "Apple · Android",
                    languageLabel: "Choose language",
                    english: "EN",
                    nepali: "ने"
                },
                header: {
                    navigation: "Site navigation",
                    openMenu: "Open site navigation menu",
                    product: "Product",
                    solutions: "Solutions",
                    services: "Services",
                    about: "About Click T",
                    contact: "Contact"
                },
                product: {
                    overview: "Overview",
                    teams: "Teams",
                    checklist: "Checklist",
                    builder: "Builder",
                    presentation: "Presentation",
                    clicktai: "ClicktAI",
                    plans: "Plans"
                },
                industry: {
                    schools: "Schools",
                    healthcare: "Healthcare",
                    banks: "Banks",
                    ngos: "NGOs",
                    hotels: "Hotels",
                    restaurants: "Restaurants",
                    construction: "Construction & Real Estate"
                },
                footer: {
                    navigation: "Footer navigation",
                    groups: {
                        product: "Product",
                        solutions: "Solutions",
                        clickT: "Click T",
                        help: "Help",
                        legal: "Legal"
                    },
                    support: "Support",
                    userGuide: "User Guide",
                    privacy: "Privacy",
                    security: "Security & Trust",
                    terms: "Terms of Service",
                    writeUs: "Write Us",
                    email: "Email",
                    projectNote: "Have a project in mind? Send us a project brief.",
                    callUs: "Call Us",
                    phone: "Phone",
                    visitUs: "Visit Us",
                    office: "Office",
                    officeName: "Click T Pvt. Ltd.",
                    officeLocation: "Kathmandu, Nepal",
                    copyright: "© 2026 Click T. Pvt. Ltd. All rights reserved.",
                    download: "Download Clickt"
                }
            }
        },
        ne: {
            siteShell: {
                brand: { logoAlt: "क्लिक्ट लोगो" },
                utility: {
                    ariaLabel: "क्लिक्ट प्लेटफर्म र भाषा विकल्पहरू",
                    platform: "एप्पल · एन्ड्रोइड",
                    languageLabel: "भाषा रोज्नुहोस्",
                    english: "EN",
                    nepali: "ने"
                },
                header: {
                    navigation: "साइट नेभिगेसन",
                    openMenu: "साइट नेभिगेसन मेनु खोल्नुहोस्",
                    product: "उत्पादन",
                    solutions: "समाधानहरू",
                    services: "सेवाहरू",
                    about: "Click T बारे",
                    contact: "सम्पर्क"
                },
                product: {
                    overview: "अवलोकन",
                    teams: "टोली",
                    checklist: "चेकलिस्ट",
                    builder: "बिल्डर",
                    presentation: "प्रस्तुति",
                    clicktai: "ClicktAI",
                    plans: "योजनाहरू"
                },
                industry: {
                    schools: "विद्यालयहरू",
                    healthcare: "स्वास्थ्य सेवा",
                    banks: "बैंकहरू",
                    ngos: "गैरसरकारी संस्था",
                    hotels: "होटेलहरू",
                    restaurants: "रेस्टुरेन्टहरू",
                    construction: "निर्माण र घरजग्गा"
                },
                footer: {
                    navigation: "फुटर नेभिगेसन",
                    groups: {
                        product: "उत्पादन",
                        solutions: "समाधानहरू",
                        clickT: "Click T",
                        help: "सहयोग",
                        legal: "कानुनी"
                    },
                    support: "सहयोग",
                    userGuide: "प्रयोगकर्ता मार्गदर्शन",
                    privacy: "गोपनीयता",
                    security: "सुरक्षा र विश्वास",
                    terms: "सेवाका सर्तहरू",
                    writeUs: "हामीलाई लेख्नुहोस्",
                    email: "इमेल",
                    projectNote: "परियोजनाको सोचमा हुनुहुन्छ? हामीलाई परियोजना विवरण पठाउनुहोस्।",
                    callUs: "हामीलाई कल गर्नुहोस्",
                    phone: "फोन",
                    visitUs: "हामीलाई भेट्नुहोस्",
                    office: "कार्यालय",
                    officeName: "Click T Pvt. Ltd.",
                    officeLocation: "काठमाडौं, नेपाल",
                    copyright: "© २०२६ Click T Pvt. Ltd. सर्वाधिकार सुरक्षित।",
                    download: "Clickt डाउनलोड गर्नुहोस्"
                }
            }
        }
    };

    Object.keys(translations).forEach(function (lang) {
        dicts[lang] = dicts[lang] || {};
        dicts[lang].siteShell = translations[lang].siteShell;
    });
}());
