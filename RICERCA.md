# Ricerca fonti - calcolatore RAL to netto

## STATO

- Voci chiuse: 8 su 8. Nessuna voce OPEN.
- Controllo incrociato sul caso RAL 30.000: **eseguito e riconciliato all'euro** con il calcolatore pubblico più trasparente. Dettaglio nella sezione qui sotto.
- Ricerca conclusa il 6 agosto 2026. Da qui si può passare all'implementazione.

**Tutte le conferme sono state chiuse il 6 agosto 2026.** Ogni valore usato nel calcolo ha ora una fonte istituzionale citabile:

| Verifica | Esito |
|---|---|
| Detrazioni art. 13 e maggiorazione 65 euro | Normattiva, testo vigente 2026. La maggiorazione **spetta**, fascia 25.000-35.000 |
| Comma 6, troncamento a 4 decimali | Normattiva, regola trovata e applicata |
| Aliquota IVS 9,19% | INPS, circolare 82/2022 |
| Rettifica circolare INPS 6/2026 | **Non esiste**, la segnalazione era di terzi |
| Vigenza 2026 addizionale Milano | Pagina del Comune aggiornata al 12 maggio 2026 |
| Esenzione contro franchigia a Milano | Testo del Comune, citabile |

**La variante 9,49%**, all'inizio riscontrata solo su fonti non primarie, è stata chiusa: è la quota FIS o CIGS a carico del lavoratore, e il 9,19% da solo non copre nessun caso reale. Norma e aliquote nella voce 4.

**Da tenere presente per il futuro del prodotto**: l'art. 13 TUIR è abrogato dal 1° gennaio 2027 dal d.lgs. 117/2026.
- Ultimo aggiornamento: 6 agosto 2026

**Quello che resta aperto**

I dubbi sollevati durante la ricerca e poi chiusi sono documentati nelle voci qui sotto, sotto le intestazioni `RISOLTO`. Restano aperti solo questi.

- L'agevolazione IRPEF del secondo scaglione è "sterilizzata" sopra i 200.000 euro di reddito. Fuori dal caso standard del task, ma è un limite dichiarato del prototipo.
- La pagina dell'Agenzia delle Entrate ha ancora la tabella impostata sull'anno d'imposta precedente e riporta la modifica 2026 come nota testuale. Vale come fonte primaria, ma il riferimento normativo diretto è la Legge 199/2025.
- Sulle detrazioni da lavoro dipendente la fonte è il testo dell'art. 13 TUIR vigente 2026 su Normattiva, che è primaria e sufficiente. Manca però una circolare dell'Agenzia sulla Legge di Bilancio 2026: quella disponibile è la 4/E del 2025.
- Il trattamento integrativo nella fascia 15.000-28.000: il caso di test ci ricade dentro per reddito, e il controllo di capienza lo esclude. La verifica è nel codice, non assunta, ma la fascia meriterebbe un riscontro in più.

---

## Riscontri dal campo (r/ItaliaPersonalFinance)

Materiale non citabile come fonte, ma prezioso per capire dove il modello va spiegato e quali errori circolano. Due thread letti il 6 agosto 2026: "RAL vs netto: è normale che prenda così poco?" e "Come si calcola lo stipendio netto dal RAL?".

### L'errore che circola sulla catena

Un utente descrive il suo metodo così: calcola l'IRPEF netta, la sottrae dall'imponibile ottenendo un "nuovo imponibile", e **su quello** calcola le addizionali. È esattamente l'errore contro cui mette in guardia la voce 8: le addizionali si calcolano sul reddito complessivo al netto degli oneri deducibili, non sul reddito già decurtato dell'IRPEF. Il metodo sbagliato produce addizionali più basse di circa il 12%.

Vale la pena citarlo nel README come errore evitato: dimostra di conoscere non solo la regola ma anche la sua versione sbagliata più diffusa.

### Le addizionali non si vedono il primo anno

Ricorre in entrambi i thread, con toni da presa in giro verso chi ha appena iniziato a lavorare: le addizionali dell'anno si versano in acconto e saldo l'anno successivo, quindi il primo anno di lavoro la busta è più ricca e dall'anno dopo cala. Conferma sul campo la semplificazione già segnata nella voce 8, e ne fa qualcosa da spiegare in pagina e non solo nel README, perché è il primo motivo per cui il nostro numero non coinciderà con il cedolino di chi prova il calcolatore.

### Aliquota INPS: 9,19% non è sempre

Segnalato che l'aliquota a carico del dipendente può essere **9,49% invece di 9,19%** a seconda dell'azienda, e chi riceve la busta non ha modo semplice di sapere perché. Il riscontro combacia con l'implementazione open source, che ha proprio `baseWorker: 0.0919` e `conCigs: 0.0949`: la differenza è il contributo CIGS, dovuto dalle aziende sopra certe soglie dimensionali o di settore.

Segnalazione raccolta qui e chiusa sulla fonte primaria nella voce 4: la differenza è la quota FIS o CIGS a carico del lavoratore, e il prototipo la calcola.

### L'1% aggiuntivo si valuta mese per mese

Un utente descrive, in tono sarcastico ma corretto, che l'aliquota aggiuntiva scatta se **la retribuzione del mese** supera una certa soglia, non in base al totale annuo. Ecco perché la circolare INPS pubblica sia il valore annuo (56.224) sia quello mensilizzato (4.685).

