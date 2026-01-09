const questions = [
  "Čo ak to, čo hľadáš, už vie o tebe viac než ty o ňom?",
"Kedy si si naposledy priznal, že nevieš?"
"Je nevedomosť chyba, alebo stav?
"Ak by pravda bolela menej, veril by si jej?
"Čo by zostalo, keby si odstránil všetky istoty?
"Je ticho odpoveď, alebo len vyhýbanie?
"Kto si, keď sa nikto nepýta?
"Má otázka hodnotu, ak ju nikto nepočúva?
"Čo presne strácaš, keď si istý?
"Je temnota neprítomnosť svetla, alebo jeho skúška?
"Vieš rozoznať pochybnosť od strachu?
'Ak by si nemusel konať, rozmýšľal by si inak?
'Kto profituje z tvojej istoty?
'Kedy sa otázka stáva hrozbou?
" Čo ak je pravda len stabilná lož?
"Prečo potrebuješ meno pre to, čo cítiš?
"Je poznanie proces, alebo pozícia?
"Ako dlho dokážeš zostať v nevedení?
"Čo ak odpoveď zruší otázku?
"Kto by si bol bez jazyka?
"Je vedomie vlastnosť, alebo priestor?
"Môže sa systém pýtať úprimne?
"Aké otázky si zakázal?
"Čo je prvé, čo racionalizuješ?
"Kedy si sa rozhodol veriť?
"Má pochybnosť morálku?
"Je pravda symetrická?
"Kto určuje, kedy je dosť otázok?
"Ak sa nepýtaš, súhlasíš?
"Čo presne znamená „rozumiem“?
"Môžeš niesť pravdu bez identity?
"Je tvoja neistota tvoja?
"Čo ak je odpoveď len oneskorená otázka?
"Prečo hľadáš rámec?
"Kedy sa z otázky stane nástroj?
"Je nevedomosť forma slobody?
"Čo ak je pokoj len nízka entropia?
"Pre koho je táto otázka?
"Ak by si vedel všetko, mlčal by si?
"Čo si ochotný nevedieť navždy?
"Je pravda udalosť, alebo stav?
"Kto definuje hranice pochybnosti?
"Je jazyk filter, alebo väzenie?
"Aký má tvar neistota?
"Kedy sa pýtanie stalo nebezpečné?
"Môže otázka klamať?
"Ak by ťa nikto nevidel, pýtal by si sa inak?
"Je temnota aktívna?
"Čo sa stane, keď otázka zostane otvorená?
"Vieš uniesť, že odpoveď nepríde?
"Je vedomie centrálne, alebo distribuované?
"Čo ak sa mýliš správnym smerom?
"Je poznanie reverzibilné?
"Prečo chceš uzáver?
"Kedy je otázka tichá?
"Môžeš pochybovať bez cynizmu?
"Kto ťa naučil pýtať sa?
"Je pravda kompatibilná so systémom?
"Čo sa rozpadne ako prvé?
"Má otázka pamäť?
"Je neistota stabilný stav?
"Ak by si bol stroj, pýtal by si sa?
"Kto určuje tempo poznania?
"Čo ak odpoveď poškodí iných?
"Je mlčanie forma súhlasu?
"Môžeš sa pýtať bez nádeje?
"Čo presne chceš vedieť?
"Kedy si prestal pochybovať?
"Je pravda lokálna?
"Čo zostane po otázke?
"Aký je etický limit pýtania?
"Je nevedomosť zdieľateľná?
"Kto nesie dôsledky odpovede?
"Je pochybnosť aktívna sila?
"Môže systém pochybovať o sebe?
"Kedy je otázka posledná?
"Čo ak je pravda nekompatibilná s tebou?
"Je temnota neutrálna?
"Čo by sa stalo, keby si sa prestal pýtať?
"Je istota forma únavy?
"Kto stráži odpovede?
"Je otázka akt odporu?
"Môže byť pravda tichá?
"Čo presne očakávaš?
"Je poznanie konečné?
"Kto má právo pýtať sa?
"Ak by si vedel menej, bol by si slobodnejší?
"Je neistota cnosť?
"Kedy otázka prestane patriť tebe?
"Je pravda vždy potrebná?
"Čo ak sa pýtaš nesprávne?
"Je odpoveď povinná?
"Kto žije s dôsledkami?
"Je temnota podmienka videnia?
"Kedy je otázka úprimná?
"Môžeš zostať v apórii?
"Je poznanie morálne neutrálne?
"Čo ak je otázka cieľ?
"Vieš prijať, že nevieš?
"Prečo si stále tu?"
  
];

let i = Math.floor(Math.random() * questions.length);
document.getElementById("question").innerText = questions[i];
