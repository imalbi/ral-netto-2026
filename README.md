# Da RAL a netto, anno d'imposta 2026

Prototipo che, data una retribuzione annua lorda, proietta il netto annuo e
mensile mostrando in chiaro ogni voce trattenuta.

Caso coperto: **impiegato a tempo indeterminato, residente a Milano, nessuna
agevolazione, nessun familiare a carico**.

**Demo:** https://imalbi.github.io/ral-netto-2026/

## Come si apre

Nessuna build, nessuna dipendenza. HTML e JavaScript semplice.

```
python3 -m http.server 8765 --directory .
# poi http://127.0.0.1:8765
```

## Struttura

| File | Ruolo |
|---|---|
| `index.html` | Pagina: form, cascata delle voci, semplificazioni, fonti |
| `src/rates-2026.js` | **Tutte** le costanti fiscali e contributive, ognuna con fonte, data e tipo |
| `src/calculator.js` | Il calcolo, una funzione per voce di busta paga |
| `src/app.js` | Collegamento tra form, calcolo e pagina |
| `RICERCA.md` | Il lavoro di ricerca: ogni valore, la sua fonte, i conflitti trovati e come sono stati sciolti |
| `verifica-caso-30000.py` | Riferimento indipendente in Python per il caso di test |

La sezione "Fonti" della pagina è **generata da `rates-2026.js`**: pagina e
codice non possono divergere.

## Type checking senza build

I file restano JavaScript, ma i tipi ci sono: stanno nei commenti JSDoc e in
`types/globals.d.ts`, e si verificano davvero.

```
npx tsc -p jsconfig.json     # 0 errori
```

Nessun passaggio di compilazione, nessuna dipendenza a runtime, il browser
carica gli stessi file che leggi.

Il controllo copre `rates-2026.js` e `calculator.js`, cioè il modello. Non
copre `app.js`, che è wiring del DOM: in modalità strict produce una
cinquantina di errori di nullabilità sui `getElementById`, e zittirli
richiederebbe riempire il file di cast. Il valore del controllo dei tipi qui
sta sul calcolo, non sul codice che appende nodi a una tabella, quindi il
confine è dichiarato invece che nascosto.

## Perché senza framework

È una scelta, non una scorciatoia.

Quello che va dimostrato qui è il controllo sulla logica, non la capacità di
montare un'impalcatura: senza build e senza dipendenze chi revisiona apre un
file e vede tutto, invece di cercare il calcolo dentro una gerarchia di
componenti e un bundle. La consegna è un link, e file statici vanno online
senza configurazione. E la pagina non eserciterebbe comunque un framework: un
numero in ingresso, una lista di righe in uscita, tre selettori, nessuno stato
condiviso e nessun routing.

Il punto in cui la decisione si ribalta è preciso: quando lo stato smette di
stare in una schermata sola. Un selettore su ottomila comuni con ricerca, il
confronto affiancato di più scenari, la persistenza di un profilo utente, il
passaggio da uno a più anni d'imposta confrontabili. Lì la reattività e la
composizione iniziano a pagare il proprio costo, e riscriverei in SvelteKit con
adapter statico, tenendo `rates-*.js` e `calculator.js` esattamente come sono:
non dipendono dal DOM, e sono la parte che non va riscritta.

## La catena di calcolo

```
RAL
  − contributi previdenziali a carico del dipendente     art. 51 c.2 lett. a) TUIR
= imponibile fiscale                                     (= reddito complessivo nel caso standard)
  → IRPEF lorda per scaglioni                            23% / 33% / 43%
  − detrazione da lavoro dipendente                      art. 13 c.1 e c.1.1 TUIR
  − ulteriore detrazione                                 fascia 20.000-40.000
= IRPEF netta                                            mai sotto zero
  − addizionale regionale Lombardia                      per scaglioni, sul reddito
  − addizionale comunale Milano                          aliquota unica, sul reddito
  + somma integrativa / trattamento integrativo          se spettanti
= netto annuo
  ÷ 12, 13 o 14                                          netto mensile
```