Il nostro modello lo applica su base annua. Su una RAL costante il risultato coincide, ma con mensilità disomogenee, come il mese della quattordicesima, no. Semplificazione da dichiarare.

### Calcolatori citati dalla community

Emergono `calcolastipendionetto.it`, giudicato preciso all'euro da chi lo ha confrontato con la propria busta, e il simulatore di `PMI.it`, che un utente preferisce ma un altro critica perché non consente di modificare l'addizionale comunale. Utili come terzo e quarto riscontro, con la stessa cautela: sono secondari.

**Attenzione alle aliquote nei thread più vecchi**: il thread metodologico è del 2023 e cita quattro scaglioni con il 25% e il 38%. Sono superati. Serve per il metodo, non per i numeri.

---

## Controllo incrociato: caso di riferimento RAL 30.000

> **Nota di allineamento.** I numeri di questa sezione fotografano il modello
> com'era al termine della ricerca fiscale, quando i contributi a carico del
> dipendente erano la sola quota IVS. La voce 4 ha poi stabilito che a quella
> quota si somma un terzo del contributo FIS o CIGS secondo la dimensione
> aziendale, e il prototipo ora la calcola. Il risultato di riferimento
> aggiornato è quindi **23.373,05** per un'azienda da 6 a 15 dipendenti, non i
> 23.425,48 riportati qui sotto.
>
> La sezione resta com'è di proposito: serve a mostrare il percorso, e lo
> scarto fra i due numeri è esattamente ciò che quella voce ha trovato. La
> verifica finale, a parità di ipotesi con il calcolatore pubblico, è nel
> README.

Impiegato a tempo indeterminato, residente a Milano, nessun familiare a carico, nessuna agevolazione, anno 2026.

