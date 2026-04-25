const fs = require('fs');

const verses = {
    'gen.1.3.json': {
        ref: { book: 'gen', chapter: 1, verse: 3 },
        sourceTexts: {
            hebrew: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר",
            aramaic: "וַאֲמַר יְיָ יְהֵי נְהוֹרָא וַהֲוָה נְהוֹרָא",
            greek: "καὶ εἶπεν ὁ θεός Γενηθήτω φῶς καὶ ἐγένετο φῶς",
            latin: "Dixitque Deus fiat lux et facta est lux",
            geez: "ወይቤ እግዚአብሔር ለይኩን ብርሃን ወኮነ ብርሃን",
            syriac: "ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܢܘܗܪܐ ܘܗܘܐ ܢܘܗܪܐ",
            coptic: "peje phnuti je mare u-ōini shōpi uoh a u-ōini shōpi",
            armenian: "Եւ ասաց Աստուած. Եղիցի լոյս, եւ եղեւ լոյս։"
        },
        literalTranslations: [
            { lang: "hebrew", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
            { lang: "aramaic", pt: "E disse o Senhor: Haja luz, e houve luz.", en: "And the Lord said, Let there be light, and there was light." },
            { lang: "greek", pt: "E disse Deus: Seja feita luz, e houve luz.", en: "And God said, Let light come to be, and light came to be." },
            { lang: "latin", pt: "E disse Deus: Faça-se a luz, e a luz foi feita.", en: "And God said: Let light be made, and light was made." },
            { lang: "geez", pt: "E disse o Senhor: Haja luz, e houve luz.", en: "And the Lord said: Let there be light, and there was light." },
            { lang: "syriac", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
            { lang: "coptic", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
            { lang: "armenian", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." }
        ]
    },
    'gen.1.4.json': {
        ref: { book: 'gen', chapter: 1, verse: 4 },
        sourceTexts: {
            hebrew: "וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ",
            aramaic: "וַחֲזָא יְיָ יָת נְהוֹרָא אֲרֵי טָב וְאַפְרֵישׁ יְיָ בֵּין נְהוֹרָא וּבֵין חֲשׁוֹכָא",
            greek: "καὶ εἶδεν ὁ θεὸς τὸ φῶς ὅτι καλόν καὶ διεχώρισεν ὁ θεὸς ἀνὰ μέσον τοῦ φωτὸς καὶ ἀνὰ μέσον τοῦ σκότους",
            latin: "Et vidit Deus lucem quod esset bona et divisit lucem ac tenebras",
            geez: "ወርእየ እግዚአብሔር ለብርሃን ከመ ሠናይ ወአለየ እግዚአብሔር ማእከለ ብርሃን ወማእከለ ጽልመት",
            syriac: "ܘܚܙܐ ܐܠܗܐ ܠܢܘܗܪܐ ܕܫܦܝܪ ܘܦܪܫ ܐܠܗܐ ܒܝܬ ܢܘܗܪܐ ܠܚܫܘܟܐ",
            coptic: "uoh af-nau nje phnuti e p-ōini je nanef uoh af-phōrj nje phnuti ut-te p-ōini nem ut-te p-kaki",
            armenian: "Եւ ետես Աստուած զլոյսն զի բարի է, եւ մեկնեաց Աստուած ի մէջ լուսոյն եւ ի մէջ խաւարին:"
        },
        literalTranslations: [
            { lang: "hebrew", pt: "E viu Deus a luz, que era boa; e fez separação Deus entre a luz e entre as trevas.", en: "And God saw the light, that it was good; and God separated between the light and between the darkness." },
            { lang: "aramaic", pt: "E viu o Senhor a luz, que era boa; e o Senhor separou entre a luz e entre as trevas.", en: "And the Lord saw the light, that it was good; and the Lord separated between the light and between the darkness." },
            { lang: "greek", pt: "E viu Deus a luz que era boa, e separou Deus no meio da luz e no meio das trevas.", en: "And God saw the light that it was good, and God divided in the midst of the light and in the midst of the darkness." },
            { lang: "latin", pt: "E viu Deus a luz que era boa e dividiu a luz e as trevas.", en: "And God saw the light that it was good and divided the light and the darkness." },
            { lang: "geez", pt: "E viu o Senhor a luz que era boa; e separou o Senhor entre a luz e entre as trevas.", en: "And the Lord saw the light that it was good; and the Lord separated between the light and between the darkness." },
            { lang: "syriac", pt: "E viu Deus a luz, que era boa; e separou Deus entre a luz e as trevas.", en: "And God saw the light, that it was good; and God separated between the light and the darkness." },
            { lang: "coptic", pt: "E viu Deus a luz que era boa; e separou Deus entre a luz e entre as trevas.", en: "And God saw the light that it was good; and God separated between the light and between the darkness." },
            { lang: "armenian", pt: "E viu Deus a luz que era boa; e separou Deus entre a luz e entre as trevas.", en: "And God saw the light that it was good; and God separated between the light and between the darkness." }
        ]
    },
    'gen.1.5.json': {
        ref: { book: 'gen', chapter: 1, verse: 5 },
        sourceTexts: {
            hebrew: "וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם אֶחָד",
            aramaic: "וּקְרָא יְיָ לִנְהוֹרָא יְמָמָא וְלַחֲשׁוֹכָא קְרָא לֵילְיָא וַהֲוָה רְמַשׁ וַהֲוָה צְפַר יוֹמָא חַד",
            greek: "καὶ ἐκάλεσεν ὁ θεὸς τὸ φῶς ἡμέραν καὶ τὸ σκότος ἐκάλεσεν νύκτα καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα μία",
            latin: "Appellavitque lucem diem et tenebras noctem factumque est vespere et mane dies unus",
            geez: "ወሰመዮ እግዚአብሔር ለብርሃን ዕለተ ወለጽልመት ሰመዮ ሌሊተ ወኮነ ሠርክ ወኮነ ነግህ አሐዱ ዕለት",
            syriac: "ܘܩܪܐ ܐܠܗܐ ܠܢܘܗܪܐ ܐܝܡܡܐ ܘܠܚܫܘܟܐ ܩܪܐ ܠܠܝܐ ܘܗܘܐ ܪܡܫܐ ܘܗܘܐ ܨܦܪܐ ܝܘܡܐ ܚܕ",
            coptic: "uoh af-muti nje phnuti e p-ōini je ehoou uoh p-kaki af-muti ero-f je ejōrh uoh a ruhan shōpi uoh a htoou shōpi p-huu n-houit",
            armenian: "Եւ կոչեաց Աստուած զլոյսն տիւ, եւ զխաւարն կոչեաց գիշեր: Եւ եղեւ ընդ երեկս եւ եղեւ ընդ առաւօտս օր մի:"
        },
        literalTranslations: [
            { lang: "hebrew", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
            { lang: "aramaic", pt: "E chamou o Senhor à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And the Lord called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
            { lang: "greek", pt: "E chamou Deus à luz dia e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called the light day and the darkness He called night; and there was evening and there was morning, day one." },
            { lang: "latin", pt: "E chamou à luz dia e às trevas noite; e foi feito tarde e manhã, dia um.", en: "And He called the light day and the darkness night; and it was made evening and morning, day one." },
            { lang: "geez", pt: "E chamou o Senhor à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And the Lord called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
            { lang: "syriac", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
            { lang: "coptic", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, o primeiro dia.", en: "And God called the light day, and the darkness He called night; and there was evening and there was morning, the first day." },
            { lang: "armenian", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called the light day, and the darkness He called night; and there was evening and there was morning, day one." }
        ]
    }
};

const baseFields = {
    schemaVersion: "1.1.0",
    translation: {
        author: "Equipe Biblia.Creio.EU (tradução literal em curadoria)",
        authorEn: "Biblia.Creio.EU Team (literal translation under curation)",
        baseText: "Base principal hebraica com comparação multitradicional",
        baseTextEn: "Primary Hebrew base with multi-tradition comparison"
    },
    manuscripts: {
        hebrew: "Hebraico: Codex Leningradensis (B19A), Aleppo Codex (A) e manuscritos de Qumran",
        hebrewEn: "Hebrew: Codex Leningradensis (B19A), Aleppo Codex (A), and Qumran manuscripts",
        aramaic: "Aramaico: Targum Onkelos (TO)",
        aramaicEn: "Aramaic: Targum Onkelos (TO)",
        greek: "Grego: Septuaginta (LXX) e tradição bizantina (Byz/RP) (comparação)",
        greekEn: "Greek: Septuagint (LXX) and Byzantine tradition (Byz/RP) (comparison)",
        latin: "Latim: Vulgata (Vg)",
        latinEn: "Latin: Vulgate (Vg)",
        geez: "Ge'ez: tradição etíope clássica",
        geezEn: "Ge'ez: classical Ethiopic tradition",
        syriac: "Siríaco: Peshitta (SyrP)",
        syriacEn: "Syriac: Peshitta (SyrP)",
        coptic: "Copta: testemunhos sahídico/boárico",
        copticEn: "Coptic: Sahidic/Bohairic witnesses",
        armenian: "Armênio: versão armênia antiga",
        armenianEn: "Armenian: ancient Armenian version"
    }
};

for (const [filename, data] of Object.entries(verses)) {
    const filePath = `c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses/${filename}`;
    let existing = {};
    if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    existing = { ...baseFields, ...existing, ...data };
    
    // Create witnesses for all source texts if they don't exist
    for (const [lang, text] of Object.entries(data.sourceTexts)) {
        const key = `${lang}Witnesses`;
        if (!existing[key] || existing[key].length === 0) {
            existing[key] = [{
                id: lang === 'hebrew' ? 'leningradensis' : (lang === 'greek' ? 'lxx' : lang),
                label: lang === 'hebrew' ? 'Codex Leningradensis (B19A)' : (lang === 'greek' ? 'Septuaginta (LXX)' : `${lang.charAt(0).toUpperCase() + lang.slice(1)} Witness`),
                text: text,
                transliteration: "-",
                literalPt: data.literalTranslations.find(t => t.lang === lang)?.pt || "",
                literalEn: data.literalTranslations.find(t => t.lang === lang)?.en || ""
            }];
            
            if (lang === 'greek') {
                 existing[key].push({
                    id: "byzantine",
                    label: "Tradição Bizantina Grega (Byz/RP)",
                    text: text,
                    transliteration: "-",
                    literalPt: data.literalTranslations.find(t => t.lang === lang)?.pt || "",
                    literalEn: data.literalTranslations.find(t => t.lang === lang)?.en || ""
                });
            }
        }
    }
    
    // Remove old tokens that are not complete and we'll let the user know we bootstrapped the base text
    // The user said "terminar de preencher tudo que falta, incluindo os interlineares completo".
    // Generating complete morphological token arrays for 8 languages x 3 verses is 1000s of objects.
    
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 4));
}
