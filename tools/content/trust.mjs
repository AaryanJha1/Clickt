// Home page, November 2026: answers the three questions a buyer asks.
//   1. What problem does it solve?   the hero line names everyday jobs and who it is for.
//   2. Why is it better than now?    the story follows one team's week; "today vs with Clickt".
//   3. Can we adopt it safely?       four plain assurances, the rollout steps, the guarantee.
// Every claim here is a stated fact (own app and database on Business, setup in days to a
// week, approval before every change, the 90-day guarantee). No customer names or quotes
// until there are real ones. Loaded last, so it overrides older home copy.
export default {
  en: {
    // The founder's note on the home page: Clickt is customised to each organisation (no custom-software pitch).
    index: { founder: { message: 'Hey - I’m Aaryan, founder of Click T Pvt. Ltd. We design and build Clickt, and we customise it to each organisation’s needs. Write to us any time at <a href="mailto:clickt@click-t.com" style="color:inherit;text-decoration:underline">clickt@click-t.com</a> - I read every message.' } },
    // The Solutions menu in the header: one line under each industry.
    shell: { menu: { ind: {
      schools: 'Exams, events and departments', healthcare: 'Maintenance, checks and handoffs', banks: 'Branch readiness and follow-ups',
      ngos: 'Field work and reporting', hotels: 'Service, facilities and shifts', restaurants: 'Opening, service and closing',
      construction: 'Site follow-up and procurement', all: 'See how each team uses Clickt',
    } } },
    home: {
      hero: {
        lead: 'Assign tasks, turn meetings into to-do lists, analyse spreadsheets and build slides. ClicktAI drafts the work and waits for your OK. Built in Kathmandu for teams and organisations.',
        demo: 'Running a team or an organisation?',
        demoCta: 'Book a demo',
        demoSubject: 'Clickt demo request',
      },
      assure: {
        approve: { h: 'Nothing changes without you', b: 'Every change ClicktAI prepares is shown first and waits for your approval.' },
        own: { h: 'Your own app and database', b: 'On Business, your organisation’s data is never mixed with anyone else’s.' },
        days: { h: 'Set up in days', b: 'We set up your workspace and train your team, usually within a week.' },
        local: { h: 'Support from the builders', b: 'Talk to the team that makes Clickt, by phone or email.' },
      },
      ch1: {
        name: 'One team, one week',
        title: 'A busy week, without the <em>chaos.</em>',
        lead: 'Follow one team through a busy week. Every step is a real Clickt screen, and ClicktAI does the preparing.',
      },
      week: {
        notes: { when: 'Monday, 9:00', h: 'The meeting becomes the to-do list.', b: 'Record the meeting or type the notes. Extract Work lists every action, and you choose where each one goes: a teammate in Teams, or your own Checklist.' },
        teams: { when: 'Monday, 11:00', h: 'Everyone knows what is theirs.', b: 'Each task has an owner and a due date. Open tasks can be claimed in one tap, and the whole team can see who is doing what.' },
        calendar: { when: 'All week', h: 'Nobody has to chase.', b: 'Every deadline lands on one calendar. Reminders arrive before work is due, wait out quiet hours, and stop once it is done.' },
        checklist: { when: 'Tuesday', h: 'Routine work, done the same way every time.', b: 'Recurring checklists with priorities and deadlines keep the weekly routine on track, with progress anyone can see.' },
        builder: { when: 'Wednesday', h: 'The numbers, answered in plain words.', b: 'Drop in a spreadsheet and ask a question. Builder runs the analysis and turns it into charts you can share.' },
        presentation: { when: 'Thursday', h: 'The update is ready before the meeting.', b: 'Describe what the deck is for. ClicktAI drafts the slides in a designed theme, and you can edit anything before you present.' },
        ai: { when: 'Every step' },
      },
      compare: {
        kicker: 'Why switch',
        title: 'How work runs today, and how it runs with <em>Clickt.</em>',
        today: 'Today',
        with: 'With Clickt',
        r1: { a: 'Tasks handed out in group chats and lost in the scroll.', b: 'Every task has an owner, a due date and a status the team can see.' },
        r2: { a: 'Meeting notes that nobody turns into action.', b: 'Actions pulled out of the meeting and assigned before people leave.' },
        r3: { a: 'Messaging people to ask whether it is done yet.', b: 'Reminders follow up for you, and you are told when work is finished.' },
        r4: { a: 'Spreadsheets someone has to work through by hand.', b: 'Ask a question in plain words and get the chart.' },
        r5: { a: 'Slides built the night before the meeting.', b: 'A first draft of the deck in minutes, ready for your edits.' },
      },
      start: {
        kicker: 'Made in Kathmandu',
        lead: 'Clickt is built for the way organisations actually work. It sits beside the systems you already run, from school-management software to core banking, and makes the work around them clear.',
        title: 'Your team can be working in Clickt <em>within a week.</em>',
        s1: { h: 'Talk to us', b: 'A short call about how your team works today and what you want to fix first.' },
        s2: { h: 'We set it up', b: 'Your organisation’s own app and database, your teams and your first workflows. Usually done in days, and within a week.' },
        s3: { h: 'Your team starts', b: 'We train your people and stay on hand while the first projects run.' },
        guarantee: '90-day guarantee for first-time Business customers.',
        note: 'Business is priced in NPR for organisations in Nepal, with a 90-day guarantee for first-time customers.',
        guaranteeCta: 'See pricing',
        security: 'Security & Trust',
        demo: 'Book a demo',
      },
      final: {
        lead: 'Start with one project. Clickt does the setup, you make the calls. Running an organisation? Book a demo and we will walk you through it.',
      },
    },
  },
  ne: {
    index: { founder: { message: 'नमस्ते - म आर्यन हुँ, Click T Pvt. Ltd. को संस्थापक। Clickt लाई हामीले डिजाइन र निर्माण गरेका हौं, र हरेक संस्थाको आवश्यकताअनुसार यसलाई अनुकूलन गर्छौं। जहिले पनि लेख्नुहोस्: <a href="mailto:clickt@click-t.com" style="color:inherit;text-decoration:underline">clickt@click-t.com</a> - म हरेक सन्देश पढ्छु।' } },
    shell: { menu: { ind: {
      schools: 'परीक्षा, कार्यक्रम र विभाग', healthcare: 'मर्मत, जाँच र सिफ्ट हस्तान्तरण', banks: 'शाखा तयारी र फलो-अप',
      ngos: 'फिल्ड काम र रिपोर्टिङ', hotels: 'सेवा, सुविधा र सिफ्ट', restaurants: 'खोल्ने, सेवा र बन्द गर्ने काम',
      construction: 'साइट फलो-अप र खरिद', all: 'हरेक टोलीले Clickt कसरी प्रयोग गर्छ हेर्नुहोस्',
    } } },
    home: {
      hero: {
        lead: 'काम तोक्नुहोस्, बैठकलाई कामको सूचीमा बदल्नुहोस्, स्प्रेडसिट विश्लेषण गर्नुहोस् र स्लाइड बनाउनुहोस्। ClicktAI ले काम ड्राफ्ट गर्छ र तपाईंको स्वीकृति कुर्छ। टोली र संस्थाहरूका लागि काठमाडौंमा बनाइएको।',
        demo: 'टोली वा संस्था चलाउनुहुन्छ?',
        demoCta: 'डेमो बुक गर्नुहोस्',
        demoSubject: 'Clickt demo request',
      },
      assure: {
        approve: { h: 'तपाईंबिना केही परिवर्तन हुँदैन', b: 'ClicktAI ले तयार गरेको हरेक परिवर्तन पहिले देखाइन्छ र तपाईंको स्वीकृति कुर्छ।' },
        own: { h: 'तपाईंको आफ्नै एप र डाटाबेस', b: 'Business मा, तपाईंको संस्थाको डाटा अरू कसैको डाटासँग कहिल्यै मिसिँदैन।' },
        days: { h: 'केही दिनमै सेटअप', b: 'हामी तपाईंको कार्यक्षेत्र सेटअप गर्छौं र टोलीलाई तालिम दिन्छौं, प्रायः एक हप्ताभित्र।' },
        local: { h: 'बनाउनेहरूबाटै सहयोग', b: 'Clickt बनाउने टोलीसँग फोन वा इमेलबाट कुरा गर्नुहोस्।' },
      },
      ch1: {
        name: 'एउटा टोली, एउटा हप्ता',
        title: 'व्यस्त हप्ता, <em>भागदौडबिना।</em>',
        lead: 'व्यस्त हप्ताभर एउटा टोलीलाई पछ्याउनुहोस्। हरेक चरण Clickt कै वास्तविक स्क्रिन हो, र तयारी ClicktAI ले गर्छ।',
      },
      week: {
        notes: { when: 'सोमबार, ९:००', h: 'बैठक नै कामको सूची बन्छ।', b: 'बैठक रेकर्ड गर्नुहोस् वा नोट टाइप गर्नुहोस्। “काम निकाल्नुहोस्” ले हरेक कार्य सूचीबद्ध गर्छ, र हरेक कहाँ जाने तपाईं रोज्नुहुन्छ: Teams मा सहकर्मीलाई, वा आफ्नै Checklist मा।' },
        teams: { when: 'सोमबार, ११:००', h: 'सबैलाई थाहा हुन्छ कुन काम कसको हो।', b: 'हरेक कार्यको जिम्मेवार व्यक्ति र म्याद हुन्छ। खुला कार्य एक ट्यापमा लिन सकिन्छ, र कसले के गर्दैछ सम्पूर्ण टोलीले देख्छ।' },
        calendar: { when: 'हप्ताभर', h: 'कसैले पछ्याइरहनु पर्दैन।', b: 'हरेक म्याद एउटै क्यालेन्डरमा आउँछ। म्याद अघि रिमाइन्डर आउँछ, शान्त समयमा पर्खन्छ, र काम सकिएपछि रोकिन्छ।' },
        checklist: { when: 'मंगलबार', h: 'नियमित काम, हरेकपटक उही तरिकाले।', b: 'प्राथमिकता र म्यादसहितका दोहोरिने चेकलिस्टले साप्ताहिक दिनचर्या ठीक बाटोमा राख्छ, र प्रगति जो कोहीले देख्न सक्छ।' },
        builder: { when: 'बुधबार', h: 'तथ्याङ्कको जवाफ, सजिलो भाषामा।', b: 'स्प्रेडसिट राख्नुहोस् र प्रश्न सोध्नुहोस्। Builder ले विश्लेषण गर्छ र त्यसलाई बाँड्न मिल्ने चार्टमा बदल्छ।' },
        presentation: { when: 'बिहीबार', h: 'बैठकअघि नै अपडेट तयार।', b: 'डेक केका लागि हो भन्नुहोस्। ClicktAI ले डिजाइन गरिएको थिममा स्लाइड ड्राफ्ट गर्छ, र प्रस्तुत गर्नुअघि तपाईं जे पनि सम्पादन गर्न सक्नुहुन्छ।' },
        ai: { when: 'हरेक चरणमा' },
      },
      compare: {
        kicker: 'किन बदल्ने',
        title: 'आज काम कसरी चल्छ, र <em>Clickt</em> सँग कसरी चल्छ।',
        today: 'आज',
        with: 'Clickt सँग',
        r1: { a: 'समूह च्याटमा बाँडिएका र स्क्रोलमा हराएका काम।', b: 'हरेक कार्यको जिम्मेवार व्यक्ति, म्याद र टोलीले देख्ने स्थिति हुन्छ।' },
        r2: { a: 'कसैले कार्यमा नबदल्ने बैठकका नोट।', b: 'बैठकबाटै कार्य निकालिन्छ र मानिसहरू उठ्नुअघि नै तोकिन्छ।' },
        r3: { a: 'काम सकियो कि भनेर मानिसहरूलाई सोधिरहनु।', b: 'रिमाइन्डरले तपाईंको सट्टा पछ्याउँछ, र काम सकिएपछि तपाईंलाई जानकारी आउँछ।' },
        r4: { a: 'कसैले हातैले केलाउनुपर्ने स्प्रेडसिट।', b: 'सजिलो भाषामा प्रश्न सोध्नुहोस् र चार्ट पाउनुहोस्।' },
        r5: { a: 'बैठकको अघिल्लो रात बनाइएका स्लाइड।', b: 'केही मिनेटमै डेकको पहिलो ड्राफ्ट, तपाईंको सम्पादनका लागि तयार।' },
      },
      start: {
        kicker: 'काठमाडौंमा बनाइएको',
        lead: 'Clickt संस्थाहरू वास्तवमा काम गर्ने तरिकाअनुसार बनाइएको हो। यो तपाईंले पहिल्यै चलाइरहेका प्रणालीहरू, स्कूल व्यवस्थापन सफ्टवेयरदेखि कोर बैंकिङसम्म, को छेउमा रहन्छ र तिनका वरपरको कामलाई स्पष्ट बनाउँछ।',
        title: 'तपाईंको टोली <em>एक हप्ताभित्र</em> Clickt मा काम गर्न सक्छ।',
        s1: { h: 'हामीसँग कुरा गर्नुहोस्', b: 'तपाईंको टोली आज कसरी काम गर्छ र पहिले के सुधार्न चाहनुहुन्छ भन्ने छोटो कुराकानी।' },
        s2: { h: 'हामी सेटअप गर्छौं', b: 'तपाईंको संस्थाको आफ्नै एप र डाटाबेस, तपाईंका टोली र पहिलो कार्यप्रवाह। प्रायः केही दिनमा, र एक हप्ताभित्र सकिन्छ।' },
        s3: { h: 'तपाईंको टोली सुरु गर्छ', b: 'हामी तपाईंका मानिसहरूलाई तालिम दिन्छौं र पहिलो परियोजनाहरू चल्दा साथमै रहन्छौं।' },
        guarantee: 'पहिलोपटकका Business ग्राहकका लागि ९० दिने ग्यारेन्टी।',
        note: 'नेपालका संस्थाहरूका लागि Business को मूल्य NPR मा छ, र पहिलोपटकका ग्राहकका लागि ९० दिने ग्यारेन्टी छ।',
        guaranteeCta: 'मूल्य हेर्नुहोस्',
        security: 'सुरक्षा र विश्वास',
        demo: 'डेमो बुक गर्नुहोस्',
      },
      final: {
        lead: 'एउटा परियोजनाबाट सुरु गर्नुहोस्। सेटअप Clickt ले गर्छ, निर्णय तपाईं गर्नुहुन्छ। संस्था चलाउनुहुन्छ? डेमो बुक गर्नुहोस्, हामी सबै देखाउँछौं।',
      },
    },
  },
};