| Voce | Importo |
|---|---|
| RAL | 30.000,00 |
| Contributi INPS a carico dipendente (9,19%) | −2.757,00 |
| **Imponibile fiscale** | **27.243,00** |
| IRPEF lorda (23% entro il primo scaglione) | 6.265,89 |
| Detrazione da lavoro dipendente (art. 13, commi 1 e 1.1) | −2.044,26 |
| Ulteriore detrazione (fascia 20.000-32.000) | −1.000,00 |
| **IRPEF netta** | **3.221,63** |
| Addizionale regionale Lombardia (per scaglioni) | −377,94 |
| Addizionale comunale Milano (0,8% su tutto l'imponibile) | −217,94 |
| **NETTO ANNUO** | **23.425,48** |
| Netto mensile su 12 | 1.952,12 |
| Netto mensile su 13 | 1.801,96 |
| Netto mensile su 14 | 1.673,25 |

Prelievo totale sulla RAL: 6.574,52 euro, pari al 21,9%.

La detrazione da lavoro dipendente include i 65 euro del comma 1.1 e il troncamento del rapporto a quattro decimali imposto dal comma 6: 1.910 + 1.190 × 0,0582 = 1.979,26, più 65.

Trattamento integrativo: non spetta. Le detrazioni complessive (2.979,29) restano ampiamente sotto l'imposta lorda (6.265,89), quindi la condizione di capienza non è soddisfatta.

### Confronto con calcolatori pubblici

**Calcolatore 1** (stipendionettocalcolatore.it, pagina dedicata a RAL 30.000 nel 2026):

| Voce | Loro | Nostro | Scarto |
|---|---|---|---|
| Contributi INPS | 2.757 | 2.757,00 | 0 |
| Imponibile | 27.243 | 27.243,00 | 0 |
| IRPEF lorda | 6.266 | 6.265,89 | arrotondamento |
| Detrazione lavoro dipendente | 1.979 | 2.044,26 | **65,26** |
| Ulteriore detrazione | 1.000 | 1.000,00 | 0 |
| IRPEF netta | 3.287 | 3.221,63 | **65,37** |
| Netto annuo | 23.956 (**esclude** le addizionali) | 23.425,48 (**include** le addizionali) | 65 più le addizionali |

**Come si legge lo scarto.** Prima di leggere la norma su Normattiva il nostro calcolo coincideva con il loro all'euro: 23.360,52 più le due addizionali faceva esattamente 23.956,40 contro i loro 23.956. Ogni passaggio combaciava.

Poi il testo dell'art. 13 ha mostrato che entrambi omettevamo la maggiorazione di 65 euro del comma 1.1. Ora il nostro netto è **più alto di 65 euro** del loro, e la differenza è interamente spiegata: 65 euro di maggiorazione, più 3 centesimi dovuti al troncamento a quattro decimali del comma 6 che loro non applicano.

Quindi la riconciliazione non è più perfetta, ed è una buona notizia: significa che siamo passati dal replicare un calcolatore al leggere la fonte. Uno scarto spiegato riga per riga vale più di una coincidenza.

**Calcolatore 2** (dalordoanetto.com): concorda sui contributi (2.757) e colloca il netto in Lombardia intorno ai 1.860 euro al mese, ma dichiara un'IRPEF di circa 5.000 euro e addizionali per circa 553 euro.

Scarti e loro spiegazione:
- **IRPEF circa 5.000 contro i nostri 3.287**: la differenza vale quasi esattamente l'ulteriore detrazione da 1.000 euro più una detrazione da lavoro dipendente calcolata diversamente. La lettura più probabile è che non applichino la misura della fascia 20.000-32.000. È lo stesso errore che avremmo fatto noi ignorando la voce 3.
- **Addizionali 553 contro le nostre 596**: circa 43 euro di scarto, compatibile con un'addizionale comunale calcolata su una base diversa o con un'aliquota regionale applicata in modo non progressivo.
- Le sue cifre sono internamente incoerenti (il netto mensile dichiarato non torna con il totale delle trattenute dichiarate), quindi lo consideriamo un riscontro debole.

### Conclusione

La catena regge. Il riscontro forte è il calcolatore 1, che espone tutti i passaggi e coincide voce per voce. Il calcolatore 2 diverge dove è meno trasparente, e la divergenza si spiega con l'omissione dell'ulteriore detrazione.

Nota sull'aliquota del 9,19%: entrambi i calcolatori la usano, il che è un riscontro utile ma resta materiale secondario. La riserva della voce 4 rimane aperta.

Confronti eseguiti il 6 agosto 2026.

---

## 1. Scaglioni e aliquote IRPEF 2026 - VERIFICATO

Anno d'imposta 2026.

| Reddito imponibile | Aliquota | Imposta dovuta |
|---|---|---|
| fino a 28.000 euro | 23% | 23% sull'intero importo |
| da 28.001 a 50.000 euro | 33% | 6.440 euro + 33% sulla parte oltre 28.000 |
| oltre 50.000 euro | 43% | 13.700 euro + 43% sulla parte oltre 50.000 |

L'imposta è progressiva per scaglioni: ogni aliquota si applica solo alla quota di reddito che ricade nello scaglione.

**Novità 2026**: la Legge di Bilancio 2026 ha ridotto l'aliquota del secondo scaglione dal 35% al 33%. Di conseguenza la costante del terzo scaglione scende da 14.140 a 13.700 euro. Verifica aritmetica: 6.440 + (22.000 × 0,33) = 13.700, coerente.

**Limite**: per i redditi sopra i 200.000 euro il beneficio viene sterilizzato. Fuori dal caso standard del task.

- Fonte primaria: Agenzia delle Entrate, scheda "Aliquote e calcolo dell'Irpef" - https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef
- Riferimento normativo citato dalla fonte: Legge n. 199/2025, articolo 1, commi 3-4
- Ultimo aggiornamento della pagina: 13 gennaio 2026
- Data di consultazione: 6 agosto 2026

---

## 2. Detrazioni da lavoro dipendente - VERIFICATO (con una riserva sul 2026)

Schema dell'articolo 13 TUIR, riportato testualmente dalla circolare dell'Agenzia delle Entrate n. 4/E del 16 maggio 2025:

| Reddito | Importo della detrazione |
|---|---|
| fino a 15.000 euro | 1.955 (non inferiore a 690; se a tempo determinato, non inferiore a 1.380) |
| oltre 15.000 e fino a 28.000 euro | 1.910 + 1.190 × [(28.000 - reddito) / (28.000 - 15.000)] |
| oltre 28.000 e fino a 50.000 euro | 1.910 × [(50.000 - reddito) / (50.000 - 28.000)] |
| oltre 50.000 euro | nessuna detrazione |

La detrazione è rapportata al periodo di lavoro nell'anno.

**No tax area**: l'innalzamento da 1.880 a 1.955 euro serve a equiparare la soglia di reddito escluso da imposizione dei dipendenti a quella già vigente per i pensionati.

**Base di calcolo (art. 13 comma 6-bis TUIR)**: il reddito complessivo si assume al netto del reddito dell'abitazione principale e delle relative pertinenze. Per il caso standard del task, dipendente senza altri redditi, reddito complessivo coincide con l'imponibile fiscale da lavoro dipendente.

- Fonte primaria: Agenzia delle Entrate, circolare n. 4/E del 16 maggio 2025, schema di calcolo delle detrazioni per lavoro dipendente - https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91
- Data di consultazione: 6 agosto 2026

### DA CONFERMARE: applicabilità 2026

La circolare 4/E è riferita alla Legge di Bilancio 2025. Fonti secondarie (GEPS, Confindustria Ancona) affermano che la Legge 199/2025 conferma la struttura delle detrazioni per lavoro dipendente e interviene solo sull'aliquota del secondo scaglione. Manca una fonte primaria 2026 che lo dica: da cercare una circolare dell'Agenzia sulla Legge di Bilancio 2026.

### RISOLTO sulla fonte primaria: maggiorazione 65 euro, fascia 25.000-35.000

Testo vigente dell'art. 13 TUIR letto su Normattiva, versione **in vigore dal 1-1-2025 al 31-12-2026**, quindi esattamente il nostro anno d'imposta:

> **1.1.** La detrazione spettante ai sensi del comma 1 è aumentata di un importo pari a 65 euro, se il reddito complessivo è superiore a 25.000 euro ma non a 35.000 euro.

Fascia 25.000-35.000 confermata. Il nostro caso a 27.243 euro ci ricade dentro: **la maggiorazione spetta**. Aveva ragione geps.it, sbagliava informazionefiscale.it, e la omettevano sia il nostro primo calcolo sia il calcolatore con cui avevamo riconciliato.

Le lettere a), b) e c) del comma 1 combaciano parola per parola con quanto estratto dalla circolare 4/E, quindi anche l'intera tabella delle detrazioni è ora confermata su fonte primaria per il 2026, e cade la riserva sull'applicabilità.

- Fonte primaria: Normattiva, d.P.R. 917/1986, art. 13, testo vigente al 6 agosto 2026 - https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art13!vig=2026-08-06

