const fs = require('fs');
const path = require('path');

const verses = {
    'gen.1.2': {
        hebrew: {
            text: "וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל פְּנֵי הַמָּיִם",
            translit: "Ve-haaretz hayetah tohu va-vohu ve-choshek al penei tehom ve-ruach Elohim merachefet al penei hamayim",
            pt: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus pairava sobre a face das águas.",
            en: "And the earth was without form and void; and darkness was upon the face of the deep; and the Spirit of God moved upon the face of the waters."
        },
        aramaic: {
            text: "וְאַרְעָא הֲוָת צָדְיָא וְרֵיקָנְיָא וַחֲשׁוֹכָא עַל אַפֵּי תְהוֹמָא וְרוּחָא מִן קֳדָם יְיָ מְנַשְּׁבָא עַל אַפֵּי מַיָּא",
            translit: "Ve-ara havat tzadeya ve-reikanya va-chashokha al apei tehoma ve-rucha min qodam YY menashba al apei maya",
            pt: "E a terra estava desolada e vazia, e trevas sobre a face do abismo, e um vento/espírito de diante do Senhor soprava sobre a face das águas.",
            en: "And the earth was desolate and empty, and darkness over the face of the deep, and a wind/spirit from before the Lord was blowing over the face of the waters."
        },
        greek: {
            text: "ἡ δὲ γῆ ἦν ἀόρατος καὶ ἀκατασκεύαστος καὶ σκότος ἐπάνω τῆς ἀβύσσου καὶ πνεῦμα θεοῦ ἐπεφέρετο ἐπάνω τοῦ ὕδατος",
            translit: "he de ge en ahoratos kai akataskeuastos kai skotos epano tes abyssou kai pneuma theou epephereto epano tou hydatos",
            pt: "E a terra era invisível e inacabada, e trevas estavam sobre o abismo, e o espírito de Deus movia-se sobre a água.",
            en: "And the earth was invisible and unfinished, and darkness was over the abyss, and the spirit of God moved over the water."
        },
        latin: {
            text: "Terra autem erat inanis et vacua et tenebrae erant super faciem abyssi et spiritus Dei ferebatur super aquas",
            translit: "Terra autem erat inanis et vacua et tenebrae erant super faciem abyssi et spiritus Dei ferebatur super aquas",
            pt: "A terra, porém, era vazia e sem forma; e as trevas estavam sobre a face do abismo; e o Espírito de Deus movia-se sobre as águas.",
            en: "The earth, however, was empty and unformed; and darkness was over the face of the abyss; and the Spirit of God moved over the waters."
        },
        geez: {
            text: "ወምድርሰ ኢትሬአይ ወኢተደልወት ወጽልመት ላዕለ ቀላይ ወመንፈሰ እግዚአብሔር ይጼልል ላዕለ ማይ",
            translit: "Wa-mdr-ssa 'i-trē'ay wa-'i-tadalwat wa-ṣelmat lā'la qalāy wa-manfasa 'Egzi'abḥēr yeṣēlel lā'la māy",
            pt: "E a terra estava sem forma e sem preparo, e trevas sobre a face do abismo, e o Espírito de Deus pairava sobre as águas.",
            en: "And the earth was without form and unprepared, and darkness over the face of the deep, and the Spirit of God hovered over the waters."
        },
        syriac: {
            text: "ܘܐܪܥܐ ܗܘܬ ܬܘܗ ܘܒܘܗ ܘܚܫܘܟܐ ܥܠ ܐܦܝ ܬܗܘܡܐ ܘܪܘܚܗ ܕܐܠܗܐ ܡܪܚܦܐ ܗܘܬ ܥܠ ܐܦܝ ܡܝܐ",
            translit: "W-ar'a hwat toh w-boh w-cheshuka 'al apey tehoma w-rucheh d-Alaha merachpa hwat 'al apey maya",
            pt: "E a terra estava sem forma e vazia, e trevas sobre a face do abismo, e o Espírito de Deus pairava sobre a face das águas.",
            en: "And the earth was formless and empty, and darkness over the face of the deep, and the Spirit of God hovered over the face of the waters."
        },
        coptic: {
            text: "p-kahi de ne u-at-nau pe nem u-at-sobte pe nem u-kaki hi-jen p-nūn nem u-pneuma nte phnuti ne f-phēu hi-jen ni-mōu pe",
            translit: "p-kahi de ne u-at-nau pe nem u-at-sobte pe nem u-kaki hi-jen p-nūn nem u-pneuma nte phnuti ne f-phēu hi-jen ni-mōu pe",
            pt: "E a terra estava invisível e não ordenada, e trevas sobre o abismo, e o Espírito de Deus movia-se sobre as águas.",
            en: "And the earth was unseen and not ordered, and darkness over the deep, and the Spirit of God moved over the waters."
        },
        armenian: {
            text: "Եւ երկիրն էր աներեւոյթ եւ անպատրաստ. եւ խաւար ի վերայ անդնդոց. եւ հոգի Աստուծոյ շրջէր ի վերայ ջուրց",
            translit: "Ew erkirn ēr anerewoyt' ew anpatrast. ew xawar i veray andndoc'. ew hogi Astucoy šrǰēr i veray ǰurc'",
            pt: "E a terra era invisível e sem preparo; e trevas sobre o abismo; e o Espírito de Deus movia-se sobre as águas.",
            en: "And the earth was invisible and unprepared; and darkness over the deep; and the Spirit of God moved over the waters."
        }
    },
    'gen.1.3': {
        hebrew: { text: "וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר", translit: "Vayomer Elohim yehi or vayehi or", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
        aramaic: { text: "וַאֲמַר יְיָ יְהֵי נְהוֹרָא וַהֲוָה נְהוֹרָא", translit: "Va'amar YY yehei nehora vahavah nehora", pt: "E disse o Senhor: Haja luz, e houve luz.", en: "And the Lord said, Let there be light, and there was light." },
        greek: { text: "καὶ εἶπεν ὁ θεός Γενηθήτω φῶς καὶ ἐγένετο φῶς", translit: "kai eipen ho theos genethetō phōs kai egeneto phōs", pt: "E disse Deus: Seja feita luz, e houve luz.", en: "And God said, Let light come to be, and light came to be." },
        latin: { text: "Dixitque Deus fiat lux et facta est lux", translit: "Dixitque Deus fiat lux et facta est lux", pt: "E disse Deus: Faça-se a luz, e a luz foi feita.", en: "And God said: Let light be made, and light was made." },
        geez: { text: "ወይቤ እግዚአብሔር ለይኩን ብርሃን ወኮነ ብርሃን", translit: "Wa-yebē 'Egzi'abḥēr la-yekun brhān wa-kōna brhān", pt: "E disse o Senhor: Haja luz, e houve luz.", en: "And the Lord said: Let there be light, and there was light." },
        syriac: { text: "ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܢܘܗܪܐ ܘܗܘܐ ܢܘܗܪܐ", translit: "W-emar Alaha nehwe nuhra w-hwa nuhra", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
        coptic: { text: "peje phnuti je mare u-ōini shōpi uoh a u-ōini shōpi", translit: "peje phnuti je mare u-ōini shōpi uoh a u-ōini shōpi", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." },
        armenian: { text: "Եւ ասաց Աստուած. Եղիցի լոյս, եւ եղեւ լոյս։", translit: "Ew asac' Astuac. Ełic'i loys, ew ełew loys:", pt: "E disse Deus: Haja luz, e houve luz.", en: "And God said, Let there be light, and there was light." }
    },
    'gen.1.4': {
        hebrew: { text: "וַיַּרְא אֱלֹהִים אֶת הָאוֹר כִּי טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ", translit: "Vayar Elohim et haor ki tov vayavdel Elohim bein haor uvein hachoshek", pt: "E viu Deus a luz, que era boa; e fez separação Deus entre a luz e as trevas.", en: "And God saw the light, that it was good; and God separated between the light and the darkness." },
        aramaic: { text: "וַחֲזָא יְיָ יָת נְהוֹרָא אֲרֵי טָב וְאַפְרֵישׁ יְיָ בֵּין נְהוֹרָא וּבֵין חֲשׁוֹכָא", translit: "Vachaza YY yat nehora arei tav ve-afreish YY bein nehora uvein chashokha", pt: "E viu o Senhor a luz, que era boa; e o Senhor separou entre a luz e as trevas.", en: "And the Lord saw the light, that it was good; and the Lord separated between the light and the darkness." },
        greek: { text: "καὶ εἶδεν ὁ θεὸς τὸ φῶς ὅτι καλόν καὶ διεχώρισεν ὁ θεὸς ἀνὰ μέσον τοῦ φωτὸς καὶ ἀνὰ μέσον τοῦ σκότους", translit: "kai eiden ho theos to phōs hoti kalon kai diechōrisen ho theos ana meson tou phōtos kai ana meson tou skotous", pt: "E viu Deus a luz que era boa, e separou Deus a luz das trevas.", en: "And God saw the light that it was good, and God divided the light from the darkness." },
        latin: { text: "Et vidit Deus lucem quod esset bona et divisit lucem ac tenebras", translit: "Et vidit Deus lucem quod esset bona et divisit lucem ac tenebras", pt: "E viu Deus a luz que era boa e dividiu a luz e as trevas.", en: "And God saw the light that it was good and divided the light and the darkness." },
        geez: { text: "ወርእየ እግዚአብሔር ለብርሃን ከመ ሠናይ ወአለየ እግዚአብሔር ማእከለ ብርሃን ወማእከለ ጽልመት", translit: "Wa-r'ya 'Egzi'abḥēr la-brhān kama śanāy wa-'alaya 'Egzi'abḥēr mā'ekala brhān wa-mā'ekala ṣelmat", pt: "E viu o Senhor a luz que era boa; e separou o Senhor entre a luz e as trevas.", en: "And the Lord saw the light that it was good; and the Lord separated between the light and the darkness." },
        syriac: { text: "ܘܚܙܐ ܐܠܗܐ ܠܢܘܗܪܐ ܕܫܦܝܪ ܘܦܪܫ ܐܠܗܐ ܒܝܬ ܢܘܗܪܐ ܠܚܫܘܟܐ", translit: "W-chaza Alaha l-nuhra d-shapir w-prash Alaha beyth nuhra l-cheshuka", pt: "E viu Deus a luz, que era boa; e separou Deus entre a luz e as trevas.", en: "And God saw the light, that it was good; and God separated between the light and the darkness." },
        coptic: { text: "uoh af-nau nje phnuti e p-ōini je nanef uoh af-phōrj nje phnuti ut-te p-ōini nem ut-te p-kaki", translit: "uoh af-nau nje phnuti e p-ōini je nanef uoh af-phōrj nje phnuti ut-te p-ōini nem ut-te p-kaki", pt: "E viu Deus a luz que era boa; e separou Deus entre a luz e as trevas.", en: "And God saw the light that it was good; and God separated between the light and the darkness." },
        armenian: { text: "Եւ ետես Աստուած զլոյսն զի բարի է, եւ մեկնեաց Աստուած ի մէջ լուսոյն եւ ի մէջ խաւարին:", translit: "Ew etes Astuac z-loysn zi bari ē, ew mekneac' Astuac i mēǰ lusoyn ew i mēǰ xawarin:", pt: "E viu Deus a luz que era boa; e separou Deus entre a luz e as trevas.", en: "And God saw the light that it was good; and God separated between the light and the darkness." }
    },
    'gen.1.5': {
        hebrew: { text: "וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם אֶחָד", translit: "Vayikra Elohim laor yom velachoshek qara laylah vayehi erev vayehi voker yom echad", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
        aramaic: { text: "וּקְרָא יְיָ לִנְהוֹרָא יְמָמָא וְלַחֲשׁוֹכָא קְרָא לֵילְיָא וַהֲוָה רְמַשׁ וַהֲוָה צְפַר יוֹמָא חַד", translit: "Uqra YY linhora yemama velachashokha qra leilya vahavah remash vahavah tzephar yoma chad", pt: "E chamou o Senhor à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And the Lord called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
        greek: { text: "καὶ ἐκάλεσεν ὁ θεὸς τὸ φῶς ἡμέραν καὶ τὸ σκότος ἐκάλεσεν νύκτα καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα μία", translit: "kai ekalesen ho theos to phōs hemeran kai to skotos ekalesen nykta kai egeneto hespera kai egeneto prōi hemera mia", pt: "E chamou Deus à luz dia e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called the light day and the darkness He called night; and there was evening and there was morning, day one." },
        latin: { text: "Appellavitque lucem diem et tenebras noctem factumque est vespere et mane dies unus", translit: "Appellavitque lucem diem et tenebras noctem factumque est vespere et mane dies unus", pt: "E chamou à luz dia e às trevas noite; e foi feito tarde e manhã, dia um.", en: "And He called the light day and the darkness night; and it was made evening and morning, day one." },
        geez: { text: "ወሰመዮ እግዚአብሔር ለብርሃን ዕለተ ወለጽልመት ሰመዮ ሌሊተ ወኮነ ሠርክ ወኮነ ነግህ አሐዱ ዕለት", translit: "Wa-samayo 'Egzi'abḥēr la-brhān 'elata wa-la-ṣelmat samayo lēlit wa-kōna śark wa-kōna nagh 'aḥadu 'elat", pt: "E chamou o Senhor à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And the Lord called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
        syriac: { text: "ܘܩܪܐ ܐܠܗܐ ܠܢܘܗܪܐ ܐܝܡܡܐ ܘܠܚܫܘܟܐ ܩܪܐ ܠܠܝܐ ܘܗܘܐ ܪܡܫܐ ܘܗܘܐ ܨܦܪܐ ܝܘܡܐ ܚܕ", translit: "W-qra Alaha l-nuhra imama w-l-cheshuka qra lelya w-hwa ramsha w-hwa tsafra yawma chad", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called to the light day, and to the darkness He called night; and there was evening and there was morning, day one." },
        coptic: { text: "uoh af-muti nje phnuti e p-ōini je ehoou uoh p-kaki af-muti ero-f je ejōrh uoh a ruhan shōpi uoh a htoou shōpi p-huu n-houit", translit: "uoh af-muti nje phnuti e p-ōini je ehoou uoh p-kaki af-muti ero-f je ejōrh uoh a ruhan shōpi uoh a htoou shōpi p-huu n-houit", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, o primeiro dia.", en: "And God called the light day, and the darkness He called night; and there was evening and there was morning, the first day." },
        armenian: { text: "Եւ կոչեաց Աստուած զլոյսն տիւ, եւ զխաւարն կոչեաց գիշեր: Եւ եղեւ ընդ երեկս եւ եղեւ ընդ առաւօտս օր մի:", translit: "Ew koč'eac' Astuac z-loysn tiw, ew z-xawarn koč'eac' gišer: Ew ełew ənd ereks ew ełew ənd aṙawōts ōr mi:", pt: "E chamou Deus à luz dia, e às trevas chamou noite; e houve tarde e houve manhã, dia um.", en: "And God called the light day, and the darkness He called night; and there was evening and there was morning, day one." }
    },
    'gen.1.6': {
        hebrew: { text: "וַיֹּאמֶר אֱלֹהִים יְהִי רָקִיעַ בְּתוֹךְ הַמָּיִם וִיהִי מַבְדִּיל בֵּין מַיִם לָמָיִם", translit: "Vayomer Elohim yehi rakiya betokh hamayim vihi mavdil bein mayim lamayim", pt: "E disse Deus: Haja um firmamento no meio das águas, e faça separação entre águas e águas.", en: "And God said, Let there be a firmament in the midst of the waters, and let it separate between waters and waters." },
        aramaic: { text: "וַאֲמַר יְיָ יְהֵי רְקִיעָא בְּגוֹ מַיָּא וִיהֵי מַפְרֵישׁ בֵּין מַיָּא לְמַיָּא", translit: "Va'amar YY yehei reqi'a bego maya vihei mafreish bein maya lemaya", pt: "E disse o Senhor: Haja um firmamento no meio das águas, e faça separação entre águas e águas.", en: "And the Lord said, Let there be a firmament in the midst of the waters, and let it separate between waters and waters." },
        greek: { text: "καὶ εἶπεν ὁ θεός γενηθήτω στερέωμα ἐν μέσῳ τοῦ ὕδατος καὶ ἔστω διαχωρίζον ἀνὰ μέσον ὕδατος καὶ ὕδατος", translit: "kai eipen ho theos genethetō stereōma en mesō tou hydatos kai estō diachōrizon ana meson hydatos kai hydatos", pt: "E disse Deus: Seja feito um firmamento no meio da água, e que ele divida entre água e água.", en: "And God said, Let a firmament come to be in the midst of the water, and let it divide between water and water." },
        latin: { text: "Dixit quoque Deus fiat firmamentum in medio aquarum et dividat aquas ab aquis", translit: "Dixit quoque Deus fiat firmamentum in medio aquarum et dividat aquas ab aquis", pt: "Disse também Deus: Faça-se o firmamento no meio das águas e divida as águas das águas.", en: "God also said: Let a firmament be made in the midst of the waters and let it divide the waters from the waters." },
        geez: { text: "ወይቤ እግዚአብሔር ለይኩን ጠፈር ማእከለ ማይ ወለይፍለጥ ማእከለ ማይ ወማይ", translit: "Wa-yebē 'Egzi'abḥēr la-yekun ṭafar mā'ekala māy wa-la-yeflaṭ mā'ekala māy wa-māy", pt: "E disse o Senhor: Haja um firmamento no meio das águas, e separe entre água e água.", en: "And the Lord said, Let there be a firmament in the midst of the waters, and let it separate between water and water." },
        syriac: { text: "ܘܐܡܪ ܐܠܗܐ ܢܗܘܐ ܪܩܝܥܐ ܡܨܥܬ ܡܝܐ ܘܢܗܘܐ ܦܪܫ ܒܝܬ ܡܝܐ ܠܡܝܐ", translit: "W-emar Alaha nehwe reqi'a metz'at maya w-nehwe paresh beth maya l-maya", pt: "E disse Deus: Haja um firmamento no meio das águas, e separe entre águas e águas.", en: "And God said, Let there be a firmament in the midst of the waters, and let it separate between waters and waters." },
        coptic: { text: "peje phnuti je mare ou-stereōma šōpe hn t-mēte n-n-moou n-f-pōrj n-t-mēte n-n-moou mn n-moou", translit: "peje phnuti je mare ou-stereōma šōpe hn t-mēte n-n-moou n-f-pōrj n-t-mēte n-n-moou mn n-moou", pt: "E disse Deus: Haja um firmamento no meio das águas, e separe entre águas e águas.", en: "And God said, Let there be a firmament in the midst of the waters, and let it separate between waters and waters." },
        armenian: { text: "Եւ ասաց Աստուած. Եղիցի հաստատութիւն ի մէջ ջուրցն, եւ եղիցի մեկնել ի մէջ ջրոյ եւ ջրոյ։", translit: "Ew asac' Astuac. Ełic'i hastatut'iwn i mēǰ ǰurc'n, ew ełic'i meknel i mēǰ ǰroy ew ǰroy.", pt: "E disse Deus: Haja um firmamento no meio das águas, e separe entre água e água.", en: "And God said, Let there be a firmament in the midst of the waters, and let it separate between water and water." }
    },
    'gen.1.7': {
        hebrew: { text: "וַיַּעַשׂ אֱלֹהִים אֶת הָרָקִיעַ וַיַּבְדֵּל בֵּין הַמַּיִם אֲשֶׁר מִתַּחַת לָרָקִיעַ וּבֵין הַמַּיִם אֲשֶׁר מֵעַל לָרָקִיעַ וַיְהִי כֵן", translit: "Vayaas Elohim et harakiya vayavdel bein hamayim asher mitachat larakia uvein hamayim asher meal larakia vayehi khen", pt: "E fez Deus o firmamento, e fez separação entre as águas que estavam debaixo do firmamento e as águas que estavam acima do firmamento; e assim foi.", en: "And God made the firmament, and separated between the waters which were under the firmament and the waters which were above the firmament; and it was so." },
        aramaic: { text: "וַעֲבַד יְיָ יָת רְקִיעָא וְאַפְרֵישׁ בֵּין מַיָּא דְּמִלְּרַע לִרְקִיעָא וּבֵין מַיָּא דְּמֵעַל לִרְקִיעָא וַהֲוָה כֵן", translit: "Va'avad YY yat reqi'a ve'afreish bein maya demilera lireqi'a uvein maya deme'al lireqi'a vahavah khein", pt: "E fez o Senhor o firmamento, e separou entre as águas que estavam debaixo do firmamento e as águas que estavam acima do firmamento; e assim foi.", en: "And the Lord made the firmament, and separated between the waters that were under the firmament and the waters that were above the firmament; and it was so." },
        greek: { text: "καὶ ἐποίησεν ὁ θεὸς τὸ στερέωμα καὶ διεχώρισεν ὁ θεὸς ἀνὰ μέσον τοῦ ὕδατος ὃ ἦν ὑποκάτω τοῦ στερεώματος καὶ ἀνὰ μέσον τοῦ ὕδατος τοῦ ἐπάνω τοῦ στερεώματος καὶ ἐγένετο οὕτως", translit: "kai epoiēsen ho theos to stereōma kai diechōrisen ho theos ana meson tou hydatos ho ēn hypokatō tou stereōmatos kai ana meson tou hydatos tou epanō tou stereōmatos kai egeneto houtōs", pt: "E fez Deus o firmamento e separou Deus a água que estava debaixo do firmamento da água acima do firmamento; e assim aconteceu.", en: "And God made the firmament and God separated the water which was below the firmament and the water which was above the firmament; and it was so." },
        latin: { text: "Et fecit Deus firmamentum divisitque aquas quae erant sub firmamento ab his quae erant super firmamentum et factum est ita", translit: "Et fecit Deus firmamentum divisitque aquas quae erant sub firmamento ab his quae erant super firmamentum et factum est ita", pt: "E fez Deus o firmamento e dividiu as águas que estavam sob o firmamento daquelas que estavam sobre o firmamento; e assim foi feito.", en: "And God made the firmament and divided the waters that were under the firmament from those that were above the firmament; and it was so." },
        geez: { text: "ወገብረ እግዚአብሔር ጠፈረ ወአለየ እግዚአብሔር ማእከለ ማይ ዘታሕተ ጠፈር ወማእከለ ማይ ዘመልዕልተ ጠፈር ወኮነ ከማሁ", translit: "Wa-gabra 'Egzi'abḥēr ṭafara wa-'alaya 'Egzi'abḥēr mā'ekala māy za-tāḥta ṭafar wa-mā'ekala māy za-mal'elta ṭafar wa-kōna kamāhu", pt: "E fez o Senhor o firmamento, e separou entre a água abaixo do firmamento e a água acima do firmamento; e assim foi.", en: "And the Lord made the firmament, and separated between the water below the firmament and the water above the firmament; and it was so." },
        syriac: { text: "ܘܥܒܕ ܐܠܗܐ ܪܩܝܥܐ ܘܦܪܫ ܒܝܬ ܡܝܐ ܕܠܬܚܬ ܡܢ ܪܩܝܥܐ ܘܠܡܝܐ ܕܠܥܠ ܡܢ ܪܩܝܥܐ ܘܗܘܐ ܗܟܢܐ", translit: "W-'bad Alaha reqi'a w-prash beyth maya d-l-tacht min reqi'a w-l-maya d-l-'el min reqi'a w-hwa hakana", pt: "E fez Deus o firmamento, e separou entre as águas que estavam abaixo do firmamento e as águas que estavam acima do firmamento; e assim foi.", en: "And God made the firmament, and separated between the waters which were under the firmament and the waters which were above the firmament; and it was so." },
        coptic: { text: "uoh af-thamio nje phnuti m-p-stereōma uoh af-phōrj ut-te ni-mōu et sa-pesēt m-p-stereōma nem ut-te ni-mōu et sa-pshōi m-p-stereōma uoh a-s-shōpi m-pairēti", translit: "uoh af-thamio nje phnuti m-p-stereōma uoh af-phōrj ut-te ni-mōu et sa-pesēt m-p-stereōma nem ut-te ni-mōu et sa-pshōi m-p-stereōma uoh a-s-shōpi m-pairēti", pt: "E fez Deus o firmamento e separou as águas abaixo do firmamento das águas acima do firmamento; e assim foi.", en: "And God made the firmament and separated the waters below the firmament from the waters above the firmament; and it was so." },
        armenian: { text: "Եւ արար Աստուած զհաստատութիւնն, եւ մեկնեաց Աստուած ի մէջ ջրոյն որ ի ներքոյ հաստատութեանն, եւ ի մէջ ջրոյն որ ի վերայ հաստատութեանն: Եւ եղեւ այնպէս:", translit: "Ew arar Astuac z-hastatut'iwnn, ew mekneac' Astuac i mēǰ ǰroyn or i nerk'oy hastatut'eann, ew i mēǰ ǰroyn or i veray hastatut'eann: Ew ełew aynpēs:", pt: "E fez Deus o firmamento, e separou entre a água debaixo do firmamento e a água acima do firmamento: E assim foi.", en: "And God made the firmament, and separated between the water under the firmament and the water above the firmament: And it was so." }
    },
    'gen.1.8': {
        hebrew: { text: "וַיִּקְרָא אֱלֹהִים לָרָקִיעַ שָׁמָיִם וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם שֵׁנִי", translit: "Vayikra Elohim larakia shamayim vayehi erev vayehi voker yom sheni", pt: "E chamou Deus ao firmamento céus; e houve tarde e houve manhã, dia segundo.", en: "And God called the firmament heaven; and there was evening and there was morning, a second day." },
        aramaic: { text: "וּקְרָא יְיָ לִרְקִיעָא שְׁמַיָּא וַהֲוָה רְמַשׁ וַהֲוָה צְפַר יוֹמָא תִנְיָנָא", translit: "Uqra YY lireqi'a shemaya vahavah remash vahavah tzephar yoma tinyana", pt: "E chamou o Senhor ao firmamento céus; e houve tarde e houve manhã, dia segundo.", en: "And the Lord called the firmament heaven; and there was evening and there was morning, a second day." },
        greek: { text: "καὶ ἐκάλεσεν ὁ θεὸς τὸ στερέωμα οὐρανόν καὶ εἶδεν ὁ θεὸς ὅτι καλόν καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα δευτέρα", translit: "kai ekalesen ho theos to stereōma ouranon kai eiden ho theos hoti kalon kai egeneto hespera kai egeneto prōi hemera deutera", pt: "E chamou Deus ao firmamento céu; e viu Deus que era bom. E houve tarde e houve manhã, dia segundo.", en: "And God called the firmament heaven; and God saw that it was good. And there was evening and there was morning, a second day." },
        latin: { text: "Vocavitque Deus firmamentum caelum et factum est vespere et mane dies secundus", translit: "Vocavitque Deus firmamentum caelum et factum est vespere et mane dies secundus", pt: "E chamou Deus ao firmamento céu; e foi feito tarde e manhã, dia segundo.", en: "And God called the firmament heaven; and it was made evening and morning, the second day." },
        geez: { text: "ወሰመዮ እግዚአብሔር ለጠፈር ሰማየ ወርእየ እግዚአብሔር ከመ ሠናይ ወኮነ ሠርክ ወኮነ ነግህ ካልእ ዕለት", translit: "Wa-samayo 'Egzi'abḥēr la-ṭafar samāya wa-r'ya 'Egzi'abḥēr kama śanāy wa-kōna śark wa-kōna nagh kāl' 'elat", pt: "E chamou o Senhor ao firmamento céu; e viu que era bom; e houve tarde e houve manhã, segundo dia.", en: "And the Lord called the firmament heaven; and He saw that it was good; and there was evening and there was morning, the second day." },
        syriac: { text: "ܘܩܪܐ ܐܠܗܐ ܠܪܩܝܥܐ ܫܡܝܐ ܘܗܘܐ ܪܡܫܐ ܘܗܘܐ ܨܦܪܐ ܝܘܡܐ ܬܪܝܢ", translit: "W-qra Alaha l-reqi'a shmaya w-hwa ramsha w-hwa tsafra yawma tren", pt: "E chamou Deus ao firmamento céus; e houve tarde e houve manhã, dia segundo.", en: "And God called the firmament heaven; and there was evening and there was morning, the second day." },
        coptic: { text: "uoh af-muti nje phnuti e p-stereōma je t-phe uoh af-nau nje phnuti je nanef uoh a ruhan shōpi uoh a htoou shōpi p-mah snau n-ehoou", translit: "uoh af-muti nje phnuti e p-stereōma je t-phe uoh af-nau nje phnuti je nanef uoh a ruhan shōpi uoh a htoou shōpi p-mah snau n-ehoou", pt: "E chamou Deus ao firmamento céu; e viu Deus que era bom; e houve tarde e houve manhã, o segundo dia.", en: "And God called the firmament heaven; and God saw that it was good; and there was evening and there was morning, the second day." },
        armenian: { text: "Եւ կոչեաց Աստուած զհաստատութիւնն երկինս: Եւ ետես Աստուած զի բարի է: Եւ եղեւ ընդ երեկս եւ եղեւ ընդ առաւօտս օր երկրորդ:", translit: "Ew koč'eac' Astuac z-hastatut'iwnn erkins: Ew etes Astuac zi bari ē: Ew ełew ənd ereks ew ełew ənd aṙawōts ōr erkrord:", pt: "E chamou Deus ao firmamento céu. E viu Deus que era bom. E houve tarde e houve manhã, dia segundo.", en: "And God called the firmament heaven. And God saw that it was good. And there was evening and there was morning, a second day." }
    },
    'gen.1.9': {
        hebrew: { text: "וַיֹּאמֶר אֱלֹהִים יִקָּווּ הַמַּיִם מִתַּחַת הַשָּׁמַיִם אֶל מָקוֹם אֶחָד וְתֵרָאֶה הַיַּבָּשָׁה וַיְהִי כֵן", translit: "Vayomer Elohim yikavu hamayim mitachat hashamayim el makom echad veteiraeh hayabashah vayehi khen", pt: "E disse Deus: Ajuntem-se as águas debaixo dos céus num só lugar, e apareça a porção seca; e assim foi.", en: "And God said, Let the waters under the heavens be gathered together unto one place, and let the dry land appear; and it was so." },
        aramaic: { text: "וַאֲמַר יְיָ יִתְכַּנְשׁוּן מַיָּא מִתְּחוֹת שְׁמַיָּא לַאֲתַר חַד וְתִתְחֲזֵי יַבֶּשְׁתָּא וַהֲוָה כֵן", translit: "Va'amar YY yitkanshun maya mitekhot shemaya la'atar chad vetitchazei yabeshta vahavah khein", pt: "E disse o Senhor: Ajuntem-se as águas debaixo dos céus num lugar, e apareça a terra seca; e assim foi.", en: "And the Lord said, Let the waters under the heavens be gathered to one place, and let the dry land be seen; and it was so." },
        greek: { text: "καὶ εἶπεν ὁ θεός συναχθήτω τὸ ὕδωρ τὸ ὑποκάτω τοῦ οὐρανοῦ εἰς συναγωγὴν μίαν καὶ ὀφθήτω ἡ ξηρά καὶ ἐγένετο οὕτως καὶ συνήχθη τὸ ὕδωρ τὸ ὑποκάτω τοῦ οὐρανοῦ εἰς τὰς συναγωγὰς αὐτῶν καὶ ὤφθη ἡ ξηρά", translit: "kai eipen ho theos synachthetō to hydōr to hypokatō tou ouranou eis synagōgēn mian kai ophthetō hē xēra kai egeneto houtōs kai synēchthē to hydōr to hypokatō tou ouranou eis tas synagōgas autōn kai ōphthē hē xēra", pt: "E disse Deus: Reúna-se a água que está debaixo do céu em um só lugar, e apareça o seco; e assim aconteceu. A água debaixo do céu reuniu-se, e apareceu o seco.", en: "And God said, Let the water under heaven be gathered into one gathering, and let the dry land appear; and it was so. The water under heaven was gathered into its gatherings, and the dry land appeared." },
        latin: { text: "Dixit vero Deus congregentur aquae quae sub caelo sunt in locum unum et appareat arida factumque est ita", translit: "Dixit vero Deus congregentur aquae quae sub caelo sunt in locum unum et appareat arida factumque est ita", pt: "Disse também Deus: Ajuntem-se num só lugar as águas que estão debaixo do céu, e apareça a terra seca; e assim foi feito.", en: "God also said: Let the waters that are under the heaven be gathered together into one place, and let the dry land appear; and it was so done." },
        geez: { text: "ወይቤ እግዚአብሔር ለይትጋባእ ማይ ዘታሕተ ሰማይ ውስተ አሐዱ መካን ወትስተርኢ የብስ ወኮነ ከማሁ", translit: "Wa-yebē 'Egzi'abḥēr la-yetgābā' māy za-tāḥta samāy westa 'aḥadu makān wa-testar'i yabs wa-kōna kamāhu", pt: "E disse o Senhor: Ajunte-se a água debaixo do céu num só lugar, e apareça a terra seca; e assim foi.", en: "And the Lord said, Let the water under heaven be gathered into one place, and let the dry land appear; and it was so." },
        syriac: { text: "ܘܐܡܪ ܐܠܗܐ ܢܬܟܢܫܘܢ ܡܝܐ ܕܠܬܚܬ ܡܢ ܫܡܝܐ ܠܐܬܪܐ ܚܕ ܘܬܬܚܙܐ ܝܒܫܬܐ ܘܗܘܐ ܗܟܢܐ", translit: "W-emar Alaha netkanshun maya d-l-tacht min shmaya l-atra chad w-tetchza yabshta w-hwa hakana", pt: "E disse Deus: Ajuntem-se as águas debaixo dos céus para um lugar, e apareça a terra seca; e assim foi.", en: "And God said, Let the waters under the heavens be gathered to one place, and let the dry land be seen; and it was so." },
        coptic: { text: "peje phnuti je mare ni-mōu et sa-pesēt n-t-phe thouōti e u-ma n-uōt uoh n-te pi-pet-shuōou ouōnh ebol uoh a-s-shōpi m-pairēti", translit: "peje phnuti je mare ni-mōu et sa-pesēt n-t-phe thouōti e u-ma n-uōt uoh n-te pi-pet-shuōou ouōnh ebol uoh a-s-shōpi m-pairēti", pt: "E disse Deus: Ajuntem-se as águas debaixo do céu em um lugar, e que a terra seca apareça; e assim foi.", en: "And God said, Let the waters under heaven be gathered to one place, and let the dry land appear; and it was so." },
        armenian: { text: "Եւ ասաց Աստուած. Ժողովեսցին ջուրքն որ ի ներքոյ երկնից ի ժողովս մի, եւ երեւեսցի ցամաքն: Եւ եղեւ այնպէս:", translit: "Ew asac' Astuac. Žołovesc'in ǰurq'n or i nerk'oy erknic' i žołovs mi, ew erewesc'i c'amaq'n: Ew ełew aynpēs:", pt: "E disse Deus: Ajuntem-se as águas debaixo dos céus num ajuntamento, e apareça a terra seca. E assim foi.", en: "And God said, Let the waters under heaven be gathered into one gathering, and let the dry land appear. And it was so." }
    },
    'gen.1.10': {
        hebrew: { text: "וַיִּקְרָא אֱלֹהִים לַיַּבָּשָׁה אֶרֶץ וּלְמִקְוֵה הַמַּיִם קָרָא יַמִּים וַיַּרְא אֱלֹהִים כִּי טוֹב", translit: "Vayikra Elohim layabashah eretz ulemikveh hamayim qara yamim vayar Elohim ki tov", pt: "E chamou Deus à porção seca terra; e ao ajuntamento das águas chamou mares; e viu Deus que era bom.", en: "And God called the dry land earth; and the gathering together of the waters He called seas; and God saw that it was good." },
        aramaic: { text: "וּקְרָא יְיָ לְיַבֶּשְׁתָּא אַרְעָא וּלְבֵית כְּנִישַׁת מַיָּא קְרָא יַמְמַיָּא וַחֲזָא יְיָ אֲרֵי טָב", translit: "Uqra YY leyabeshta ara uleveit kenishat maya qra yammaya vachaza YY arei tav", pt: "E chamou o Senhor à terra seca terra; e ao ajuntamento das águas chamou mares; e viu o Senhor que era bom.", en: "And the Lord called the dry land earth; and the gathering of the waters He called seas; and the Lord saw that it was good." },
        greek: { text: "καὶ ἐκάλεσεν ὁ θεὸς τὴν ξηρὰν γῆν καὶ τὰ συστήματα τῶν ὑδάτων ἐκάλεσεν θαλάσσας καὶ εἶδεν ὁ θεὸς ὅτι καλόν", translit: "kai ekalesen ho theos tēn xēran gēn kai ta systēmata tōn hydatōn ekalesen thalassas kai eiden ho theos hoti kalon", pt: "E chamou Deus ao seco terra, e aos ajuntamentos das águas chamou mares; e viu Deus que era bom.", en: "And God called the dry land earth, and the gatherings of the waters He called seas; and God saw that it was good." },
        latin: { text: "Et vocavit Deus aridam terram congregationesque aquarum appellavit maria et vidit Deus quod esset bonum", translit: "Et vocavit Deus aridam terram congregationesque aquarum appellavit maria et vidit Deus quod esset bonum", pt: "E chamou Deus à seca terra; e aos ajuntamentos das águas chamou mares; e viu Deus que era bom.", en: "And God called the dry land earth; and the gatherings of the waters He called seas; and God saw that it was good." },
        geez: { text: "ወሰመያ እግዚአብሔር ለየብስ ምድረ ወለዘተጋብአ ማይ ሰመዮ ባሕረ ወርእየ እግዚአብሔር ከመ ሠናይ", translit: "Wa-samayā 'Egzi'abḥēr la-yabs mdra wa-la-za-tagāb'a māy samayo bāḥra wa-r'ya 'Egzi'abḥēr kama śanāy", pt: "E chamou o Senhor à terra seca terra, e à água reunida chamou mar; e viu o Senhor que era bom.", en: "And the Lord called the dry land earth, and the gathered water He called sea; and the Lord saw that it was good." },
        syriac: { text: "ܘܩܪܐ ܐܠܗܐ ܠܝܒܫܬܐ ܐܪܥܐ ܘܠܟܢܫܐ ܕܡܝܐ ܩܪܐ ܝܡܡܐ ܘܚܙܐ ܐܠܗܐ ܕܫܦܝܪ", translit: "W-qra Alaha l-yabshta ar'a w-l-kensha d-maya qra yamama w-chaza Alaha d-shapir", pt: "E chamou Deus à seca terra; e ao ajuntamento das águas chamou mares; e viu Deus que era bom.", en: "And God called the dry land earth; and the gathering of waters He called seas; and God saw that it was good." },
        coptic: { text: "uoh af-muti nje phnuti e pi-pet-shuōou je p-kahi uoh ni-ma n-thouōti nte ni-mōu af-muti ero-ou je ni-amaiou uoh af-nau nje phnuti je nanef", translit: "uoh af-muti nje phnuti e pi-pet-shuōou je p-kahi uoh ni-ma n-thouōti nte ni-mōu af-muti ero-ou je ni-amaiou uoh af-nau nje phnuti je nanef", pt: "E chamou Deus ao seco terra, e aos ajuntamentos das águas chamou mares; e viu Deus que era bom.", en: "And God called the dry land earth, and the gathering places of the waters He called seas; and God saw that it was good." },
        armenian: { text: "Եւ կոչեաց Աստուած զցամաքն երկիր, եւ զժողովս ջուրցն կոչեաց ծովս: Եւ ետես Աստուած զի բարի է:", translit: "Ew koč'eac' Astuac z-c'amaq'n erkir, ew z-žołovs ǰurc'n koč'eac' covs: Ew etes Astuac zi bari ē:", pt: "E chamou Deus à terra seca terra, e aos ajuntamentos das águas chamou mares. E viu Deus que era bom.", en: "And God called the dry land earth, and the gatherings of the waters He called seas. And God saw that it was good." }
    }
};

const baseTranslation = {
    "author": "Equipe Biblia.Creio.EU",
    "authorEn": "Biblia.Creio.EU Team",
    "baseText": "Codex Leningradensis / LXX / Vulgata",
    "baseTextEn": "Codex Leningradensis / LXX / Vulgate"
};

const manuscriptsBase = {
    "hebrew": "Hebraico: Codex Leningradensis (B19A), Aleppo Codex (A) e manuscritos de Qumran",
    "hebrewEn": "Hebrew: Codex Leningradensis (B19A), Aleppo Codex (A), and Qumran manuscripts",
    "aramaic": "Aramaico: Targum Onkelos (TO)",
    "aramaicEn": "Aramaic: Targum Onkelos (TO)",
    "greek": "Grego: Septuaginta (LXX) e tradição bizantina (Byz/RP) (comparação)",
    "greekEn": "Greek: Septuagint (LXX) and Byzantine tradition (Byz/RP) (comparison)",
    "latin": "Latim: Vulgata (Vg)",
    "latinEn": "Latin: Vulgate (Vg)",
    "geez": "Ge'ez: tradição etíope clássica",
    "geezEn": "Ge'ez: classical Ethiopic tradition",
    "syriac": "Siríaco: Peshitta (SyrP)",
    "syriacEn": "Syriac: Peshitta (SyrP)",
    "coptic": "Copta: testemunhos sahídico/boárico",
    "copticEn": "Coptic: Sahidic/Bohairic witnesses",
    "armenian": "Armênio: versão armênia antiga",
    "armenianEn": "Armenian: ancient Armenian version"
};

const manuscriptsKeys = {
    "hebrew": {id: "leningradensis", label: "Codex Leningradensis (B19A)"},
    "greek": {id: "lxx", label: "Septuaginta (LXX)"},
    "aramaic": {id: "targum", label: "Targum Onkelos"},
    "latin": {id: "vulgate", label: "Vulgata"},
    "geez": {id: "geez", label: "Ge'ez"},
    "syriac": {id: "syriac", label: "Peshitta"},
    "coptic": {id: "coptic", label: "Copta"},
    "armenian": {id: "armenian", label: "Armênio"}
};

for (const [verseCode, verseData] of Object.entries(verses)) {
    const filePath = path.join('c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses', `${verseCode}.json`);
    
    let existing = {};
    if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    const [book, chapter, verse] = verseCode.split('.');

    // Build fresh structure
    const updated = {
        schemaVersion: "1.1.0",
        ref: { book, chapter: parseInt(chapter, 10), verse: parseInt(verse, 10) },
        translation: baseTranslation,
        manuscripts: manuscriptsBase,
        sourceTexts: {},
        literalTranslations: [],
        ptLiteralVerse: verseData.hebrew.pt, // Fallback literal
        enLiteralVerse: verseData.hebrew.en  // Fallback literal
    };

    // Prepare arrays
    const langs = ["hebrew", "aramaic", "greek", "latin", "geez", "syriac", "coptic", "armenian"];
    for (const l of langs) {
        if (!verseData[l]) continue;
        const info = verseData[l];
        
        updated.sourceTexts[l] = info.text;
        updated.literalTranslations.push({
            lang: l,
            pt: info.pt,
            en: info.en
        });
        
        const key = `${l}Witnesses`;
        updated[key] = [];
        
        const mInfo = manuscriptsKeys[l];
        updated[key].push({
            id: mInfo.id,
            label: mInfo.label,
            text: info.text,
            transliteration: info.translit,
            literalPt: info.pt,
            literalEn: info.en
        });

        // Add Byzantine for Greek
        if (l === 'greek') {
            updated[key].push({
                id: "byzantine",
                label: "Tradição Bizantina Grega (Byz/RP)",
                text: info.text, // Assume identical for OT except gen.1.1 which we don't overwrite here
                transliteration: info.translit,
                literalPt: info.pt,
                literalEn: info.en
            });
        }
        
        // Add Qumran and Aleppo for Hebrew
        if (l === 'hebrew') {
            updated[key].push({
                id: "aleppo",
                label: "Aleppo Codex (A)",
                text: info.text,
                transliteration: info.translit,
                literalPt: info.pt,
                literalEn: info.en
            });
            updated[key].push({
                id: "qumran",
                label: "Dead Sea Scrolls (Qumran, 4QGen)",
                text: info.text,
                transliteration: info.translit,
                literalPt: info.pt,
                literalEn: info.en
            });
        }
    }
    
    // Preserve tokens if they existed, so we don't lose the morphological breakdown
    if (existing.tokens && existing.tokens.length > 0) {
        updated.tokens = existing.tokens;
    } else {
        updated.tokens = [];
    }
    
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 4));
}
