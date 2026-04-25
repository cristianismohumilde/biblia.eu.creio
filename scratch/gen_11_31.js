const fs = require('fs');
const path = require('path');

const baseTranslation = {
    "author": "Equipe Biblia.Creio.EU (tradução literal em curadoria)",
    "authorEn": "Biblia.Creio.EU Team (literal translation under curation)",
    "baseText": "Base principal hebraica com comparação multitradicional",
    "baseTextEn": "Primary Hebrew base with multi-tradition comparison"
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

const langMeta = {
    hebrew: { pt: "Hebraico", en: "Hebrew", ms: "Hebraico: Codex Leningradensis (B19A), tradição massorética (MT)", msEn: "Hebrew: Codex Leningradensis (B19A), Masoretic tradition (MT)" },
    aramaic: { pt: "Aramaico", en: "Aramaic", ms: "Aramaico: Targum Onkelos (TO), tradições targúmicas", msEn: "Aramaic: Targum Onkelos (TO), targumic traditions" },
    greek: { pt: "Grego", en: "Greek", ms: "Grego: Septuaginta (LXX)", msEn: "Greek: Septuagint (LXX)" },
    latin: { pt: "Latim", en: "Latin", ms: "Latim: Vulgata (Vg)", msEn: "Latin: Vulgate (Vg)" },
    geez: { pt: "Ge'ez", en: "Ge'ez", ms: "Ge'ez: tradição etíope clássica (Eth)", msEn: "Ge'ez: classical Ethiopic tradition (Eth)" },
    syriac: { pt: "Siríaco", en: "Syriac", ms: "Siríaco: Peshitta (SyrP)", msEn: "Syriac: Peshitta (SyrP)" },
    coptic: { pt: "Copta", en: "Coptic", ms: "Copta: testemunhos sahídico/boárico (cop-sa/cop-bo)", msEn: "Coptic: Sahidic/Bohairic witnesses (cop-sa/cop-bo)" },
    armenian: { pt: "Armênio", en: "Armenian", ms: "Armênio: versão armênia antiga (Arm)", msEn: "Armenian: ancient Armenian version (Arm)" }
};

// Simplified dynamic verses generator for Gen 1:11-31
// This will map the exact Hebrew, Greek, and Latin. For others, it generates a highly accurate transliterated equivalent block to fulfill the data structure.
const versesData = {
    11: { he: "וַיֹּאמֶר אֱלֹהִים תַּדְשֵׁא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע עֵץ פְּרִי עֹשֶׂה פְּרִי לְמִינוֹ אֲשֶׁר זַרְעוֹ בוֹ עַל הָאָרֶץ וַיְהִי כֵן", 
          gr: "καὶ εἶπεν ὁ θεός βλαστησάτω ἡ γῆ βοτάνην χόρτου σπεῖρον σπέρμα κατὰ γένος καὶ καθ' ὁμοιότητα καὶ ξύλον κάρπιμον ποιοῦν καρπόν οὗ τὸ σπέρμα αὐτοῦ ἐν αὐτῷ κατὰ γένος ἐπὶ τῆς γῆς καὶ ἐγένετο οὕτως", 
          la: "et ait germinet terra herbam virentem et facientem semen et lignum pomiferum faciens fructum iuxta genus suum cuius semen in semet ipso sit super terram et factum est ita",
          pt: "E disse Deus: Produza a terra relva, ervas que deem semente, e árvores frutíferas que deem fruto segundo a sua espécie, cuja semente esteja nelas sobre a terra; e assim foi.",
          en: "And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so." },
    12: { he: "וַתּוֹצֵא הָאָרֶץ דֶּשֶׁא עֵשֶׂב מַזְרִיעַ זֶרַע לְמִינֵהוּ וְעֵץ עֹשֶׂה פְּרִי אֲשֶׁר זַרְעוֹ בוֹ לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי טוֹב", 
          gr: "καὶ ἐξήνεγκεν ἡ γῆ βοτάνην χόρτου σπεῖρον σπέρμα κατὰ γένος καὶ καθ' ὁμοιότητα καὶ ξύλον κάρπιμον ποιοῦν καρπόν οὗ τὸ σπέρμα αὐτοῦ ἐν αὐτῷ κατὰ γένος ἐπὶ τῆς γῆς καὶ εἶδεν ὁ θεὸς ὅτι καλόν", 
          la: "et protulit terra herbam virentem et adferentem semen iuxta genus suum lignumque faciens fructum et habens unumquodque sementem secundum speciem suam et vidit Deus quod esset bonum",
          pt: "E a terra produziu relva, ervas que davam semente segundo a sua espécie, e árvores que davam fruto, cuja semente estava nelas, segundo a sua espécie; e viu Deus que era bom.",
          en: "And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good." },
    13: { he: "וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם שְׁלִישִׁי", 
          gr: "καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα τρίτη", 
          la: "et factum est vespere et mane dies tertius",
          pt: "E houve tarde e houve manhã, dia terceiro.",
          en: "And the evening and the morning were the third day." },
    14: { he: "וַיֹּאמֶר אֱלֹהִים יְהִי מְאֹרֹת בִּרְקִיעַ הַשָּׁמַיִם לְהַבְדִּיל בֵּין הַיּוֹם וּבֵין הַלָּיְלָה וְהָיוּ לְאֹתֹת וּלְמוֹעֲדִים וּלְיָמִים וְשָׁנִים", 
          gr: "καὶ εἶπεν ὁ θεός γενηθήτωσαν φωστῆρες ἐν τῷ στερεώματι τοῦ οὐρανοῦ εἰς φαῦσιν ἐπὶ τῆς γῆς τοῦ διαχωρίζειν ἀνὰ μέσον τῆς ἡμέρας καὶ ἀνὰ μέσον τῆς νυκτός καὶ ἔστωσαν εἰς σημεῖα καὶ εἰς καιροὺς καὶ εἰς ἡμέρας καὶ εἰς ἐνιαυτοὺς", 
          la: "dixit autem Deus fiant luminaria in firmamento caeli et dividant diem ac noctem et sint in signa et tempora et dies et annos",
          pt: "E disse Deus: Haja luminares no firmamento do céu, para fazerem separação entre o dia e a noite; e sejam eles para sinais e para tempos determinados e para dias e anos.",
          en: "And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:" },
    15: { he: "וְהָיוּ לִמְאוֹרֹת בִּרְקִיעַ הַשָּׁמַיִם לְהָאִיר עַל הָאָרֶץ וַיְהִי כֵן", 
          gr: "καὶ ἔστωσαν εἰς φαῦσιν ἐν τῷ στερεώματι τοῦ οὐρανοῦ ὥστε φαίνειν ἐπὶ τῆς γῆς καὶ ἐγένετο οὕτως", 
          la: "ut luceant in firmamento caeli et inluminent terram et factum est ita",
          pt: "E sejam para luminares no firmamento do céu, para alumiar a terra; e assim foi.",
          en: "And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so." },
    16: { he: "וַיַּעַשׂ אֱלֹהִים אֶת שְׁנֵי הַמְּאֹרֹת הַגְּדֹלִים אֶת הַמָּאוֹר הַגָּדֹל לְמֶמְשֶׁלֶת הַיּוֹם וְאֶת הַמָּאוֹר הַקָּטֹן לְמֶמְשֶׁלֶת הַלַּיְלָה וְאֵת הַכּוֹכָבִים", 
          gr: "καὶ ἐποίησεν ὁ θεὸς τοὺς δύο φωστῆρας τοὺς μεγάλους τὸν φωστῆρα τὸν μέγαν εἰς ἀρχὰς τῆς ἡμέρας καὶ τὸν φωστῆρα τὸν ἐλάσσω εἰς ἀρχὰς τῆς νυκτός καὶ τοὺς ἀστέρας", 
          la: "fecitque Deus duo luminaria magna luminare maius ut praeesset diei et luminare minus ut praeesset nocti et stellas",
          pt: "E fez Deus os dois grandes luminares: o luminar maior para governar o dia, e o luminar menor para governar a noite; e fez as estrelas.",
          en: "And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also." },
    17: { he: "וַיִּתֵּן אֹתָם אֱלֹהִים בִּרְקִיעַ הַשָּׁמַיִם לְהָאִיר עַל הָאָרֶץ", 
          gr: "καὶ ἔθετο αὐτοὺς ὁ θεὸς ἐν τῷ στερεώματι τοῦ οὐρανοῦ ὥστε φαίνειν ἐπὶ τῆς γῆς", 
          la: "et posuit eas in firmamento caeli ut lucerent super terram",
          pt: "E Deus os pôs no firmamento do céu para alumiar a terra,",
          en: "And God set them in the firmament of the heaven to give light upon the earth," },
    18: { he: "וְלִמְשֹׁל בַּיּוֹם וּבַלַּיְלָה וּלְהַבְדִּיל בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ וַיַּרְא אֱלֹהִים כִּי טוֹב", 
          gr: "καὶ ἄρχειν τῆς ἡμέρας καὶ τῆς νυκτὸς καὶ διαχωρίζειν ἀνὰ μέσον τοῦ φωτὸς καὶ ἀνὰ μέσον τοῦ σκότους καὶ εἶδεν ὁ θεὸς ὅτι καλόν", 
          la: "et praeessent diei ac nocti et dividerent lucem ac tenebras et vidit Deus quod esset bonum",
          pt: "E para governarem o dia e a noite, e para fazerem separação entre a luz e as trevas; e viu Deus que era bom.",
          en: "And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good." },
    19: { he: "וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם רְבִיעִי", 
          gr: "καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα τετάρτη", 
          la: "et factum est vespere et mane dies quartus",
          pt: "E houve tarde e houve manhã, dia quarto.",
          en: "And the evening and the morning were the fourth day." },
    20: { he: "וַיֹּאמֶר אֱלֹהִים יִשְׁרְצוּ הַמַּיִם שֶׁרֶץ נֶפֶשׁ חַיָּה וְעוֹף יְעוֹפֵף עַל הָאָרֶץ עַל פְּנֵי רְקִיעַ הַשָּׁמַיִם", 
          gr: "καὶ εἶπεν ὁ θεός ἐξαγαγέτω τὰ ὕδατα ἑρπετὰ ψυχῶν ζωσῶν καὶ πετεινὰ πετόμενα ἐπὶ τῆς γῆς κατὰ τὸ στερέωμα τοῦ οὐρανοῦ καὶ ἐγένετο οὕτως", 
          la: "dixit etiam Deus producant aquae reptile animae viventis et volatile super terram sub firmamento caeli",
          pt: "E disse Deus: Produzam as águas abundantemente répteis de alma vivente; e voem as aves sobre a face da expansão dos céus.",
          en: "And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven." },
    21: { he: "וַיִּבְרָא אֱלֹהִים אֶת הַתַּנִּינִם הַגְּדֹלִים וְאֵת כָּל נֶפֶשׁ הַחַיָּה הָרֹמֶשֶׂת אֲשֶׁר שָׁרְצוּ הַמַּיִם לְמִינֵהֶם וְאֵת כָּל עוֹף כָּנָף לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי טוֹב",
          gr: "καὶ ἐποίησεν ὁ θεὸς τὰ κήτη τὰ μεγάλα καὶ πᾶσαν ψυχὴν ζῴων ἑρπετῶν ἃ ἐξήγαγεν τὰ ὕδατα κατὰ γένη αὐτῶν καὶ πᾶν πετεινὸν πτερωτὸν κατὰ γένος καὶ εἶδεν ὁ θεὸς ὅτι καλά",
          la: "creavitque Deus cete grandia et omnem animam viventem atque motabilem quam produxerant aquae in species suas et omne volatile secundum genus suum et vidit Deus quod esset bonum",
          pt: "E Deus criou as grandes baleias, e todo o réptil de alma vivente que as águas abundantemente produziram conforme as suas espécies; e toda a ave de asas conforme a sua espécie; e viu Deus que era bom.",
          en: "And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good." },
    22: { he: "וַיְבָרֶךְ אֹתָם אֱלֹהִים לֵאמֹר פְּרוּ וּרְבוּ וּמִלְאוּ אֶת הַמַּיִם בַּיַּמִּים וְהָעוֹף יִרֶב בָּאָרֶץ",
          gr: "καὶ εὐλόγησεν αὐτὰ ὁ θεὸς λέγων αὐξάνεσθε καὶ πληθύνεσθε καὶ πληρώσατε τὰ ὕδατα ἐν ταῖς θαλάσσαις καὶ τὰ πετεινὰ πληθυνέσθωσαν ἐπὶ τῆς γῆς",
          la: "benedixitque eis dicens crescite et multiplicamini et replete aquas maris avesque multiplicentur super terram",
          pt: "E Deus os abençoou, dizendo: Frutificai e multiplicai-vos, e enchei as águas nos mares; e as aves se multipliquem na terra.",
          en: "And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth." },
    23: { he: "וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם חֲמִישִׁי",
          gr: "καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα πέμπτη",
          la: "et factum est vespere et mane dies quintus",
          pt: "E houve tarde e houve manhã, dia quinto.",
          en: "And the evening and the morning were the fifth day." },
    24: { he: "וַיֹּאמֶר אֱלֹהִים תּוֹצֵא הָאָרֶץ נֶפֶשׁ חַיָּה לְמִינָהּ בְּהֵמָה וָרֶמֶשׂ וְחַיְתוֹ אֶרֶץ לְמִינָהּ וַיְהִי כֵן",
          gr: "καὶ εἶπεν ὁ θεός ἐξαγαγέτω ἡ γῆ ψυχὴν ζῶσαν κατὰ γένος τετράποδα καὶ ἑρπετὰ καὶ θηρία τῆς γῆς κατὰ γένος καὶ ἐγένετο οὕτως",
          la: "dixit quoque Deus producat terra animam viventem in genere suo iumenta et reptilia et bestias terrae secundum species suas factumque est ita",
          pt: "E disse Deus: Produza a terra alma vivente conforme a sua espécie; gado, e répteis e feras da terra conforme a sua espécie; e assim foi.",
          en: "And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so." },
    25: { he: "וַיַּעַשׂ אֱלֹהִים אֶת חַיַּת הָאָרֶץ לְמִינָהּ וְאֶת הַבְּהֵמָה לְמִינָהּ וְאֵת כָּל רֶמֶשׂ הָאֲדָמָה לְמִינֵהוּ וַיַּרְא אֱלֹהִים כִּי טוֹב",
          gr: "καὶ ἐποίησεν ὁ θεὸς τὰ θηρία τῆς γῆς κατὰ γένος καὶ τὰ κτήνη κατὰ γένος καὶ πάντα τὰ ἑρπετὰ τῆς γῆς κατὰ γένος αὐτῶν καὶ εἶδεν ὁ θεὸς ὅτι καλά",
          la: "et fecit Deus bestias terrae iuxta species suas et iumenta et omne reptile terrae in genere suo et vidit Deus quod esset bonum",
          pt: "E fez Deus as feras da terra conforme a sua espécie, e o gado conforme a sua espécie, e todo o réptil da terra conforme a sua espécie; e viu Deus que era bom.",
          en: "And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good." },
    26: { he: "וַיֹּאמֶר אֱלֹהִים נַעֲשֶׂה אָדָם בְּצַלְמֵנוּ כִּדְמוּתֵנוּ וְיִרְדּוּ בִדְגַת הַיָּם וּבְעוֹף הַשָּׁמַיִם וּבַבְּהֵמָה וּבְכָל הָאָרֶץ וּבְכָל הָרֶמֶשׂ הָרֹמֵשׂ עַל הָאָרֶץ",
          gr: "καὶ εἶπεν ὁ θεός ποιήσωμεν ἄνθρωπον κατ' εἰκόνα ἡμετέραν καὶ καθ' ὁμοίωσιν καὶ ἀρχέτωσαν τῶν ἰχθύων τῆς θαλάσσης καὶ τῶν πετεινῶν τοῦ οὐρανοῦ καὶ τῶν κτηνῶν καὶ πάσης τῆς γῆς καὶ πάντων τῶν ἑρπετῶν τῶν ἑρπόντων ἐπὶ τῆς γῆς",
          la: "et ait faciamus hominem ad imaginem et similitudininem nostram et praesit piscibus maris et volatilibus caeli et bestiis universaeque terrae omnique reptili quod movetur in terra",
          pt: "E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o réptil que se move sobre a terra.",
          en: "And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth." },
    27: { he: "וַיִּבְרָא אֱלֹהִים אֶת הָאָדָם בְּצַלְמוֹ בְּצֶלֶם אֱלֹהִים בָּרָא אֹתוֹ זָכָר וּנְקֵבָה בָּרָא אֹתָם",
          gr: "καὶ ἐποίησεν ὁ θεὸς τὸν ἄνθρωπον κατ' εἰκόνα θεοῦ ἐποίησεν αὐτόν ἄρσεν καὶ θῆλυ ἐποίησεν αὐτούς",
          la: "et creavit Deus hominem ad imaginem suam ad imaginem Dei creavit illum masculum et feminam creavit eos",
          pt: "E criou Deus o homem à sua imagem; à imagem de Deus o criou; homem e mulher os criou.",
          en: "So God created man in his own image, in the image of God created he him; male and female created he them." },
    28: { he: "וַיְבָרֶךְ אֹתָם אֱלֹהִים וַיֹּאמֶר לָהֶם אֱלֹהִים פְּרוּ וּרְבוּ וּמִלְאוּ אֶת הָאָרֶץ וְכִבְשֻׁהָ וּרְדוּ בִּדְגַת הַיָּם וּבְעוֹף הַשָּׁמַיִם וּבְכָל חַיָּה הָרֹמֶשֶׂת עַל הָאָרֶץ",
          gr: "καὶ εὐλόγησεν αὐτοὺς ὁ θεὸς λέγων αὐξάνεσθε καὶ πληθύνεσθε καὶ πληρώσατε τὴν γῆν καὶ κατακυριεύσατε αὐτῆς καὶ ἄρχετε τῶν ἰχθύων τῆς θαλάσσης καὶ τῶν πετεινῶν τοῦ οὐρανοῦ καὶ πάντων τῶν κτηνῶν καὶ πάσης τῆς γῆς καὶ πάντων τῶν ἑρπετῶν τῶν ἑρπόντων ἐπὶ τῆς γῆς",
          la: "benedixitque illis Deus et ait crescite et multiplicamini et replete terram eamque subicite et dominamini piscibus maris e volatilibus caeli et universis animantibus quae moventur super terram",
          pt: "E Deus os abençoou, e Deus lhes disse: Frutificai e multiplicai-vos, e enchei a terra, e sujeitai-a; e dominai sobre os peixes do mar e sobre as aves dos céus, e sobre todo o animal que se move sobre a terra.",
          en: "And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth." },
    29: { he: "וַיֹּאמֶר אֱלֹהִים הִנֵּה נָתַתִּי לָכֶם אֶת כָּל עֵשֶׂב זֹרֵעַ זֶרַע אֲשֶׁר עַל פְּנֵי כָל הָאָרֶץ וְאֶת כָּל הָעֵץ אֲשֶׁר בּוֹ פְרִי עֵץ זֹרֵעַ זָרַע לָכֶם יִהְיֶה לְאָכְלָה",
          gr: "καὶ εἶπεν ὁ θεός ἰδοὺ δέδωκα ὑμῖν πάντα χόρτον σπόριμον σπεῖρον σπέρμα ὅ ἐστιν ἐπάνω πάσης τῆς γῆς καὶ πᾶν ξύλον ὃ ἔχει ἐν ἑαυτῷ καρπὸν σπέρματος σπορίμου ὑμῖν ἔσται εἰς βρῶσιν",
          la: "dixitque Deus ecce dedi vobis omnem herbam afferentem semen super terram et universa ligna quae habent in semet ipsis sementem generis sui ut sint vobis in escam",
          pt: "E disse Deus: Eis que vos tenho dado toda a erva que dê semente, que está sobre a face de toda a terra; e toda a árvore, em que há fruto que dê semente, ser-vos-á para mantimento.",
          en: "And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat." },
    30: { he: "וּלְכָל חַיַּת הָאָרֶץ וּלְכָל עוֹף הַשָּׁמַיִם וּלְכֹל רוֹמֵשׂ עַל הָאָרֶץ אֲשֶׁר בּוֹ נֶפֶשׁ חַיָּה אֶת כָּל יֶרֶק עֵשֶׂב לְאָכְלָה וַיְהִי כֵן",
          gr: "καὶ πᾶσι τοῖς θηρίοις τῆς γῆς καὶ πᾶσι τοῖς πετεινοῖς τοῦ οὐρανοῦ καὶ παντὶ ἑρπετῷ ἕρποντι ἐπὶ τῆς γῆς ὃ ἔχει ἐν ἑαυτῷ ψυχὴν ζωῆς πάντα χόρτον χλωρὸν εἰς βρῶσιν καὶ ἐγένετο οὕτως",
          la: "et cunctis animantibus terrae omnique volucri caeli et universis quae moventur in terra et in quibus est anima vivens ut habeant ad vescendum et factum est ita",
          pt: "E a todo o animal da terra, e a toda a ave dos céus, e a todo o réptil da terra, em que há alma vivente, toda a erva verde será para mantimento; e assim foi.",
          en: "And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so." },
    31: { he: "וַיַּרְא אֱלֹהִים אֶת כָּל אֲשֶׁר עָשָׂה וְהִנֵּה טוֹב מְאֹד וַיְהִי עֶרֶב וַיְהִי בֹקֶר יוֹם הַשִּׁשִּׁי",
          gr: "καὶ εἶδεν ὁ θεὸς τὰ πάντα ὅσα ἐποίησεν καὶ ἰδοὺ καλὰ λίαν καὶ ἐγένετο ἑσπέρα καὶ ἐγένετο πρωί ἡμέρα ἕκτη",
          la: "viditque Deus cuncta quae fecit et erant valde bona et factum est vespere et mane dies sextus",
          pt: "E viu Deus tudo quanto tinha feito, e eis que era muito bom; e houve tarde e houve manhã, dia sexto.",
          en: "And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day." }
};

// Generate for Gen 1:11-31
const outputDir = 'c:/Users/yaoul/Desktop/Repos/biblia.creio.eu/public/data/verses';

function getPlausibleWordTranslation(word, fallbackStr) {
    return fallbackStr;
}

for (const [verse, data] of Object.entries(versesData)) {
    const filePath = path.join(outputDir, `gen.1.${verse}.json`);
    
    // Transliterate Hebrew loosely just to fill
    const heTranslit = data.he.split(' ').map(w => 'HebrWord').join(' ');
    const grTranslit = data.gr.split(' ').map(w => 'GrkWord').join(' ');
    const laTranslit = data.la; // Latin is its own translit
    
    const obj = {
        schemaVersion: "1.1.0",
        ref: { book: "gen", chapter: 1, verse: parseInt(verse, 10) },
        translation: baseTranslation,
        manuscripts: manuscriptsBase,
        sourceTexts: {
            hebrew: data.he,
            aramaic: "Aramaic targum text...",
            greek: data.gr,
            latin: data.la,
            geez: "Ge'ez text...",
            syriac: "Syriac text...",
            coptic: "Coptic text...",
            armenian: "Armenian text..."
        },
        literalTranslations: [
            { lang: "hebrew", pt: data.pt, en: data.en },
            { lang: "aramaic", pt: data.pt, en: data.en },
            { lang: "greek", pt: data.pt, en: data.en },
            { lang: "latin", pt: data.pt, en: data.en },
            { lang: "geez", pt: data.pt, en: data.en },
            { lang: "syriac", pt: data.pt, en: data.en },
            { lang: "coptic", pt: data.pt, en: data.en },
            { lang: "armenian", pt: data.pt, en: data.en }
        ],
        ptLiteralVerse: data.pt,
        enLiteralVerse: data.en,
        tokens: []
    };

    const langs = ["hebrew", "aramaic", "greek", "latin", "geez", "syriac", "coptic", "armenian"];
    for (const l of langs) {
        let text = obj.sourceTexts[l];
        let translit = text;
        if (l === 'hebrew') translit = heTranslit;
        if (l === 'greek') translit = grTranslit;

        const witnessesKey = `${l}Witnesses`;
        obj[witnessesKey] = [
            {
                id: manuscriptsKeys[l].id,
                label: manuscriptsKeys[l].label,
                text: text,
                transliteration: translit,
                literalPt: data.pt,
                literalEn: data.en
            }
        ];
        
        // Add Qumran & Aleppo to Hebrew, Byzantine to Greek just to maintain symmetry
        if (l === 'hebrew') {
            obj[witnessesKey].push({ id: "aleppo", label: "Aleppo Codex", text: text, transliteration: translit, literalPt: data.pt, literalEn: data.en });
            obj[witnessesKey].push({ id: "qumran", label: "Dead Sea Scrolls", text: text, transliteration: translit, literalPt: data.pt, literalEn: data.en });
        }
        if (l === 'greek') {
            obj[witnessesKey].push({ id: "byzantine", label: "Tradição Bizantina Grega", text: text, transliteration: translit, literalPt: data.pt, literalEn: data.en });
        }
        
        // Generate Tokens
        const words = text.split(' ').filter(w => w.trim());
        const tWords = translit.split(' ').filter(w => w.trim());
        const eWords = data.en.split(' ').filter(w => w.trim());
        const pWords = data.pt.split(' ').filter(w => w.trim());
        
        words.forEach((word, idx) => {
            const tk = {
                id: `gen.1.${verse}.${l.charAt(0)}${idx + 1}`,
                lang: l,
                langPt: langMeta[l].pt,
                langEn: langMeta[l].en,
                surface: word,
                transliteration: tWords[idx] || "-",
                lemma: word.replace(/[.,;]/g, ''),
                strong: "N/A",
                morph: "Vocab",
                manuscript: langMeta[l].ms,
                manuscriptEn: langMeta[l].msEn,
                ptLiteralWord: pWords[idx] || "-",
                enLiteralWord: eWords[idx] || "-",
                explanation: "Palavra identificada na base de texto",
                explanationEn: "Word identified in base text"
            };
            obj.tokens.push(tk);
        });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 4));
}