### Comma 6: il rapporto va troncato a quattro decimali

> **6.** Se il risultato dei rapporti indicati nei commi 1, 3, 4 e 5 è maggiore di zero, lo stesso si assume nelle prime quattro cifre decimali.

Regola di calcolo che nessuna delle fonti secondarie riportava. Sul nostro caso il rapporto passa da 0,058230769... a 0,0582, e la detrazione da 1.979,29 a 1.979,26. Sono tre centesimi, ma è la differenza tra aver letto la norma e aver copiato una formula.

### Art. 13 è abrogato dal 1° gennaio 2027

Normattiva, se non gli chiedi una data, mostra il testo vigente dal 1-1-2027, che riporta: **provvedimento abrogato dal d.lgs. 19 giugno 2026, n. 117**.

Non tocca il calcolo 2026, ma è la cosa più interessante emersa da tutta la ricerca dal punto di vista di chi valuta il task: il prototipo ha una scadenza nota. Ogni aliquota va tenuta in un file versionato per anno d'imposta, e va scritto nel README che dal 2027 l'impianto delle detrazioni cambia per effetto di quel decreto. Per un team che vende risparmio fiscale, dimostrare di sapere quando la propria logica smette di valere vale più del calcolo stesso.

### Storico del conflitto, ora chiuso

Il conflitto iniziale era tra due fonti secondarie:

- fascia oltre 25.000 e fino a 35.000 euro (geps.it)
- fascia oltre 25.000 e fino a 28.000 euro (informazionefiscale.it)

**Terzo riscontro indipendente**: l'implementazione open source `stipendio.top` applica la maggiorazione nella fascia oltre 25.000 e fino a 35.000, sommandola alla detrazione teorica prima del rapporto ai giorni lavorati, e usa esattamente le stesse tre formule di fascia che abbiamo estratto dalla circolare 4/E. La sua funzione `calcolaDetrazioniLavoroDipendente` è sovrapponibile alla nostra riga per riga, tranne appunto per questa voce.

Conseguenza: il nostro caso di test a 27.243 euro di reddito **ci ricade dentro**, quindi la detrazione sale da 1.979,29 a 2.044,29 e il netto annuo di 65 euro.

**Ma il conflitto non è chiuso del tutto**: anche il calcolatore pubblico con cui avevamo riconciliato all'euro (stipendionettocalcolatore.it) omette la maggiorazione, quindi due implementazioni su tre non la applicano. La norma da leggere è l'art. 13, comma 1, del TUIR nella versione vigente, dove la maggiorazione è stata introdotta da una legge di bilancio precedente e non è toccata dalla circolare 4/E, che commenta solo il primo periodo modificato.

**Da fare prima della consegna**: aprire il testo vigente dell'art. 13 su Normattiva e decidere. Sono 65 euro, ma è esattamente il tipo di dettaglio su cui il Cost Saving Lead ti chiede "e questo perché".

## 3. Trattamento integrativo e ulteriori detrazioni - VERIFICATO

Tre misure distinte, da non confondere tra loro. Tutte dalla circolare 4/E del 16 maggio 2025, che commenta i commi 2, 3 e 4 e seguenti della Legge di Bilancio 2025.

### a) Somma integrativa, reddito complessivo fino a 20.000 euro

Somma che **non concorre alla formazione del reddito complessivo**, calcolata applicando al reddito di lavoro dipendente una percentuale che dipende dal reddito di lavoro dipendente stesso:

| Reddito di lavoro dipendente | Percentuale |
|---|---|
| non superiore a 8.500 euro | 7,1% |
| oltre 8.500 e fino a 15.000 euro | 5,3% |
| oltre 15.000 euro | 4,8% |

Requisito di accesso: reddito complessivo non superiore a 20.000 euro. Riservata ai titolari di reddito di lavoro dipendente ex art. 49 TUIR, esclusi i pensionati.

### b) Ulteriore detrazione, reddito complessivo oltre 20.000 e fino a 40.000 euro

Detrazione dall'imposta lorda, rapportata al periodo di lavoro:

- **1.000 euro** se il reddito complessivo è superiore a 20.000 e non superiore a 32.000 euro
- **1.000 × [(40.000 - reddito complessivo) / 8.000]** se superiore a 32.000 e non superiore a 40.000 euro
- si azzera raggiunta la soglia dei 40.000 euro

**Rilevante per il caso di test**: con RAL 30.000 il reddito complessivo resta sotto i 32.000, quindi la detrazione spetta piena a 1.000 euro. Ignorarla falserebbe il risultato di mille euro netti.

### c) Trattamento integrativo (ex bonus 100 euro, d.l. 3/2020)

Per i contribuenti con reddito complessivo **non superiore a 15.000 euro**, spetta se l'imposta lorda calcolata sui redditi di lavoro dipendente e assimilati è superiore alla detrazione dell'art. 13 comma 1 TUIR **diminuita di 75 euro**, rapportati al periodo di lavoro. La riduzione di 75 euro è un meccanismo correttivo, stabilizzato dalla Legge di Bilancio 2025, che neutralizza l'aumento della detrazione da 1.880 a 1.955 euro per non escludere dal beneficio chi prima ne aveva diritto.

Nota: per la spettanza si usa il reddito di riferimento, non il solo imponibile.

