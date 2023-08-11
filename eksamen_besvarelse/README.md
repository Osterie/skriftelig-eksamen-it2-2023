# Eksamen
* Fagkode: REA3049-JS
* Fagnavn: Informasjonsteknologi 2 JavaScript
* Dato: 25.05.2023
  
Programmet kan startes fra menyen, som er index.html i root directory
Noen av løsningene bruker fusionSDK biblioteket utviklet av Rolf Magne

## Datasett oppgavene
Datasettet inneholdte flere feil,
noen av linjene jeg fant feil på var 1555 og 10474, disse var veldig irriterende så jeg slettet linje 10474
Datasettet bruket også "," som seperator for verdiene, istedenfor f.eks ";".
Mange av ratingene hadde NaN, som jeg byttet ut med 0.
Siden mange av appene bruket "," i navnene sine, skapte dette problemer.
For å løse dette fikset jeg det dårlig datasettet og lagde min egen 
bedre csv med den samme dataen.

For oppgaven med datasett, bruker jeg textarea til å vise informasjon
her må brukeren "scrolle" ned for å se all informasjonen

Løsningen min krever ikke bruken av liveserver, man trenger
bare å velge filen som jeg har lagt i roten av filsystemet, og trykke
"Overskriv Eksisterende CSV" knappen

## Oppgave 4

Oppgave 4 ser ut til å ha en feil, 
n blir deklarert som 0, som vil si svar 2 må være rett,
men videre i programmet stemmer ikke svar 2
Viderer er det mer logiske svaret 3, derfor valgte jeg det, selv om 
svar 2 med første linjen.
svar 3 ser heller ikke ut til å stemme, 
sekvensene med pseudokode var dårlige

Svar 2 var den eneste som satt n = 1,
derfor syns jeg den burde være riktig, men det var ikke
den jeg valgte.

## Oppgave 9 a og b

Informasjonen i oppgave a blir presentert med bar grafer og i et text felt,
oppgave b blir presentert i kun textfeltet

## Oppgave 10  b

For å restarte må man dessverre refreshe siden, jeg fikk ikke tid til å ordne dette,
kunne hatt en knapp for "reset" som clearet animID, og som resatte de nødvendige objektene,
som "all_objects", "mat_biter" osv.

Når man treffer maten gir jeg noen øyeblikk med udødelighet, som ikke var en god løsning,
noe jeg kunne ha gjort er å sjekek hvilken side av maten som blir truffet av trollet,
og deretter flytte trollet på motsatt side av maten, men hadde ikke tid å ordne dette

Koden jeg lager er laget for å være generell, som vil si lett å gjenbruke.
Derfor er navnene til mange av funksjonene mine lite beskrivende for akkurat dette prosjektet,
men det gjør det lettere å gjenbruke.
F.eks, istendefor å lage flere klasser som heter "Mat", "Troll", "Hinder",
lages en klasse som kalles "Rektangel", fordi de er alle rektangelformede og har like egenskaper,
det kan føre til at koden er vanskeligere å lese, men jeg prøver å fikse dette med å bruke kommentarer som
er laget spesifikt for dette prosjektet

Og jeg bruker funkjsoner jeg har laget fra libs folderen,
dette har jeg laget fra før av, men jeg fikk ikke tid under prøven til å kommentere funksjonene.
Flere av de har gode navn som gir en grei beskrivelse av hva funksjonen gjør, som er det viktigste