### I tre punti dove è facile sbagliare

**Le addizionali hanno base e condizione diverse.** La base imponibile è il
reddito complessivo al netto degli oneri deducibili, non il reddito già
decurtato dell'IRPEF. La condizione di debenza è invece che risulti IRPEF
dovuta *dopo* le detrazioni. Vanno quindi calcolate dopo aver determinato
l'IRPEF netta, pur non applicandosi a essa.

**L'esenzione comunale di Milano non è una franchigia.** Superata la soglia di
23.000 euro l'aliquota si applica all'intero imponibile. Trattarla come
franchigia, su una RAL di 30.000, produce 34 euro invece di 218.

**Il rapporto nella formula delle detrazioni va troncato a quattro decimali**,
come impone l'art. 13 comma 6. È l'unica regola di calcolo che nessuna fonte
secondaria consultata riportava.

### Le mensilità non cambiano il netto annuo

La RAL comprende già tredicesima e quattordicesima. Il numero di mensilità
cambia solo in quante quote viene diviso lo stesso importo. Le tre tab in
pagina servono a rendere evidente proprio questo: cambiando tab il netto annuo
resta fermo e cambia solo il mensile.

## Il costo per l'azienda: costruito, misurato, rimosso

Era l'estensione naturale, ed è il lato che interessa a chi compra uno
strumento di cost saving. È stato implementato con la sola quota IVS a carico
del datore (23,81%), l'unica componente con una fonte verificata, e poi tolto.

Il motivo è che non esiste un'aliquota unica per "il datore di lavoro del
terziario". Il FIS è lo 0,50% fino a 5 dipendenti e lo 0,80% oltre, con una
riduzione al 40% dal 2025 per i piccoli che non hanno chiesto integrazioni da
24 mesi; sopra i 15 dipendenti si aggiunge la CIGS allo 0,90%; l'INAIL varia
per classe di rischio. Servirebbero due input in più in una pagina che la
traccia vuole semplice, e ogni combinazione andrebbe sourcata.

La versione parziale restava bassa di circa il 10%. Su un prodotto di cost
saving sbagliare per difetto è la direzione che costa al cliente, quindi un
costo del lavoro parziale è peggio di nessun costo del lavoro.

La ricerca non è stata buttata: è da lì che è emersa la quota FIS e CIGS a
carico del dipendente, cioè la sezione qui sotto.

## La quota FIS e CIGS a carico del dipendente

Cercando il costo azienda è emerso un difetto nel calcolo del dipendente, che
vale la pena dichiarare per esteso.

La circolare INPS n. 5 del 20 gennaio 2025 spiega che il contributo FIS è
«ripartito tra datori di lavoro e lavoratori nella misura, rispettivamente, di
due terzi e di un terzo». Quindi ogni dipendente non dirigente paga, oltre al
9,19% di IVS, un terzo del contributo FIS o CIGS: fra lo 0,17% e lo 0,30%
secondo la dimensione aziendale.

Il 9,19% secco non corrisponde quindi a nessun caso reale. **La quota è
implementata**, e la dimensione aziendale si sceglie con un selettore a tre
stati invece che con un campo da compilare: fino a 5 dipendenti, oltre 5, oltre
15. Chi non tocca nulla ottiene comunque un risultato, perché c'è un default.

| Dimensione | Schema | Quota dipendente | Netto su RAL 30.000 |
|---|---|---|---|
| fino a 5 | FIS 0,50% | 0,17% | 23.392,70 |
| da 6 a 15 | FIS 0,80% | 0,27% | 23.373,05 |
| oltre 15 | CIGS 0,90% | 0,30% | 23.366,54 |

Le etichette sono volutamente esclusive. La norma dice "più di 5 dipendenti"
per l'aliquota FIS dello 0,80%, ma sopra i 15 subentra la CIGS: lasciare
scritto "oltre 5" accanto a "oltre 15" costringerebbe chi ha venti dipendenti a
indovinare in quale delle due si riconosce.