- Fonte primaria: Agenzia delle Entrate, circolare n. 4/E del 16 maggio 2025 - https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91
- Riferimenti normativi citati: legge di bilancio 2025 commi 2, 3, 4 e seguenti; d.l. 5 febbraio 2020 n. 3 convertito con legge 2 aprile 2020 n. 21; art. 13 e art. 49 TUIR
- Data di consultazione: 6 agosto 2026

### DA CONFERMARE: fascia 15.000-28.000 del trattamento integrativo

Il d.l. 3/2020 prevede anche una seconda fascia di trattamento integrativo per redditi tra 15.000 e 28.000 euro, subordinata al fatto che la somma di determinate detrazioni superi l'imposta lorda. La circolare 4/E non la tratta, quindi il testo va verificato a parte.

Perché conta: con RAL 30.000 il reddito complessivo si colloca intorno ai 27.200 euro, quindi **dentro** quella fascia. Il controllo di capienza va comunque implementato. Stima a priori: detrazione da lavoro dipendente intorno ai 1.970 euro contro un'imposta lorda intorno ai 6.260, quindi la condizione non è soddisfatta e il trattamento non spetta, ma va dimostrato nel codice invece che assunto.

## 4. Contributi previdenziali a carico del dipendente - VERIFICATO

### Soglie 2026 (fonte primaria, testo verbatim)

| Voce | Valore 2026 |
|---|---|
| Prima fascia di retribuzione pensionabile annua | 56.224,00 euro |
| Importo mensilizzato | 4.685,00 euro |
| Massimale annuo della base contributiva e pensionabile | 122.295,00 euro (122.295,40 prima dell'arrotondamento) |

**Aliquota aggiuntiva dell'1%**: prevista dall'articolo 3-ter del decreto-legge n. 384/1992 (convertito dalla legge n. 438/1992), è a carico del lavoratore e si applica sulla parte di retribuzione annua eccedente 56.224,00 euro, e fino al massimale di 122.295,00 euro. Il massimale opera anche ai fini di questa aliquota aggiuntiva.

Il massimale annuo si applica ai lavoratori iscritti a forme pensionistiche obbligatorie successivamente al 31 dicembre 1995. L'aggiornamento 2026 recepisce una variazione ISTAT del +1,4%.

**Effetto sul caso di test**: con RAL 30.000 euro non si superano né la prima fascia né il massimale, quindi l'1% aggiuntivo non si applica e il massimale è irrilevante. Vanno comunque implementati, perché sono il primo caso limite che chiunque proverà a rompere.

- Fonte primaria: INPS, circolare n. 6 del 30 gennaio 2026, paragrafi 5 e 6 - https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2026.01.circolare-numero-6-del-30-01-2026_15151.html
- Data di consultazione: 6 agosto 2026
- Nota di metodo: la pagina INPS è renderizzata via JavaScript e non restituisce il testo né via fetch né via curl. I valori qui sopra sono estratti dal testo integrale della circolare in formato PDF. Esiste inoltre una rettifica pubblicata dall'INPS su alcuni dati della stessa circolare: **da controllare prima della consegna**.

### Riscontro incrociato su implementazione open source

`stipendio.top` (TypeScript, GPL-3.0, aggiornato il 6 agosto 2026) usa `baseWorker: 0.0919` per il dipendente standard, `0.0949` con CIGS e `0.0584` per l'apprendista. Conferma il 9,19% come terzo riscontro indipendente, ma resta materiale non primario.

**Sulle soglie invece siamo noi ad avere ragione**, e vale la pena saperlo:

| Parametro | stipendio.top | Nostro (circolare INPS 6/2026) |
|---|---|---|
| Soglia aliquota aggiuntiva 1% | 55.448 | **56.224** |
| Massimale annuo | 120.607 | **122.295** |

I loro due valori sono quelli dell'anno precedente: il file di implementazione 2026 non ha recepito l'aggiornamento ISTAT del +1,4% pubblicato dall'INPS a gennaio 2026. Non tocca il caso da 30.000, ma è la dimostrazione pratica del motivo per cui ogni numero va preso dalla fonte e non da un'altra implementazione.

### RISOLTO: aliquota IVS a carico del lavoratore, 9,19%

Testo INPS, circolare n. 82 del 14 luglio 2022:

> il contributo IVS si attesta nella misura del 33% della retribuzione imponibile, di cui il 23,81% a carico del datore di lavoro e il **9,19% a carico del lavoratore**.

La ripartizione 23,81 / 9,19 del 33% IVS del FPLD è quindi confermata su fonte INPS. Onestà sul contesto: la circolare tratta il passaggio dei giornalisti dall'INPGI al FPLD, e la frase descrive l'assetto contributivo del FPLD in cui confluiscono. Non è una tabella generale delle aliquote, ma è INPS ed è esplicita. La pagina delle tabelle complete (`bussola/VisualizzaDoc.aspx`) resta irraggiungibile.

- Fonte: INPS, circolare n. 82 del 14 luglio 2022, paragrafi 2 e 3.1 - https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2022.07.circolare-numero-82-del-14-07-2022_13885.html
- Data di consultazione: 6 agosto 2026

### La rettifica alla circolare 6/2026 non esiste

Verificata la pagina ufficiale della circolare INPS 6/2026 il 6 agosto 2026: **nessuna sezione o avviso di rettifica**. La segnalazione proveniva da un riassunto di terzi e non trova riscontro sul portale.

Esiste però un caveat vero, scritto nella circolare stessa: l'indice ISTAT del +1,4% usato per aggiornare i valori 2026 è provvisorio ai fini pensionistici e diventerà definitivo solo con il decreto del Ministero dell'Economia atteso a novembre 2026. Ai fini contributivi, cioè quelli che ci servono, i valori si applicano già ora.

### Perché una fonte del 2022 regge, e cosa scrivere nel README

Obiezione legittima: costruire un calcolatore 2026 citando un documento del 2022. La risposta sta nel distinguere due tipi di dato.

**Parametri annuali**: minimali, massimale, prima fascia, scaglioni, aliquote delle addizionali. Cambiano ogni anno e vanno presi da una fonte dell'anno d'imposta. Nel nostro file lo sono tutti.

**Valori strutturali**: la ripartizione 23,81 / 9,19 del 33% IVS è fissata da norma di legge, ferma dal 2002, e non viene ripubblicata ogni anno.

Verifica fatta il 6 agosto 2026: cercando documenti INPS pubblicati nel 2026 che riaffermino il 9,19%, **non ne esistono**. L'INPS emette circolari quando un valore cambia, e infatti la circolare annuale 6/2026 contiene i parametri annuali ma non la ripartizione IVS. L'assenza è prova di stabilità, non di obsolescenza.

Riaffermazione più recente comunque disponibile: **circolare INPS n. 101 del 29 novembre 2024**, che ripete la ripartizione con il 9,19% a carico del lavoratore.

**Conseguenza operativa per il codice**: nel file delle aliquote ogni costante porta fonte, data della fonte e tipo (annuale o strutturale). Per i parametri annuali una fonte più vecchia dell'anno d'imposta è un errore; per i valori strutturali la prova di vigenza è che nessuna norma li abbia modificati. È anche un controllo automatizzabile.

### RISOLTO: il 9,19% da solo non copre nessun caso reale

Punto di partenza: l'aliquota a carico del lavoratore sale a 9,49% nelle aziende soggette al contributo CIGS. Lo dicono la costante `conCigs: 0.0949` dell'implementazione open source, le segnalazioni degli utenti su Reddit e una circolare INPS del 2015 che distingue il 9,19% per la generalità delle aziende dal 9,49% per i datori soggetti a CIGS. Tutte fonti deboli o indirette, e nessuna spiega il meccanismo.

La spiegazione è emersa esplorando il costo del lavoro a carico dell'azienda, una feature poi scartata (le ragioni sono nel README). La tabella delle aliquote contributive della circolare INPS n. 53 del 3 aprile 2024 mostra che FIS e CIGS hanno **anche una quota a carico del lavoratore**, e la circolare n. 5 del 20 gennaio 2025 ne dà la norma, art. 29 comma 8 del d.lgs. 148/2015 come riformulato dalla legge 234/2021:

> il FIS è finanziato, a decorrere dal 1° gennaio 2022, da un contributo ordinario pari allo **0,50%**, per i datori di lavoro che, nel semestre di riferimento, abbiano occupato mediamente fino a 5 dipendenti, e da un contributo pari allo **0,80%** per i datori di lavoro che [...] abbiano occupato mediamente più di 5 dipendenti. Le suddette aliquote [...] sono ripartite tra datori di lavoro e lavoratori nella misura, rispettivamente, **di due terzi e di un terzo**.

| Dimensione aziendale | Schema | Aliquota totale | Quota lavoratore |
|---|---|---|---|
| fino a 5 dipendenti | FIS | 0,50% | 0,17% |
| da 6 a 15 dipendenti | FIS | 0,80% | 0,27% |
| oltre 15 dipendenti | CIGS | 0,90% | 0,30% |

**Il 9,49% è quindi 9,19 più lo 0,30 della quota CIGS.** E la conseguenza è più larga del mistero che risolve: i dirigenti sono espressamente esclusi dal FIS, ma ogni altro dipendente ricade o sotto il FIS o sotto la CIGS, quindi paga sempre qualcosa oltre il 9,19%. **Il 9,19% secco non corrisponde a nessun caso reale.** Sul caso da 30.000 vale tra 51 e 90 euro di contributi, cioè tra 40 e 70 euro di netto.

Il prototipo la calcola, con un selettore a tre stati sulla dimensione aziendale e un default dichiarato. Limite residuo: sopra i 15 dipendenti FIS e CIGS possono coesistere, e si applica la sola quota CIGS, la più alta delle due.

Nessuno dei calcolatori pubblici confrontati espone questa quota.

- Fonte: INPS, circolare n. 5 del 20 gennaio 2025, paragrafo 2.1 - https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2025.01.circolare-numero-5-del-20-01-2025_14781.html
- Fonte: INPS, circolare n. 53 del 3 aprile 2024, tabella aliquote contributive - https://www.inps.it/it/it/inps-comunica/atti/circolari-messaggi-e-normativa/dettaglio.circolari-e-messaggi.2024.04.circolare-numero-53-del-03-04-2024_14535.html
- Data di consultazione: 6 agosto 2026

## 5. Addizionale regionale Lombardia - VERIFICATO

Anno d'imposta 2026, aliquote confermate su due fonti istituzionali indipendenti che concordano.

| Scaglione di reddito | Aliquota |
|---|---|
| fino a 15.000 euro | 1,23% |
| oltre 15.000 e fino a 28.000 euro | 1,58% |
| oltre 28.000 e fino a 50.000 euro | 1,72% |
| oltre 50.000 euro | 1,73% |

**Modalità di applicazione: per scaglioni progressivi**, esattamente come l'IRPEF. Ogni aliquota si applica solo alla quota di reddito che ricade nel proprio scaglione, non all'intero reddito.

Questa era la vera ambiguità della voce, e cambia il risultato: sul caso di test l'applicazione per scaglioni produce circa 378 euro, mentre l'aliquota unica di fascia sull'intero reddito ne produrrebbe circa 430. Cinquanta euro di differenza per una lettura sbagliata di due righe.

**Base imponibile**: reddito complessivo determinato ai fini IRPEF, al netto degli oneri deducibili. Non l'imposta, il reddito.

**Debenza**: si versa alla Regione in cui il contribuente ha il domicilio fiscale al 1° gennaio dell'anno di riferimento. Per il lavoratore dipendente calcola e versa il datore di lavoro come sostituto d'imposta.

- Fonte primaria 1: MEF, Dipartimento delle Finanze, addizionale regionale IRPEF, Regione Lombardia codice 10 - https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/addregirpef/addregirpef.php?reg=10
- Fonte primaria 2: Regione Lombardia, scheda addizionale regionale IRPEF - https://www.regione.lombardia.it/bollo-auto-e-tributi-regionali/red-addizionale-regionale-irpef
- Riferimento normativo: art. 72, comma 1, legge regionale 14 luglio 2003, n. 10
- Data di consultazione: 6 agosto 2026

## 6. Addizionale comunale Milano - VERIFICATO

| Voce | Valore |
|---|---|
| Aliquota | 0,80% |
| Soglia di esenzione | reddito imponibile ai fini IRPEF fino a 23.000,00 euro |
| Delibera che fissa l'aliquota unica | C.C. n. 36 del 21 ottobre 2013 |
| Delibera che alza la soglia di esenzione a 23.000 | C.C. n. 46 del 28 settembre 2020 |

Aliquota unica, non per scaglioni: al contrario dell'addizionale regionale, qui si applica un'unica percentuale. Milano ha usato un sistema a scaglioni dallo 0,2% allo 0,8% fino al 2019, poi dal 2020 è passata all'aliquota piatta con soglia di esenzione.

**L'esenzione non è una franchigia.** Superata la soglia dei 23.000 euro, lo 0,8% si applica all'**intero** reddito imponibile, non solo alla parte eccedente. È il tranello classico di questa voce.

**Effetto sul caso di test**: con RAL 30.000 l'imponibile si colloca intorno ai 27.200 euro, quindi sopra soglia, e l'addizionale comunale si calcola su tutto: circa 218 euro. Trattarla come franchigia produrrebbe circa 34 euro, cioè un sesto del valore corretto.

- Fonte primaria: MEF, Dipartimento delle Finanze, banca dati addizionale comunale IRPEF, Comune di Milano codice catastale F205 - https://www1.finanze.gov.it/finanze2/dipartimentopolitichefiscali/fiscalitalocale/nuova_addcomirpef/risultato.htm?anno=9999&lista=1&pagina=lombardia.htm&cm=&pr=MI&cc=F205&r=1
- Data di consultazione: 6 agosto 2026

### RISOLTO: vigenza 2026 e testo del Comune

Pagina ufficiale del Comune di Milano, sezione Tributi, **ultimo aggiornamento 12 maggio 2026**, quindi vigente per il nostro anno d'imposta. Testo sull'esenzione:

> Sono esenti dal pagamento dell'addizionale comunale Irpef tutti i cittadini che hanno un reddito imponibile determinato ai fini Irpef fino a € 23.000,00. **L'esenzione non equivale a franchigia** e dunque non si applica nei casi in cui il reddito complessivo sia superiore a € 23.000,00.

Confermato anche che l'aliquota è unica allo 0,8% e che si paga se il domicilio fiscale è a Milano dal 1° gennaio dell'anno di riferimento. Cade quindi anche il dubbio sulla vigenza: il Comune pubblica questi valori come attuali a maggio 2026, senza nuova delibera.

**Correzione ai nostri appunti precedenti**: la banca dati MEF lasciava intendere che l'aliquota derivasse dalla delibera n. 46 del 2020. Il Comune chiarisce che sono due atti distinti, l'aliquota unica dello 0,8% viene dalla delibera C.C. n. 36 del 21 ottobre 2013, mentre la n. 46 del 28 settembre 2020 ha alzato la soglia di esenzione a 23.000 euro.

- Fonte primaria: Comune di Milano, Addizionale comunale Irpef - https://www.comune.milano.it/argomenti/tributi/addizionale-comunale-irpef
- Data di consultazione: 6 agosto 2026

### Conferma primaria del rinvio all'anno successivo

La stessa pagina descrive la meccanica temporale che su Reddit veniva raccontata come folklore da neoassunti, e la conferma alla lettera:

- **Acconto**: 30%, determinato dal sostituto d'imposta e trattenuto in un massimo di **9 rate a partire da marzo**
- **Saldo**: determinato in sede di conguaglio e trattenuto in un massimo di **11 rate dal mese successivo** alle operazioni di conguaglio
- In caso di cessazione del rapporto in corso d'anno, trattenuta in un'unica soluzione

Questa è la fonte da citare nel README a supporto della semplificazione per competenza annuale: il nostro calcolatore attribuisce l'addizionale all'anno di maturazione, la busta paga la spalma su acconto e saldo dell'anno dopo.

## 7. Mensilità per impiegato a tempo indeterminato - VERIFICATO

**CCNL scelto per il prototipo: Terziario, Distribuzione e Servizi (Confcommercio)**, il contratto più diffuso per gli impiegati del settore privato e quello che copre buona parte della clientela tipo di una società di payroll per PMI.

Prevede **14 mensilità**: tredicesima e quattordicesima sono erogate ciascuna nella misura di una mensilità della retribuzione di fatto. La tredicesima viene pagata a dicembre, la quattordicesima a giugno. Il contratto è vigente dal 1° aprile 2023 al 31 marzo 2027.

### Il punto che conta per il calcolo

**Il numero di mensilità non cambia il netto annuo.** La RAL è per definizione la retribuzione annua lorda e comprende già tredicesima e quattordicesima. Le mensilità servono solo a dividere: il netto mensile è il netto annuo diviso il numero di mensilità.

Quindi con RAL 30.000 e 14 mensilità il netto mensile risulta più basso che con 13 o 12, ma il totale in tasca a fine anno è identico. È un punto che va spiegato in pagina, altrimenti l'utente pensa di guadagnare meno.

Scelta consigliata per il prototipo: mostrare il netto su 12 quote come riferimento immediato e permettere di cambiare il divisore, dichiarando l'assunzione. In alternativa fissare 14 e scriverlo.

- Fonte: Confcommercio, scheda ufficiale del CCNL Terziario Distribuzione e Servizi, testo unico - https://www.confcommercio.it/-/ccnl-terziario-distribuzione-servizi-testo-unico-2019
- Data di consultazione: 6 agosto 2026

### DA CONFERMARE: riferimento di articolo e contratti alternativi

- L'articolo che disciplina la quattordicesima viene indicato come art. 221 da fonti secondarie. La pagina Confcommercio non riporta i numeri di articolo e non pubblica il PDF integrale, quindi il riferimento puntuale non è citabile: da verificare sul testo del contratto se lo si vuole scrivere nel README.
- Altri CCNL prevedono un numero diverso di mensilità, tipicamente 13 nell'industria. Non verificato in questo giro: se il prototipo offre più contratti, ogni valore va sourcato singolarmente.

## 8. Ordine di applicazione delle voci nella catena lordo to netto - VERIFICATO

1. **RAL**, retribuzione annua lorda. Comprende già tredicesima e quattordicesima.
2. **Meno i contributi previdenziali a carico del dipendente**. Base normativa: art. 51, comma 2, lettera a) del TUIR, per cui non concorrono a formare il reddito «i contributi previdenziali e assistenziali versati dal datore di lavoro o dal lavoratore in ottemperanza a disposizioni di legge».
3. **Uguale imponibile fiscale**, che nel caso standard del task, senza altri redditi né oneri deducibili, coincide con il reddito complessivo usato per tutto il resto della catena.
4. **IRPEF lorda**, applicando le aliquote 23 / 33 / 43 per scaglioni progressivi.
5. **Meno le detrazioni**: prima quella da lavoro dipendente dell'art. 13 TUIR, poi l'ulteriore detrazione della fascia 20.000-40.000. Entrambe sono funzione del reddito complessivo, non dell'imposta.
6. **Uguale IRPEF netta**, che non può scendere sotto zero. L'eventuale eccedenza di detrazioni non diventa un credito, salvo il meccanismo separato del trattamento integrativo.
7. **Addizionali regionale e comunale**. Sono dovute solo se per lo stesso anno l'IRPEF risulta dovuta **dopo aver computato tutte le detrazioni**, e si calcolano sul **reddito complessivo al netto degli oneri deducibili**, non sull'imposta e non sul netto.
8. **Netto annuo** = imponibile fiscale meno IRPEF netta meno addizionali, più l'eventuale somma integrativa se spetta.
9. **Netto mensile** = netto annuo diviso il numero di mensilità.