Questa è anche la spiegazione dell'aliquota del 9,49% che circola nei
calcolatori: è 9,19 più lo 0,30 della CIGS.

Limite dichiarato: sopra i 15 dipendenti FIS e CIGS possono coesistere. Il
prototipo applica la sola quota CIGS, che è la più alta delle due.

Nessuno dei calcolatori pubblici confrontati espone questa quota.

## Il primo anno di lavoro

Secondo selettore, stesso principio: un click, nessun campo.

Le addizionali si versano l'anno successivo a quello di maturazione, in acconto
da marzo e a saldo dopo il conguaglio, come descrive la pagina del Comune di
Milano. Nel primo anno di rapporto quindi non compaiono in busta paga, e sulla
stessa RAL di 30.000 il netto passa da 23.373,05 a **23.967,03**.

È il salto che spiega perché chi ha appena iniziato a lavorare vede lo stipendio
calare l'anno dopo a parità di lordo. Nessuno dei calcolatori confrontati lo
mostra.

## I carichi di famiglia: perché non c'è un selettore

È la prima estensione che viene in mente, e l'art. 12 TUIR nel testo vigente
per il 2026 spiega perché un selettore sarebbe peggio della sua assenza.

Per i figli sotto i 21 anni la detrazione non esiste più: i periodi che la
prevedevano sono stati soppressi dal d.lgs. 230/2021, quello che istituisce
l'assegno unico e universale, con decorrenza dal 1° marzo 2022. Restano 950
euro per i figli fra i 21 e i 30 anni, e oltre i 30 solo con disabilità
accertata. Una casella "figli a carico" mostrerebbe quindi uno sconto dove la
norma non lo prevede, nel caso più comune di tutti.

C'è poi una ragione che vale anche per il coniuge: essere a carico non è una
scelta dell'utente ma una condizione di reddito, non più di 2.840,51 euro
l'anno, elevati a 4.000 per i figli sotto i 24. Un interruttore acceso o spento
non esprime quella condizione, la nasconde. Il selettore della dimensione
aziendale fa il contrario, e la differenza è il motivo per cui uno c'è e
l'altro no.

Fonte: art. 12 TUIR, testo vigente dal 20 dicembre 2025 al 31 dicembre 2026,
letto su Normattiva il 7 agosto 2026.

## Semplificazioni dichiarate

- **Addizionali per competenza.** Attribuite all'anno di maturazione. In busta
  paga si versano l'anno successivo, in acconto (30%, fino a 9 rate da marzo) e
  a saldo (fino a 11 rate dopo il conguaglio). Nel primo anno di lavoro non
  compaiono affatto.
- **Sopra i 15 dipendenti FIS e CIGS possono coesistere.** Il calcolo applica
  la sola quota CIGS, che è la più alta delle due. Sotto quella soglia la quota
  FIS è corretta e completa.
- **La dimensione aziendale è una scelta dell'utente.** Da essa dipende la
  quota FIS o CIGS a carico del dipendente, fra 0,17% e 0,30%: il calcolo la
  applica, ma il default non può indovinarla.
- **1% aggiuntivo valutato su base annua.** In busta paga la soglia si verifica
  mese per mese sul valore mensilizzato (4.685 euro), quindi con mensilità
  disomogenee il risultato può differire.
- **Nessun altro reddito e nessun onere deducibile**, quindi imponibile fiscale
  e reddito complessivo coincidono.
- **Nessun carico familiare**, per le ragioni della sezione qui sopra.
- Nessun premio di risultato, straordinario, fringe benefit o previdenza
  complementare.
- Nessun arrotondamento fiscale all'unità di euro sulle imposte.
- Un solo comune e una sola regione. La struttura del file delle aliquote è
  però già pronta per ospitarne altri: il MEF pubblica le tabelle complete.

## Verifica

Il caso di riferimento, RAL 30.000, azienda oltre 5 dipendenti, rapporto a
regime:

| Voce | Importo |
|---|---|
| RAL | 30.000,00 |
| Contributi IVS (9,19%) | −2.757,00 |
| Quota FIS a carico del dipendente | −80,00 |
| Imponibile fiscale | 27.163,00 |
| IRPEF lorda | 6.247,49 |
| Detrazione lavoro dipendente (incl. 65 euro del c.1.1) | −2.051,52 |
| Ulteriore detrazione | −1.000,00 |
| IRPEF netta | 3.195,97 |
| Addizionale regionale Lombardia | −376,68 |
| Addizionale comunale Milano | −217,30 |
| **Netto annuo** | **23.373,05** |

Prelievo effettivo 22,1%. Netto mensile 1.947,75 su 12 quote, 1.797,93 su 13,
1.669,50 su 14.

Riprodotto in modo indipendente da `verifica-caso-30000.py`, che parte dagli
stessi valori grezzi e arriva allo stesso centesimo.

**Perché il riscontro è in Python e non in JavaScript.** Un test scritto nella
stessa lingua importerebbe `calculator.js`, e verificherebbe che il codice è
uguale a se stesso. Riscrivere la catena in un'altra lingua, partendo dalle
aliquote grezze invece che dal codice, costringe a riderivare il modello: un
errore di modellazione emerge come scarto fra i due risultati, invece di
essere riprodotto due volte. Python inoltre non aggiunge nulla da installare,
serve già a mettere in piedi la pagina.

**Confronto con un calcolatore pubblico, a parità di ipotesi.** Un calcolatore
online che espone tutti i passaggi produce 23.956 euro per lo stesso caso,
dichiarando di escludere le addizionali. Non applica però né la quota FIS né la
maggiorazione del comma 1.1.

Disattivando quelle due regole e togliendo le addizionali, cioè mettendosi
esattamente nelle sue ipotesi, il nostro modello produce **23.956,37** contro i
suoi 23.956: 37 centesimi di scarto, dovuti al fatto che lui arrotonda
all'euro.

Riattivando la sola maggiorazione del comma 1.1 il nostro risultato sale a
24.021,37, cioè **esattamente 65,00 euro in più**: la maggiorazione che quel
calcolatore omette.

Lo scarto è quindi spiegato al centesimo, ed è il motivo per cui il modello è
stato costruito sulle fonti invece che replicando un calcolatore esistente.

## Scadenza nota

L'articolo 13 del TUIR, che regge l'intera parte delle detrazioni, è
**abrogato dal 1° gennaio 2027** dal d.lgs. 19 giugno 2026, n. 117. Per questo
le costanti stanno in un unico file versionato per anno d'imposta.

## Annuale contro strutturale

Ogni costante in `rates-2026.js` è etichettata:

- **annuale**: il valore viene ripubblicato ogni anno. Una fonte più vecchia
  dell'anno d'imposta è un errore.
- **strutturale**: il valore è fissato da norma e non viene ripubblicato. La
  prova di vigenza non è l'età del documento che lo cita, ma il fatto che
  nessuna norma lo abbia modificato.

La distinzione è verificabile automaticamente e rende esplicito perché, ad
esempio, la ripartizione IVS 23,81 / 9,19 può essere citata da un documento
non recente mentre il massimale contributivo no.

## Fonti

Agenzia delle Entrate (scaglioni IRPEF 2026, circolare 4/E 2025), Normattiva
(TUIR art. 13 e 51, testo vigente 2026), INPS (circolare 6/2026 per minimali,
massimale e prima fascia; circolare 82/2022 per la ripartizione IVS), MEF
Dipartimento delle Finanze (addizionali regionali e comunali), Comune di
Milano, Confcommercio (CCNL Terziario).

Elenco completo con URL, data di consultazione e riferimento normativo nella
sezione "Fonti" della pagina e in `RICERCA.md`.

Ultima verifica delle fonti: 6 agosto 2026.

---

Prototipo a scopo dimostrativo, non costituisce consulenza fiscale.