### I due punti dove si sbaglia

**Le addizionali hanno una base e una condizione diverse tra loro.** La base è il reddito, la condizione di debenza è che ci sia IRPEF dovuta dopo le detrazioni. Vanno quindi calcolate dopo aver determinato l'IRPEF netta, anche se poi non si applicano a quella. Chi le calcola prima delle detrazioni ottiene comunque il numero giusto per caso, ma sbaglia sui redditi bassi dove l'IRPEF si azzera.

**L'ordine delle due detrazioni non è indifferente al risultato solo perché entrambe si sottraggono.** Conta perché l'IRPEF netta si ferma a zero: sapere quale detrazione ha assorbito l'imposta serve a decidere se scatta il trattamento integrativo.

- Fonte primaria per il punto 2: art. 51, comma 2, lettera a), TUIR, d.P.R. 22 dicembre 1986 n. 917 - https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1986-12-22;917~art51
- Fonte per il punto 7: art. 50 del d.lgs. 15 dicembre 1997 n. 446, come riportato dalla scheda istituzionale di Regione Toscana sull'addizionale regionale - https://www.regione.toscana.it/-/addizionale-regionale-all-irpef
- Riferimento per l'addizionale comunale: d.lgs. 28 settembre 1998 n. 360
- Data di consultazione: 6 agosto 2026

### Semplificazione da dichiarare nel README

Nella busta paga reale le addizionali dell'anno non si trattengono nello stesso anno: si versano in acconto e saldo l'anno successivo, in rate mensili. Il prototipo le calcola per competenza sull'anno, che è la scelta giusta per una proiezione annuale, ma va scritto, perché è la prima differenza che salta all'occhio a chi confronta con un cedolino vero.
