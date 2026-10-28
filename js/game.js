"use strict";
/* =====================================================================
   MODUL 1: DATA (statická data hry – třídy, předměty, lokace, soupeři)
   ===================================================================== */
const SAVE_KEY = "sakura_rpg_v1";
const CLASSES = {
  samurai:{n:"Samuraj",ico:"⚔️",s:{str:14,dex:8,spi:6},d:"Vysoká Síla a obrana, bonus k mečům (+25 %)."},
  ninja:{n:"Ninja",ico:"🥷",s:{str:8,dex:14,spi:6},d:"Vysoká Obratnost, kritické údery a úhyby, bonus k vrhacím zbraním (+25 %)."},
  monk:{n:"Šugendžó mnich",ico:"🏯",s:{str:6,dex:8,spi:14},d:"Vysoký Duch, léčí se během boje i po něm, bonus ke spirituálním zbraním (+25 %)."}
};
/* =====================================================================
   MODUL 1b: ROD (rasa) A PODOBA – data
   s = bonus k vlastnostem, p = pasivní bonusy (hp/en = % max životů/energie, atk/def = % útoku/obrany,
   crit = % kritu, reg = rychlejší léčení, gx = % zlata a XP), f = jak rod sedí ke třídě (+ posílí, g doplní, u univerzální)
   ===================================================================== */
const RACES = {
  human:{n:"Člověk",k:"人",t:"Přizpůsobivý rod z nížin",s:{str:2,dex:2,spi:2},p:{gx:.10},pas:"+10 % zlata a XP z bojů",
    f:{samurai:["u","vyrovnané vlastnosti a rychlejší postup"],ninja:["u","vyrovnané vlastnosti a rychlejší postup"],monk:["u","vyrovnané vlastnosti a rychlejší postup"]}},
  oni:{n:"Oni",k:"鬼",t:"Rohatí obři z horských jeskyní",s:{str:6,spi:-1},p:{hp:.10},pas:"+10 % max. životů",
    f:{samurai:["+","ještě víc Síly, útoku a životů"],ninja:["g","křehký ninja vydrží mnohem víc ran"],monk:["g","Síla a životy, které mnichovi chybí"]}},
  tengu:{n:"Tengu",k:"羽",t:"Horští duchové s havraními pery",s:{str:1,dex:5},p:{crit:4,dodge:4,critm:.1},pas:"+4 % kritický zásah, +4 % úhyb a +0,1 síly kritu",
    f:{samurai:["g","samuraj sám kritické zásahy téměř nedává"],ninja:["+","víc Obratnosti a ještě častější krity"],monk:["g","iniciativa, blok a krity navíc"]}},
  kitsune:{n:"Kicune",k:"狐",t:"Liščí duchové, mistři iluzí",s:{str:-1,dex:2,spi:5},p:{en:.15},pas:"+15 % max. energie",
    f:{samurai:["g","víc energie na výpravy a nízký Duch se srovná"],ninja:["g","Duch a energie pro delší lov"],monk:["+","Duch je útok mnicha i jeho energie"]}},
  kappa:{n:"Kappa",k:"河",t:"Říční tvorové s pevným krunýřem",s:{str:2,spi:2},p:{def:.12,reg:.5},pas:"+12 % obrana, léčení o 50 % rychlejší",
    f:{samurai:["+","z obránce se stane nedobytná tvrz"],ninja:["g","obrana a léčení pro křehkého ninju"],monk:["g","obrana a rychlé léčení mezi boji"]}},
  ryujin:{n:"Rjúdžin",k:"龍",t:"Potomci dračího krále moří",s:{str:3,dex:-1,spi:3},p:{atk:.06},pas:"+6 % útok",
    f:{samurai:["g","Duch a energie, které samuraji chybí"],ninja:["g","Síla a útok navíc k obratnosti"],monk:["+","Duch i útok, mnich udeří tvrději"]}}
};
const LOOK = {
  skin:{n:"Pleť",c:1,v:[["#f0d3b6","Světlá"],["#e0b78f","Pšeničná"],["#c8956b","Olivová"],["#a3704c","Opálená"],["#6e4a33","Tmavá"],["#c46a56","Rudá"],["#7d92a6","Popelavá"],["#8eae94","Zelenkavá"]]},
  hair:{n:"Účes",v:["Holá hlava","Čonmage","Vysoký culík","Dlouhé vlasy","Rozcuchané","Drdol"]},
  hc:{n:"Barva vlasů",c:1,v:[["#1b1a1f","Černá"],["#25324a","Havraní"],["#3d2a1f","Tmavě hnědá"],["#6b3a22","Kaštanová"],["#8c8a88","Šedá"],["#e4dfd4","Bílá"],["#8e2a22","Rudá"],["#c9a35c","Zlatavá"]]},
  eyes:{n:"Oči",v:["Klidné","Ostré","Přivřené","Zavřené"]},
  ec:{n:"Barva očí",c:1,v:[["#5a3a22","Hnědá"],["#1a1514","Černá"],["#c08a2c","Jantarová"],["#6d8aa6","Šedomodrá"],["#b3392b","Rudá"],["#5f8f5a","Zelená"]]},
  mouth:{n:"Výraz",v:["Klidný","Úsměv","Zamračený","Bojový pokřik"]},
  beard:{n:"Vousy",v:["Žádné","Knír","Bradka","Plnovous","Dlouhý vous"]},
  scar:{n:"Jizva",v:["Žádná","Přes oko","Na tváři","Na čele"]},
  head:{n:"Pokrývka hlavy",v:["Žádná","Čelenka","Klobouk kasa","Kápě a maska","Přilba kabuto"]},
  outfit:{n:"Oděv",v:["Kimono","Zbroj","Mnišské roucho"]},
  oc:{n:"Barva oděvu",c:1,v:[["#2d3f66","Indigo"],["#9c3326","Rumělka"],["#2a2a30","Inkoust"],["#55663f","Matcha"],["#5b3557","Švestka"],["#b07a2a","Šafrán"],["#6b6862","Popel"]]}
};
const defLook = cls => ({skin:1,hair:{samurai:1,ninja:4,monk:0}[cls],hc:0,eyes:{samurai:1,ninja:1,monk:3}[cls],ec:0,mouth:0,
  beard:{samurai:1,ninja:0,monk:0}[cls],scar:0,head:{samurai:0,ninja:3,monk:0}[cls],outfit:{samurai:1,ninja:0,monk:2}[cls],oc:{samurai:1,ninja:2,monk:5}[cls]});
const STATN = {str:"Síla",dex:"Obratnost",spi:"Duch"};
const SLOTS = {weapon:"🗡️ Zbraň",armor:"🥋 Zbroj",head:"⛑️ Hlava",acc:"📿 Doplněk",mount:"🐎 Zvíře"};
// Předmět: n=název, s=slot, a=útok, d=obrana, h=HP, p=cena, t=typ zbraně (sword/thrown/spirit), x=bonus ke statu
const SHOP_GEAR = [
  {n:"Wakizashi",s:"weapon",a:5,p:80,t:"sword"},{n:"Katana",s:"weapon",a:10,p:220,t:"sword"},{n:"Masamune",s:"weapon",a:20,p:900,t:"sword"},
  {n:"Shuriken",s:"weapon",a:5,p:80,t:"thrown"},{n:"Kunai",s:"weapon",a:10,p:220,t:"thrown"},{n:"Kusarigama",s:"weapon",a:19,p:850,t:"thrown"},
  {n:"Bo hůl",s:"weapon",a:5,p:80,t:"spirit"},{n:"Šakudžó",s:"weapon",a:10,p:220,t:"spirit"},{n:"Gohei posvátné",s:"weapon",a:20,p:900,t:"spirit"},
  {n:"Kimono",s:"armor",d:3,p:70},{n:"Lamelární zbroj",s:"armor",d:9,p:350},{n:"Ó-jóroi",s:"armor",d:18,p:1200},
  {n:"Kasa klobouk",s:"head",d:2,p:60},{n:"Kabuto přilba",s:"head",d:7,p:320},
  {n:"Omamori talisman",s:"acc",h:30,p:150},{n:"Magatama",s:"acc",x:{str:3,dex:3,spi:3},p:500},
  {n:"Válečný kůň",s:"mount",m:1,p:600,r:0},{n:"Duhový duchovní vlk",s:"mount",m:1,p:0,r:25}, // r = cena v Rjō
  // Vyšší tiery: l = potřebný level
  {n:"Tači",s:"weapon",a:30,p:1800,t:"sword",l:10},{n:"Muramasa",s:"weapon",a:45,p:4500,t:"sword",l:20},{n:"Kusanagi",s:"weapon",a:65,p:10000,t:"sword",l:30},
  {n:"Fúma shuriken",s:"weapon",a:30,p:1800,t:"thrown",l:10},{n:"Kama větru",s:"weapon",a:45,p:4500,t:"thrown",l:20},{n:"Vějíř Tengu",s:"weapon",a:65,p:10000,t:"thrown",l:30},
  {n:"Kongó hůl",s:"weapon",a:30,p:1800,t:"spirit",l:10},{n:"Šakudžó světla",s:"weapon",a:45,p:4500,t:"spirit",l:20},{n:"Hůl nebeské perly",s:"weapon",a:65,p:10000,t:"spirit",l:30},
  {n:"Dó-maru",s:"armor",d:28,p:2500,l:10},{n:"Zbroj šóguna",s:"armor",d:42,p:6500,l:20},{n:"Dračí zbroj",s:"armor",d:60,p:14000,l:30},
  {n:"Kabuto s rohy",s:"head",d:14,p:900,l:10},{n:"Přilba šóguna",s:"head",d:24,p:3200,l:20},{n:"Dračí maska",s:"head",d:36,p:8000,l:30},
  {n:"Nefritový talisman",s:"acc",h:120,p:1200,l:10},{n:"Zlatý prsten draka",s:"acc",x:{str:8,dex:8,spi:8},p:3500,l:20},{n:"Posvátná perla",s:"acc",h:300,x:{str:5,dex:5,spi:5},p:8000,l:30}
];
// Endgame vybavení (levely 40–80) generované po tierech: [lvl, přívlastek, útok, obrana, hlava, HP doplňku, staty doplňku, cena]
[[40,"Zlatého jeřába",90,85,52,500,12,22000],[50,"Měsíčního stínu",120,110,70,800,16,48000],[60,"Hvězdného pádu",160,145,95,1200,22,105000],
 [70,"Božského větru",210,190,125,1800,30,230000],[80,"Věčného císaře",270,240,160,2600,40,500000]].forEach(([l,k,a,d,hd,ah,ax,p])=>{
  SHOP_GEAR.push({n:"Katana "+k,s:"weapon",a,p,t:"sword",l},{n:"Kunai "+k,s:"weapon",a,p,t:"thrown",l},{n:"Šakudžó "+k,s:"weapon",a,p,t:"spirit",l},
    {n:"Zbroj "+k,s:"armor",d,p:Math.round(p*1.2),l},{n:"Přilba "+k,s:"head",d:hd,p:Math.round(p*.5),l},
    {n:"Talisman "+k,s:"acc",h:ah,x:{str:ax,dex:ax,spi:ax},p:Math.round(p*.7),l}); });

// Nebeské vybavení (levely 90–300): každých 10 levelů nová řada, růst podle křivky CURVE
const GP = 220000;   // cena zbraně řady 90+ (mírný růst)
const CURVE = {ph:2.45, pa:2.0, pd:2.0, ga:2.3, gd:1.8, gh:2.2, gx:1.4};
const HIGH = ["Rudého lotosu","Hromového draka","Mlžného ostrova","Fénixova pera","Stříbrné luny","Bouřného nebe","Jadeitového trůnu","Půlnočního slunce",
  "Prastarého cedru","Ohnivé hory","Ledového pramene","Devíti ocasů","Krvavého měsíce","Zlatého fénixe","Hvězdné řeky","Prázdnoty","Osmi hlav",
  "Nebeské brány","Věčného ohně","Prvního úsvitu","Bohů hromu","Amaterasu"];
HIGH.forEach((k,i)=>{ const l = 90+i*10, q = l/80, ga = Math.pow(q,CURVE.ga), gd = Math.pow(q,CURVE.gd), p = Math.round(GP*Math.pow(q,1.3)/1000)*1000;
  const a = Math.round(270*ga), d = Math.round(240*gd), hd = Math.round(160*gd), ah = Math.round(2600*Math.pow(q,CURVE.gh)), ax = Math.round(40*Math.pow(q,CURVE.gx));
  SHOP_GEAR.push({n:"Katana "+k,s:"weapon",a,p,t:"sword",l},{n:"Kunai "+k,s:"weapon",a,p,t:"thrown",l},{n:"Šakudžó "+k,s:"weapon",a,p,t:"spirit",l},
    {n:"Zbroj "+k,s:"armor",d,p:Math.round(p*1.2),l},{n:"Přilba "+k,s:"head",d:hd,p:Math.round(p*.5),l},
    {n:"Talisman "+k,s:"acc",h:ah,x:{str:ax,dex:ax,spi:ax},p:Math.round(p*.7),l}); });
const SHOP_USE = [
  {n:"Lektvar léčení",s:"use",heal:60,p:30},{n:"Velký lektvar",s:"use",heal:150,p:70},
  {n:"Rýžový koláček",s:"use",en:30,p:25},{n:"Onigiri hostina",s:"use",en:70,p:55},
  {n:"Elixír kitsune",s:"use",heal:400,p:140},{n:"Nektar bohů",s:"use",heal:1000,p:320},{n:"Hostina šóguna",s:"use",en:130,p:110},
  {n:"Slza Amaterasu",s:"use",heal:20000,p:6000},{n:"Elixír nesmrtelnosti",s:"use",heal:90000,p:24000},{n:"Čajový obřad",s:"use",en:350,p:900},{n:"Hostina bohů",s:"use",en:900,p:3000}
];
const EXPEDS = [
  {n:"🌲 Les plný banditů",i:"🦹",lvl:1,cost:10,hp:40,atk:9,def:2,g:[20,45],xp:30,loot:1},
  {n:"⛩️ Prokletá svatyně Yokai",i:"👻",lvl:4,cost:15,hp:110,atk:20,def:6,g:[50,100],xp:70,loot:2},
  {n:"🏔️ Mlžné hory",i:"🐺",lvl:8,cost:20,hp:230,atk:36,def:12,g:[110,200],xp:140,loot:3},
  {n:"🏯 Hrad odpadlého rónina",i:"🥷",lvl:11,cost:25,hp:330,atk:46,def:16,g:[160,280],xp:190,loot:3},
  {n:"🌊 Pobřeží pirátů Wokó",i:"🏴‍☠️",lvl:14,cost:28,hp:460,atk:58,def:21,g:[220,380],xp:260,loot:3},
  {n:"🎋 Bambusový les Tengu",i:"👺",lvl:18,cost:30,hp:700,atk:76,def:29,g:[330,560],xp:380,loot:4},
  {n:"🌋 Sopka Fudži",i:"🔥",lvl:23,cost:35,hp:1000,atk:98,def:39,g:[500,850],xp:550,loot:4},
  {n:"🏰 Palác Jūrei",i:"👻",lvl:28,cost:40,hp:1500,atk:125,def:50,g:[800,1300],xp:800,loot:5},
  {n:"⛩️ Údolí tisíce torii",i:"👺",lvl:34,cost:42,hp:1900,atk:135,def:56,g:[1000,1700],xp:1100,loot:5},
  {n:"🌌 Hvězdné pláně",i:"🌠",lvl:40,cost:45,hp:2800,atk:170,def:72,g:[1600,2600],xp:1700,loot:6},
  {n:"🐅 Stezka Bjakka",i:"🐅",lvl:46,cost:48,hp:4000,atk:215,def:92,g:[2400,3800],xp:2500,loot:6},
  {n:"❄️ Chrám Yuki-onny",i:"❄️",lvl:52,cost:52,hp:5600,atk:265,def:115,g:[3500,5500],xp:3600,loot:7},
  {n:"🌙 Měsíční palác",i:"🌙",lvl:58,cost:56,hp:7800,atk:330,def:142,g:[5000,8000],xp:5000,loot:7},
  {n:"🌀 Podmořský Rjúgú",i:"🐙",lvl:64,cost:60,hp:10500,atk:400,def:172,g:[7000,11000],xp:7000,loot:8},
  {n:"⚡ Hory Raijina",i:"⚡",lvl:70,cost:65,hp:14000,atk:480,def:205,g:[10000,16000],xp:10000,loot:8},
  {n:"🪐 Brána mezi světy",i:"🪐",lvl:76,cost:70,hp:19000,atk:570,def:245,g:[14000,22000],xp:14000,loot:9}
];
const DUNGEONS = [
  {n:"👹 Jeskyně Oni démona",i:"👹",lvl:3,cost:25,hp:260,atk:26,def:9,g:[120,200],xp:160,ryo:2,loot:2},
  {n:"🐉 Doupě Orochiho",i:"🐉",lvl:9,cost:35,hp:700,atk:55,def:20,g:[350,600],xp:450,ryo:5,loot:3},
  {n:"🌑 Palác Tengu krále",i:"👺",lvl:15,cost:45,hp:1500,atk:90,def:34,g:[800,1400],xp:1000,ryo:10,loot:3},
  {n:"🕷️ Jeskyně Džorógumo",i:"🕷️",lvl:12,cost:40,hp:950,atk:68,def:26,g:[450,750],xp:600,ryo:6,loot:3},
  {n:"🦊 Chrám Kyūbi lišky",i:"🦊",lvl:18,cost:50,hp:1900,atk:105,def:40,g:[1000,1700],xp:1300,ryo:12,loot:4},
  {n:"🐲 Doupě Rjúdžina",i:"🐲",lvl:22,cost:55,hp:2600,atk:130,def:50,g:[1500,2500],xp:1900,ryo:16,loot:4},
  {n:"☠️ Brána Yomi",i:"💀",lvl:27,cost:60,hp:3600,atk:165,def:65,g:[2300,3800],xp:2800,ryo:22,loot:5},
  {n:"🌞 Nebeský palác Takamagahara",i:"🌞",lvl:32,cost:70,hp:5000,atk:210,def:82,g:[3500,5500],xp:4200,ryo:30,loot:5},
  {n:"🐍 Hnízdo Orochiho",i:"🐍",lvl:35,cost:80,hp:6500,atk:230,def:90,g:[2500,4000],xp:3000,ryo:35,loot:5},
  {n:"👹 Pevnost Šutendódžiho",i:"👹",lvl:42,cost:85,hp:9500,atk:290,def:115,g:[3800,6000],xp:4500,ryo:45,loot:6},
  {n:"🐉 Chrám Zlatého draka",i:"🐲",lvl:50,cost:90,hp:14000,atk:360,def:145,g:[5500,9000],xp:6500,ryo:60,loot:6},
  {n:"⚫ Propast Džigoku",i:"😈",lvl:58,cost:95,hp:20000,atk:450,def:180,g:[8000,13000],xp:9500,ryo:80,loot:7},
  {n:"🌩️ Trůn Raijina",i:"🌩️",lvl:66,cost:100,hp:28000,atk:550,def:220,g:[12000,20000],xp:14000,ryo:110,loot:8},
  {n:"☄️ Izanami z Yomi",i:"🥀",lvl:74,cost:110,hp:40000,atk:680,def:270,g:[18000,30000],xp:21000,ryo:150,loot:8},
  {n:"🌸 Věčný císař Mikado",i:"👑",lvl:82,cost:120,hp:60000,atk:850,def:330,g:[28000,45000],xp:32000,ryo:220,loot:9}
];

// Nové oblasti za levelem 80: výpravy a dungeony do levelu 300 (síla podle npcFor)
[[85,"🐙","Pobřeží mořských démonů"],[100,"🔥","Ohnivé ostrovy Sakuradžima"],[115,"🐺","Vlčí hory Tóhoku"],[130,"👻","Mlžné bažiny Osorezan"],
 [145,"🦊","Les devíti ocasů"],[160,"❄️","Věčný ledovec Ezo"],[175,"🐅","Planiny Bílého tygra"],[190,"👺","Hory Kurama"],[205,"🕷️","Pavoučí rokle Kumo"],
 [220,"🌙","Měsíční poušť"],[235,"⚡","Bouřné útesy"],[250,"🐉","Hřbet spícího draka"],[265,"💀","Říše Jomi"],[280,"🌠","Hvězdná řeka Amanogawa"],[295,"🪐","Okraj světa"]].forEach(([L,i,n])=>{
  const E = npcFor(L,n); EXPEDS.push({n:i+" "+n,i,lvl:L,cost:Math.min(95,70+Math.round((L-85)/10)),hp:Math.round(E.hp*0.8),atk:E.atk*0.9,def:E.def*0.9,
    g:[Math.round(L*L*1.5),Math.round(L*L*2.5)],xp:Math.round(L*L*1.2),loot:L}); });
[[90,"🐍","Doupě Jamata no Oroči"],[105,"👹","Ostrov Onigašima"],[120,"🦊","Palác Tamamo no Mae"],[135,"🕷️","Hnízdo Cučigumo"],[150,"⚡","Bouřná pevnost Raidžina"],
 [165,"🐉","Podmořský palác Owatacumi"],[180,"💀","Hřbitov tisíce samurajů"],[195,"🔥","Kovárna Kagucučiho"],[210,"🌙","Dvůr Cukujomiho"],[225,"❄️","Ledový trůn Juki-onny"],
 [240,"🥀","Zahrada Izanami"],[255,"😈","Propast Ašury"],[270,"🌩️","Trůn Susanoa"],[285,"🌞","Sluneční svatyně Amaterasu"],[300,"👑","Brána stvoření"]].forEach(([L,i,n])=>{
  const E = npcFor(L,n); DUNGEONS.push({n:i+" "+n,i,lvl:L,cost:Math.min(150,120+Math.round((L-90)/10)),hp:Math.round(E.hp*1.15),atk:E.atk*1.2,def:E.def*1.15,
    g:[Math.round(L*L*4),Math.round(L*L*6)],xp:Math.round(L*L*3),ryo:220+(L-80)*2,loot:L}); });
const JUNK_HIGH = [{n:"Šupina Oroči",sv:5000},{n:"Pírko fénixe",sv:5500},{n:"Úlomek nebeské brány",sv:6000},{n:"Slza bohyně slunce",sv:7000}];
const junkFor = t => t<=9 ? JUNK[t-1] : JUNK_HIGH.map(j=>({n:j.n, sv:Math.round(j.sv*Math.pow(t/85,2.5))}));   // t = tier 1–9, nebo level lokace
const towerGold = f => [Math.max(f*120,Math.round(f*f*1.5)), Math.max(f*200,Math.round(f*f*2.5))], towerXp = f => Math.max(f*60, Math.round(f*f*1.2));
const lootTier = L => L>=85 ? L : Math.min(9,1+Math.floor(L/10));
const NPC_CLANS = ["Klan Tygřího Drápu","Klan Mlžného Havrana","Klan Rudého Měsíce"];
// Práce: h = délka v reálných hodinách, g = zlato, xp = zkušenosti
const JOBS = [
  {n:"🌾 Nosič rýže",lvl:1,h:1,g:60,xp:10},{n:"🚪 Strážce brány",lvl:2,h:4,g:280,xp:40},
  {n:"🔨 Pomocník kováře",lvl:3,h:10,g:700,xp:100},{n:"🐎 Doprovod karavany",lvl:6,h:24,g:2200,xp:300}];
JOBS.push({n:"🍵 Služba v čajovně",lvl:1,h:2,g:120,xp:20},{n:"🏯 Hlídka na hradbách",lvl:2,h:6,g:420,xp:60});   // na konec: indexy rozpracované práce ze starých uložení zůstanou
const jobG = j => Math.round(j.g + j.h*S.lvl*S.lvl*JR.g), jobX = j => Math.round(j.xp + j.h*S.lvl*S.lvl*JR.x);   // odměna práce podle levelu
const JR = {g:2.2, x:0.45};
// Kořist z výprav a dungeonů (sv = výkupní cena u vetešníka), index = tier lokace - 1
const JUNK = [
  [{n:"Banditský váček",sv:25},{n:"Rezavý nůž",sv:15},{n:"Kožený opasek",sv:20}],
  [{n:"Yokai lucerna",sv:60},{n:"Papírová ofuda",sv:55},{n:"Rozlomená maska",sv:70}],
  [{n:"Horský křišťál",sv:130},{n:"Vlčí kožešina",sv:110},{n:"Démonův roh",sv:160}],
  [{n:"Liščí ocas",sv:300},{n:"Svitek starých mistrů",sv:340},{n:"Lakovaná maska",sv:380}],
  [{n:"Dračí šupina",sv:600},{n:"Zlatý nefrit",sv:700},{n:"Úlomek nebeského meče",sv:800}],
  [{n:"Hvězdný prach",sv:1000},{n:"Tygří dráp",sv:1100},{n:"Ledový krystal",sv:1250}],
  [{n:"Měsíční perla",sv:1500},{n:"Svitek měsíce",sv:1700},{n:"Stříbrný paroh",sv:1900}],
  [{n:"Hřmící blesk",sv:2500},{n:"Dračí oko",sv:2800},{n:"Mořská perla",sv:3200}],
  [{n:"Nebeský nefrit",sv:4000},{n:"Pero fénixe",sv:4500},{n:"Císařova pečeť",sv:5000}]];
// Opakovatelné úkoly: k = počítadlo, need = cíl, m = násobič odměny
const QUESTS = [{k:"exp",n:"Dokonči 10 výprav",need:10,m:1},{k:"arena",n:"Vyhraj 10 soubojů v aréně",need:10,m:1},{k:"dun",n:"Poraz 5 bossů v dungeonech",need:5,m:2},
  {k:"tw",n:"Zdolej 5 pater věže",need:5,m:2},{k:"work",n:"Dokonči 3 práce",need:3,m:1},{k:"win",n:"Vyhraj 50 bitev",need:50,m:3}];
const FIRST = ["Takeda","Uesugi","Oda","Sanada","Date","Mori","Hattori","Kuroda","Shimazu","Hojo","Akechi","Tokugawa","Fuma","Momochi"];
const LAST = ["Kenshin","Nobuna","Hanzo","Yukimura","Masamune","Motonari","Goemon","Shingen","Kojiro","Tadakatsu","Sasuke","Kotaro"];
const NPCS = FIRST.map((f,i)=>({name:f+" "+LAST[(i*5)%LAST.length],cls:["samurai","ninja","monk"][i%3],lvl:2+i*5,fame:20+i*90+(i%3)*11}));
[["Raikó Kagetora","samurai",120],["Kurojami Hanzó","ninja",160],["Šiden Masakage","samurai",200],["Mistr Kókai","monk",240],["Jomi no Kenši","ninja",280],["Oroči no Ko","monk",320]]
  .forEach(([name,cls,lvl],i)=>NPCS.push({name,cls,lvl,fame:3000+i*2500}));

/* =====================================================================
   MODUL 2: STAV A ULOŽENÍ (localStorage)
   ===================================================================== */
let S = null; // herní stav hráče
let enter = false, pendFx = null, tab = "char", logText = "Vítej, bojovníku. Tvá cesta začíná.";
function save(){ try{ S.ts = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} cloudQueue(); }
/* ---- uložení na účet (db capability publikované stránky): přežije nové verze hry i jiná zařízení ----
   CLOUD.st: "off" = jen tento prohlížeč, "ok" = ukládá se na účet, "ro" = účet nejde zapisovat, "err" = dočasná chyba */
const CLOUD = {ref:null, st:"off", t:0, busy:false, dirty:false, tm:0};
let BOOT = !!(window.claude && window.claude.use), PEND = null;   // BOOT = čekáme na uložení z účtu
function cloudQueue(){ if(!CLOUD.ref) return; CLOUD.dirty = true; clearTimeout(CLOUD.tm); CLOUD.tm = setTimeout(cloudFlush, 2500); }
async function cloudFlush(){ if(!CLOUD.ref || !CLOUD.dirty || CLOUD.busy || !S || PEND) return; CLOUD.busy = true; CLOUD.dirty = false;
  try{ await CLOUD.ref.set({v:1, ts:S.ts, lvl:S.lvl, name:S.name, cls:S.cls, data:JSON.stringify(S)}); CLOUD.st = "ok"; CLOUD.t = Date.now(); }
  catch(e){ const c = e && e.code; CLOUD.st = c==="invalid_argument" ? "ro" : "err"; if(c==="unavailable"||c==="resource_exhausted") CLOUD.dirty = true; }
  CLOUD.busy = false; if(CLOUD.dirty) cloudQueue(); }
function backupLocal(o){ try{ if(o) localStorage.setItem(SAVE_KEY+"_zaloha", JSON.stringify(o)); }catch(e){} }
async function cloudInit(){
  const done = () => { if(BOOT){ BOOT = false; if(!S) draw(); } };
  setTimeout(done, 12000);
  try{
    const [db, user] = await Promise.all([claude.use("db"), claude.use("user")]); if(!db || !user) return done();
    const id = await user.id(); if(!id) return done();
    CLOUD.ref = db.doc("data/users/"+id+"/save");
    let c = null; try{ const sn = await CLOUD.ref.get(); const d = sn.exists && sn.data(); c = d && d.data ? JSON.parse(d.data) : null; CLOUD.st = "ok"; }
    catch(e){ CLOUD.st = "err"; return done(); }
    BOOT = false;
    if(c && !S){ S = c; try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} draw(); toast("Postava načtena z tvého účtu."); return; }
    if(!c && S){ CLOUD.dirty = true; cloudFlush(); return; }
    if(!c && !S){ draw(); return; }
    if(c.ts===S.ts) return;
    if(c.ts > S.ts && c.lvl >= S.lvl){ backupLocal(S); S = c; try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} draw(); toast("Načtena novější postava z účtu."); return; }
    if(S.ts > c.ts && S.lvl >= c.lvl){ CLOUD.dirty = true; cloudFlush(); return; }
    PEND = c; pickSave();                                         // nejasné: nech hráče vybrat
  }catch(e){ done(); }
}
function pickSave(){ const c = PEND, d = t => t ? new Date(t).toLocaleString("cs-CZ",{day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}) : "?";
  const card = (o,k,lab) => `<button class="gpick" onclick="G.useSave('${k}')"><span><b>${lab}: ${o.name}</b><small>${CLASSES[o.cls]?CLASSES[o.cls].n:""} · level ${o.lvl} · uloženo ${d(o.ts)}</small></span><em>Vybrat</em></button>`;
  M = {src:"pick"};
  $("#modal").innerHTML = deco(`<div class="mback"></div><div class="mcard"><h4 class="mtitle">Kterou postavu načíst?</h4><p class="mut" style="margin:6px 0 14px">Na tvém účtu je uložená jiná postava než v tomto zařízení. Ta, kterou nevybereš, zůstane jako záloha v tomto prohlížeči.</p><div class="gpicks">${card(c,"cloud","Z účtu")}${card(S,"local","V tomto zařízení")}</div></div>`);
  $("#modal").classList.add("open"); lockSync(); }
function load(){ try{ const r = localStorage.getItem(SAVE_KEY); if(r) S = JSON.parse(r); }catch(e){} }
// záloha jako text: SAKURA1:<base64 JSON>
const exportCode = () => "SAKURA1:"+btoa(unescape(encodeURIComponent(JSON.stringify(S))));
function parseCode(t){ t = String(t||"").trim(); if(t.startsWith("SAKURA1:")) t = t.slice(8);
  let o; try{ o = JSON.parse(decodeURIComponent(escape(atob(t.replace(/\s+/g,""))))); }catch(e){ try{ o = JSON.parse(t); }catch(e2){ return null; } }
  return o && typeof o==="object" && o.name && CLASSES[o.cls] && o.lvl>0 && o.base && o.eq ? o : null; }
// vlastní potvrzovací okno (systémové confirm() v zabezpečené stránce nemusí fungovat)
let ASK = null;
function ask(text, yes, fn){ ASK = fn; M = {src:"ask"};
  $("#modal").innerHTML = deco(`<div class="mback" onclick="closeModal()"></div><div class="mcard"><p class="sttext" style="font-size:1rem">${text}</p><div class="macts">${btn(yes,"askOk()")}${btn("Zpět","closeModal()",0,"alt")}</div></div>`);
  $("#modal").classList.add("open"); lockSync(); }
function askOk(){ const f = ASK; ASK = null; closeModal(); if(f) f(); }
function newGame(name, cls){
  const c = CLASSES[cls];
  S = {name:name||"Bezejmenný", cls, lvl:1, xp:0, hp:100, gold:250, ryo:0, fame:0, energy:100, ts:Date.now(),
       base:{...c.s}, inv:[], eq:{}, clan:null, uid:1};
  const start = {samurai:SHOP_GEAR[0], ninja:SHOP_GEAR[3], monk:SHOP_GEAR[6]}[cls];
  S.eq.weapon = mk(start); S.hp = maxHp();
  save();
}
function mk(base){ return {...base, u:0, id:S ? S.uid++ : 0}; } // instance předmětu s úrovní vylepšení u

/* =====================================================================
   MODUL 3: POMOCNÉ VÝPOČTY (staty, vybavení, regenerace)
   ===================================================================== */
const sellVal = it => (it.sv!==undefined ? it.sv : Math.round((it.p||100)*0.4*(1+0.3*(it.u||0))))*(it.q||1);
const R = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const up = (it,k)=> Math.round((it[k]||0)*(1+0.15*(it.u||0))); // hodnota po vylepšení kovářem
function eqSum(k){ return Object.values(S.eq).reduce((t,it)=>t+(it&&it.s!=="mount"?up(it,k):0),0); }
const RACESC = 20;   // bonus rodu k vlastnostem: ×(1 + level/20), na levelu 140 osminásobek
const LB0 = 60, LBM = 1.2, LBO = 0.6;   // růst vlastností s levelem: od levelu LB0, hlavní vlastnost třídy LBM za level, ostatní LBO
const race = () => RACES[S.race] || null;               // rod hráče (staré uložené hry ho nemají)
function stat(k){ // celková statistika včetně doplňků a rodu
  const r = race(), main = {samurai:"str",ninja:"dex",monk:"spi"}[S.cls], lb = Math.max(0,S.lvl-LB0)*(k===main?LBM:LBO);
  const v = Math.round(S.base[k] + lb) + Math.round((r && r.s[k] || 0)*(1+S.lvl/RACESC)) + gemSum("stat") + enchStat(k) + Object.values(S.eq).reduce((t,it)=>t+((it&&it.x&&it.x[k])||0),0);
  return k==="spi" ? Math.round(v*(1+bon("spiP"))) : v;
}
function maxEn(){ return Math.round((100 + S.lvl*5 + stat("spi") + (S.eb||0))*(1+bon("en"))); } // max energie: základ + level + Duch + svitky
function maxHp(){ return Math.round((60 + S.lvl*12 + stat("str")*3 + eqSum("h") + gemSum("hp"))*(1+bon("hp"))); }
function mount(){ return S.eq.mount || null; }
function clanBonus(){ return S.clan ? 0.03 + Math.min(0.17, Math.floor(S.clan.treasury/100)*0.01) + 0.01*clanB("market") : 0; }
// ---- klan: sláva (xp) dává úroveň 1–20, budovy se staví z pokladnice, týdenní úkol ----
const CLAN_MAX = 5;
const CLAN_B = {dojo:{n:"Dódžó",d:"trénink o 3 % levnější za stupeň",c:l=>1500*(l+1)},
  smithy:{n:"Kovárna",d:"+3 % šance na vylepšení od +7 za stupeň",c:l=>2000*(l+1)},
  shrine:{n:"Svatyně",d:"+5 % rychlost léčení za stupeň",c:l=>2500*(l+1)},
  well:{n:"Studna klanu",d:"očarování o 5 % levnější za stupeň",c:l=>3000*(l+1)},
  market:{n:"Tržnice",d:"+1 % zlata a XP z odměn za stupeň",c:l=>1200*(l+1)}};
const clanB = k => (S.clan && S.clan.b && S.clan.b[k]) || 0;
const clanLvl = () => S.clan ? Math.min(20, 1+Math.floor(Math.sqrt((S.clan.xp||0)/50))) : 0;
const clanWk = () => Math.floor(Date.now()/604800000);
function clanWq(){ if(!S.clan.wq || S.clan.wq.w!==clanWk()) S.clan.wq = {w:clanWk(), n:0, done:0}; return S.clan.wq; }
function clanWin(){ if(!S.clan) return ""; const q = clanWq(); q.n++; S.clan.xp = (S.clan.xp||0)+2;
  if(q.n===300 && !q.done){ q.done = 1; S.clan.treasury += 2000; S.clan.xp += 150; return `\n<span class="win">Klanový úkol splněn: +2 000 zlata do pokladnice.</span>`; } return ""; }
const MREG = 0.012;   // mnich: vrozená regenerace, po každém svém úderu se vyléčí o 1,2 % max. životů
const NDG = {b:5, k:0.02, cap:20};   // ninja: vrozený úhyb 5 % + Obratnost × 0,02 (max 20 %)
const CRITCAP = {samurai:50, ninja:70, monk:50}, CRITOV = 0.03;   // strop kritu; každá přebytečná % zvyšuje sílu kritu (odmocninově)
const critRaw = () => 5+stat("dex")*(S.cls==="ninja"?0.7:0.25)+bon("crit")+gemSum("crit");
function myFighter(){ // bojové hodnoty hráče
  const w = S.eq.weapon, c = S.cls;
  let atk = c==="monk" ? stat("spi")*1.4+stat("str")*.4 : c==="ninja" ? stat("dex")*1.25+stat("str")*.5 : stat("str")*1.5+stat("dex")*.3;   // každá třída útočí hlavně svou vlastností
  let wa = w ? up(w,"a") : 0;
  const match = w && ((c==="samurai"&&w.t==="sword")||(c==="ninja"&&w.t==="thrown")||(c==="monk"&&w.t==="spirit"));
  if(match) wa *= 1.25;
  let def = 1 + stat("str")*0.4 + stat("spi")*0.2 + eqSum("d") + gemSum("def"); if(c==="samurai") def *= 1.2; def *= 1+bon("def");
  const cr = critRaw(), cap = CRITCAP[c], over = Math.max(0, cr-cap);
  return {name:S.name, hp:S.hp, max:maxHp(), atk:(atk+wa+gemSum("atk"))*(1+bon("atk")), def, dex:stat("dex"), crit:Math.min(cr,cap), critRaw:cr,
    blk:bon("blk"), blkCap:35+bon("blk"), dodge:bon("dodge")+(c==="ninja"?Math.min(NDG.cap, NDG.b+stat("dex")*NDG.k):0), critm:2+bon("critm")+Math.sqrt(over)*CRITOV, pierce:bon("pierce"), exec:bon("exec"), tech:techs(), comp:petFighter(), regen:c==="monk"?MREG:0, ls:bon("ls"), bleed:bon("bleed"), stun:bon("stun")};
}
function regen(){ // pasivní regenerace energie a HP podle času
  const sec = (Date.now()-(S.ts||Date.now()))/1000;
  S.energy = Math.min(maxEn(), S.energy + sec/8);
  S.hp = Math.min(maxHp(), S.hp + maxHp()*sec/1200*(1+bon("reg")));
  S.ts = Date.now();
}
const xpNeed = (l=S.lvl) => Math.max(l*100, Math.round(Math.pow(l,3)/22*(1+Math.max(0,l-100)/100)));   // XP na další level
function gainXp(n){ // postup levelů
  S.xp += n; let msg="";
  while(S.xp >= xpNeed()){ S.xp -= xpNeed(); S.lvl++; S.hp = maxHp(); S.energy = Math.max(S.energy, maxEn()); msg += `\n🌸 LEVEL UP! Nyní level ${S.lvl}.`; }
  return msg;
}
function pick(arr,n){ const a=[...arr], o=[]; while(o.length<n&&a.length) o.push(a.splice(R(0,a.length-1),1)[0]); return o; }
function rollShop(){ // nabídka: nejlepší kus pro každý slot dostupný na tvém levelu + náhodné doplnění (platí 30 min)
  const tag = {samurai:"sword",ninja:"thrown",monk:"spirit"}[S.cls], L = it=>it.l||1;
  const idx = SHOP_GEAR.map((x,i)=>i).filter(i=>SHOP_GEAR[i].s!=="mount" && L(SHOP_GEAR[i])<=S.lvl+3), g = [];
  ["weapon","armor","head","acc"].forEach(sl=>{
    const c = idx.filter(i=>SHOP_GEAR[i].s===sl && (sl!=="weapon"||SHOP_GEAR[i].t===tag)).sort((a,b)=>L(SHOP_GEAR[b])-L(SHOP_GEAR[a]));
    if(c.length) g.push(c[0]);
    const af = c.find(i=>SHOP_GEAR[i].p<=S.gold);                  // nejlepší kus, na který máš zlato
    if(af!==undefined && !g.includes(af)) g.push(af); });
  let rest = idx.filter(i=>!g.includes(i) && L(SHOP_GEAR[i])>=S.lvl-10);
  if(rest.length < 8-g.length) rest = idx.filter(i=>!g.includes(i));
  pick(rest, 8-g.length).forEach(i=>g.push(i));
  S.shop = {v:5, end:Date.now()+30*60000, gear:g}; save(); }
function ensureShop(){ if(!S.shop||S.shop.v!==5||Date.now()>S.shop.end) rollShop(); }
function npcFor(lvl,name){ let h, a, d;
  if(lvl<=100){ h = 50+lvl*14+Math.pow(lvl,3)*0.05; a = 8+lvl*3.2+lvl*lvl*0.05; d = 2+lvl*1.4+lvl*lvl*0.02; }
  else { const k = lvl/100; h = 51450*Math.pow(k,CURVE.ph); a = 828*Math.pow(k,CURVE.pa); d = 342*Math.pow(k,CURVE.pd); }   // nad 100: plynulejší růst, aby vybavení stačilo
  return {name, hp:h, max:h, atk:a, def:d, dex:6+lvl, crit:8, ico:["🤺","🥷","🧘"][name.length%3]}; }

/* =====================================================================
   MODUL 4: BOJ (automaticky vyhodnocený tahový souboj)
   ===================================================================== */
/* =====================================================================
   MODUL 8: ROZŠÍŘENÍ – dovednosti a techniky, sady, drahokamy, kampaň, světový boss,
   trofeje a tituly, den/noc a roční období, společníci
   Všechny % bonusy se sčítají ve funkci bon(k): rod + dovednosti + sady + titul + čas + společník.
   ===================================================================== */
// ---- názvy bonusů (1 = zobrazit jako % z desetinného čísla, 0 = už jsou to procentní body) ----
const BN = {atk:["útok",1],def:["obrana",1],hp:["max. životů",1],en:["max. energie",1],crit:["krit",0],blk:["blok",0],dodge:["úhyb",0],
  gold:["zlata",1],xp:["XP",1],gx:["zlata a XP",1],drop:["šance na kořist",1],ryo:["Rjō",1],reg:["rychlost léčení",1],pierce:["šance na průraz",0],
  exec:["poškození proti oslabeným",1],weak:["oslabení soupeře",1],spiP:["Duch",1],critm:["síla kritu",1],pray:["léčení po vítězství",1],
  ls:["vysávání životů",1],bleed:["šance na krvácení",0],stun:["šance na omráčení",0]};
const bonTxt = o => Object.entries(o).map(([k,v])=>`+${BN[k][1]?Math.round(v*100):v} % ${BN[k][0]}`).join(" · ");

// ---- strom dovedností: 3 cesty × 3 uzly; bon = bonus za úroveň, tech = technika spouštěná v boji ----
const SKILLS = {
  samurai:[
    {b:"Iaidó",k:"刀",nodes:[
      {id:"s1",n:"Ostří ducha",max:5,bon:{atk:.03},d:r=>`+${3*r} % útok`},
      {id:"s2",n:"Iaidó",max:3,lvl:10,tech:"iai",d:r=>`První úder boje zasáhne ×${(1.6+.2*r).toFixed(1)}`},
      {id:"s3",n:"Těžký sek",max:5,lvl:30,bon:{pierce:6},d:r=>`${6*r} % šance, že úder úplně ignoruje obranu`}]},
    {b:"Bušidó",k:"衛",nodes:[
      {id:"s4",n:"Ocelová kůže",max:5,bon:{def:.04},d:r=>`+${4*r} % obrana`},
      {id:"s5",n:"Protiúder",max:3,lvl:10,tech:"counter",d:r=>`Po každém bloku okamžitý protiúder za ${50+15*r} % útoku`},
      {id:"s6",n:"Neochvějnost",max:5,lvl:30,bon:{blk:2},d:r=>`+${2*r} % blok a strop bloku ${35+2*r} %`}]},
    {b:"Vůle",k:"力",nodes:[
      {id:"s7",n:"Tělo z oceli",max:5,bon:{hp:.05},d:r=>`+${5*r} % max. životů`},
      {id:"s8",n:"Poslední vzdor",max:3,lvl:10,tech:"laststand",d:r=>`Pod 30 % životů jednou za boj vyléčí 10 % a útok +${30+10*r} % do konce boje`},
      {id:"s9",n:"Válečný řev",max:5,lvl:30,bon:{weak:.03},d:r=>`Soupeř má o ${3*r} % nižší útok`}]}],
  ninja:[
    {b:"Stín",k:"影",nodes:[
      {id:"n1",n:"Tichá čepel",max:5,bon:{atk:.03},d:r=>`+${3*r} % útok`},
      {id:"n2",n:"Stínové dvojče",max:3,lvl:10,tech:"twin",d:r=>`${8+4*r} % šance na okamžitý druhý úder (70 %)`},
      {id:"n3",n:"Smrtící bod",max:5,lvl:30,bon:{critm:.15},d:r=>`Kritický zásah ×${(2+.15*r).toFixed(2)}`}]},
    {b:"Mlha",k:"霊",nodes:[
      {id:"n4",n:"Kouřová bomba",max:5,bon:{dodge:2},d:r=>`${2*r} % šance úplně uhnout útoku`},
      {id:"n5",n:"Náhradní tělo",max:3,lvl:10,tech:"kawa",d:r=>`${[0,33,66,100][r]} % šance přežít smrtelný zásah (jednou za boj)`},
      {id:"n6",n:"Rychlost větru",max:5,lvl:30,bon:{blk:2},d:r=>`+${2*r} % blok a strop bloku ${35+2*r} %`}]},
    {b:"Jed",k:"薬",nodes:[
      {id:"n7",n:"Smrtící přesnost",max:5,bon:{crit:1.5},d:r=>`+${1.5*r} % krit`},
      {id:"n8",n:"Jedovaté ostří",max:3,lvl:10,tech:"poison",d:r=>`${10+5*r} % šance otrávit: soupeř ztrácí ${1.5+.5*r} % životů v každém svém kole`},
      {id:"n9",n:"Dorážení",max:5,lvl:30,bon:{exec:.05},d:r=>`+${5*r} % poškození proti soupeři pod 50 % životů`}]}],
  monk:[
    {b:"Duch",k:"霊",nodes:[
      {id:"m1",n:"Vnitřní oheň",max:5,bon:{spiP:.03},d:r=>`+${3*r} % Duch`},
      {id:"m2",n:"Kiai",max:3,lvl:10,tech:"kiai",d:r=>`Každý 4. úder zasáhne ×${(1.8+.3*r).toFixed(1)}`},
      {id:"m3",n:"Osvícení",max:5,lvl:30,bon:{atk:.04},d:r=>`+${4*r} % útok`}]},
    {b:"Ochrana",k:"衛",nodes:[
      {id:"m4",n:"Kamenné tělo",max:5,bon:{def:.04},d:r=>`+${4*r} % obrana`},
      {id:"m5",n:"Ochranná mantra",max:3,lvl:10,tech:"shield",d:r=>`Na začátku boje štít za ${10+5*r} % max. životů`},
      {id:"m6",n:"Pečeť",max:5,lvl:30,tech:"seal",d:r=>`${5*r} % šance, že soupeř vynechá útok`}]},
    {b:"Léčení",k:"祝",nodes:[
      {id:"m7",n:"Hojivý dech",max:5,bon:{hp:.05},d:r=>`+${5*r} % max. životů`},
      {id:"m8",n:"Léčivá mantra",max:3,lvl:10,tech:"mantra",d:r=>`Pod 40 % životů jednou za boj vyléčí ${20+8*r} %`},
      {id:"m9",n:"Modlitba poutníka",max:5,lvl:30,bon:{pray:.04,reg:.1},d:r=>`Po vítězství +${4*r} % životů navíc a léčení o ${10*r} % rychlejší`}]}]
};
const MASTER = {b:"Mistrovství",k:"星",free:1,nodes:[
  {id:"x1",n:"Síla mistra",max:50,lvl:100,bon:{atk:.01},d:r=>`+${r} % útok`},
  {id:"x2",n:"Štít mistra",max:50,lvl:100,bon:{def:.01},d:r=>`+${r} % obrana`},
  {id:"x3",n:"Dech mistra",max:50,lvl:100,bon:{hp:.01},d:r=>`+${r} % max. životů`},
  {id:"x4",n:"Oko mistra",max:20,lvl:150,bon:{crit:.5},d:r=>`+${(r*.5).toFixed(1)} % krit`},
  {id:"x5",n:"Štěstí mistra",max:30,lvl:150,bon:{gx:.01},d:r=>`+${r} % zlata a XP`},
  {id:"x6",n:"Klid mistra",max:20,lvl:200,bon:{en:.02},d:r=>`+${2*r} % max. energie`}]};
const skBranches = () => [...SKILLS[S.cls], MASTER];
const skNodes = () => skBranches().flatMap(b=>b.nodes);
const skR = id => (S.sk||{})[id]||0;
const skTot = () => Math.floor(S.lvl/2);                       // bod dovednosti za každé 2 levely
const skSpent = () => Object.values(S.sk||{}).reduce((t,v)=>t+v,0);
const skB = k => skNodes().reduce((t,n)=>t+(n.bon&&n.bon[k]?n.bon[k]*skR(n.id):0),0);
const techs = () => { const o = {}; skNodes().forEach(n=>{ if(n.tech && skR(n.id)) o[n.tech] = skR(n.id); }); return o; };

// ---- sady vybavení (zbraň, zbroj, přilba, doplněk stejné řady) ----
const SETS = [
  {k:"draka",m:/^(Dračí zbroj|Dračí maska|Zlatý prsten draka)$/,n:"Dračí sada",of:3,b:{2:{hp:.06},3:{atk:.08}}},
  {k:"jerab",m:/Zlatého jeřába$/,n:"Sada Zlatého jeřába",of:4,b:{2:{hp:.08},4:{atk:.08,crit:4}}},
  {k:"mesic",m:/Měsíčního stínu$/,n:"Sada Měsíčního stínu",of:4,b:{2:{dodge:4},4:{atk:.10,crit:5}}},
  {k:"hvezda",m:/Hvězdného pádu$/,n:"Sada Hvězdného pádu",of:4,b:{2:{def:.10},4:{atk:.12,blk:6}}},
  {k:"vitr",m:/Božského větru$/,n:"Sada Božského větru",of:4,b:{2:{dodge:6},4:{atk:.15,hp:.10}}},
  {k:"cisar",m:/Věčného císaře$/,n:"Sada Věčného císaře",of:4,b:{2:{hp:.12},4:{atk:.20,def:.10,crit:5}}}
];
HIGH.forEach((k,i)=>SETS.push({k:"h"+i, m:new RegExp(k+"$"), n:"Sada "+k, of:4, b:{2:{hp:+(.10+.005*i).toFixed(3)}, 4:{atk:+(.20+.01*i).toFixed(2), crit:5+Math.floor(i/4)}}}));
const GEARSLOTS = ["weapon","armor","head","acc"];
const setOf = it => it && it.s!=="mount" && SETS.find(x=>x.m.test(it.n)) || null;
const setCount = k => GEARSLOTS.filter(s=>{ const t = setOf(S.eq[s]); return t && t.k===k; }).length;
const setB = k => SETS.reduce((t,st)=>{ const c = setCount(st.k); return t+Object.entries(st.b).reduce((a,[n,b])=>a+(c>=+n&&b[k]?b[k]:0),0); },0);
const fullSet = () => SETS.some(st=>setCount(st.k)>=st.of);

// ---- drahokamy: typ + stupeň 1–5, ve slotech nasazeného vybavení ----
const GEMS = {ruby:{n:"Rubín",k:"atk",c:"#c8443a",v:[5,10,18,30,48,70,100,140,190,250],u:"útok"},jade:{n:"Nefrit",k:"hp",c:"#4f9a6b",v:[40,90,170,300,480,700,1000,1400,1900,2500],u:"životů"},
  saph:{n:"Safír",k:"def",c:"#4a72b8",v:[4,8,15,26,42,60,85,120,160,210],u:"obrana"},topaz:{n:"Topaz",k:"crit",c:"#d4a13a",v:[1,1.5,2,3,4.5,5.5,6.5,7.5,8.5,10],u:"% krit"},
  amet:{n:"Ametyst",k:"stat",c:"#8d5cb8",v:[1,2,4,6,9,13,18,24,31,40],u:"ke všem vlastnostem"}};
const mergeCost = g => 100*g*g*g;   // spojení 3× stupeň g → g+1
const ROM = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
const gemT = id => GEMS[id.split(":")[0]], gemG = id => +id.split(":")[1];
const gemName = id => `${gemT(id).n} ${ROM[gemG(id)-1]}`;
const gemVal = id => gemT(id).v[gemG(id)-1];
const gemTxt = id => `+${gemVal(id)} ${gemT(id).u}`;
const gemIco = id => { const c = gemT(id).c; return `<svg class="gi" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l4 5-9 12L3 9z" fill="${c}"/><path d="M3 9h18M9 4l-1 5 4 12 4-12-1-5" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/></svg>`; };
const sockets = it => !it || !GEARSLOTS.includes(it.s) ? 0 : (it.l||1)>=60 ? 3 : (it.l||1)>=30 ? 2 : 1;
const gemSum = k => GEARSLOTS.reduce((t,s)=>{ const it = S.eq[s]; return t+((it&&it.g)||[]).reduce((a,id)=>a+(id&&gemT(id).k===k?gemVal(id):0),0); },0);
const addGem = id => { S.gems = S.gems||{}; S.gems[id] = (S.gems[id]||0)+1; };
function rollGem(L){ const ks = Object.keys(GEMS), g = Math.max(1,Math.min(10,(L<=110?1+Math.floor(L/22):5+Math.floor((L-110)/40))-(Math.random()<.3?1:0))); return ks[R(0,ks.length-1)]+":"+g; }

// ---- kovářské riziko: od +7 může vylepšení selhat ----
const forgeCh = t => t<=6 ? 100 : Math.min(100,[70,55,40,30][t-7]+3*clanB("smithy"));
const forgeCost = it => Math.round((it.p||100)*0.5*((it.u||0)+1))+30;

// ---- den/noc a roční období (podle skutečného času hráče) ----
const SEASONS = [{n:"Jaro",k:"春",b:{xp:.10},t:"+10 % XP"},{n:"Léto",k:"夏",b:{gold:.10},t:"+10 % zlata"},
  {n:"Podzim",k:"秋",b:{drop:.15},t:"+15 % šance na kořist"},{n:"Zima",k:"冬",b:{ryo:.20},t:"+20 % Rjō"}];
const NIGHT = {b:{drop:.25,xp:.10},t:"silnější soupeři v divočině (+15 %), +25 % šance na kořist, +10 % XP"};
function env(){ const d = new Date(), h = d.getHours(), m = d.getMonth(); return {night: h>=20||h<6, se: m===11||m<2 ? 3 : m<5 ? 0 : m<8 ? 1 : 2}; }
const envB = k => { const e = env(); return (SEASONS[e.se].b[k]||0)+(e.night?(NIGHT.b[k]||0):0); };
const envTxt = () => { const e = env(), s = SEASONS[e.se]; return `${e.night?"Noc":"Den"} · ${s.n}`; };
const envFull = () => { const e = env(), s = SEASONS[e.se]; return `${s.n}: ${s.t}`+(e.night?` · Noc: ${NIGHT.t}`:" · Den: běžní soupeři"); };
// sezónní výprava: jedna navíc v každém ročním období
const SEAS_EXP = [{n:"Liščí svatba pod sakurami",i:"🦊",t:"Za jarního deště se v sakurovém háji konají liščí svatby. Kdo je vyruší, toho kicune nepustí."},
  {n:"Noc ohňů svátku Obon",i:"🔥",t:"O letním svátku se vracejí duše předků. Ne všechny přicházejí v míru."},
  {n:"Javorový les tengu",i:"👺",t:"V rudém javorovém lese cvičí tengu své žáky. Rádi si změří síly s poutníky."},
  {n:"Sněžná bouře Juki-onny",i:"❄️",t:"Ve vánici se zjevuje sněhová žena. Za ní zůstávají jen zamrzlé sochy."}];

// ---- společníci ----
const PETS = {
  fox:{n:"Liška",k:"狐",t:"dmg",a:"Liščí oheň",d:l=>`zasáhne za ${Math.round((.4+.03*l)*100)} % tvého útoku`},
  hawk:{n:"Jestřáb",k:"鷹",t:"pierce",a:"Útok ze vzduchu",d:l=>`zasáhne za ${Math.round((.3+.02*l)*100)} % útoku a ignoruje obranu`},
  tanuki:{n:"Tanuki",k:"狸",t:"heal",a:"Léčivé byliny",d:l=>`vyléčí ${(4+.3*l).toFixed(1)} % tvých max. životů`},
  akita:{n:"Akita",k:"犬",t:"dmg",a:"Kousnutí",d:l=>`zasáhne za ${Math.round((.25+.02*l)*100)} % útoku; trvale +${l} % obrana`}};
const pet = () => S.pet && S.pets && S.pets[S.pet] || null;
const petCh = l => Math.min(.35,.15+.01*l);
const petB = k => k==="def" && S.pet==="akita" && pet() ? pet().lvl*.01 : 0;
const PET_EVO = {fox:["Liška","Kicune","Devítiocasá kicune"],hawk:["Jestřáb","Orlí stín","Bouřný jestřáb"],tanuki:["Tanuki","Mnišský tanuki","Světlý tanuki"],akita:["Akita","Bojová akita","Psí bohyně"]};
const petName = () => { const p = pet(); return p ? PET_EVO[S.pet][p.lvl>=30?2:p.lvl>=15?1:0] : ""; };
const petEvo = l => l>=30?1.35:l>=15?1.15:1;
const petAvail = () => { const p = pet(); if(!p) return 0; const sp = p.sp||{pow:0,sup:0}; return Math.floor(p.lvl/5) - sp.pow - sp.sup; };
function petFighter(){ const p = pet(); if(!p) return null; const P = PETS[S.pet], l = p.lvl, sp = p.sp||{pow:0,sup:0}, m = petEvo(l)*(1+.04*sp.pow);
  return {n:petName(), k:P.k, a:P.a, t:P.t, ch:Math.min(.5,petCh(l)+.02*sp.sup), v:{fox:.4+.03*l,hawk:.3+.02*l,tanuki:.04+.003*l,akita:.25+.02*l}[S.pet]*m}; }
function petGain(n){ const p = pet(); if(!p) return ""; p.xp += n; let m = "";
  while(p.lvl<30 && p.xp>=p.lvl*8){ p.xp -= p.lvl*8; p.lvl++; m += `\nSpolečník ${PETS[S.pet].n} dosáhl levelu ${p.lvl}.` + (p.lvl===15||p.lvl===30 ? `\nVývoj: ${PET_EVO[S.pet][p.lvl>=30?2:1]}!` : ""); } return m; }

// ---- trofeje a tituly (nošený titul dává bonus) ----
const st = k => (S.st||{})[k]||0;
const maxU = () => Math.max(0,...[...Object.values(S.eq),...S.inv].map(i=>(i&&i.u)||0));
const bestKinds = () => Object.keys(S.best||{}).length;
const ACH = [
  {id:"w10",n:"Novic meče",d:"Vyhraj 10 bojů",c:()=>st("win"),need:10,b:{atk:.02}},
  {id:"w100",n:"Veterán",d:"Vyhraj 100 bojů",c:()=>st("win"),need:100,b:{atk:.03,hp:.02}},
  {id:"w1000",n:"Nesmrtelný",d:"Vyhraj 1 000 bojů",c:()=>st("win"),need:1000,b:{atk:.05,hp:.04}},
  {id:"e50",n:"Poutník",d:"Dokonči 50 výprav",c:()=>st("exp"),need:50,b:{gold:.05}},
  {id:"d25",n:"Lovec démonů",d:"Poraz 25 bossů v dungeonech",c:()=>st("dun"),need:25,b:{crit:3}},
  {id:"t50",n:"Pán věže",d:"Zdolej 50. patro Věže zkoušek",c:()=>S.tw||0,need:50,b:{hp:.05}},
  {id:"t100",n:"Dobyvatel nebes",d:"Zdolej 100. patro Věže zkoušek",c:()=>S.tw||0,need:100,b:{hp:.08,def:.04}},
  {id:"l50",n:"Mistr cesty",d:"Dosáhni levelu 50",c:()=>S.lvl,need:50,b:{en:.06}},
  {id:"l80",n:"Legenda",d:"Dosáhni levelu 80",c:()=>S.lvl,need:80,b:{atk:.05,def:.05,hp:.05}},
  {id:"c3",n:"Ochránce řeky",d:"Dokonči 3. kapitolu kampaně",c:()=>Math.floor((S.camp||0)/4),need:3,b:{def:.04}},
  {id:"c6",n:"Přemožitel Akumy",d:"Dokonči celou kampaň",c:()=>Math.floor((S.camp||0)/4),need:6,b:{atk:.06,xp:.05}},
  {id:"f10",n:"Mistr kovář",d:"Vylepši předmět na +10",c:()=>maxU(),need:10,b:{def:.05}},
  {id:"set",n:"Sběratel",d:"Nos kompletní sadu vybavení",c:()=>fullSet()?1:0,need:1,b:{hp:.04,atk:.02}},
  {id:"g5",n:"Klenotník",d:"Vytvoř Císařský drahokam (stupeň V)",c:()=>st("g5"),need:1,b:{crit:2}},
  {id:"wb",n:"Krotitel bouří",d:"Poraz světového bosse",c:()=>st("wbk"),need:1,b:{crit:3,gold:.03}},
  {id:"wb10",n:"Postrach démonů",d:"Poraz světového bosse 10×",c:()=>st("wbk"),need:10,b:{atk:.04,crit:2}},
  {id:"pet10",n:"Přítel zvířat",d:"Vycvič společníka na level 10",c:()=>Math.max(0,...Object.values(S.pets||{}).map(p=>p.lvl)),need:10,b:{xp:.04}},
  {id:"sk20",n:"Osvícený",d:"Využij 20 bodů dovedností",c:()=>skSpent(),need:20,b:{en:.05}},
  {id:"l150",n:"Světec meče",d:"Dosáhni levelu 150",c:()=>S.lvl,need:150,b:{atk:.06,hp:.06}},
  {id:"l250",n:"Nebeský válečník",d:"Dosáhni levelu 250",c:()=>S.lvl,need:250,b:{atk:.08,def:.08,hp:.08}},
  {id:"l300",n:"Rovný bohům",d:"Dosáhni levelu 300",c:()=>S.lvl,need:300,b:{atk:.10,def:.10,hp:.10,crit:3}},
  {id:"c10",n:"Hrdina osmi provincií",d:"Dokonči kampaň včetně druhého dějství",c:()=>Math.floor((S.camp||0)/4),need:10,b:{atk:.08,xp:.06}},
  {id:"g10",n:"Mistr drahokamů",d:"Vytvoř drahokam stupně X",c:()=>st("g10"),need:1,b:{crit:4}},
  {id:"sk100",n:"Mistr všech cest",d:"Využij 100 bodů dovedností",c:()=>skSpent(),need:100,b:{atk:.05,def:.05}},
  {id:"en50",n:"Zaklínač studny",d:"Očaruj předměty 50×",c:()=>st("ench"),need:50,b:{crit:2}},
  {id:"best25",n:"Znalec yokai",d:"Poraz 25 různých yokai a démonů",c:()=>bestKinds(),need:25,b:{atk:.02}},
  {id:"dun300",n:"Strážce stvoření",d:"Poraz bosse Brány stvoření (level 300)",c:()=>st("d300"),need:1,b:{atk:.10,hp:.08}}
];
const titleB = k => { const a = S.title && ACH.find(x=>x.id===S.title); return a && a.b[k] || 0; };
const titleN = () => { const a = S.title && ACH.find(x=>x.id===S.title); return a ? a.n : ""; };
function checkAch(){ S.ach = S.ach||{}; const nu = [];
  ACH.forEach(a=>{ if(!S.ach[a.id] && a.c()>=a.need){ S.ach[a.id] = 1; nu.push(a.n); } }); return nu; }

// ---- součet všech procentních bonusů ----
function bon(k){ const r = RACES[S.race]; return (r && r.p[k] || 0) + skB(k) + setB(k) + titleB(k) + envB(k) + petB(k) + enB(k) + (k==="reg" ? clanB("shrine")*0.05 : 0) + (k==="atk" ? Math.min(0.1, bestKinds()*0.002) : 0); }


// ---- OČAROVANÁ STUDNA: náhodné vlastnosti na vybavení (it.ench = [{k,v,q}], it.el = zamčené pozice) ----
// p:1 = procenta (do bon() jako v/100), jinak procentní body; st:1 = plusové body k vlastnosti; w = vyšší váha pro sloty
const ENCH = [
  {k:"atk",n:"Útok",lo:1,hi:5,p:1,w:{weapon:3,acc:2}},{k:"def",n:"Obrana",lo:1,hi:6,p:1,w:{armor:3,head:2}},
  {k:"hp",n:"Max. životy",lo:1,hi:6,p:1,w:{armor:3,head:2}},{k:"crit",n:"Kritický zásah",lo:1,hi:4,w:{weapon:2,acc:2}},
  {k:"critm",n:"Síla kritu",lo:3,hi:12,p:1,w:{weapon:2,acc:1}},{k:"blk",n:"Blok",lo:1,hi:4,w:{armor:2,head:2}},
  {k:"dodge",n:"Úhyb",lo:1,hi:3,w:{head:2,acc:1}},{k:"pierce",n:"Průraz obrany",lo:1,hi:5,w:{weapon:2}},
  {k:"exec",n:"Poškození proti oslabeným",lo:2,hi:8,p:1,w:{weapon:2}},{k:"ls",n:"Vysávání životů",lo:1,hi:4,p:1,w:{weapon:2,acc:1}},
  {k:"bleed",n:"Šance na krvácení",lo:3,hi:12,w:{weapon:2}},{k:"stun",n:"Šance na omráčení",lo:1,hi:5,w:{weapon:1,head:1}},
  {k:"reg",n:"Rychlost léčení",lo:5,hi:20,p:1,w:{armor:1,acc:1}},{k:"gold",n:"Zlato",lo:3,hi:10,p:1,w:{acc:2,head:1}},
  {k:"xp",n:"Zkušenosti",lo:2,hi:8,p:1,w:{acc:2,head:1}},{k:"drop",n:"Šance na kořist",lo:3,hi:10,p:1,w:{acc:1}},
  {k:"ryo",n:"Rjō",lo:3,hi:10,p:1,w:{acc:1}},
  {k:"str",n:"Síla",st:1,w:{weapon:1,armor:1}},{k:"dex",n:"Obratnost",st:1,w:{weapon:1,head:1}},{k:"spi",n:"Duch",st:1,w:{acc:1,head:1}}];
const ENK = Object.fromEntries(ENCH.map(e=>[e.k,e]));
const enchOk = it => !!it && GEARSLOTS.includes(it.s);
const enchSlots = it => { const L = it.l||1; return L<20?1:L<50?2:L<100?3:L<180?4:5; };
const enchCost = it => { const L = it.l||1, lk = (it.el||[]).length; const dsc = 1-0.05*clanB("well"); return {r:Math.max(1,Math.round((5+Math.floor(L/8))*(1+lk)*dsc)), g:Math.round((L*L*1.2+100)*dsc)}; };
function rollEnch(it, used){ const L = it.l||1, pool = ENCH.filter(e=>!used.has(e.k)), w = pool.map(e=>1+((e.w||{})[it.s]||0));
  let x = Math.random()*w.reduce((a,b)=>a+b,0), i = 0; while(x>=w[i]) x -= w[i++];
  const e = pool[i], q = Math.pow(Math.random(),1.5), m = Math.min(1.6,.5+L/200);
  const v = e.st ? Math.max(1,Math.round(L*(.12+.38*q))) : Math.round((e.lo+(e.hi-e.lo)*q)*m*10)/10;
  return {k:e.k, v, q:Math.round(q*100)/100}; }
const enchTxt = x => { const e = ENK[x.k]; return e.st ? `+${x.v} ${e.n}` : `+${String(x.v).replace(".",",")} % ${e.n}`; };
const enchAll = () => GEARSLOTS.flatMap(s=>(S.eq[s]&&S.eq[s].ench)||[]);
const enB = k => { const e = ENK[k]; if(!e || e.st) return 0; return enchAll().reduce((t,x)=>t+(x.k===k?(e.p?x.v/100:x.v):0),0); };
const enchStat = k => enchAll().reduce((t,x)=>t+(x.k===k?x.v:0),0);
const enchSig = () => enchAll().map(x=>x.k+x.v).join("");

// ---- kampaň: 6 kapitol × 4 boje (poslední je boss) ----
const CAMP = [
  {n:"Popel vesnice Kiri",lvl:1,who:["Mnich Genkai","僧"],end:"Kurogane padl, ale černý lotos na jeho zbroji svědčí o mocnějším pánovi.",st:[
    ["Bandité u studny","🦹","Vesnice Kiri hoří. „Bandité odvlekli rýži i děti,“ šeptá starý mnich Genkai. „Začni u studny, tam mají hlídky.“"],
    ["Žoldnéři z mlýna","🥷","U mlýna stojí žoldnéři s cizím erbem, černým lotosem. „Ten znak jsem neviděl třicet let,“ zamračí se Genkai."],
    ["Prokletý strážce","👻","Cestu k táboru hlídá duch padlého samuraje. Něco ho drží na tomto světě proti jeho vůli."],
    ["Rónin Kurogane","👹","Vůdce banditů se směje: „Černý lotos platí lépe než jakýkoli pán. Šógun Akuma brzy pohltí celé Kai!“"]]},
  {n:"Mlhy Šinana",lvl:10,who:["Lovkyně Ajame","弓"],end:"Mlha se zvedá. Ajame ti podává šíp s černým lotosem: „Vede k řece Kiso.“",st:[
    ["Vlci z mlhy","🐺","Za průsmykem čeká lovkyně Ajame. „Mlha v Šinanu není přirozená. Vlci v ní mají rudé oči.“"],
    ["Bludné ohně","🔥","V bažinách tančí bludné ohně a lákají poutníky do hlubin. Ajame napíná luk: „Drž se za mnou.“"],
    ["Sluha čarodějnice","👺","Tengu v masce nese košík kostí a míří k chýši na vrcholu hory."],
    ["Čarodějnice Jamauba","👹","Jamauba si olizuje prsty: „Akuma mi slíbil tisíc duší. Tvoje bude první.“"]]},
  {n:"Krvavá řeka",lvl:20,who:["Rybář Tóbei","漁"],end:"Řeka se čistí. Tóbei slyšel, že generál Kagemaru otevřel hrad Sakuja démonům.",st:[
    ["Říční piráti","🏴‍☠️","Řeka Kiso je rudá. Rybář Tóbei ukazuje na čluny s černým lotosem: „Vybírají daň krví.“"],
    ["Utopenci","👻","Z vody vystupují postavy v rozedraných kimonech. Ti, kdo daň nezaplatili."],
    ["Obří chobotnice","🐙","U jezu se vynoří chapadla silná jako kmeny cedrů."],
    ["Kappa-král Suiko","🐉","Suiko sedí na trůnu z lastur: „Akuma mi dal řeku. Ty mi dáš svou hlavu.“"]]},
  {n:"Hrad bez stínu",lvl:35,who:["Princezna Sakuja","姫"],end:"Sakuja usedá na trůn otce. „Akumova moc pramení z Jomi. Šamanka Mio zná cestu.“",st:[
    ["Stráže brány","🤺","Princezna Sakuja tě vpustí tajnou chodbou. „Generál Kagemaru zradil mého otce a otevřel hrad démonům.“"],
    ["Stínoví ninjové","🥷","V chodbách se míhají stíny bez těl. Kagemaru prodal i vlastní stín."],
    ["Démonická garda","👹","Trůnní sál hlídají oni v ukradených zbrojích klanu Sakuja."],
    ["Generál Kagemaru","🦹","Kagemaru tasí čepel z černé oceli: „Akuma je budoucnost. Starý řád shoří.“"]]},
  {n:"Brána Jomi",lvl:50,who:["Šamanka Mio","巫"],end:"Pramen Jomi je přerušen. Akuma slábne a jeho palác se otevírá.",st:[
    ["Hladoví duchové","👻","Šamanka Mio otevírá cestu do podsvětí: „Akumova síla pochází z Jomi. Musíme přerušit pramen.“"],
    ["Psí démoni","🐺","U řeky zapomnění štěkají démoničtí psi s lidskými tvářemi."],
    ["Pavoučí kněžka","🕷️","Džorógumo spřádá sítě z duší. Každé vlákno je něčí jméno."],
    ["Gašadokuro","💀","Z hromad kostí povstane obří kostlivec. Jeho čelisti cvakají hladem stovek let."]]},
  {n:"Stín šóguna",lvl:65,who:["Mnich Genkai","僧"],end:"Akuma padl. Černý lotos uvadá a do provincií se vrací jaro. Tvé jméno se zapíše do kronik.",st:[
    ["Elitní stráž Akumy","🤺","Genkai se vrací: „Černý lotos byl kdysi můj klan. Akuma byl můj žák.“"],
    ["Bouřní démoni","⚡","Nebe nad palácem praská blesky. Démoni bouře se snášejí z mraků."],
    ["Stín Akumy","👤","Akuma posílá svůj stín, aby změřil tvou sílu."],
    ["Šógun Akuma","😈","Akuma sundá masku. „Mistr Genkai… a jeho nový nástroj. Ukaž mi, co tě naučil.“"]]},
  {n:"Probuzení osmi hlav",lvl:80,who:["Mnich Genkai","僧"],end:"Jedna hlava padla, ale sedm dalších se probouzí. Genkai tě posílá k moři, kde žije kovář Amakuni.",st:[
    ["Kultisté osmi hlav","🐍","Genkai se třese: „Akumova smrt zlomila pečeť. Pod horou Funacu se probouzí Jamata no Oroči.“"],
    ["Hadí kněžky","🕷️","Kněžky v šupinatých róbách přinášejí obětiny. Každá nese na čele znak osmi hlav."],
    ["Strážce pečeti","👹","Kamenný oni hlídá rozbitou pečeť. Jeho oči hoří zeleným ohněm."],
    ["První hlava Oroči","🐉","Ze skály se vyvine první z osmi hlav. Ostatních sedm zatím spí."]]},
  {n:"Meč z ocasu draka",lvl:120,who:["Kovář Amakuni","鍛"],end:"Kusanagi je tvůj. Amakuni čepel překove a ta zazáří modrým plamenem.",st:[
    ["Mořští piráti","🏴‍☠️","Kovář Amakuni žije na útesu: „Jen meč Kusanagi zabije Oroči. Jeho čepel leží na dně Moře stínů.“"],
    ["Utopení samurajové","👻","Na dně moře stojí celé vojsko utopených samurajů. Pořád drží stráž."],
    ["Obří mořský had","🐍","Kolem potopeného chrámu se ovíjí had dlouhý jako řeka."],
    ["Umibózu","🐙","Z hlubin povstane mořský mnich Umibózu. Čepel Kusanagi svírá v pěsti."]]},
  {n:"Nebe se trhá",lvl:170,who:["Šamanka Mio","巫"],end:"Susanó-o se skloní: „Bojuješ jako bůh. Pomohu ti proti Oroči.“",st:[
    ["Bouřní vrány","👺","Mio hledí na roztrhané nebe: „Oroči volá bohy bouře. Susanó-o se k němu přidal.“"],
    ["Hromoví démoni","⚡","Raidžinovi bubeníci rozbíjejí hory úderem do bubnů."],
    ["Větrný bůh Fúdžin","🌩️","Fúdžin rozvine vak větrů a celé údolí se zvedá k nebi."],
    ["Susanó-o","🌩️","Bůh bouře tasí meč: „Ukaž mi, že si smrtelník zaslouží nebesa.“"]]},
  {n:"Osm hlav, osm bran",lvl:230,who:["Princezna Sakuja","姫"],end:"Oroči padl a z jeho těla vyrůstá posvátný cedr. Tvé jméno nese osm provincií a bohové se ti klaní.",st:[
    ["Armáda šupin","🐍","Sakuja vede vojska osmi provincií: „Dnes skončí věk hada. Za námi stojí celé císařství.“"],
    ["Sedm hlav","🐉","Sedm hlav Oroči chrlí oheň, jed, led a blesky. Kusanagi v tvé ruce zpívá."],
    ["Srdce hada","😈","Uvnitř hory pulzuje obří srdce. Kolem něj tančí Akumův stín."],
    ["Jamata no Oroči","🐉","Všech osm hlav se na tebe obrátí najednou. Hory se třesou."]]}
];
const campLvl = (c,s) => Math.max(CAMP[c].lvl + s*3, S.lvl - 4 + s);   // starší kapitoly rostou s hráčem, aby příběh nebyl procházka
function campEnemy(c,s){ const L = campLvl(c,s), [n,i] = CAMP[c].st[s], E = npcFor(L,n); E.ico = i;
  if(s===3){ E.hp = E.max = Math.round(E.max*2.2); E.atk *= 1.15; E.def *= 1.1; } return E; }

// ---- světový boss: denní démon, tvůj podíl jeho síly, 3 pokusy denně ----
const WB = [["Jamata no Oroči","🐍"],["Daidarabotči","👹"],["Nue","🐅"],["Ómukade","🕷️"],["Tamamo no Mae","🦊"],["Raidžú","⚡"],["Umibózu","🐙"]];
const dayN = () => Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000);
function wbState(){ const d = dayN();
  if(!S.wb || S.wb.day!==d){ let tot = 0;          // síla démona = zhruba 2,6× průměrné poškození jednoho pokusu (simulace)
    for(let i=0;i<6;i++){ const E = wbBase(d); E.hp = E.max = 1e12; const P = myFighter(); P.hp = P.max; fight(P,E,24); tot += 1e12-E.hp; }
    S.wb = {day:d, dmg:0, tries:0, got:[], pool:Math.max(500,Math.round(tot/6*2.9)), lvl:S.lvl}; }
  else if(S.lvl >= (S.wb.lvl||0)+10){ const fr = S.wb.dmg/S.wb.pool, old = S.wb; S.wb = null; const n = wbState(); n.dmg = Math.round(Math.min(1,fr)*n.pool); n.tries = old.tries; n.got = old.got; }
  return S.wb; }
function wbBase(d){ const b = WB[d%WB.length], base = npcFor(S.lvl+8,b[0]), f = myFighter();
  return {name:b[0], ico:b[1], atk:f.def*0.5+maxHp()*0.09, def:base.def*1.2, dex:base.dex, crit:10}; }
function wbEnemy(){ const w = wbState(), E = wbBase(w.day); E.hp = w.pool-w.dmg; E.max = w.pool; return E; }

// ---- vlastnosti soupeřů: každý soupeř má podle jména jednu (nebo žádnou) zvláštnost ----
const TRAITS = {
  rage:{n:"Zuřivost",d:"pod 35 % životů útočí o 25 % silněji"},
  heavy:{n:"Drtivý úder",d:"každý 4. útok o 60 % silnější, předem ho ohlásí"},
  venom:{n:"Jedovaté zuby",d:"zásah může otrávit (2 % tvých životů za kolo)"},
  frenzy:{n:"Dvojitý výpad",d:"občas zaútočí dvakrát"},
  stone:{n:"Kamenná kůže",d:"blokuje častěji"}};
const TRL = ["rage","heavy","venom","frenzy","stone",null,null];
const traitOf = E => E.tr!==undefined ? E.tr : TRL[[...String(E.name)].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)%TRL.length];
const COMBO = .04, COMBOMAX = 5;   // série: každý tvůj zásah bez inkasovaného zásahu +4 % poškození (max +20 %)

/* ---- BOJ: tahový souboj s technikami, stavy (jed, krvácení, omráčení), sérií, společníkem a vlastnostmi soupeřů ----
   událost: p = jedná hráč, dmg, crit, blk, dodge, tech, heal, dot (1 jed, 2 krvácení, 3 jed na hráče), stun, comp, ls (vysáto),
            chg (soupeř nabírá sílu), rg (zuřivost), ph/eh = životy po události, s = stavy po události */
function fight(P, E, cap){
  const log = [], ev = [], ph0 = P.hp, eh0 = E.hp, T = P.tech||{}, tr = traitOf(E); let first = P.dex >= E.dex ? 0 : 1, round = 0;
  const s = {pAtk:0, last:false, mantra:false, kawa:false, shield:0, poison:0, bleed:0, bt:0, vt:0, stunE:0, combo:0, eAtk:0, rage:false, chg:false};
  const push = e => { e.ph = Math.round(P.hp); e.eh = Math.round(E.hp);
    e.s = {sh:Math.round(s.shield), ps:s.poison?1:0, bl:s.bt?s.bleed:0, vn:s.vt, rg:s.rage?1:0, ch:s.chg?1:0, cb:s.combo, st:s.stunE}; ev.push(e); return e; };
  const strike = (att, def, mult, noBlk) => {
    const isP = att===P; let tech = null, armor = def.def*0.5;
    if(isP && P.pierce && Math.random()*100 < P.pierce){ armor = 0; tech = "Těžký sek"; }
    if(isP) mult *= 1+COMBO*Math.min(s.combo,COMBOMAX);
    let dmg = Math.max(1, att.atk*(0.8+Math.random()*0.4)*mult - armor);
    const blk = !noBlk && Math.random()*100 < Math.min(def.blkCap||35, def.def*0.5+def.dex*0.3+(def.blk||0)+(def===E&&tr==="stone"?8:0));
    const crit = !blk && Math.random()*100 < att.crit;
    if(crit) dmg *= att.critm||2; if(blk) dmg *= 0.4;
    if(isP && P.exec && E.hp < E.max*0.5) dmg *= 1+P.exec;
    dmg = Math.max(1, Math.round(dmg)); def.hp -= dmg;
    log.push(`${att.name} ${blk?"zasáhl (blok)":"zasáhl"} ${def.name} za ${dmg}${crit?" 💥KRIT":""}`);
    const e = {p:isP, dmg, crit, blk, tech};
    if(isP){ if(P.ls){ const h = Math.round(Math.min(P.max-P.hp, dmg*P.ls)); if(h>0){ P.hp += h; e.ls = h; } }
      if(E.hp>0 && P.bleed && !blk && Math.random()*100 < P.bleed){ s.bleed = Math.min(3,s.bleed+1); s.bt = 3; e.bleed = 1; }
      if(E.hp>0 && P.stun && !s.stunE && Math.random()*100 < P.stun){ s.stunE = 1; e.stn = 1; }
      if(!blk) s.combo++; }
    return e;
  };
  const hitP = e => {   // zásah do hráče: štít, náhradní tělo, konec série
    if(s.shield>0){ const a = Math.min(s.shield, e.dmg); s.shield -= a; P.hp += a; e.dmg -= a; e.abs = Math.round(a); }
    if(P.hp<=0 && T.kawa && !s.kawa && Math.random() < T.kawa/3){ s.kawa = true; P.hp += e.dmg; e.dmg = 0; e.dodge = 1; e.tech = "Náhradní tělo"; }
    if(e.dmg>0) s.combo = 0; return push(e); };
  if(T.shield){ s.shield = P.max*(0.10+0.05*T.shield); push({p:true, dmg:0, tech:"Ochranná mantra", sh:Math.round(s.shield)}); }
  while(P.hp>0 && E.hp>0 && round<(cap||80)){
    if((round+first)%2===0){                                   // tah hráče
      let mult = 1, tech = null;
      if(T.iai && s.pAtk===0){ mult = 1.6+0.2*T.iai; tech = "Iaidó"; }
      else if(T.kiai && (s.pAtk+1)%4===0){ mult = 1.8+0.3*T.kiai; tech = "Kiai"; }
      if(s.last) mult *= 1.3+0.1*T.laststand;
      s.pAtk++; if(P.regen) P.hp = Math.min(P.max, P.hp + P.max*P.regen); const e = strike(P,E,mult); if(tech) e.tech = tech; push(e);
      if(E.hp>0 && T.twin && Math.random() < .08+.04*T.twin){ const e2 = strike(P,E,.7); e2.tech = "Stínové dvojče"; push(e2); }
      if(E.hp>0 && T.poison && !s.poison && !e.blk && Math.random() < .10+.05*T.poison){ s.poison = Math.min(E.max*(.015+.005*T.poison), P.atk*(.4+.1*T.poison)); /* strop: jed není přesílený na bosse */ push({p:true, dmg:0, tech:"Jedovaté ostří"}); }
      if(E.hp>0 && P.comp && Math.random() < P.comp.ch){ const c = P.comp;
        if(c.t==="heal"){ const h = Math.round(Math.min(P.max-P.hp, P.max*c.v)); P.hp += h; push({p:true, dmg:0, heal:h, tech:c.a, comp:1}); }
        else { const d = Math.max(1, Math.round(P.atk*c.v - (c.t==="pierce"?0:E.def*0.5))); E.hp -= d; push({p:true, dmg:d, tech:c.a, comp:1}); } }
    } else {                                                   // tah soupeře
      if(s.poison){ const d = Math.max(1,Math.round(s.poison)); E.hp -= d; push({p:true, dmg:d, dot:1, tech:"Jed"}); if(E.hp<=0) break; }
      if(s.bt){ const d = Math.max(1,Math.round(Math.min(E.max*.012, P.atk*.12)*s.bleed)); E.hp -= d; s.bt--; const n = s.bleed; if(!s.bt) s.bleed = 0;
        push({p:true, dmg:d, dot:2, tech:"Krvácení ×"+n}); if(E.hp<=0) break; }
      if(s.vt){ const d = Math.max(1,Math.round(P.max*.02)); P.hp -= d; s.vt--; push({p:false, dmg:d, dot:3, tech:"Jed"}); if(P.hp<=0) break; }
      if(s.stunE){ s.stunE = 0; push({p:false, dmg:0, stun:1, tech:"Omráčení"}); round++; continue; }
      if(T.seal && Math.random() < .05*T.seal){ push({p:false, dmg:0, stun:1, tech:"Pečeť"}); round++; continue; }
      if(tr==="rage" && !s.rage && E.hp < E.max*.35){ s.rage = true; push({p:false, dmg:0, tech:"Zuřivost", rg:1}); }
      s.eAtk++; let mult = s.rage ? 1.25 : 1, htech = null;
      if(s.chg){ s.chg = false; mult *= 1.6; htech = "Drtivý úder"; }
      if(P.dodge && Math.random()*100 < P.dodge){ const e = push({p:false, dmg:0, dodge:1}); if(htech) e.tech = htech; }
      else {
        const e = strike(E,P,mult); if(htech) e.tech = htech;
        if(tr==="venom" && e.dmg>0 && !s.vt && Math.random() < .2){ s.vt = 3; e.ven = 1; }
        hitP(e);
        if(P.hp>0 && tr==="frenzy" && Math.random() < .15){ const e2 = strike(E,P,.6); e2.tech = "Dvojitý výpad"; hitP(e2); }
        if(P.hp>0 && E.hp>0 && e.blk && T.counter){ const c = strike(P,E,.5+.15*T.counter,true); c.tech = "Protiúder"; push(c); }
        if(P.hp>0 && T.laststand && !s.last && P.hp < P.max*.3){ s.last = true; const h = Math.round(P.max*.1); P.hp += h; push({p:true, dmg:0, heal:h, tech:"Poslední vzdor"}); }
        if(P.hp>0 && T.mantra && !s.mantra && P.hp < P.max*.4){ s.mantra = true; const h = Math.round(Math.min(P.max-P.hp, P.max*(.2+.08*T.mantra))); P.hp += h; push({p:true, dmg:0, heal:h, tech:"Léčivá mantra"}); }
      }
      if(P.hp>0 && E.hp>0 && tr==="heavy" && !s.chg && s.eAtk%4===3){ s.chg = true; push({p:false, dmg:0, tech:"Nabírá sílu", chg:1}); }
    }
    round++;
  }
  return {win: E.hp<=0, log, ev, ph0, eh0, tr};
}
function battle(E, rewards){ // spustí boj a aplikuje odměny/tresty
  const e0 = env();
  if(e0.night && ["exp","dun","camp"].includes(rewards.k)){ E.hp = E.max = Math.round(E.max*1.15); E.atk *= 1.15; }   // noc: silnější divočina
  E.atk *= 1-bon("weak");
  const P = myFighter(), res = fight(P, E, rewards.cap);
  ANIM = {pn:P.name, en:E.name, ei:E.ico||"👹", pm:P.max, em:E.max, ph0:res.ph0, eh0:res.eh0, ev:res.ev, win:res.win, txt:"", pet:P.comp&&P.comp.k, tr:res.tr, cls:S.cls};
  S.hp = Math.max(1, Math.round(P.hp)); S.st = S.st||{};
  let txt = res.log.slice(-6).join("\n")+"\n"; const L0 = txt.length;
  if(rewards.wb) return wbResult(res, E, txt, L0);
  if(res.win){
    S.q=S.q||{}; S.q.win=(S.q.win||0)+1; if(rewards.k) S.q[rewards.k]=(S.q[rewards.k]||0)+1;
    if(rewards.k && rewards.k!=="arena"){ S.best = S.best||{}; S.best[E.name] = 1; }
    S.st.win=(S.st.win||0)+1; if(rewards.k) S.st[rewards.k]=(S.st[rewards.k]||0)+1;
    const b0 = 1 + clanBonus() + (mount()?0.2:0) + bon("gx");
    const g = Math.round(R(...rewards.g)*(b0+bon("gold"))), xp = Math.round(rewards.xp*(b0+bon("xp")));
    S.gold += g; S.fame += rewards.fame||2;
    txt += `<span class="win">✅ Vítězství! +${fmt(g)} zlata, +${fmt(xp)} XP</span>`;
    if(rewards.ryo){ const r = Math.round(rewards.ryo*(1+bon("ryo"))); S.ryo += r; txt += `, +${r} Rjō`; }
    txt += gainXp(xp);
    if(S.cls==="monk"){ const k = 0.1+bon("pray"); S.hp = Math.min(maxHp(), S.hp + maxHp()*k); txt += `\n🙏 Mnich se pomodlil (+${Math.round(k*100)} % HP).`; }
    const dc = (rewards.dropCh||0.4)*(1+bon("drop"));
    if(rewards.loot && S.inv.length<20 && Math.random() < dc){ const it = rollLoot(rewards.loot); S.inv.push(it); txt += `\n🎁 Kořist: ${it.n}`; }
    if(rewards.loot && S.inv.length<20 && Math.random()<0.8){ const J=junkFor(rewards.loot), j=J[R(0,J.length-1)]; S.inv.push(mk({...j,s:"junk"})); txt += `\n🧺 Nalezeno: ${j.n} (hodnota ${j.sv})`; }
    if(rewards.gem && Math.random() < rewards.gem*(1+bon("drop"))){ const id = rollGem(rewards.gl||S.lvl); addGem(id); txt += `\nDrahokam: ${gemName(id)}`; }
    txt += petGain(rewards.k==="dun"||rewards.k==="camp"?2:1);
    txt += clanWin();
  } else {
    const lost = Math.round(S.gold*0.05); S.gold -= lost;
    txt += `<span class="lose">❌ Porážka. Ztrácíš ${fmt(lost)} zlata. Odpočiň si nebo se vyléč.</span>`;
  }
  ANIM.txt = txt.slice(L0).trim(); return txt;
}
function wbResult(res, E, txt, L0){
  const w = S.wb, dealt = Math.max(0, Math.round(res.eh0 - Math.max(0,E.hp))), frac = dealt/w.pool;
  w.dmg = Math.min(w.pool, w.dmg+dealt); w.tries++;
  const b0 = 1 + clanBonus() + bon("gx"), g = Math.round((S.lvl*10 + S.lvl*S.lvl*8*frac)*(b0+bon("gold"))), xp = Math.round((S.lvl*5 + S.lvl*S.lvl*5*frac)*(b0+bon("xp")));
  S.gold += g; txt += `<span class="win">Způsobeno ${fmt(dealt)} poškození (${Math.round(frac*100)} % síly bosse): +${fmt(g)} zlata, +${fmt(xp)} XP</span>`+gainXp(xp);
  [.25,.5,.75,1].forEach((m,i)=>{ if(!w.got[i] && w.dmg >= w.pool*m-0.5){ w.got[i] = 1; const r = Math.round([3,5,8,15][i]*(1+bon("ryo"))); S.ryo += r;
    txt += `\nTruhla za ${m*100} %: +${r} Rjō`;
    if(i===1||i===3){ const id = rollGem(S.lvl+(i===3?22:0)); addGem(id); txt += ` a ${gemName(id)}`; }
    if(i===3){ S.st.wbk = (S.st.wbk||0)+1; txt += `\n<span class="win">${E.name} je pro dnešek poražen!</span>`; } } });
  txt += petGain(1);
  ANIM.win = w.dmg >= w.pool; if(!ANIM.win) ANIM.vt = S.hp<=1 ? "Ústup" : "Konec kola";
  ANIM.txt = txt.slice(L0).trim(); return txt;
}

function rollLoot(tier){ // drop: předměty z rozmezí úrovní podle tieru lokace
  const mx = tier<=9 ? [5,12,20,26,40,50,60,70,85][tier-1] : tier;   // tier 1–9, nebo přímo level lokace
  const pool = SHOP_GEAR.filter(i=>i.s!=="mount" && (i.l||1)<=mx && (i.l||1)>=mx-12);
  return mk(pool[R(0,pool.length-1)]);
}

/* =====================================================================
   MODUL 5: AKCE HRÁČE (volané z tlačítek přes objekt G)
   ===================================================================== */
const G = {
  tab(t){ tab=t; enter=true; draw(); window.scrollTo({top:0,behavior:"instant"}); },
  grp(g){ grp=g; tab=MENU[g][0][0]; enter=true; draw(); window.scrollTo({top:0,behavior:"instant"}); },
  nav(k){ // spodní navigace na mobilu: char / city / wild / quest / more
    if(k==="quest") tab=k; else if(k==="char") tab=CHARM.some(m=>m[0]===tab)?tab:"char"; else if(k==="more") tab=MORE.some(m=>m[0]===tab)?tab:"clan";
    else { grp=k; if(!MENU[k].some(m=>m[0]===tab)) tab=MENU[k][0][0]; }
    enter=true; draw(); window.scrollTo({top:0,behavior:"instant"}); },
  train(k,n){ const r = trainPlan(k,n==null?1:n); if(!r.k) return say("Nedostatek zlata.");
    S.gold -= r.c; S.base[k] += r.k; say(`Trénink hotov: ${STATN[k]} +${r.k} (nyní ${S.base[k]}) za ${fmt(r.c)} zlata.`); },
  exped(i){ if(S.job) return say("Právě pracuješ."); const e = EXPEDS[i], cost = Math.ceil(e.cost*(mount()?0.7:1));
    if(S.lvl<e.lvl) return say("Příliš nízký level."); if(S.energy<cost) return say("Nedostatek energie.");
    if(S.hp<10) return say("Jsi příliš zraněn.");
    S.energy-=cost; say(battle(npcFor(1,"Nepřítel")&&{name:e.n.replace(/^\S+ /,""),ico:e.i,hp:e.hp,max:e.hp,atk:e.atk,def:e.def,dex:8,crit:8}, {g:e.g,xp:e.xp,loot:e.loot,fame:2,k:"exp"})); },
  arena(lvl,name){ const ec = arenaCost(); if(S.job) return say("Právě pracuješ."); if(S.energy<ec) return say(`Nedostatek energie (${ec}).`); if(S.hp<10) return say("Jsi příliš zraněn.");
    S.energy-=ec; const L=Math.max(1,lvl); say(battle(npcFor(L,name), {g:[Math.max(6,L*L),Math.max(12,L*L*2)],xp:Math.max(12,L*L),fame:5,loot:0,k:"arena"})); },
  dungeon(i){ if(S.job) return say("Právě pracuješ."); const d = DUNGEONS[i];
    if(S.lvl<d.lvl) return say("Příliš nízký level."); if(S.energy<d.cost) return say("Nedostatek energie.");
    if(S.hp<S.lvl*5) return say("Jsi příliš zraněn – vyléč se.");
    S.energy-=d.cost; const txt = battle({name:d.n.replace(/^\S+ /,""),ico:d.i,hp:d.hp,max:d.hp,atk:d.atk,def:d.def,dex:10+d.lvl*.5,crit:10}, {g:d.g,xp:d.xp,ryo:d.ryo,loot:d.loot,fame:15,dropCh:0.8,gem:0.35,gl:d.lvl,cap:120,k:"dun"});
    if(ANIM.win && d.lvl>=300) S.st.d300 = (S.st.d300||0)+1; say(txt); },
  buy(list,i){ const it = (list==="gear"?SHOP_GEAR:SHOP_USE)[i];
    if(it.r){ if(S.ryo<it.r) return say("Nedostatek Rjō."); S.ryo-=it.r; } else { if(S.gold<it.p) return say("Nedostatek zlata."); S.gold-=it.p; }
    if(it.s==="mount"){ S.eq.mount = mk(it); say(`Získal jsi: ${it.n}. Výpravy jsou levnější a výnosnější.`); }
    else { const st = it.s==="use" && S.inv.find(x=>x.n===it.n); if(st){ st.q=(st.q||1)+1; return say(`Koupeno: ${it.n} (${st.q}×)`); }
      if(S.inv.length>=20){ if(it.r) S.ryo+=it.r; else S.gold+=it.p; return say("Inventář je plný."); } S.inv.push(mk(it)); say(`Koupeno: ${it.n}`); } },
  use(id){ const k = S.inv.findIndex(x=>x.id===id), it = S.inv[k];
    if(it.heal) S.hp = Math.min(maxHp(), S.hp+it.heal);
    if(it.en) S.energy = Math.min(maxEn(), S.energy+it.en);
    if((it.q||1)>1) it.q--; else S.inv.splice(k,1); say(`Použito: ${it.n}`); },
  equip(id){ const k = S.inv.findIndex(x=>x.id===id), it = S.inv[k];
    if((it.l||1)>S.lvl) return say(`Potřebuješ level ${it.l}.`); const old = S.eq[it.s]; S.eq[it.s] = it; S.inv.splice(k,1); if(old) S.inv.push(old); say(`Nasazeno: ${it.n}`); },
  unequip(s){ if(S.inv.length>=20) return say("Inventář je plný."); S.inv.push(S.eq[s]); delete S.eq[s]; say("Sundáno."); },
  sell(id){ const k = S.inv.findIndex(x=>x.id===id), it = S.inv[k], v = sellVal(it);
    S.gold+=v; S.inv.splice(k,1); say(`Prodáno ${it.n} za ${v} zlata.`); },
  makeClan(){ const n = ($("#cn").value||"").trim(); if(!n) return say("Zadej název klanu."); if(S.gold<300) return say("Založení stojí 300 zlata.");
    S.gold-=300; S.clan={name:n,treasury:0,own:true,xp:0,b:{}}; say(`Klan ${n} byl založen.`); },
  joinClan(n){ S.clan={name:n,treasury:0,xp:0,b:{}}; say(`Vstoupil jsi do klanu ${n}.`); },
  clanBuild(k){ const X = CLAN_B[k], lv = clanB(k), c = X.c(lv); if(!S.clan) return;
    if(lv>=CLAN_MAX) return say("Budova je na maximu."); if(S.clan.treasury<c) return say(`Pokladnice potřebuje ${fmt(c)} zlata.`);
    S.clan.treasury -= c; S.clan.b = S.clan.b||{}; S.clan.b[k] = lv+1; say(`Postavena budova: ${X.n}, úroveň ${lv+1}.`); },
  petSkill(br){ const p = pet(); if(!p) return; p.sp = p.sp||{pow:0,sup:0}; if(petAvail()<1) return say("Nemáš volný bod schopnosti."); p.sp[br]++; say("Schopnost společníka zvýšena."); },
  leaveClan(){ S.clan=null; say("Opustil jsi klan."); },
  donate(a){ if(S.gold<a) return say("Nedostatek zlata."); S.gold-=a; S.clan.treasury+=a; S.clan.xp=(S.clan.xp||0)+Math.round(a/20); say(`Do pokladnice vloženo ${a} zlata.`); },
  sellJunk(){ const j = S.inv.filter(x=>x.s==="junk"); if(!j.length) return say("Žádná kořist k prodeji.");
    const v = j.reduce((t,x)=>t+x.sv,0); S.inv = S.inv.filter(x=>x.s!=="junk"); S.gold += v; say(`Prodáno ${j.length} kusů kořisti za ${v} zlata.`); },
  refreshShop(){ if(S.gold<25) return say("Nová nabídka stojí 25 zlata."); S.gold-=25; rollShop(); say("Obchodníci přinesli nové zboží."); },
  work(i){ const j = JOBS[i]; if(S.job) return say("Už pracuješ."); if(S.lvl<j.lvl) return say("Příliš nízký level.");
    S.job = {i, end: Date.now()+j.h*3600000}; say(`Začal jsi pracovat: ${j.n}. Vrať se za ${j.h} h.`); },
  collect(){ if(!S.job||Date.now()<S.job.end) return say("Práce ještě neskončila."); const j = JOBS[S.job.i];
    const g = Math.round(jobG(j)*(1+clanBonus())), x = jobX(j); S.gold+=g; S.job=null; S.q=S.q||{}; S.q.work=(S.q.work||0)+1; say(`<span class="win">⚒️ Práce hotova: +${fmt(g)} zlata, +${fmt(x)} XP</span>`+gainXp(x)); },
  quitJob(){ ask("Zrušit práci? Odměnu nedostaneš.","Zrušit práci",()=>{ S.job=null; say("Práce zrušena."); }); },
  tower(){ if(S.job) return say("Právě pracuješ."); if(S.energy<30) return say("Nedostatek energie (30)."); if(S.hp<S.lvl*5) return say("Jsi příliš zraněn.");
    const f=(S.tw||0)+1, bs=f%10===0, k=bs?1.5:1; S.energy-=30;
    const E=towerEnemy(f);
    const txt=battle(E,{g:towerGold(f),xp:towerXp(f),ryo:bs?Math.round(5+f/2):0,loot:f>=85?Math.min(f,S.lvl+5):Math.min(9,5+Math.floor(f/10)),fame:Math.ceil(f/2),dropCh:bs?0.9:0.15,gem:bs?1:0,gl:S.lvl,k:"tw"});
    if(ANIM.win) S.tw=f; say(txt); },
  claim(i){ const x=QUESTS[i]; S.q=S.q||{}; if((S.q[x.k]||0)<x.need) return say("Úkol ještě není hotový."); S.q[x.k]-=x.need;
    const g=S.lvl*150*x.m; S.gold+=g; S.ryo+=x.m*2; say(`📋 Úkol splněn: +${g} zlata, +${x.m*2} Rjō`+gainXp(S.lvl*40*x.m)); },
  daily(){ const t=new Date().toDateString(); if(S.daily===t) return say("Dnešní dar už máš."); S.daily=t; const g=S.lvl*300;
    S.gold+=g; S.ryo+=5; S.energy=maxEn(); S.hp=maxHp(); say(`🎁 Denní dar: +${g} zlata, +5 Rjō, plná energie i HP.`); },
  buyScroll(n){ let k = 0, c = 0; n = n||1;
    while(k<n){ const p = scrollCost(); if(S.ryo<p) break; S.ryo -= p; S.eb = (S.eb||0)+10; c += p; k++; }
    if(!k) return say("Nedostatek Rjō."); say(`Svitky vytrvalosti: ${k}× za ${c} Rjō, max energie +${k*10} (celkem +${S.eb}).`); },
  reset(){ ask("Opravdu smazat postavu? Smaže se i uložení na tvém účtu. Poslední stav zůstane jako záloha v tomto prohlížeči.","Smazat postavu",()=>{ backupLocal(S); localStorage.removeItem(SAVE_KEY); if(CLOUD.ref) CLOUD.ref.delete().catch(()=>{}); S=null; draw(); }); },
  useSave(k){ const c = PEND; PEND = null; closeModal(); if(!c) return;
    if(k==="cloud"){ backupLocal(S); S = c; try{ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }catch(e){} draw(); toast("Načtena postava z účtu."); }
    else { backupLocal(c); CLOUD.dirty = true; cloudFlush(); draw(); toast("Ponechána postava z tohoto zařízení."); } },
  copyCode(){ const t = $("#expc"); if(!t) return; t.select(); const ok = () => toast("Kód zkopírován. Ulož si ho do poznámek.");
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t.value).then(ok, ()=>{ document.execCommand("copy"); ok(); }); else { document.execCommand("copy"); ok(); } },
  importCode(){ const o = parseCode(($("#impc")||{}).value); if(!o) return say("Kód zálohy je neplatný. Zkopíruj ho celý, včetně začátku SAKURA1:.");
    const go = () => { if(S) backupLocal(S); S = o; S.ts = Date.now(); save(); tab = "char"; draw(); say(`Záloha načtena: ${S.name}, level ${S.lvl}.`); };
    if(S) ask(`Nahradit postavu ${S.name} (level ${S.lvl}) postavou ${o.name} (level ${o.lvl}) ze zálohy? Současný stav zůstane jako záloha v tomto prohlížeči.`,"Načíst zálohu",go); else go(); },
  create(cls){ NM = $("#nm").value.trim(); CR = {name:NM||"Bezejmenný", cls, race:"human", look:defLook(cls)}; draw(); window.scrollTo({top:0,behavior:"instant"}); },
  back(){ CR = null; draw(); window.scrollTo({top:0,behavior:"instant"}); },
  begin(){ const c = CR; CR = null; newGame(c.name, c.cls); S.race = c.race; S.look = c.look; S.hp = maxHp(); S.energy = maxEn(); tab = "char"; enter = true; save(); say("Tvá legenda začíná."); window.scrollTo({top:0,behavior:"instant"}); },
  lk(k,i){ const t = S || CR; if(!t) return; t.look = t.look || defLook(t.cls); t.look[k] = i; if(S) save(); redraw(); },
  rndLook(){ const t = S || CR; if(!t) return; const L = {}; Object.entries(LOOK).forEach(([k,o])=>L[k]=R(0,o.v.length-1));
    if(Math.random()<.6) L.head = 0; if(Math.random()<.4) L.beard = 0; if(Math.random()<.6) L.scar = 0; if(L.skin>4 && Math.random()<.6) L.skin = R(0,4);
    t.look = L; if(S) save(); redraw(); },
  race(r){ if(!S){ CR.race = r; return redraw(); }
    if(S.race===r) return; const first = !S.race;
    if(!first){ if(S.ryo<30) return say("Obřad znovuzrození stojí 30 Rjō.");
      if(!G._rc) return ask(`Obřadem znovuzrození změníš rod na ${RACES[r].n} za 30 Rjō. Pokračovat?`,"Provést obřad",()=>{ G._rc = 1; G.race(r); G._rc = 0; }); S.ryo -= 30; }
    S.race = r; S.hp = Math.min(S.hp, maxHp()); S.energy = Math.min(S.energy, maxEn());
    const y = window.scrollY; say(`${first?"Tvůj rod":"Znovuzrozen jako"}: ${RACES[r].n}. ${RACES[r].pas}.`); window.scrollTo(0,y); }
};
// ---- hromadné nákupy: plán (kolik kusů a za kolik) pro zobrazení i akci ----
function trainPlan(k,n){ let b = S.base[k], c = 0, i = 0; const lim = n>0 ? n : 1e5;
  while(i<lim){ const p = Math.round(Math.pow(b,1.6)*(1-0.03*clanB("dojo"))); if(c+p>S.gold) break; c += p; b++; i++; } return {k:i, c}; }
const scrollCost = () => 5+Math.floor((S.eb||0)/10)*3;
function petPlan(){ const p = pet(); if(!p) return 0; let l = p.lvl, x = p.xp, k = 0; const c = S.lvl*40;
  while(l<30 && (k+1)*c<=S.gold){ k++; x += 4; while(l<30 && x>=l*8){ x -= l*8; l++; } } return k; }
const bq = a => `<div class="bq">${a.join("")}</div>`;   // skupina tlačítek ×1 / ×10 / Max
// ---- akce nových systémů ----
function story(title, who, kj2, text, act){   // okno s dialogem postavy
  M = {src:"story"};
  $("#modal").innerHTML = deco(`<div class="mback" onclick="closeModal()"></div><div class="mcard story"><div class="sthead"><div class="hanko">${kj2}</div><div><b>${who}</b><small>${title}</small></div></div><p class="sttext">${text}</p><div class="macts">${act}</div><button class="x" onclick="closeModal()" aria-label="Zavřít">×</button></div>`);
  $("#modal").classList.add("open"); lockSync();
}
Object.assign(G, {
  skUpN(id,cnt){ const n = skNodes().find(x=>x.id===id), r = skR(id), k = Math.min(cnt, n.max-r, skTot()-skSpent()); if(k<1) return G.skUp(id);
    if(n.lvl && S.lvl<n.lvl) return say(`Potřebuješ level ${n.lvl}.`); S.sk = S.sk||{}; S.sk[id] = r+k; say(`Naučeno: ${n.n} +${k} (${r+k}/${n.max}).`); },
  skUp(id){ const b = skBranches().find(x=>x.nodes.some(n=>n.id===id)), i = b.nodes.findIndex(n=>n.id===id), n = b.nodes[i], r = skR(id);
    if(r>=n.max) return say("Tuto dovednost už ovládáš dokonale."); if(skSpent()>=skTot()) return say("Nemáš volný bod dovednosti. Další získáš na příštím sudém levelu.");
    if(n.lvl && S.lvl<n.lvl) return say(`Potřebuješ level ${n.lvl}.`); if(!b.free && i>0 && !skR(b.nodes[i-1].id)) return say("Nejdřív se nauč předchozí dovednost této cesty.");
    S.sk = S.sk||{}; S.sk[id] = r+1; say(`Naučeno: ${n.n} (${r+1}/${n.max}).`); },
  skReset(){ if(!skSpent()) return; if(S.ryo<20) return say("Zapomenutí stojí 20 Rjō.");
    ask("Zapomenout všechny dovednosti za 20 Rjō? Body se vrátí.","Zapomenout",()=>{ S.ryo -= 20; S.sk = {}; say("Mysl je čistá. Všechny body dovedností jsou volné."); }); },
  gemPick(slot,i){ const have = Object.entries(S.gems||{}).filter(([,c])=>c>0).sort((a,b)=>gemG(b[0])-gemG(a[0]));
    if(!have.length) return say("Nemáš žádné drahokamy. Kup je níže, nebo je získej v dungeonech, kampani a od světového bosse.");
    M = {src:"pick"};
    $("#modal").innerHTML = deco(`<div class="mback" onclick="closeModal()"></div><div class="mcard"><h4 class="mtitle">Vložit drahokam</h4><p class="mut" style="margin:4px 0 14px">${S.eq[slot].n} · slot ${i+1}</p><div class="gpicks">`+
      have.map(([id,c])=>`<button class="gpick" onclick="G.gemIn('${slot}',${i},'${id}')">${gemIco(id)}<span><b>${gemName(id)}</b><small>${gemTxt(id)}</small></span><em>${c}×</em></button>`).join("")+
      `</div><button class="x" onclick="closeModal()" aria-label="Zavřít">×</button></div>`);
    $("#modal").classList.add("open"); lockSync(); },
  gemIn(slot,i,id){ const it = S.eq[slot]; if(!it || !(S.gems||{})[id]) return closeModal(); it.g = it.g||[]; if(it.g[i]) return closeModal();
    S.gems[id]--; if(!S.gems[id]) delete S.gems[id]; it.g[i] = id; closeModal(); say(`Vsazeno: ${gemName(id)} do ${it.n} (${gemTxt(id)}).`); },
  gemOut(slot,i){ const it = S.eq[slot], id = it && (it.g||[])[i]; if(!id) return; const c = 50*gemG(id)*gemG(id);
    if(S.gold<c) return say(`Vyjmutí stojí ${c} zlata.`);
    ask(`Vyjmout ${gemName(id)} za ${c} zlata? Drahokam se vrátí do váčku.`,"Vyjmout",()=>{ S.gold -= c; it.g[i] = null; addGem(id); say(`Vyjmuto: ${gemName(id)}.`); }); },
  gemMerge(id){ const g = gemG(id), c = mergeCost(g); if(g>=10 || ((S.gems||{})[id]||0)<3) return; if(S.gold<c) return say(`Spojení stojí ${c} zlata.`);
    S.gold -= c; S.gems[id] -= 3; if(!S.gems[id]) delete S.gems[id]; const nid = id.split(":")[0]+":"+(g+1); addGem(nid);
    S.st = S.st||{}; if(g+1===5) S.st.g5 = (S.st.g5||0)+1; if(g+1===10) S.st.g10 = (S.st.g10||0)+1; say(`Klenotník spojil tři kameny: ${gemName(nid)}.`); },
  gemBuy(t,n){ n = Math.min(n||1, Math.floor(S.ryo/4)); if(n<1) return say("Úlomek stojí 4 Rjō.");
    S.ryo -= 4*n; S.gems = S.gems||{}; S.gems[t+":1"] = (S.gems[t+":1"]||0)+n; say(`Koupeno: ${GEMS[t].n} I ×${n} za ${4*n} Rjō.`); },
  gemBuyMax(t){ const n = Math.floor(S.ryo/4); if(n<1) return say("Úlomek stojí 4 Rjō.");
    ask(`Koupit ${n}× ${GEMS[t].n} I za ${4*n} Rjō? Utratíš téměř všechny Rjō.`,`Koupit ${n}×`,()=>G.gemBuy(t,n)); },
  gemMergeAll(t){ let k = 0, c = 0; S.gems = S.gems||{};
    for(let g=1; g<10; g++){ const id = t+":"+g;
      while((S.gems[id]||0)>=3){ const p = mergeCost(g); if(S.gold<p) break; S.gold -= p; c += p; S.gems[id] -= 3; k++; addGem(t+":"+(g+1));
        S.st = S.st||{}; if(g+1===5) S.st.g5 = (S.st.g5||0)+1; if(g+1===10) S.st.g10 = (S.st.g10||0)+1; }
      if(!S.gems[id]) delete S.gems[id]; }
    if(!k) return say("Není co spojit, nebo chybí zlato.");
    const hi = Math.max(...Object.keys(S.gems).filter(x=>x.startsWith(t+":")).map(gemG));
    say(`Klenotník provedl ${k} spojení za ${fmt(c)} zlata. Nejvyšší ${GEMS[t].n}: ${ROM[hi-1]}.`); },
  buyAmul(n){ n = Math.min(n||1, Math.floor(S.ryo/6)); if(n<1) return say("Amulet stojí 6 Rjō."); S.ryo -= 6*n; S.amul = (S.amul||0)+n; say(`Amulety ochrany ×${n} za ${6*n} Rjō (máš ${S.amul}).`); },
  frame(k){ const f = FRAMES.find(x=>x.k===k); if(!f) return;
    if(!frOwn(f)){ if(!f.r) return say(`Rámeček ${f.n} se odemkne: ${f.d}.`); if(S.ryo<f.r) return say(`Rámeček stojí ${f.r} Rjō.`);
      return ask(`Koupit ${f.n.toLowerCase()} rámeček za ${f.r} Rjō?`,"Koupit",()=>{ S.ryo -= f.r; S.frames = [...(S.frames||[]),k]; S.frame = k; say(`Zakoupen a nasazen ${f.n.toLowerCase()} rámeček.`); }); }
    S.frame = k; say(k==="none"?"Rámeček sundán.":`Nasazen ${f.n.toLowerCase()} rámeček.`); },
  wellPick(src,key){ WS = {src,key}; closeModal(); if(tab!=="well") G.tab("well"); else redraw(); },
  wellLock(i){ const it = WS && resolve(WS.src,WS.key); if(!enchOk(it) || !(it.ench||[])[i]) return; it.el = it.el||[];
    const k = it.el.indexOf(i); if(k>=0) it.el.splice(k,1); else if(it.el.length < enchSlots(it)-1) it.el.push(i); else return say("Aspoň jedna vlastnost musí zůstat odemčená.");
    save(); redraw(); },
  enchant(){ const it = WS && resolve(WS.src,WS.key); if(!enchOk(it)) return say("Vyber předmět.");
    const c = enchCost(it), n = enchSlots(it), cur = it.ench||[], lk = (it.el||[]).filter(i=>cur[i]);
    if(S.ryo<c.r) return say(`Nedostatek Rjō (potřebuješ ${c.r}).`); if(S.gold<c.g) return say("Nedostatek zlata.");
    S.ryo -= c.r; S.gold -= c.g; const used = new Set(lk.map(i=>cur[i].k)), out = []; WFRESH = [];
    for(let i=0;i<n;i++){ if(lk.includes(i)){ out.push(cur[i]); continue; } const r = rollEnch(it,used); used.add(r.k); out.push(r); WFRESH.push(i); }
    it.ench = out; it.el = lk; S.st = S.st||{}; S.st.ench = (S.st.ench||0)+1;
    const pf = WFRESH.filter(i=>out[i].q>=.95).map(i=>enchTxt(out[i]));
    say(`Studna očarovala ${it.n}.`+(pf.length?`\n<span class="win">Dokonalá vlastnost: ${pf.join(", ")}</span>`:"")); },
  forge(where,id,am){ const it = where==="eq" ? S.eq[id] : S.inv.find(x=>x.id===id); if(!it) return;
    const cost = forgeCost(it), t = (it.u||0)+1, ch = forgeCh(t);
    if(it.u>=10) return say("Maximální vylepšení +10."); if(S.gold<cost) return say("Nedostatek zlata.");
    S.gold -= cost;
    if(Math.random()*100 < ch){ it.u = t; return say(`Kovář vylepšil ${it.n} na +${it.u}.`); }
    if(am && (S.amul||0)>0){ S.amul--; return say(`Vylepšení selhalo, ale amulet ochrany udržel ${it.n} na +${it.u}.`); }
    it.u = Math.max(0,it.u-1); say(`<span class="lose">Vylepšení selhalo! ${it.n} kleslo na +${it.u}.</span>`); },
  camp(){ const c = Math.floor((S.camp||0)/4), s = (S.camp||0)%4; if(c>=CAMP.length) return say("Kampaň je dokončena.");
    const C = CAMP[c]; if(S.lvl<C.lvl) return say(`Kapitola ${c+1} se otevře na levelu ${C.lvl}.`);
    story(`Kapitola ${c+1} · ${C.n}`, C.who[0], C.who[1], C.st[s][2], btn(s===3?"Postavit se bossovi":"Do boje","G.campGo()")+btn("Později","closeModal()",0,"alt")); },
  campGo(){ closeModal(); const c = Math.floor((S.camp||0)/4), s = (S.camp||0)%4, cost = s===3?30:15; if(c>=CAMP.length) return;
    if(S.job) return say("Právě pracuješ."); if(S.energy<cost) return say(`Nedostatek energie (${cost}).`); if(S.hp<S.lvl*3) return say("Jsi příliš zraněn – vyléč se.");
    S.energy -= cost; const L = campLvl(c,s), B = s===3;
    let txt = battle(campEnemy(c,s), {g:[Math.max(25,Math.round(L*L*1.5*(B?3:1))),Math.max(50,Math.round(L*L*2.5*(B?3:1)))], xp:Math.max(30,Math.round(L*L*(B?4:1.5))),
      fame:B?20:6, loot:lootTier(L), dropCh:B?.9:.3, gem:B?1:.1, gl:L+(B?10:0), ryo:B?10+c*10:0, k:"camp"});
    if(ANIM.win){ S.camp = (S.camp||0)+1; if(B){ const e = `\n<b>Kapitola ${c+1} dokončena.</b> ${CAMP[c].end}`; txt += e; ANIM.txt += e; } }
    say(txt); },
  wboss(){ const w = wbState(); if(w.dmg>=w.pool) return say("Dnešní démon je poražen. Nový přijde zítra.");
    if(w.tries>=3) return say("Dnešní tři pokusy jsou vyčerpány. Nový démon přijde zítra.");
    if(S.job) return say("Právě pracuješ."); if(S.energy<20) return say("Nedostatek energie (20)."); if(S.hp<maxHp()*.3) return say("Jsi příliš zraněn – vyléč se.");
    S.energy -= 20; say(battle(wbEnemy(), {wb:1, cap:24, k:"wb"})); },
  seasonExp(){ const e = env(), X = SEAS_EXP[e.se], d = dayN(); S.sxd = S.sxd && S.sxd.day===d ? S.sxd : {day:d,n:0};
    if(S.sxd.n>=5) return say("Sezónní výpravu lze dnes podniknout jen pětkrát."); if(S.job) return say("Právě pracuješ.");
    if(S.energy<25) return say("Nedostatek energie (25)."); if(S.hp<10) return say("Jsi příliš zraněn.");
    S.energy -= 25; S.sxd.n++; const L = S.lvl+3, E = seasonE();
    say(battle(E, {g:[Math.round(L*L*1.5),L*L*3], xp:Math.round(L*L*1.5), fame:3, loot:lootTier(S.lvl), gem:.3, gl:S.lvl, k:"exp"})); },
  petAdopt(k){ S.pets = S.pets||{};
    if(!S.pets[k]){ const paid = Object.keys(S.pets).length>0; if(paid){ if(S.ryo<15) return say("Adopce stojí 15 Rjō."); S.ryo -= 15; } S.pets[k] = {lvl:1,xp:0}; }
    S.pet = k; say(`${PETS[k].n} je teď tvým společníkem.`); },
  petFeed(n){ const p = pet(), c = S.lvl*40; if(!p) return; if(p.lvl>=30) return say("Společník je na nejvyšším levelu."); if(S.gold<c) return say("Nedostatek zlata.");
    const l0 = p.lvl; let k = 0; n = n||1;
    while(k<n && p.lvl<30 && S.gold>=c){ S.gold -= c; petGain(4); k++; }
    say(`${PETS[S.pet].n} snědl ${k}× (−${fmt(k*c)} zlata)`+(p.lvl>l0?`, level ${l0} → ${p.lvl}.`:`, +${k*4} zkušeností.`)); },
  title(id){ S.title = S.title===id ? null : id; say(S.title ? `Nosíš titul: ${titleN()}.` : "Titul sundán."); }
});

const $ = s => document.querySelector(s);
let WS = null, WFRESH = []; // WS = předmět vybraný ve studni, WFRESH = právě očarované pozice
let CR = null, NM = ""; // CR = rozpracovaná postava při tvorbě (rod a podoba), NM = zadané jméno
function redraw(){ const y = window.scrollY; draw(); window.scrollTo(0,y); }
let ANIM = null, busy = false; // ANIM = data posledního souboje, busy = běží animace souboje
const SPRITE = {samurai:"侍", ninja:"忍", monk:"僧"}; // znak třídy = pečeť postavy
const HUE = {samurai:8, ninja:262, monk:36};

/* =====================================================================
   SYMBOLY: emoji z dat se v rozhraní nahrazují znaky kandži (jednotný, důstojný vzhled)
   ===================================================================== */
const KJ = {"🤺":"侍","🥷":"忍","🧘":"僧","👤":"影","👹":"鬼","🦹":"賊","👻":"霊","🐺":"狼","🏴‍☠️":"海","👺":"狗","🔥":"炎","🌠":"星","🐅":"虎","❄️":"雪","🌙":"月","🐙":"蛸","⚡":"雷","🪐":"界","🐉":"龍","🐲":"龍","🕷️":"蜘","🦊":"狐","💀":"屍","🌞":"天","🐍":"蛇","😈":"魔","🌩️":"雷","🥀":"冥","👑":"帝",
 "🌲":"森","⛩️":"社","🏔️":"山","🏯":"城","🌊":"海","🎋":"竹","🌋":"火","🏰":"宮","🌌":"空","🌑":"闇","🌀":"渦","☠️":"死","☄️":"彗","🌸":"桜","🗼":"塔","🌾":"米","🚪":"門","🔨":"鎚","🐎":"馬"};
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}️‍]/gu;
const kj = e => KJ[e] || (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(e) ? "◆" : e);
const COIN = '<i class="coin"></i>', RYO = '<i class="coin ryo"></i>';
const deco = t => String(t).replace(/💰/g,COIN).replace(/🔴/g,RYO).replace(EMOJI_RE,""); // zlato/Rjō = mince, ostatní emoji pryč
// Znaky předmětů podle názvu (první shoda), jinak podle slotu
const ICONS = [[/Hůl|Bo hůl|Kongó|Šakudžó/,"杖"],[/Gohei|perla|perly/,"珠"],[/Wakizashi|Katana|Tači|Muramasa|Kusanagi/,"刀"],[/Úlomek/,"剣"],[/Shuriken/,"針"],[/Kunai|nůž/,"刃"],[/Kusarigama|Kama/,"鎖"],[/Vějíř/,"扇"],
 [/Kimono/,"衣"],[/zbroj|Dó-maru|jóroi/i,"鎧"],[/Kasa/,"笠"],[/Kabuto|Přilba/,"兜"],[/maska|Rozlomená|Lakovaná/i,"面"],[/Omamori|Nefritový|Talisman/,"守"],[/Magatama|nefrit/i,"玉"],[/prsten/,"輪"],
 [/kůň/,"馬"],[/vlk/,"狼"],[/lektvar|elixír|nektar/i,"薬"],[/koláček|Onigiri/,"飯"],[/Hostina/,"膳"],[/váček/,"袋"],[/opasek/,"帯"],[/lucerna/,"灯"],[/ofuda|svitek/i,"札"],[/křišťál|Ledový/,"晶"],[/kožešina/,"毛"],[/roh|paroh/,"角"],[/ocas/,"尾"],[/šupina/,"鱗"],
 [/Hvězdný/,"星"],[/dráp/,"爪"],[/blesk/,"雷"],[/oko/,"眼"],[/Pero/,"羽"],[/pečeť/,"印"]];
const SLOTKJ = {weapon:"刀",armor:"鎧",head:"兜",acc:"守",mount:"馬",use:"薬",junk:"品"};
const SLOTN = {weapon:"Zbraň",armor:"Zbroj",head:"Hlava",acc:"Doplněk",mount:"Zvíře"};
const TYPE_NAME = {weapon:"Zbraň",armor:"Zbroj",head:"Pokrývka hlavy",acc:"Doplněk",mount:"Jezdecké zvíře",use:"Spotřební předmět",junk:"Kořist"};
const ICN={"sword": "M20 4l-9.5 9.5M17 4h3v3M7.5 12.5l4 4M10 15l-5 5", "armor": "M8 4l4 2 4-2 4 3-2 4-2-1v9H8v-9l-2 1-2-4z", "helmet": "M4 16a8 8 0 0116 0v2H4zM12 4v3M8 18v2M16 18v2", "ring": "M12 20a6 6 0 100-12 6 6 0 000 12zM9.5 4h5l1 3h-7z", "horse": "M6 4v8a6 6 0 0012 0V4M6 8h3M15 8h3M6 12h3M15 12h3", "potion": "M9 3h6M10 3v5l-5 9a3 3 0 003 4h8a3 3 0 003-4l-5-9V3M7.5 15h9", "bowl": "M3 11h18a9 9 0 01-18 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4", "bag": "M6 8h12l1 12H5zM9 8V6a3 3 0 016 0v2", "scroll": "M7 4h11v13a3 3 0 01-3 3H7a3 3 0 003-3V6a2 2 0 00-2-2zM11 9h4M11 13h4", "gem": "M12 3l6 5-6 13L6 8zM6 8h12", "staff": "M4 20L15 9M16 3a5 5 0 105 5", "pearl": "M12 20a8 8 0 100-16 8 8 0 000 16zM8.5 9.5a4 4 0 012-2", "shuriken": "M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z", "kunai": "M12 2l3 7-3 6-3-6zM12 15v7M10 20h4", "chain": "M10 14l-2 2a3 3 0 004 4l2-2M14 10l2-2a3 3 0 00-4-4l-2 2M9 15l6-6", "fan": "M12 20L3 8a14 14 0 0118 0zM12 20L8 6M12 20l4-14", "robe": "M8 3l4 4 4-4 4 3-1 14H5L4 6zM12 7v13", "hat": "M2 15L12 5l10 10zM8 15v3h8v-3", "mask": "M4 5h16v8a8 6 0 01-16 0zM8 10h2M14 10h2M9 16h6", "bolt": "M13 2L5 14h6l-1 8 8-12h-6z", "star": "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z", "eye": "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z", "feather": "M20 4C10 4 5 10 5 17l-1 3 3-1c7 0 13-5 13-15zM5 19L14 10", "claw": "M6 20c0-8 4-14 10-16-1 5-3 9-7 12M12 20c0-5 3-9 8-11", "horn": "M6 20c0-8 3-14 12-16-2 6-5 10-9 12z", "tail": "M4 20c8 0 4-8 10-8s2-8 6-8", "scale": "M12 3l8 5v8l-8 5-8-5V8zM12 3v18", "fur": "M5 6l3 3 4-4 4 4 3-3v12H5z", "seal": "M7 4h10v8H7zM5 16h14v4H5z", "person": "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0", "tasks": "M8 4h8v3H8zM6 5H5v16h14V5h-1M9 12h6M9 16h6", "flag": "M5 21V4M5 4h13l-3 4 3 4H5", "trophy": "M8 4h8v5a4 4 0 01-8 0zM8 6H4v2a4 4 0 004 4M16 6h4v2a4 4 0 01-4 4M12 13v4M8 20h8", "swords": "M5 5l14 14M19 5L5 19M3 7l4-4M21 7l-4-4", "shield": "M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z", "dumbbell": "M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12", "hammer": "M14 4l6 6-3 3-6-6zM13 8L4 17l3 3 9-9", "coins": "M12 4c4 0 8 1 8 3s-4 3-8 3-8-1-8-3 4-3 8-3zM4 7v5c0 2 4 3 8 3s8-1 8-3V7M4 12v5c0 2 4 3 8 3s8-1 8-3v-5", "compass": "M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z", "cave": "M4 21V12a8 8 0 0116 0v9M9 21v-6a3 3 0 016 0v6", "tower": "M8 21V9L6 7V3h12v4l-2 2v12M10 21v-4h4v4M10 12h4", "town": "M3 11l9-7 9 7M5 10v11h14V10M10 21v-6h4v6", "mount": "M2 20l7-12 4 6 3-4 6 10z", "more": "M5 12h.01M12 12h.01M19 12h.01", "gift": "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C9 7 8 3 11 3s1 4 1 4zM12 7c3 0 4-4 1-4s-1 4-1 4z", "exit": "M9 21H5V3h4M16 8l4 4-4 4M20 12H9", "well": "M4 9h16M6 9v11h12V9M5 9l7-5 7 5M9 13h6M12 13v3", "flame": "M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-3 2-4 2-7 1 1 2 2 3 2 0-2-1-4 0-6z", "dot": "M12 12h.01"};
const KI={"刀": "sword", "剣": "sword", "針": "shuriken", "刃": "kunai", "鎖": "chain", "扇": "fan", "杖": "staff", "珠": "pearl", "衣": "robe", "鎧": "armor", "笠": "hat", "兜": "helmet", "面": "mask", "守": "ring", "玉": "gem", "輪": "ring", "馬": "horse", "狼": "claw", "薬": "potion", "飯": "bowl", "膳": "bowl", "袋": "bag", "帯": "ring", "灯": "flame", "札": "scroll", "晶": "gem", "毛": "fur", "角": "horn", "尾": "tail", "鱗": "scale", "星": "star", "爪": "claw", "雷": "bolt", "眼": "eye", "羽": "feather", "印": "seal", "品": "bag", "人": "person", "務": "tasks", "族": "flag", "順": "trophy", "闘": "swords", "衛": "shield", "修": "dumbbell", "鍛": "hammer", "古": "coins", "旅": "compass", "洞": "cave", "塔": "tower", "町": "town", "野": "mount", "他": "more", "師": "person", "力": "dumbbell", "速": "bolt", "霊": "flame", "祝": "gift", "巻": "scroll", "旗": "flag", "門": "cave", "庫": "coins", "去": "exit", "影": "mask", "鬼": "mask", "井": "well"};
const gl = g => { const n = paths_ok(g); return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${n==="more"?'<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>':`<path d="${ICN[n]}"/>`}</svg>`; };
const paths_ok = g => ICN[g] ? g : (KI[g] || "mask");   // název ikony, znak kandži, nebo záložní maska
const ico = it => gl((ICONS.find(([r])=>r.test(it.n))||[0,SLOTKJ[it.s]||"品"])[1]);
const rar = it => { const l=it.l||1;
  if(it.sv!==undefined) return it.sv>=4000?"r6":it.sv>=1500?"r5":it.sv>=300?"r4":it.sv>=100?"r3":it.sv>=50?"r2":"r1";   // kořist podle hodnoty
  if(it.s==="mount") return it.r?"r4":"r2";
  if(it.s==="use") return (it.heal>=400||it.en>=130)?"r3":(it.heal>=150||it.en>=70)?"r2":"r1";
  return l>=250?"r8":l>=150?"r7":l>=70?"r6":l>=50?"r5":l>=30?"r4":l>=20?"r3":l>=10?"r2":"r1"; };
const fmt = n => Math.round(n).toLocaleString("cs-CZ");
const fmtS = n => n>=1e6 ? (n/1e6).toLocaleString("cs-CZ",{maximumFractionDigits:1})+" mil." : n>=1e4 ? (n/1e3).toLocaleString("cs-CZ",{maximumFractionDigits:1})+" tis." : fmt(n);   // zkrácené číslo pro horní lištu

/* =====================================================================
   OZNÁMENÍ, LEVEL UP A SOUBOJ
   ===================================================================== */
function say(t){ let nu = [];
  if(S){ S.hp = Math.min(S.hp, maxHp()); S.energy = Math.min(S.energy, maxEn()); nu = checkAch(); if(nu.length) t += "\n"+nu.map(n=>`<span class="win">Nová trofej: ${n}</span>`).join("\n"); }
  logText = t; if(S) save(); draw(); modalSync();
  let m, lv; const re=/Nyní level (\d+)/g; while((m=re.exec(t))) lv=m[1]; if(lv) pendFx=lv;   // oslava level upu
  const fought = !!ANIM; if(ANIM) runAnim();
  PTRO.push(...nu); if(!busy){ flushFx(); if(!fought) toast(t); } }
function toast(t){ const tc=$("#toasts"); while(tc.children.length>=3) tc.firstElementChild.remove(); const d=document.createElement("div"); d.className="toast"; d.innerHTML=deco(String(t).split("\n")[0]).trim(); $("#toasts").appendChild(d); setTimeout(()=>d.remove(),3400); }
let PTRO = [];   // trofeje čekající na konec souboje
function flushFx(){ if(pendFx){ levelFx(pendFx); pendFx=null; } PTRO.splice(0).forEach((n,i)=>setTimeout(()=>toast("Nová trofej: "+n),400+i*600)); }
function levelFx(n){ const d=document.createElement("div"); d.className="lvlfx";
  d.innerHTML=`<div class="lv"><i></i><i></i><b>Level ${n}</b><span>Tvá cesta pokračuje</span></div>`;
  document.body.appendChild(d); setTimeout(()=>d.remove(),2800); }
// bojovník = kruhový žeton se znakem (hráč: třída, soupeř: znak podle emoji z dat)
function fighter(id, g, nm){ return `<div class="fgt" id="${id}"><div class="tok${id==="pf"&&S?frc():" foe"}">${id==="pf"&&S?`<b class="pt">${myPortrait()}</b>`:`<b class="pt">${enemyPortrait(nm||"x",g)}</b>`}</div><span class="fl" id="${id}l"></span></div>`; }
let SPD = 1; // rychlost přehrávání souboje (×1 / ×2 / ×3)
function runAnim(){ // přehraje souboj: výpady, stopy čepele, částice, krit se zábleskem, stavy nad bojovníky, série, průběh boje, zpomalený poslední úder
  const a = ANIM; ANIM = null;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){ toast(a.win?"Vítězství":"Porážka"); return; }
  busy = true; const st = $("#stage"); st.style.display = "flex"; lockSync();
  const TR = a.tr && TRAITS[a.tr];
  const hb = (id,n,r,x) => `<div class="hb ${r?"r":""}"><div class="hname">${n}</div><div class="hbar" id="${id}hb"><i class="gh" id="${id}g"></i><i id="${id}b"></i><span id="${id}t"></span></div><div class="sts" id="${id}s">${x||""}</div></div>`;
  const petals = Array.from({length:7},(_,i)=>`<i class="petal" style="left:${8+i*13+Math.random()*6}%;animation-delay:${(i*1.3+Math.random()).toFixed(1)}s;animation-duration:${(7+Math.random()*4).toFixed(1)}s"></i>`).join("");
  st.innerHTML = `<div class="arenabox" id="box"><div class="top">${hb("p",a.pn)}<div class="rcount" id="rnd">Souboj</div>${hb("e",a.en,1)}</div>
    ${TR?`<div class="trait"><b>${TR.n}</b> · ${TR.d}</div>`:""}
    <div class="field" id="field">${petals}${fighter("pf",SPRITE[a.cls||S.cls])}${fighter("ef",a.ei,a.en)}<div class="combo" id="combo"></div><div class="flash" id="flash"></div></div>
    <table class="rtab"><tr><th>${a.pn}</th><th id="rt">Výsledek</th><th>${a.en}</th></tr><tr><td id="d1">0</td><td>Celkové poškození</td><td id="d2">0</td></tr><tr><td id="h1"></td><td>Životy</td><td id="h2"></td></tr><tr><td id="c1">0</td><td>Kritické zásahy</td><td id="c2">0</td></tr><tr><td id="b1">0</td><td>Odvrácené zásahy</td><td id="b2">0</td></tr></table>
    <details class="blog" open><summary>Průběh boje</summary><ol id="blog"></ol></details>
    <div class="ctl"><button class="btn alt" id="spd">Rychlost ×${SPD}</button><button class="btn" id="skip">Přeskočit</button></div><div id="res"></div></div>`;
  const fld = $("#field"), box = $("#box"), cnt = {c1:0,c2:0,b1:0,b2:0,d1:0,d2:0}, cls = a.cls||S.cls;
  let ph = a.ph0, eh = a.eh0, i = 0, stop = false; const tm = [];
  const T = (fn,ms) => tm.push(setTimeout(()=>{ if(!stop) fn(); }, ms/SPD));
  const sum = p => a.ev.filter(x=>x.p===p&&x.dot!==3).reduce((t,x)=>t+x.dmg,0)+(p?0:a.ev.filter(x=>x.dot===3).reduce((t,x)=>t+x.dmg,0));
  const w = (h,m) => Math.max(0,h)/m*100+"%";
  const upd = () => { [["p",ph,a.pm],["e",eh,a.em]].forEach(([k,h,m])=>{ $("#"+k+"b").style.width = w(h,m); $("#"+k+"g").style.width = w(h,m);
    $("#"+k+"t").textContent = fmt(Math.max(0,Math.round(h)))+" / "+fmt(m); });
    $("#h1").textContent = fmt(Math.max(0,ph)); $("#h2").textContent = fmt(Math.max(0,eh)); };
  const flashBar = k => { const b = $("#"+k+"hb"); b.classList.remove("hurt"); void b.offsetWidth; b.classList.add("hurt"); };
  const fx = (cls,html,left,vars) => { const e = document.createElement("span"); e.className = cls; e.innerHTML = html; e.style.left = left; if(vars) e.style.cssText += vars;
    fld.appendChild(e); setTimeout(()=>e.remove(),1000); };
  const burst = (left, kind, n) => { for(let k=0;k<n;k++){ const ang = Math.random()*Math.PI*2, r = 30+Math.random()*60;
    fx("pt "+kind, "", left, `--dx:${Math.round(Math.cos(ang)*r)}px;--dy:${Math.round(Math.sin(ang)*r-20)}px;--s:${(.5+Math.random()*.9).toFixed(2)}`); } };
  const num = (who, txt, cls) => { const f = $(who==="p"?"#pf":"#ef"), d = document.createElement("span");   // plovoucí číslo, víc čísel se nepřekrývá
    d.className = "dn "+(cls||""); d.textContent = txt; d.style.setProperty("--ox", (Math.random()*30-15+(who==="p"?14:-30)).toFixed(0)+"px"); f.appendChild(d); setTimeout(()=>d.remove(),1200/SPD+300); };
  const chip = (c,t) => `<span class="sc ${c}">${t}</span>`;
  const status = s => { if(!s) return;
    $("#ps").innerHTML = (s.sh?chip("ai","Štít "+fmt(s.sh)):"")+(s.vn?chip("psn","Jed "+s.vn):"");
    $("#es").innerHTML = (TR?chip("tr",TR.n):"")+(s.ps?chip("psn","Jed"):"")+(s.bl?chip("bld","Krvácení ×"+s.bl):"")+(s.st?chip("ai","Omráčen"):"")+(s.rg?chip("bld","Zuří"):"")+(s.ch?chip("kin","Nabírá sílu"):"");
    $("#ef").classList.toggle("chg", !!s.ch); $("#ef").classList.toggle("rage", !!s.rg);
    const c = $("#combo"); if(s.cb>=2){ c.innerHTML = `Série <b>×${s.cb}</b><small>+${Math.round(COMBO*Math.min(s.cb,COMBOMAX)*100)} % poškození</small>`; c.className = "combo on"; void c.offsetWidth; c.classList.add("bump"); } else c.className = "combo"; };
  const who = p => p ? a.pn : a.en;
  const logTxt = e => { const at = who(e.p), df = who(!e.p);
    if(e.dot===3) return `${a.pn} trpí jedem: −${fmt(e.dmg)}`;
    if(e.dot) return `${a.en}: ${e.tech} −${fmt(e.dmg)}`;
    if(e.stun) return `${a.en} je ${e.tech==="Pečeť"?"zapečetěn":"omráčen"} a vynechá tah`;
    if(e.chg) return `${a.en} nabírá sílu k drtivému úderu!`;
    if(e.rg) return `${a.en} propadá zuřivosti`;
    if(e.heal) return `${e.tech}: +${fmt(e.heal)} životů`;
    if(e.sh) return `${e.tech}: štít ${fmt(e.sh)}`;
    if(e.dodge) return e.tech==="Náhradní tělo" ? `${a.pn} unikl smrti (Náhradní tělo)` : `${df} uhnul${e.tech?" ("+e.tech+")":""}`;
    if(!e.dmg) return `${e.tech||"Technika"}`;
    return `${e.comp?"Společník":at}${e.tech?" · "+e.tech:""} → ${df} −${fmt(e.dmg)}${e.crit?" krit":""}${e.blk?" (blok)":""}${e.ls?`, vysáto +${fmt(e.ls)}`:""}${e.bleed?", krvácí":""}${e.stn?", omráčen":""}${e.ven?", otráven":""}`; };
  const logAdd = e => { const li = document.createElement("li"); li.className = (e.p?"p":"e")+(e.crit?" c":""); li.innerHTML = `<b>${i}</b>${logTxt(e)}`; $("#blog").prepend(li); };
  const line = e => { const k = e.dot===3?"2":e.p?"1":"2", o = e.p?"2":"1";
    if(e.dmg){ cnt["d"+k] += e.dmg; $("#d"+k).textContent = fmt(cnt["d"+k]); $("#d"+k).classList.remove("pulse"); void $("#d"+k).offsetWidth; $("#d"+k).classList.add("pulse"); }
    if(e.crit) $("#c"+k).textContent = ++cnt["c"+k]; if(e.blk||e.dodge) $("#b"+o).textContent = ++cnt["b"+o];
    $("#rt").textContent = "Kolo "+i; };
  const reset = () => ["pf","ef"].forEach(x => $("#"+x).classList.remove("atkL","atkR","hit","blk","dodge","heavy","lunge2"));
  const finish = () => { stop = true; tm.forEach(clearTimeout); reset(); fld.classList.remove("ko");
    if(!a.vt){ (a.win?$("#ef"):$("#pf")).classList.add("dead"); (a.win?$("#pf"):$("#ef")).classList.add("vic"); }
    const bn = document.createElement("div"); bn.className = "verdict "+(a.vt?"win":a.win?"win":"lose"); bn.innerHTML = `<i></i>${a.vt || (a.win?"Vítězství":"Porážka")}`; fld.appendChild(bn);
    $("#combo").className = "combo";
    $("#res").innerHTML = `<div class="sum">Způsobeno <b>${fmt(sum(true))}</b> · Utrpěno <b>${fmt(sum(false))}</b> · Kritické zásahy <b>${a.ev.filter(x=>x.p&&x.crit).length}</b> · Nejdelší série <b>${Math.max(0,...a.ev.map(x=>x.s?x.s.cb:0))}</b></div>`+deco(a.txt);
    $("#spd").style.display = "none"; const k = $("#skip"); k.textContent = "Pokračovat";
    k.onclick = () => { st.style.display = "none"; busy = false; lockSync(); draw(); flushFx(); }; };
  const step = () => {
    if(stop) return; if(i >= a.ev.length) return finish();
    const e = a.ev[i++], last = i===a.ev.length, kill = last && (e.eh<=0 || e.ph<=0);
    const atk = $(e.p?"#pf":"#ef"), def = $(e.p?"#ef":"#pf"), dk = e.p?"e":"p";
    const ax = e.p?"16%":"84%", dx = e.p?"84%":"16%", ranged = e.p && !e.comp && cls!=="samurai";
    $("#rnd").textContent = "Kolo "+i;
    const after = () => { ph = e.ph; eh = e.eh; upd(); status(e.s); line(e); logAdd(e); };
    if(e.comp || e.dot || e.stun || e.chg || e.rg || (e.tech && !e.dmg && !e.dodge)){   // technika, stav, společník, schopnost soupeře
      const side = e.comp ? "30%" : e.dot===3 ? "16%" : (e.dot||e.stun||e.chg||e.rg) ? "84%" : ax;
      fx("cb tech"+(e.chg||e.rg?" warn":"")+(e.dot===2?" bld":""), e.tech, side);
      if(e.comp && a.pet){ const pk = $("#pf .petk"); if(pk){ pk.classList.remove("act"); void pk.offsetWidth; pk.classList.add("act"); } }
      if(e.chg){ $("#ef").classList.add("chg"); burst("84%","ember",8); }
      T(()=>{ if(e.heal){ num("p","+"+fmt(e.heal),"heal"); burst("16%","leaf",8); }
        else if(e.sh){ num("p","Štít "+fmt(e.sh),"bl"); fx("ring ai","", "16%"); }
        else if(e.stun) num("e",e.tech==="Pečeť"?"Zapečetěn":"Omráčen","bl");
        else if(e.dot===3){ $("#pf").classList.add("hit"); burst("16%","psn",7); num("p","−"+fmt(e.dmg),"psn"); flashBar("p"); }
        else if(e.dmg){ $("#ef").classList.add("hit"); burst("84%", e.dot===2?"blood":e.dot?"psn":"spark", e.dot?7:9); num("e","−"+fmt(e.dmg), e.dot===2?"bld":e.dot?"psn":""); flashBar("e"); }
        after(); }, 220);
      T(()=>{ reset(); step(); }, kill ? 1500 : 820);
      return; }
    if(e.tech) fx("cb tech"+(e.tech==="Drtivý úder"?" warn":""), e.tech, ax);
    const heavy = e.tech==="Drtivý úder", hit = ranged ? 380 : heavy ? 330 : 240, slow = kill ? 2.2 : 1;
    if(kill) fld.classList.add("ko");
    atk.classList.add(e.p?"atkL":"atkR"); if(heavy) atk.classList.add("heavy");                               // výpad útočníka
    if(ranged) T(()=>fx("proj "+(cls==="ninja"?"star":"orb"),"",ax,`--x0:${ax};--x1:${dx}`), 120);   // shuriken / duchovní koule
    T(()=>{
      if(e.dodge){ def.classList.add("dodge"); fx("whiff","",dx); num(dk, e.tech==="Náhradní tělo" ? "Přežil!" : "Úhyb", "bl"); after(); return; }
      def.classList.add(e.blk?"blk":"hit");                                                        // dopad
      if(e.blk){ fx("spark blk","",dx); burst(dx,"steel",7); }
      else { const sl = e.p ? (cls==="samurai"?"slash":"slash nin") : "slash e";
        fx(sl,"",dx); if(e.crit) fx(sl+" x","",dx); burst(dx, e.p?"spark":"blood", e.crit?16:9);
        if(e.bleed) burst(dx,"blood",8); }
      if(e.crit || heavy || kill){ box.classList.remove("shk"); void box.offsetWidth; box.classList.add("shk"); const fl = $("#flash"); fl.className = "flash"; void fl.offsetWidth; fl.className = "flash on"+(e.p?"":" red"); }
      if(e.crit) fx("cb","Kritický zásah","50%");
      num(dk, (e.blk?"Blok ":"")+"−"+fmt(e.dmg)+(e.abs?` (štít ${fmt(e.abs)})`:""), (e.crit?"crit":"")+(e.blk?" bl":"")+(heavy?" crit":""));
      if(e.ls) T(()=>num("p","+"+fmt(e.ls),"heal"),160);
      if(e.stn) T(()=>num("e","Omráčen","bl"),220);
      if(e.ven) T(()=>num("p","Otráven","psn"),220);
      flashBar(dk); after(); }, hit*(kill?1.4:1));
    T(()=>{ reset(); box.classList.remove("shk"); step(); }, (hit+520)*slow);
  };
  $("#spd").onclick = () => { SPD = SPD%3+1; $("#spd").textContent = "Rychlost ×"+SPD; };
  $("#skip").onclick = () => { stop = true; tm.forEach(clearTimeout); const L = a.ev[a.ev.length-1]; ph = L?L.ph:a.ph0; eh = L?L.eh:a.eh0; upd(); if(L) status(L.s);
    $("#blog").innerHTML = ""; a.ev.forEach((e,k)=>{ i = k+1; logAdd(e); }); finish(); };
  if(a.pet) $("#pf").insertAdjacentHTML("beforeend",`<span class="petk">${a.pet}</span>`);
  $("#pf").classList.add("inL"); $("#ef").classList.add("inR");                    // nástup bojovníků
  upd(); status({sh:0,cb:0}); T(step, 700);
}

/* =====================================================================
   MODUL 6: UI – postranní panel, bannery stránek s pečetí, seznamy, mřížky předmětů, okno detailu
   ===================================================================== */
let grp = "city", M = null; // grp = aktivní skupina menu (město / divočina), M = otevřený předmět v okně
const MENU = {
  top:[["char","人","Přehled"],["skills","星","Dovednosti"],["trophy","印","Trofeje"],["quest","務","Úkoly"],["clan","族","Klan"],["board","順","Žebříček"],["save","庫","Uložení"]],
  city:[["arena","闘","Aréna"],["work","衛","Stráž a práce"],["train","修","Trénink"],["smith","鍛","Kovář"],["shop","鎧","Zbrojíř a stáje"],["alch","薬","Alchymista"],["gems","玉","Klenotník"],["pet","爪","Společník"],["junk","古","Vetešník"],["well","井","Očarovaná studna"]],
  wild:[["camp","巻","Kampaň"],["exped","旅","Výpravy"],["dungeon","洞","Dungeony"],["tower","塔","Věž zkoušek"],["boss","鬼","Světový boss"]]};
const MORE = [["clan","族","Klan"],["board","順","Žebříček"],["save","庫","Uložení"]];
const CHARM = [["char","人","Přehled"],["look","面","Podoba"],["skills","星","Dovednosti"],["trophy","印","Trofeje"]];
// NPC: p = místo (titulek stránky), n = postava, k = znak pečeti, h = odstín krajiny, t = úvodní text
const NPC = {
  train:{p:"Dódžó",n:"Sensei",k:"師",h:210,t:["V dódžó se ozývá hlasitý křik a klapot dřevěných mečů. Mladí bojovníci se tu učí válečnému umění od zkušených mistrů.","Tvrdým tréninkem tu zvýšíš své vlastnosti. Sensei za to žádá přiměřený obolus."]},
  work:{p:"Strážnice",n:"Velitel stráží",k:"衛",h:24,t:["Ve strážnici je rušno od mladých samurajů a rónin, kteří si vydělávají méně slavnou, ale výnosnou službou.","Za hotové peníze tu můžeš sloužit. Práce běží v reálném čase, i když hru zavřeš."]},
  smith:{p:"Kovárna",n:"Mistr kovář",k:"鍛",h:14,t:["Z kovárny sálá žár a kladivo dopadá na rozžhavenou ocel. Dobrá čepel se tu dá proměnit v legendu.","Každé vylepšení přidá předmětu 15 % jeho hodnot, až do +10. Od +7 může vylepšení selhat a předmět klesne o úroveň, pokud ho nechrání amulet od alchymisty."]},
  shop:{p:"Zbrojnice a stáje",n:"Zbrojíř",k:"鎧",h:205,t:["Na stojanech visí zbroje, přilby a čepele z celého císařství. Nabídka se obměňuje a vždy obsahuje to nejlepší pro tvůj level.","Klepni na předmět pro detail a nákup."]},
  alch:{p:"Alchymistická dílna",n:"Alchymista",k:"薬",h:150,t:["V pološeru bublají kotlíky a na policích se třpytí lektvary a elixíry všech barev.","Zásoby se skládají na sebe, takže nezabírají místo v batohu."]},
  junk:{p:"Vetešnictví",n:"Vetešník",k:"古",h:34,t:["Vetešník skoupí všechno, co z výprav přivlečeš: kořist, staré zbraně i zbytečné talismany.","Klepni na předmět v batohu a prodej ho, nebo rovnou prodej celou kořist."]},
  arena:{p:"Aréna",n:"Mistr arény",k:"闘",h:4,t:["Dav řve a písek je rudý od slávy. V aréně se měříš s dalšími bojovníky o slávu a zlato.","Čím silnější soupeř, tím větší odměna."]},
  exped:{p:"Brána města",n:"Průvodce",k:"旅",h:130,t:["Za branami města se rozprostírá divočina plná banditů, yokai a zapomenutých svatyní.","Zvíře ti ušetří energii a zvýší odměny."]},
  dungeon:{p:"Cech lovců",n:"Lovec démonů",k:"洞",h:352,t:["V temných jeskyních a palácích přebývají bossové, kteří střeží vzácnou kořist i Rjō.","Vstupuj jen dobře vyzbrojen."]},
  tower:{p:"Věž zkoušek",n:"Strážce věže",k:"塔",h:262,t:["Věž zkoušek nemá vrchol. Každé patro je těžší než to předchozí a každé desáté hlídá strážce.","Tvůj postup se ukládá."]},
  well:{p:"Očarovaná studna",n:"Strážkyně studny",k:"井",h:268,t:["Za svatyní stojí stará kamenná studna. V noci z ní stoupá fialová mlha a voda šeptá jména dávných kovářů.","Ponoř předmět do studny a získá náhodné vlastnosti. Vlastnosti, které chceš zachovat, zamkni. Každý zámek zdraží očarování."]},
  quest:{p:"Písárna",n:"Písař",k:"務",h:44,t:["Písař vede záznamy o tvých činech a za splněné úkoly vyplácí odměny.","Úkoly se opakují a denní dar čeká jednou za den."]},
  clan:{p:"Klanový dvůr",n:"Správce klanů",k:"族",h:0,t:["Klan je tvůj druhý domov. Společná pokladnice dává všem členům bonus k odměnám."]},
  board:{p:"Síň slávy",n:"Herold",k:"順",h:30,t:["Herold vyhlašuje jména nejslavnějších bojovníků císařství. Řadí se podle levelu a slávy."]}};

/* =====================================================================
   PORTRÉT: postava kreslená jako SVG ve stylu tušové malby (vrstvy: pozadí, vlasy vzadu, tělo, hlava, obličej, vlasy, pokrývka, rod)
   ===================================================================== */
const shade = (h,f) => { const n = parseInt(h.slice(1),16), m = c => Math.round(f<0 ? c*(1+f) : c+(255-c)*f);
  return "#"+((1<<24)|(m(n>>16)<<16)|(m(n>>8&255)<<8)|m(n&255)).toString(16).slice(1); };
const LV = (L,k) => { const o = LOOK[k], i = Math.max(0,Math.min(o.v.length-1, L[k]|0)); return o.c ? o.v[i][0] : i; };
function portrait(L, race, hue){
  L = L || defLook("samurai");
  const sk = LV(L,"skin"), hc = LV(L,"hc"), ec = LV(L,"ec"), oc = LV(L,"oc"), hair = LV(L,"hair"), head = LV(L,"head"), outfit = LV(L,"outfit");
  const skD = shade(sk,-.2), skL = shade(sk,-.42), hcD = shade(hc,-.3), hcL = shade(hc,.3), ocD = shade(oc,-.35), ink = "#1a1416", kin = "#c4a86e", shu = "#bf3b2b", wh = "#e8e1d2";
  const sym = s => s+`<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
  const hood = head===3, helm = head===4, hat = head===2;
  let o = `<svg class="por" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  // pozadí: tlumená barva třídy, rudé slunce, hřbet hor
  o += `<rect width="200" height="200" fill="hsl(${hue||20} 22% 13%)"/><circle cx="152" cy="56" r="30" fill="${shu}" opacity=".4"/>`+
       `<path d="M0 146L36 116 64 134 104 96 146 128 172 112 200 124V200H0z" fill="#000" opacity=".25"/>`;
  // vlasy vzadu
  if(!hood && !helm){
    if(hair===2) o += `<path d="M106 44C126 20 160 28 158 64 156 88 148 100 140 108 146 86 144 64 128 52 120 47 112 47 106 48Z" fill="${hcD}"/>`;
    if(hair===3) o += sym(`<path d="M68 66C56 98 50 140 54 176L86 176 82 118Z" fill="${hcD}"/>`);
    if(hair===5) o += `<circle cx="100" cy="35" r="13" fill="${hc}"/><path d="M82 28L120 42" stroke="${kin}" stroke-width="2.6" stroke-linecap="round"/>`;
  }
  // krk a tělo
  o += `<path d="M86 122V156Q100 162 114 156V122Z" fill="${skD}"/>`;
  if(outfit===1){ // zbroj: lakované lamely s barevným šněrováním a ramenní pláty
    o += `<path d="M12 200C16 172 48 158 84 153H116C152 158 184 172 188 200Z" fill="#26232b"/>`+
      [168,178,188,198].map(y=>`<path d="M40 ${y}Q100 ${y-8} 160 ${y}" stroke="${oc}" stroke-width="2.4" fill="none"/>`).join("")+
      `<path d="M86 153L100 176 114 153Z" fill="${wh}"/><path d="M84 150L78 154 96 182 100 176Z M116 150L122 154 104 182 100 176Z" fill="${ocD}"/>`+
      sym(`<path d="M10 178C18 162 38 154 60 152L66 178C48 180 30 188 18 200Z" fill="#302c36" stroke="${ink}" stroke-width="1"/>`+
          [160,168,176,184].map(y=>`<path d="M${18+(y-160)*.2} ${y+10}L${62} ${y+2}" stroke="${oc}" stroke-width="1.8"/>`).join(""));
  } else {
    o += `<path d="M12 200C16 172 48 158 84 153H116C152 158 184 172 188 200Z" fill="${oc}"/>`+
      `<path d="M86 153L100 180 114 153Z" fill="${wh}"/>`+
      `<path d="M84 150L76 154 96 200H106Z" fill="${ocD}"/><path d="M116 150L124 154 102 200H92Z" fill="${ocD}"/>`+
      `<path d="M85 151L100 182 M115 151L100 182" stroke="${wh}" stroke-width="1.6" fill="none" opacity=".9"/>`;
    if(outfit===2){ // roucho: kesa přes rameno a růženec
      o += `<path d="M58 157L78 153 152 200H120Z" fill="#9c7a3a"/><path d="M78 168L96 168 M96 180L116 180 M112 192L134 192" stroke="#6e5428" stroke-width="1.4"/>`;
      for(let i=0;i<=12;i++){ const t=i/12, x=(1-t)*(1-t)*80+2*(1-t)*t*100+t*t*120, y=(1-t)*(1-t)*148+2*(1-t)*t*198+t*t*148;
        o += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i===6?4:2.6}" fill="#5e4129" stroke="${ink}" stroke-width=".6"/>`; }
    } else o += `<circle cx="56" cy="182" r="6" fill="none" stroke="${kin}" stroke-width="1.4" opacity=".75"/><path d="M50 182H62M56 176V188" stroke="${kin}" stroke-width="1" opacity=".6"/>`;
  }
  if(race==="tengu") o += sym([0,1,2,3,4].map(i=>{ const x=26+i*12, y=168-i*3.2; return `<path d="M${x} ${y+18}C${x-4} ${y+4} ${x+2} ${y-6} ${x+10} ${y-8}C${x+12} ${y+2} ${x+8} ${y+12} ${x} ${y+18}Z" fill="#141317" stroke="#34313b" stroke-width=".8"/>`; }).join(""));
  // hlava
  o += sym(`<ellipse cx="66" cy="96" rx="6" ry="10" fill="${skD}"/>`);
  o += `<path d="M66 88C66 58 82 44 100 44 118 44 134 58 134 88 134 114 122 136 100 142 78 136 66 114 66 88Z" fill="${sk}"/>`+
       `<path d="M70 110C76 128 88 138 100 142 112 138 124 128 130 110 124 126 112 134 100 136 88 134 76 126 70 110Z" fill="#000" opacity=".1"/>`;
  if(race==="kappa") o += `<path d="M66 88C66 58 82 44 100 44 118 44 134 58 134 88 134 114 122 136 100 142 78 136 66 114 66 88Z" fill="#5f9d92" opacity=".14"/>`+
       sym(`<path d="M70 104a4 4 0 0 1 8 0M74 111a4 4 0 0 1 8 0M70 118a4 4 0 0 1 8 0" stroke="#5f9d92" stroke-width="1.6" fill="none"/>`);
  if(race==="kitsune") o += sym(`<path d="M72 108L84 110M73 114L84 114" stroke="${shu}" stroke-width="1.9" stroke-linecap="round"/>`);
  if(race==="tengu") o += sym(`<path d="M76 100Q84 104 92 100" stroke="${shu}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
  if(race==="ryujin") o += sym(`<path d="M70 98a3 3 0 0 1 6 0M73 104a3 3 0 0 1 6 0" stroke="${kin}" stroke-width="1.4" fill="none"/>`);
  if(hair===0 || hair===1) o += `<ellipse cx="94" cy="58" rx="16" ry="8" fill="#fff" opacity=".12"/>`;
  // oči a obočí (levá strana se zrcadlí)
  const br = shade(hc,-.1), E = [
    `<path d="M75 92Q84 85 93 92Q84 97 75 92Z" fill="#efe8dc"/><circle cx="84" cy="92" r="3.6" fill="${ec}"/><circle cx="84" cy="92" r="1.6" fill="${ink}"/><path d="M74 92Q84 84 94 91" stroke="${ink}" stroke-width="1.8" fill="none"/><path d="M74 80Q84 75 94 79" stroke="${br}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<path d="M75 93Q86 86 94 90Q85 96 75 93Z" fill="#efe8dc"/><circle cx="85" cy="91.6" r="3.4" fill="${ec}"/><circle cx="85" cy="91.6" r="1.5" fill="${ink}"/><path d="M74 93Q86 85 95 89" stroke="${ink}" stroke-width="2" fill="none"/><path d="M72 76L95 83" stroke="${br}" stroke-width="3.6" stroke-linecap="round"/>`,
    `<path d="M76 92Q84 89 92 92Q84 95 76 92Z" fill="#efe8dc"/><circle cx="84" cy="92.4" r="2.6" fill="${ec}"/><path d="M75 91.5Q84 87 93 91" stroke="${ink}" stroke-width="2.6" fill="none"/><path d="M74 82Q84 79 94 81" stroke="${br}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    `<path d="M76 92Q84 97 92 92" stroke="${ink}" stroke-width="2.1" fill="none" stroke-linecap="round"/><path d="M74 83Q84 79 94 82" stroke="${br}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
  ][LV(L,"eyes")];
  o += sym(E);
  o += `<path d="M100 96L96 110Q100 113 104 110" fill="none" stroke="${skL}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  // vousy a ústa
  const bd = LV(L,"beard"), MUST = `<path d="M100 116C94 111 86 113 82 122 80 128 78 131 76 132 82 131 86 125 90 121 94 119 98 119 100 119 102 119 106 119 110 121 114 125 118 131 124 132 122 131 120 128 118 122 114 113 106 111 100 116Z" fill="${hc}"/>`;
  if(bd>=3) o += `<path d="M68 98C68 118 78 136 90 144Q100 150 110 144C122 136 132 118 132 98 130 112 122 124 112 126 108 122 104 121 100 121 96 121 92 122 88 126 78 124 70 112 68 98Z" fill="${hc}"/>`;
  if(bd===4) o += `<path d="M86 138Q100 150 114 138Q112 166 100 186Q88 166 86 138Z" fill="${hc}"/><path d="M100 146V180" stroke="${hcL}" stroke-width="1" opacity=".4"/>`;
  if(bd===2) o += `<path d="M94 130Q100 128 106 130Q104 146 100 154Q96 146 94 130Z" fill="${hc}"/>`;
  const mc = shade(sk,-.55);
  o += [`<path d="M92 122Q100 124 108 122" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
        `<path d="M91 120Q100 128 109 120" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
        `<path d="M92 125Q100 119 108 125" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
        `<path d="M91 119Q100 117 109 119Q105 131 100 131Q95 131 91 119Z" fill="#3a1c1c" stroke="${mc}" stroke-width="1.2"/><path d="M93 120H107" stroke="#efe8dc" stroke-width="1.6"/>`][LV(L,"mouth")];
  if(bd>=1) o += MUST;
  // jizva
  const sc = LV(L,"scar"), SC = `stroke="#8d3a31" stroke-width="2.2" stroke-linecap="round" opacity=".85" fill="none"`;
  if(sc===1) o += `<path d="M81 74L91 110M82 84L89 82M84 93L91 91M86 102L93 100" ${SC}/>`;
  if(sc===2) o += `<path d="M106 106L126 122M110 114L114 108M117 119L121 113" ${SC}/>`;
  if(sc===3) o += `<path d="M88 56L114 68M95 55L94 62M104 60L103 67" ${SC}/>`;
  // vlasy vpředu
  const CAP = `<path d="M64 92C60 56 80 38 100 38 120 38 140 56 136 92 133 78 126 66 114 60 106 66 92 66 84 62 74 68 67 78 64 92Z" fill="${hc}"/>`,
        SHINE = `<path d="M80 50Q96 42 116 48" stroke="${hcL}" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>`;
  if(!hood && !helm){
    if(hair===1) o += sym(`<path d="M64 100C60 78 66 60 80 52 73 64 71 80 71 100Z" fill="${hc}"/>`)+`<path d="M95 47C94 35 98 28 100 28S106 35 105 47Z" fill="${hc}"/><rect x="95" y="40" width="10" height="3" fill="${wh}"/>`;
    if(hair===2) o += CAP+SHINE+`<rect x="114" y="44" width="5" height="9" rx="1.5" transform="rotate(35 116 48)" fill="${shu}"/>`;
    if(hair===3) o += CAP+SHINE+sym(`<path d="M64 90C61 110 63 126 68 136L72 106C70 98 68 94 64 90Z" fill="${hc}"/>`);
    if(hair===4) o += `<path d="M62 96L59 70 70 72 67 54 80 58 82 40 94 50 100 33 108 48 120 40 120 56 134 52 131 70 141 72 138 96C132 78 124 66 112 62L104 72 98 62 88 70 84 62C74 68 66 80 62 96Z" fill="${hc}"/>`;
    if(hair===5) o += `<path d="M64 90C62 56 80 40 100 40 120 40 138 56 136 90 132 70 120 58 100 58 80 58 68 70 64 90Z" fill="${hc}"/>`+SHINE;
  }
  // rohy, uši a parohy rodu (pod pokrývkou hlavy, kromě klobouku)
  const RF = race==="oni" ? sym(`<path d="M80 54C76 42 72 32 69 21 80 29 88 40 92 51Z" fill="#ddd2bb" stroke="${ink}" stroke-width="1.2"/><path d="M76 40L84 37M73 31L79 29" stroke="#a89c84" stroke-width="1.2"/>`)
    : race==="ryujin" ? sym(`<path d="M86 50C81 38 75 28 66 17M77 33L63 33M71 25L75 14" fill="none" stroke="${kin}" stroke-width="3.6" stroke-linecap="round"/>`)
    : race==="kitsune" ? sym(`<path d="M69 62L62 20 95 46Z" fill="${hc}" stroke="${ink}" stroke-width="1"/><path d="M71 54L67 31 87 46Z" fill="#e9d2bd"/>`) : "";
  if(!hat) o += RF;
  // pokrývka hlavy
  if(head===1) o += `<path d="M64 74C80 66 120 66 136 74V83C120 75 80 75 64 83Z" fill="${wh}"/><circle cx="100" cy="73.5" r="4.5" fill="${shu}"/><path d="M136 76L153 69 150 82ZM136 80L151 93 144 97Z" fill="${wh}"/>`;
  if(hat) o += `<path d="M66 82Q100 94 134 82V94Q100 102 66 94Z" fill="#000" opacity=".25"/><path d="M71 84L85 136M129 84L115 136" stroke="#3b3024" stroke-width="1.4"/>`+
    `<path d="M14 76L100 22 186 76Q100 90 14 76Z" fill="#a98f5e"/><path d="M100 22L56 82M100 22L144 82M100 22L100 86M100 22L32 78M100 22L168 78" stroke="#7d6740" stroke-width="1.1" opacity=".7"/><path d="M14 76Q100 90 186 76" stroke="#5e4c2c" stroke-width="2" fill="none"/>`;
  if(hood){ const hd = shade(oc,-.6), hl = shade(oc,-.4);
    o += `<path d="M56 104C52 54 78 32 100 32 122 32 148 54 144 104 144 124 140 140 134 150V96C134 84 122 76 100 76 78 76 66 84 66 96V150C60 140 56 124 56 104Z" fill="${hd}"/>`+
      `<path d="M66 100C80 104 120 104 134 100 134 124 122 140 100 148 78 140 66 124 66 100Z" fill="${hd}"/><path d="M70 112Q100 118 130 112M76 124Q100 130 124 124" stroke="${hl}" stroke-width="1.3" fill="none"/>`; }
  if(helm) o += sym(`<path d="M60 88L50 122 72 118 68 92Z" fill="#2a2830"/><path d="M58 98L70 96M55 108L70 106M52 118L71 115" stroke="${oc}" stroke-width="1.6"/>`)+
    `<path d="M58 86C58 46 78 30 100 30 122 30 142 46 142 86L132 82C130 62 118 54 100 54 82 54 70 62 68 82Z" fill="#2c2932" stroke="${ink}" stroke-width="1"/>`+
    `<path d="M76 40Q78 60 72 80M88 33Q90 56 86 78M112 33Q110 56 114 78M124 40Q122 60 128 80" stroke="#46414f" stroke-width="1.3" fill="none"/>`+
    `<path d="M56 84Q100 70 144 84L148 91Q100 78 52 91Z" fill="#3b3742"/>`+sym(`<path d="M58 84L42 76 46 102 62 96Z" fill="${oc}" stroke="${ink}" stroke-width="1"/>`)+
    `<path d="M100 54L79 13 86 12 100 42 114 12 121 13Z" fill="${kin}"/><circle cx="100" cy="52" r="4" fill="${shu}"/>`;
  if(hat) o += RF;
  return o+`</svg>`;
}
const look = () => S.look || (S.look = defLook(S.cls));
// ---- portrét soupeře: lidé a yokai podle jména (vždy stejná podoba), zvířata a živly jako tušový znak ----
const EPR = {"🤺":["samurai"],"🥷":["ninja"],"🧘":["monk"],"🦹":["ninja"],"🏴‍☠️":["samurai"],"👤":["ninja"],"👑":["samurai","human"],
  "👹":["samurai","oni"],"😈":["samurai","oni"],"👺":["monk","tengu"],"🦊":["monk","kitsune"],"🐉":["samurai","ryujin"],"🐲":["samurai","ryujin"],"🐍":["monk","ryujin"],"🐙":["monk","kappa"],
  "🔥":["monk","fire"],"❄️":["monk","snow"],"🌙":["monk","sky"],"🌠":["monk","sky"],"🌞":["monk","sky"],"🪐":["monk","sky"],
  "👻":["samurai","ghost"],"💀":["samurai","ghost"],"🥀":["monk","ghost"],"🌩️":["samurai","ryujin"],"⚡":["samurai","oni"]};
function enemyPortrait(name, ico){ const e = EPR[ico], h = [...String(name)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,11);
  const rn = k => { const x = Math.sin(h*.001+k*91.7)*43758.5453; return x-Math.floor(x); }, pick = (k,n) => Math.floor(rn(k)*n);
  if(BEAST[ico]) return beast(BEAST[ico], pick);
  if(!e) return enemyPortrait(name,"🤺");
  if(0) return `<svg class="por" viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="hsl(${pick(1,40)} 30% 12%)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#bf3b2b" stroke-width="6" opacity=".55" stroke-dasharray="380 60"/><text x="100" y="128" text-anchor="middle" font-family="Shippori Mincho,serif" font-size="92" font-weight="800" fill="#d6503d">${kj(ico)}</text></svg>`;
  const [cls, rc] = e, ghost = rc==="ghost", L = defLook(cls);
  Object.keys(LOOK).forEach((k,i)=>{ if(!["outfit"].includes(k)) L[k] = pick(i+3, LOOK[k].v.length); });
  L.head = cls==="ninja" ? 3 : pick(20,5); if(L.skin>4 && rc!=="oni") L.skin = pick(21,5); L.mouth = [2,3,0][pick(22,3)]; L.eyes = pick(23,3);
  if(ghost){ L.skin = 6; L.eyes = 3; L.oc = 6; L.hc = 5; L.head = 0; L.mouth = 0; }
  if(rc==="fire"){ L.skin = 5; L.hc = 6; L.hair = 4; L.oc = 1; L.head = 0; L.mouth = 3; L.eyes = 1; }
  if(rc==="snow"){ L.skin = 6; L.hc = 5; L.hair = 3; L.oc = 6; L.head = 0; L.beard = 0; L.eyes = 2; L.mouth = 0; L.scar = 0; }
  if(rc==="sky"){ L.skin = 0; L.hc = 7; L.hair = [3,5][pick(25,2)]; L.oc = 5; L.head = 1; L.eyes = 3; L.mouth = 0; L.scar = 0; }
  if(rc==="oni"){ L.skin = [5,5,6][pick(24,3)]; L.mouth = 3; }
  return portrait(L, ["ghost","human","fire","snow","sky"].includes(rc) ? (rc==="fire"?"oni":rc==="sky"?"kitsune":null) : rc, rc==="snow"?210:rc==="sky"?44:0); }
// ---- zvířecí soupeři: vlk, tygr, pavouk (stejný tušový styl jako portréty) ----
const BEAST = {"🐺":"wolf","🐅":"tiger","🕷️":"spider"};
function beast(k, pick){
  const ink = "#1a1416", bg = `<rect width="200" height="200" fill="hsl(${k==="spider"?280:k==="tiger"?24:210} 22% 12%)"/><circle cx="152" cy="56" r="30" fill="#bf3b2b" opacity=".4"/><path d="M0 146L36 116 64 134 104 96 146 128 172 112 200 124V200H0z" fill="#000" opacity=".25"/>`;
  let o = `<svg class="por" viewBox="0 0 200 200" aria-hidden="true">`+bg;
  if(k==="wolf"){ const c = ["#8a8f98","#5d6068","#c9c4ba"][pick(30,3)], d = "#3e4047";
    o += `<path d="M30 200C40 160 70 146 100 146S160 160 170 200Z" fill="${d}"/>`+
      `<path d="M58 70L50 18 88 52ZM142 70L150 18 112 52Z" fill="${c}" stroke="${ink}" stroke-width="1.5"/><path d="M60 58L56 32 78 52ZM140 58L144 32 122 52Z" fill="#c98a8a" opacity=".6"/>`+
      `<path d="M52 92C52 58 74 44 100 44S148 58 148 92C148 112 138 124 128 132L118 170Q100 182 82 170L72 132C62 124 52 112 52 92Z" fill="${c}" stroke="${ink}" stroke-width="1.5"/>`+
      `<path d="M78 120Q100 112 122 120L116 168Q100 178 84 168Z" fill="#e8e1d2"/><path d="M90 150Q100 158 110 150" stroke="${ink}" stroke-width="2" fill="none"/>`+
      `<ellipse cx="100" cy="128" rx="11" ry="8" fill="${ink}"/><path d="M100 136V146" stroke="${ink}" stroke-width="2"/>`+
      `<path d="M66 94L90 98 84 106 68 102Z M134 94L110 98 116 106 132 102Z" fill="#f2c24a" stroke="${ink}" stroke-width="1.5"/><path d="M80 98V105M120 98V105" stroke="${ink}" stroke-width="3"/>`+
      `<path d="M64 84L92 92M136 84L108 92" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`+
      `<path d="M52 92L40 112 60 106ZM148 92L160 112 140 106Z" fill="${c}"/><path d="M93 158L95 166M107 158L105 166" stroke="#fff" stroke-width="2.5"/>`; }
  if(k==="tiger"){ const c = pick(31,4)===0 ? "#e9e3d6" : "#d9822b";
    o += `<path d="M30 200C40 162 70 150 100 150S160 162 170 200Z" fill="${c}"/>`+
      `<circle cx="56" cy="56" r="18" fill="${c}" stroke="${ink}" stroke-width="1.5"/><circle cx="144" cy="56" r="18" fill="${c}" stroke="${ink}" stroke-width="1.5"/><circle cx="56" cy="56" r="9" fill="${ink}" opacity=".6"/><circle cx="144" cy="56" r="9" fill="${ink}" opacity=".6"/>`+
      `<path d="M46 100C46 62 70 44 100 44S154 62 154 100C154 136 130 160 100 160S46 136 46 100Z" fill="${c}" stroke="${ink}" stroke-width="1.5"/>`+
      `<path d="M100 46V66M84 50L90 66M116 50L110 66M48 92H66M48 108L66 104M152 92H134M152 108L134 104M56 126L70 118M144 126L130 118" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`+
      `<path d="M70 118Q100 100 130 118Q132 150 100 156Q68 150 70 118Z" fill="#f4eee2"/><path d="M90 116L110 116 100 128Z" fill="#c45a5a" stroke="${ink}" stroke-width="1.2"/>`+
      `<path d="M100 128V136M86 140Q100 146 114 140" stroke="${ink}" stroke-width="2" fill="none"/><path d="M90 142L92 152M110 142L108 152" stroke="#fff" stroke-width="3"/>`+
      `<path d="M68 90Q78 82 90 90Q78 96 68 90ZM132 90Q122 82 110 90Q122 96 132 90Z" fill="#9bd36a" stroke="${ink}" stroke-width="1.5"/><path d="M79 85V95M121 85V95" stroke="${ink}" stroke-width="2.6"/>`+
      `<path d="M66 128H44M68 134L46 140M134 128H156M132 134L154 140" stroke="${ink}" stroke-width="1" opacity=".7"/>`; }
  if(k==="spider"){ const c = ["#2a2230","#3a1f22","#22303a"][pick(32,3)], m = ["#b3392b","#c4a86e","#7b4fa8"][pick(33,3)];
    o += [[-1,0],[1,0]].map(([s])=>[0,1,2,3].map(i=>{ const y = 70+i*24, x1 = 100+s*40, x2 = 100+s*(76+i*4), x3 = 100+s*(94-i*2);
      return `<path d="M${x1} ${y}Q${x2} ${y-34} ${x3} ${y+30}" stroke="${ink}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M${x1} ${y}Q${x2} ${y-34} ${x3} ${y+30}" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`; }).join("")).join("")+
      `<ellipse cx="100" cy="170" rx="54" ry="40" fill="${c}" stroke="${ink}" stroke-width="2"/><path d="M100 140L88 160 100 176 112 160Z" fill="${m}" opacity=".85"/>`+
      `<ellipse cx="100" cy="98" rx="42" ry="40" fill="${c}" stroke="${ink}" stroke-width="2"/>`+
      [[84,82,8],[116,82,8],[94,70,5],[106,70,5],[74,94,4],[126,94,4],[90,98,4],[110,98,4]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#e2402e"/><circle cx="${x-r/3}" cy="${y-r/3}" r="${r/3}" fill="#fff" opacity=".8"/>`).join("")+
      `<path d="M88 118Q84 134 92 140Q92 128 96 122ZM112 118Q116 134 108 140Q108 128 104 122Z" fill="#e8e1d2" stroke="${ink}" stroke-width="1.2"/>`; }
  return o+`</svg>`; }

// ---- rámeček avatara: odemyká se úspěchy nebo za Rjō ----
const FRAMES = [
  {k:"none",n:"Bez rámečku",d:"Prostý okraj",ok:()=>true},
  {k:"bronze",n:"Bronzový",d:"Level 10",ok:()=>S.lvl>=10},
  {k:"silver",n:"Stříbrný",d:"Level 50",ok:()=>S.lvl>=50,r:40},
  {k:"gold",n:"Zlatý",d:"Level 100",ok:()=>S.lvl>=100,r:120},
  {k:"jade",n:"Nefritový",d:"10 trofejí",ok:()=>Object.keys(S.ach||{}).length>=10,r:150},
  {k:"emerald",n:"Smaragdový",d:"Level 150",ok:()=>S.lvl>=150,r:300},
  {k:"ruby",n:"Rubínový",d:"Poraz světového bosse 10×",ok:()=>st("wbk")>=10,r:400},
  {k:"sakura",n:"Sakurový",d:"Dokonči kampaň",ok:()=>Math.floor((S.camp||0)/4)>=6,r:500},
  {k:"diamond",n:"Diamantový",d:"Level 200",ok:()=>S.lvl>=200,r:800},
  {k:"celestial",n:"Nebeský",d:"Level 300",ok:()=>S.lvl>=300,r:2000}];
const frOwn = f => f.ok() || (S.frames||[]).includes(f.k);
const frc = () => { const f = FRAMES.find(x=>x.k===S.frame); return f && f.k!=="none" && frOwn(f) ? " fr fr-"+f.k : ""; };
const myPortrait = () => portrait(look(), S.race, HUE[S.cls]);

// ---- volba rodu a editor podoby (sdílené pro tvorbu postavy i stránku Podoba) ----
const sgn = v => v>0 ? `<span class="pos">+${v}</span>` : `<span class="neg">−${-v}</span>`;
function raceCards(sel, cls){
  return `<div class="rgrid">`+Object.entries(RACES).map(([k,r])=>{ const [t,x] = r.f[cls];
    return `<button class="rc ${k===sel?"on":""}" onclick="G.race('${k}')"><div class="hanko">${r.k}</div><div class="rcb"><b>${r.n}</b><small>${r.t}</small>`+
      `<p class="rs">${Object.entries(r.s).map(([s,v])=>`${STATN[s]} ${sgn(v)}`).join(" · ")}</p><p class="rp">${r.pas}</p>`+
      `<p class="rf ${t==="+"?"s":t==="g"?"g":"u"}"><em>${t==="+"?"Posílí":t==="g"?"Doplní":"Univerzální"}</em>${x}</p></div></button>`; }).join("")+`</div>`;
}
function lookEditor(L){
  return Object.entries(LOOK).map(([k,o])=>{ const cur = LV(L,k), ci = Math.max(0,Math.min(o.v.length-1,L[k]|0));
    return `<div class="lkg"><div class="lkh">${o.n}<span>${o.c?o.v[ci][1]:o.v[cur]}</span></div><div class="lkopts">`+
      o.v.map((v,i)=> o.c ? `<button class="sw ${i===ci?"on":""}" style="--c:${v[0]}" title="${v[1]}" aria-label="${o.n}: ${v[1]}" onclick="G.lk('${k}',${i})"></button>`
                          : `<button class="opt ${i===ci?"on":""}" onclick="G.lk('${k}',${i})">${v}</button>`).join("")+`</div></div>`; }).join("");
}
function lookPage(t, foot){ // t = S nebo rozpracovaná postava CR
  const r = RACES[t.race], L = t.look || defLook(t.cls);
  return `<div class="lkwrap"><div class="lkprev"><div class="lkpic${S&&t===S?frc():""}">${portrait(L,t.race,HUE[t.cls])}</div><div class="lkname"><b>${t.name}</b><small>${r?r.n+" · ":""}${CLASSES[t.cls].n}</small>`+
    `<div class="lkbtns">${btn("Náhodně","G.rndLook()",0,"alt")}${foot}</div></div></div><div class="lkside">`;
}

// ---- krajina banneru: inkoustové hory, slunce, mlha (odstín podle místa) ----
const art = h0 => { const E = env(), h = E.night ? 228 : h0, rnd = i => { const x = Math.sin(i*12.9898+h0*.37)*43758.5453; return x-Math.floor(x); };
  const sky = E.night ? Array.from({length:26},(_,i)=>`<circle cx="${(rnd(i)*900).toFixed(0)}" cy="${(rnd(i+50)*120).toFixed(0)}" r="${(.6+rnd(i+9)*1.1).toFixed(1)}" fill="#fff" opacity="${(.3+rnd(i+3)*.5).toFixed(2)}"/>`).join("") : "";
  const P = [["#e8a6b8",.75],[,0],["#c8642c",.8],["#f2efe8",.85]][E.se];
  const parts = P[1] ? Array.from({length:18},(_,i)=>{ const x = (rnd(i+100)*900).toFixed(0), y = (30+rnd(i+200)*190).toFixed(0), r = (E.se===3?1.4:2.2)+rnd(i+7)*1.6;
    return E.se===2 ? `<ellipse cx="${x}" cy="${y}" rx="${(r*1.6).toFixed(1)}" ry="${r.toFixed(1)}" transform="rotate(${(rnd(i)*180).toFixed(0)} ${x} ${y})" fill="${P[0]}" opacity="${P[1]}"/>`
                    : `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="${P[0]}" opacity="${(P[1]*(.5+rnd(i+30)*.5)).toFixed(2)}"/>`; }).join("") : "";
  return `<svg class="pb-art" viewBox="0 0 900 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>
  <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:hsl(${h} 30% ${E.night?13:17}%)"/><stop offset="1" style="stop-color:hsl(${h} 22% ${E.night?6:9}%)"/></linearGradient>
  <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0b0d" stop-opacity="0"/><stop offset="1" stop-color="#0b0b0d" stop-opacity=".85"/></linearGradient></defs>
  <rect width="900" height="240" fill="url(#gs)"/>${sky}${E.night?`<circle cx="${600+(h0%9)*14}" cy="80" r="36" fill="#ece6d8" opacity=".78"/><circle cx="${614+(h0%9)*14}" cy="72" r="34" fill="hsl(228 30% 13%)" opacity=".9"/>`:`<circle cx="${600+(h0%9)*14}" cy="92" r="50" fill="#bf3b2b" opacity=".5"/>`}
  <path d="M0 240V150l70-52 60 44 90-86 80 76 70-40 90 70 80-56 90 66 120-80 100 70 70-40V240z" fill="#17151a"/>
  <ellipse cx="300" cy="176" rx="320" ry="16" fill="#fff" opacity=".035"/>
  <path d="M0 240V196l90-40 100 42 110-58 120 60 110-44 130 56 100-30 140 40V240z" fill="#0f0e12"/>
  <ellipse cx="640" cy="205" rx="300" ry="14" fill="#fff" opacity=".03"/><rect y="130" width="900" height="110" fill="url(#gm)"/>${parts}</svg>`; };
const banner = k => { const n = NPC[k]; return `<header class="pb">${art(n.h)}${envChip()}<div class="pb-mark">${n.k}</div><div class="pb-in"><div class="hanko">${gl(n.k)}</div><div><h1 class="pb-t">${n.p}</h1><div class="pb-s">${n.n}</div><div class="pb-x">${n.t.map(x=>`<p>${x}</p>`).join("")}</div></div></div></header>`; };
const activeSetsTxt = () => SETS.map(st=>{ const c = setCount(st.k); return c>=2 ? `${st.n} ${c}/${st.of}` : ""; }).filter(Boolean).join(", ");
const envChip = () => { const e = env(); return `<div class="envc" title="${envFull()}"><b>${SEASONS[e.se].k}</b>${envTxt()}</div>`; };
const playerBanner = () => { const r = race();
  return `<header class="pb">${art(HUE[S.cls])}<div class="pb-mark">${SPRITE[S.cls]}</div><div class="pb-in"><button class="pbp${frc()}" onclick="G.tab('look')" aria-label="Upravit podobu">${myPortrait()}<span>Upravit</span></button>${envChip()}<div>${titleN()?`<div class="pb-tt">${titleN()}</div>`:""}<h1 class="pb-t">${S.name}</h1><div class="pb-s">${r?r.n+" · ":""}${CLASSES[S.cls].n} · level ${S.lvl}</div><div class="pb-x"><p>${CLASSES[S.cls].d}${r?" "+r.pas+" (rod "+r.n+").":""}</p></div>`+
    (r?"":`<div class="pb-cta"><span>Tvůj rod zatím není určen. Rod přidá bonusy k vlastnostem a pasivní schopnost.</span>${btn("Zvolit rod","G.tab('look')")}</div>`)+`</div></div></header>`; };

// ---- stavební bloky ----
const btn = (l,f,d,c) => `<button class="btn ${c||""}" ${d?"disabled":""} onclick="${f}">${l}</button>`;
const sh = (t,n) => `<div class="sh"><h2>${t}</h2>${n?`<span class="sn">${n}</span>`:""}</div>`;
const row = o => `<div class="lrow ${o.lock?"locked":""}"><div class="seal">${gl(o.g)}</div><div class="rmain"><b>${o.t}</b><small>${o.s||""}</small>${o.x||""}</div><div class="rright">${o.r||""}</div><div class="rbtn">${o.b||""}</div></div>`;
const rows = a => `<div class="list">${a.join("")}</div>`;
const mini = p => `<span class="mini"><i style="width:${Math.max(0,Math.min(100,p))}%"></i></span>`;
const lg = (n,v,p,d,c) => `<div class="lg"><div><b>${n}</b><small>${d||""}</small></div><div class="v">${v}</div>${p==null?"":`<div class="bar ${c||""}"><i style="width:${Math.max(0,Math.min(100,p))}%"></i></div>`}</div>`;
const cell = (it,src,key,ph) => it
  ? `<button class="cell ${rar(it)} ${(it.l||1)>S.lvl?"nolvl":""}" data-s="${src}" data-k="${key}" aria-label="${it.n}" onclick="showItem('${src}',${typeof key==="number"?key:`'${key}'`})"><span class="g">${ico(it)}</span>${it.u?`<sup>+${it.u}</sup>`:""}${it.q>1?`<small>${it.q}</small>`:""}</button>`
  : `<div class="cell empty"><span class="g">${ph?gl(ph):""}</span></div>`;
const gearbar = () => `<div class="gearbar">`+["weapon","armor","head","acc","mount"].map(k=>`<div class="slot">${cell(S.eq[k],"eq",k,SLOTKJ[k])}<span class="sl">${SLOTN[k]}</span></div>`).join("")+`</div>`;
const bag = (c) => `<div class="cells" style="--c:${c||5}">`+Array.from({length:20},(_,i)=>cell(S.inv[i],"inv",S.inv[i]&&S.inv[i].id)).join("")+`</div>`;
const dock = () => sh("Vybavení")+`<div class="panel">${gearbar()}</div>`+sh("Batoh",`${S.inv.length} / 20`)+`<div class="panel">${bag(5)}</div>`;
const gold = (a,b) => `💰 ${fmt(a)}${b!==undefined?"–"+fmt(b):""}`;

// ---- detail předmětu (tooltip i okno) ----
const resolve = (src,key) => src==="inv" ? S.inv.find(x=>x.id===key) : src==="eq" ? S.eq[key] : src==="gear" ? SHOP_GEAR[key] : SHOP_USE[key];
function tipHTML(it,src){
  const rows = [], add = (l,v,c) => rows.push(`<tr><td>${l}</td><td class="${c||""}">${v}</td></tr>`), L = it.l||1;
  if(it.a) add("Útok",up(it,"a")); if(it.d) add("Obrana",up(it,"d")); if(it.h) add("Životy",up(it,"h"));
  if(it.x) add("Bonus ke statům","+"+Object.values(it.x)[0]+" ke všem","pos");
  if(it.heal) add("Léčí","+"+it.heal+" HP","pos"); if(it.en) add("Energie","+"+it.en,"pos");
  if(it.s==="mount") add("Efekt","−30 % energie, +20 % odměn","pos");
  if(it.t) add("Typ",{sword:"Meč",thrown:"Vrhací zbraň",spirit:"Spirituální"}[it.t]);
  if(it.sv!==undefined) add("Hodnota",fmt(it.sv)+" 💰");
  if(L>1) add("Potřebný level",L,L>S.lvl?"neg":"");
  const so = setOf(it); if(so){ const c = setCount(so.k); add("Sada",`${so.n} (${c}/${so.of})`,"pos"); Object.entries(so.b).forEach(([n,b])=>add(`${n} kusy`,bonTxt(b),c>=+n?"pos":"mut")); }
  (it.ench||[]).forEach((x,k)=>add(k?"":"Očarování",enchTxt(x),"ench"));
  if(sockets(it)) add("Sloty",(it.g||[]).filter(Boolean).map(gemName).join(", ")+(` (${(it.g||[]).filter(Boolean).length}/${sockets(it)})`));
  if(it.u!==undefined && GEARSLOTS.includes(it.s) && it.u<10 && (src==="eq"||src==="inv")) add("Šance na vylepšení",forgeCh(it.u+1)+" %",forgeCh(it.u+1)<100?"neg":"");
  const cur = S.eq[it.s];
  if(cur && cur!==it && (src==="inv"||src==="gear") && ["weapon","armor","head","acc"].includes(it.s))   // srovnání s nasazeným
    [["a","Útok"],["d","Obrana"],["h","Životy"]].forEach(([k,n])=>{ const d = up(it,k)-up(cur,k); if(d) add("Oproti nasazenému: "+n,(d>0?"+":"")+d,d>0?"pos":"neg"); });
  if(src==="gear"||src==="use") add("Cena",it.r?it.r+" 🔴":fmt(it.p)+" 💰"); else if(src==="inv") add("Prodejní cena",fmt(sellVal(it))+" 💰");
  return deco(`<div class="tt ${rar(it)}"><h4>${it.n}${it.u?" +"+it.u:""}${it.q>1?" ×"+it.q:""}</h4><div class="mut">${TYPE_NAME[it.s]||""}${src==="eq"?" · nasazeno":""}</div><table>${rows.join("")}</table></div>`);
}
function actHTML(it,src,key){
  const fc = (it.p!==undefined && it.s!=="use" && it.s!=="junk" && it.u!==undefined) ? forgeCost(it) : 0, ch = forgeCh((it.u||0)+1), fa = src==="eq"?`'eq','${key}'`:`'inv',${key}`;
  const forge = fc ? btn(`Vylepšit${it.u<10&&ch<100?" "+ch+" %":""} · 💰 ${fmt(fc)}`, `G.forge(${fa})`, it.u>=10||S.gold<fc, "alt")+
    (it.u<10&&ch<100&&(S.amul||0)>0 ? btn(`S amuletem (${S.amul}×)`, `G.forge(${fa},1)`, S.gold<fc, "alt") : "") : "";
  const sell = btn(`Prodat · 💰 ${fmt(sellVal(it))}`,`G.sell(${key})`,0,"alt");
  const well = enchOk(it) ? btn("Do studny",`G.wellPick('${src}',${src==="eq"?`'${key}'`:key})`,0,"alt") : "";
  if(src==="inv") return it.s==="junk" ? btn(`Prodat · 💰 ${fmt(sellVal(it))}`,`G.sell(${key})`) : it.s==="use" ? btn("Použít",`G.use(${key})`)+sell : btn("Nasadit",`G.equip(${key})`,(it.l||1)>S.lvl)+forge+well+sell;
  if(src==="eq") return btn("Sundat",`G.unequip('${key}')`)+(it.s!=="mount"?forge+well:"");
  const ok = it.r ? S.ryo>=it.r : S.gold>=it.p;
  return btn("Koupit",`G.buy('${src}',${key})`,!ok)+(src==="use"?btn("Koupit ×5",`for(let k=0;k<5;k++)G.buy('use',${key})`,0,"alt"):"");
}
function showItem(src,key){
  const it = resolve(src,key); if(!it) return closeModal(); M = {src,key,keep:src==="gear"||src==="use"};
  $("#modal").innerHTML = deco(`<div class="mback" onclick="closeModal()"></div><div class="mcard ${rar(it)}"><div class="mhead"><div class="mg">${ico(it)}</div>${tipHTML(it,src)}</div><div class="macts">${actHTML(it,src,key)}</div><button class="x" onclick="closeModal()" aria-label="Zavřít">×</button></div>`);
  $("#modal").classList.add("open"); lockSync();
}
function closeModal(){ M = null; $("#modal").classList.remove("open"); $("#modal").innerHTML = ""; lockSync(); }
// POZOR: třída musí být "mopen", ne "lock" (filter na body by rozbil position:fixed)
function lockSync(){ document.body.classList.toggle("mopen", M!==null || busy); }
function modalSync(){ if(M){ if(M.keep && resolve(M.src,M.key)) showItem(M.src,M.key); else closeModal(); } }

// ---- jednotlivé stránky ----
const VIEWS = {
  char(){ const f = myFighter(), mkx = S.cls==="monk", blk = Math.min(f.blkCap,f.def*0.5+f.dex*0.3+f.blk), cap = 40+S.lvl*3;
    return playerBanner()+`<div class="cols charcols"><div>`+
      sh("Vlastnosti")+`<div class="ledger">`+
      lg("Síla",stat("str"),stat("str")/cap*100,(mkx?"+0,4":S.cls==="ninja"?"+0,5":"+1,5")+" útok · +3 HP · +0,4 obrana")+
      lg("Obratnost",stat("dex"),stat("dex")/cap*100,"iniciativa · +0,3 % blok · +"+(S.cls==="ninja"?"0,7":"0,25")+" % krit"+(mkx?"":S.cls==="ninja"?" · +1,25 útok · úhyb":" · +0,3 útok"))+
      lg("Duch",stat("spi"),stat("spi")/cap*100,"+1 energie · +0,2 obrana"+(mkx?" · +1,4 útok":""))+`</div>`+
      sh("Boj")+`<div class="ledger">`+
      lg("Útok",fmt(f.atk),null,"zbraň tvé třídy dává +25 %")+lg("Obrana",fmt(f.def),null,"sníží každý zásah o polovinu své hodnoty"+(S.cls==="samurai"?" (samuraj +20 %)":""))+
      lg("Kritický zásah",Math.round(f.crit)+" %",null,`síla ×${f.critm.toFixed(2)} · strop ${CRITCAP[S.cls]} %`+(f.critRaw>f.crit?`, přebytek ${Math.round(f.critRaw-f.crit)} % zvyšuje sílu kritu`:""))+lg("Blok",Math.round(blk)+" %",null,`zásah klesne na 40 % (max ${f.blkCap} %)`)+(f.dodge?lg("Úhyb",Math.round(f.dodge)+" %",null,"útok soupeře úplně mine"):"")+
      lg("Životy",`${fmt(S.hp)} / ${fmt(maxHp())}`,S.hp/maxHp()*100,"60 + 12 za level + Síla×3 + vybavení","hp")+
      lg("Energie",`${Math.floor(S.energy)} / ${maxEn()}`,S.energy/maxEn()*100,"100 + 5 za level + Duch + svitky","en")+`</div>`+
      sh("Postup")+`<div class="ledger">`+
      lg("Zkušenosti",`${fmt(S.xp)} / ${fmt(xpNeed())}`,S.xp/(xpNeed())*100)+lg("Sláva",fmt(S.fame),null,"získáváš ji v aréně, dungeonech a věži")+lg("Bonus klanu","+"+Math.round(clanBonus()*100)+" %",null,"k zlatu a XP")+lg("Titul",titleN()||"žádný",null,S.title?bonTxt(ACH.find(a=>a.id===S.title).b):"vyber si ho v Síni slávy")+
      lg("Čas a období",envTxt(),null,envFull())+
      (activeSetsTxt()?lg("Sada vybavení",activeSetsTxt(),null,"bonus za nošené kusy jedné sady"):"")+
      lg("Rod",race()?race().n:"neurčen",null,race()?Object.entries(race().s).map(([k,v])=>STATN[k]+" "+(v>0?"+":"−")+Math.abs(v)).join(" · ")+" · "+race().pas:"zvol si rod na stránce Podoba")+`</div>`+
      `</div><div>${dock()}</div></div><div style="margin-top:26px">${btn("Smazat postavu","G.reset()",0,"alt")}</div>`; },
  look(){ return lookPage(S, btn("Hotovo","G.tab('char')"))+sh("Rod", S.race?"změna rodu stojí 🔴 30":"první volba je zdarma")+raceCards(S.race,S.cls)+
      sh("Rámeček avatara","odemkni úspěchem, nebo kup za Rjō")+`<div class="frg">`+FRAMES.map(f=>{ const own = frOwn(f), on = (S.frame||"none")===f.k;
        return `<div class="frc ${on?"on":""} ${own?"":"lk"}"><div class="frp${f.k!=="none"?" fr fr-"+f.k:""}">${myPortrait()}</div><b>${f.n}</b><small>${own?(f.ok()?f.d:"Zakoupeno"):f.d}</small>`+
          (on?`<span class="frs">Nasazeno</span>`:own?btn("Nasadit",`G.frame('${f.k}')`,0,"alt"):f.r?btn(`Koupit · 🔴 ${f.r}`,`G.frame('${f.k}')`,S.ryo<f.r):`<span class="frs mut">Zamčeno</span>`)+`</div>`; }).join("")+`</div>`+
      sh("Podoba","změny jsou zdarma")+lookEditor(look())+`</div></div>`; },
  train(){ const cap = 40+S.lvl*3;
    return banner("train")+sh("Trénink")+rows([["str","Síla","力","útok, max HP, obrana"],["dex","Obratnost","速","iniciativa, blok, kritický zásah"],["spi","Duch","霊","max energie, obrana, útok mnicha"]].map(([k,n,g,d])=>{
      const c = Math.round(Math.pow(S.base[k],1.6)*(1-0.03*clanB("dojo"))), t10 = trainPlan(k,10), mx = trainPlan(k,0);
      return row({g,t:`${n} · ${S.base[k]}`,s:d,x:mini(S.base[k]/cap*100),r:`💰 ${fmt(c)}`,b:bq([btn("+1",`G.train('${k}')`,S.gold<c),btn(`+10 · 💰 ${fmtS(t10.c)}`,`G.train('${k}',10)`,t10.k<10,"alt"),btn(mx.k?`Max +${mx.k}`:"Max",`G.train('${k}',0)`,!mx.k,"alt")])}); })); },
  work(){ const t = S.job?Math.max(0,S.job.end-Date.now()):0, cur = S.job?JOBS[S.job.i]:null;
    const tf = ms => { const x = Math.ceil(ms/1000); return Math.floor(x/3600)+" h "+Math.floor(x%3600/60)+" m "+x%60+" s"; };
    return banner("work")+(cur?sh("Probíhající služba")+rows([row({g:kj(cur.n.split(" ")[0]),t:cur.n.replace(/^\S+ /,""),s:t>0?`Zbývá <b>${tf(t)}</b>`:"<span class=win>Hotovo</span>",b:btn("Vyzvednout","G.collect()",t>0)+btn("Zrušit","G.quitJob()",0,"alt")})]):"")+
    sh("Služba","odměna roste s tvým levelem")+rows(JOBS.map((j,i)=>[j,i]).sort((a,b)=>a[0].h-b[0].h).map(([j,i])=>row({g:kj(j.n.split(" ")[0]),t:j.n.replace(/^\S+ /,""),s:`${j.h} h`,r:`${gold(jobG(j))} · ${fmt(jobX(j))} XP`,b:btn("Nastoupit",`G.work(${i})`,S.job||S.lvl<j.lvl),lock:S.lvl<j.lvl}))); },
  arena(){ const L = arenaPower(), lv = [...new Set([L-8,L-3,L+2,L+6].map(l=>Math.max(1,Math.min(S.lvl+10,l))))];
    return banner("arena")+sh("Soupeři",`vybráni podle tvé síly (level ${L}) · ${arenaCost()} energie`)+rows(lv.map((l,i)=>{ const n = NPCS[(l+i*3)%NPCS.length].name;
      return row({g:kj(["🤺","🥷","🧘"][n.length%3]),t:n,s:`${oddsPill(odds("ar"+l,()=>npcFor(l,"x"),"arena"))}Level ${l}`,r:`${gold(Math.max(6,l*l),Math.max(12,l*l*2))} · ${fmt(Math.max(12,l*l))} XP`,b:btn("Bojovat",`G.arena(${l},'${n}')`)}); })); },
  exped(){ return banner("exped")+seasonRow()+sh("Výpravy",hidNote(EXPEDS))+rows(EXPEDS.map((e,i)=>!vis(EXPEDS,e)?"":row({g:kj(e.i),t:e.n.replace(/^\S+ /,""),s:`${S.lvl>=e.lvl?oddsPill(odds("ex"+i,exE(e),"exp")):""}Level ${e.lvl}+ · energie ${Math.ceil(e.cost*(mount()?0.7:1))}`,r:`${gold(e.g[0],e.g[1])} · ${fmt(e.xp)} XP`,b:btn("Vyrazit",`G.exped(${i})`,S.lvl<e.lvl),lock:S.lvl<e.lvl}))); },
  dungeon(){ return banner("dungeon")+sh("Dungeony",hidNote(DUNGEONS))+rows(DUNGEONS.map((d,i)=>!vis(DUNGEONS,d)?"":row({g:kj(d.i),t:d.n.replace(/^\S+ /,""),s:`${S.lvl>=d.lvl?oddsPill(odds("dn"+i,dnE(d),"dun",120)):""}Level ${d.lvl}+ · energie ${d.cost} · boss ${fmt(d.hp)} HP`,r:`${gold(d.g[0],d.g[1])} · 🔴 ${d.ryo} · ${fmt(d.xp)} XP`,b:btn("Vstoupit",`G.dungeon(${i})`,S.lvl<d.lvl),lock:S.lvl<d.lvl}))); },
  tower(){ const f = (S.tw||0)+1, bs = f%10===0, tg = towerGold(f);
    return banner("tower")+sh(`Patro ${f}`,bs?"strážce patra":"")+rows([row({g:bs?"鬼":"影",t:bs?`Strážce patra ${f}`:`Stín patra ${f}`,s:`${oddsPill(odds("tw"+f,()=>towerEnemy(f),"tw"))}Zdolaná patra: <b>${S.tw||0}</b> · energie 30`,r:`${gold(tg[0],tg[1])} · ${fmt(towerXp(f))} XP${bs?" · 🔴":""}`,b:btn("Zdolat patro","G.tower()")})]); },
  quest(){ const q = S.q||{}, today = new Date().toDateString();
    return banner("quest")+sh("Denní dar")+rows([row({g:"祝",t:"Denní dar",s:"Zlato, Rjō a plná energie i HP, jednou denně",r:`${gold(S.lvl*300)} · 🔴 5`,b:btn(S.daily===today?"Vyzvednuto":"Vyzvednout","G.daily()",S.daily===today)})])+
    sh("Opakovatelné úkoly")+rows(QUESTS.map((x,i)=>{ const p = Math.min(q[x.k]||0,x.need);
      return row({g:"巻",t:x.n,s:`${p} / ${x.need}`,x:mini(p/x.need*100),r:`${gold(S.lvl*150*x.m)} · 🔴 ${x.m*2}`,b:btn("Vyzvednout",`G.claim(${i})`,p<x.need)}); })); },
  clan(){ let h = banner("clan");
    if(!S.clan) h += sh("Založit vlastní klan")+rows([row({g:"旗",t:"Nový klan",s:"",x:`<input id="cn" placeholder="Název klanu" maxlength="24">`,r:"💰 300",b:btn("Založit","G.makeClan()")})])+sh("Vstoupit do existujícího klanu")+rows(NPC_CLANS.map(n=>row({g:"門",t:n,s:"Bonus k odměnám +3 %",b:btn("Vstoupit",`G.joinClan('${n}')`)})));
    else { const L = clanLvl(), xp = S.clan.xp||0, q = clanWq();
      h += sh(S.clan.name, `úroveň ${L} / 20`)+`<div class="panel ttl"><b>Sláva klanu ${fmt(xp)}</b><span class="mut">Další úroveň při ${fmt(50*L*L)} · bonus klanu +${Math.round(clanBonus()*100)} % k zlatu a XP</span>${mini(Math.min(100,xp/(50*L*L)*100))}</div>`+
        sh("Budovy","stavět z pokladnice")+rows(Object.entries(CLAN_B).map(([k,X])=>{ const lv = clanB(k), c = X.c(lv);
          return row({g:"族",t:`${X.n} · úroveň ${lv} / ${CLAN_MAX}`,s:X.d,r:`💰 ${fmt(c)}`,b:btn(lv>=CLAN_MAX?"Max":"Postavit",`G.clanBuild('${k}')`,lv>=CLAN_MAX||S.clan.treasury<c)}); }))+
        sh("Týdenní úkol",`${q.n} / 300`)+rows([row({g:"務",t:"Poraz 300 soupeřů tento týden",s:q.done?"Splněno, odměna vyplacena":"Každé vítězství se počítá (+2 slávy)",x:mini(q.n/300*100)})])+
        sh("Pokladnice")+rows([row({g:"庫",t:"Pokladnice",s:`Stav: 💰 ${fmt(S.clan.treasury)} · vklad dává slávu (1 za 20 zlata)`,b:btn("Vložit 50","G.donate(50)")+btn("Vložit 200","G.donate(200)",0,"alt")}),row({g:"去",t:"Opustit klan",b:btn("Opustit","G.leaveClan()",0,"alt")})]); }
    return h; },
  board(){ const all = [...NPCS,{name:S.name+" (ty)",cls:S.cls,lvl:S.lvl,fame:S.fame,me:1}].sort((a,b)=>b.lvl-a.lvl||b.fame-a.fame);
    return banner("board")+sh("Nejlepší bojovníci")+`<table class="tbl"><tr><th>#</th><th>Bojovník</th><th>Cesta</th><th>Level</th><th>Sláva</th></tr>`+all.map((p,i)=>`<tr class="${p.me?"me":""}"><td>${i+1}</td><td>${p.name}</td><td>${CLASSES[p.cls].n}</td><td>${p.lvl}</td><td>${fmt(p.fame)}</td></tr>`).join("")+`</table>`; },
  smith(){ const items = [...Object.entries(S.eq).filter(([k,v])=>v&&k!=="mount").map(([k,v])=>cell(v,"eq",k)),...S.inv.filter(i=>i.s!=="use"&&i.s!=="junk").map(i=>cell(i,"inv",i.id))];
    return banner("smith")+sh("Vylepšit předmět","klepni na předmět")+`<div class="panel"><div class="cells" style="--c:8">${items.join("")||"<p class=mut>Nemáš co vylepšit.</p>"}</div></div>`; },
  shop(){ ensureShop(); const left = Math.max(1,Math.ceil((S.shop.end-Date.now())/60000));
    return banner("shop")+`<div class="cols"><div>`+sh("Nabídka",`změna za ${left} min`)+`<div class="panel"><div class="cells" style="--c:4">${S.shop.gear.map(i=>cell(SHOP_GEAR[i],"gear",i)).join("")}</div><div style="margin-top:14px">${btn("Nová nabídka · 💰 25","G.refreshShop()",S.gold<25,"alt")}</div></div>`+
      sh("Stáje")+`<div class="panel"><div class="cells" style="--c:4">${SHOP_GEAR.map((it,i)=>it.s==="mount"?cell(it,"gear",i):"").join("")}</div></div></div><div>${dock()}</div></div>`; },
  alch(){ const sc = 5+Math.floor((S.eb||0)/10)*3;
    return banner("alch")+`<div class="cols"><div>`+sh("Lektvary a pokrmy")+`<div class="panel"><div class="cells" style="--c:4">${SHOP_USE.map((it,i)=>cell(it,"use",i)).join("")}</div></div>`+
      sh("Svitky a amulety")+rows([row({g:"守",t:"Amulet ochrany",s:`Když vylepšení od +7 selže, předmět neztratí úroveň (máš ${S.amul||0})`,r:"🔴 6",b:bq([btn("Koupit","G.buyAmul()",S.ryo<6),btn("×10 · 🔴 60","G.buyAmul(10)",S.ryo<60,"alt")])}),row({g:"札",t:"Svitek vytrvalosti",s:`Trvale +10 max energie (nyní +${S.eb||0})`,r:`🔴 ${sc}`,b:bq([btn("Koupit","G.buyScroll()",S.ryo<sc),btn("×10","G.buyScroll(10)",S.ryo<sc,"alt"),btn("Max","G.buyScroll(1e4)",S.ryo<sc,"alt")])})])+`</div><div>${dock()}</div></div>`; },
  well(){ const its = [...GEARSLOTS.filter(k=>S.eq[k]).map(k=>["eq",k,S.eq[k]]),...S.inv.filter(enchOk).map(i=>["inv",i.id,i])];
    let it = WS && resolve(WS.src,WS.key); if(!enchOk(it)){ WS = null; it = null; }
    const wc = ([src,key,i]) => `<button class="cell ${rar(i)} ${WS&&WS.src===src&&WS.key===key?"wsel":""}" aria-label="${i.n}" onclick="G.wellPick('${src}',${typeof key==="number"?key:`'${key}'`})"><span class="g">${ico(i)}</span>${i.u?`<sup>+${i.u}</sup>`:""}${(i.ench||[]).length?`<small>${i.ench.length}</small>`:""}</button>`;
    let pan = `<div class="panel mut">Vyber předmět vpravo (na mobilu níže). Očarovat jde zbraň, zbroj, pokrývka hlavy i doplněk.</div>`;
    if(it){ const n = enchSlots(it), cur = it.ench||[], lk = it.el||[], c = enchCost(it), fr = WFRESH; WFRESH = [];
      const er = k => { const x = cur[k]; if(!x) return `<div class="erow empty"><span>Volná vlastnost</span></div>`; const L = lk.includes(k), pf = x.q>=.95;
        return `<div class="erow ${L?"lk":""} ${pf?"pf":""} ${fr.includes(k)?"fresh":""}" style="animation-delay:${fr.indexOf(k)*.12}s"><span class="ev">${enchTxt(x)}${pf?" · dokonalé":""}</span>${btn(L?"Zamčeno":"Zamknout",`G.wellLock(${k})`,0,"alt lkb")}<span class="qb"><i style="width:${Math.round(x.q*100)}%"></i></span></div>`; };
      pan = `<div class="panel wpan ${fr.length?"cast":""}"><div class="whead"><div class="g">${ico(it)}</div><div><b>${it.n}${it.u?" +"+it.u:""}</b><small>${TYPE_NAME[it.s]} · level ${it.l||1} · ${n} ${n===1?"vlastnost":n<5?"vlastnosti":"vlastností"}${WS.src==="eq"?" · nasazeno":""}</small></div></div>`+
        Array.from({length:n},(_,k)=>er(k)).join("")+
        `<div style="margin-top:12px">${btn(`${cur.length?"Přečarovat":"Očarovat"} · 🔴 ${c.r} · 💰 ${fmtS(c.g)}`,"G.enchant()",S.ryo<c.r||S.gold<c.g)}</div>`+
        `<p class="mut" style="font-size:.8rem;margin:10px 0 0">Máš 🔴 ${fmt(S.ryo)}. ${lk.length?`Zamčené vlastnosti: ${lk.length} (cena ×${1+lk.length}).`:"Zamčená vlastnost zůstane, ostatní se vylosují znovu."} Pruh ukazuje kvalitu hodnoty. Počet vlastností roste s levelem předmětu (20, 50, 100, 180).</p></div>`; }
    const pool = ENCH.map(e=>e.n).join(", ");
    return banner("well")+`<div class="cols"><div>`+sh("Očarování",it?"":"vyber předmět")+pan+
      `<details class="panel" style="margin-top:14px"><summary class="mut" style="cursor:pointer">Možné vlastnosti</summary><p style="font-size:.85rem;margin:10px 0 0">${pool}. Zbraň častěji dostává útočné vlastnosti, zbroj a přilba obranné, doplněk bonusy k zlatu a zkušenostem. Hodnoty rostou s levelem předmětu.</p></details>`+
      `</div><div>`+sh("Tvé vybavení",`${its.length} předmětů`)+`<div class="panel"><div class="cells" style="--c:5">${its.map(wc).join("")||"<p class=mut>Nemáš žádné vybavení.</p>"}</div></div></div></div>`; },
  junk(){ return banner("junk")+`<div style="margin:18px 0 0">${btn("Prodat veškerou kořist z výprav","G.sellJunk()")}</div>`+sh("Batoh",`${S.inv.length} / 20`)+`<div class="panel">${bag(5)}</div>`; }
};


// ---- stránky nových systémů ----

// ---- odhad šance na výhru (simulace při plných životech, uložená, dokud se nezmění síla postavy) ----
const ODDS = {};
const powSig = () => { const f = myFighter(); return [S.lvl, Math.round(f.atk), Math.round(f.def), f.max, Math.round(f.crit), S.pet||"", env().night?1:0, enchSig()].join(); };
function odds(key, mkE, k, cap){ const id = key+"|"+powSig(); if(ODDS[id]!==undefined) return ODDS[id];
  let w = 0; const N = 14, night = env().night && ["exp","dun","camp"].includes(k);
  for(let i=0;i<N;i++){ const P = myFighter(); P.hp = P.max; const E = mkE(); if(night){ E.hp = E.max = E.max*1.15; E.atk *= 1.15; } E.atk *= 1-bon("weak"); if(fight(P,E,cap).win) w++; }
  return ODDS[id] = w/N; }
const oddsPill = p => `<span class="odd ${p>=.85?"o1":p>=.5?"o2":p>=.15?"o3":"o4"}">${p>=.85?"Snadné":p>=.5?"Vyrovnané":p>=.15?"Riskantní":"Nezvládneš"}</span>`;
// síla v aréně = nejvyšší level soupeře, kterého porazíš aspoň ve 3 ze 4 bojů
function arenaPower(){ const id = "ap|"+powSig(); if(ODDS[id]!==undefined) return ODDS[id];
  let lo = 1, hi = S.lvl+10;
  while(lo<hi){ const m = Math.ceil((lo+hi)/2); if(odds("ar"+m, ()=>npcFor(m,"x"), "arena") >= .75) lo = m; else hi = m-1; }
  return ODDS[id] = lo; }
const arenaCost = () => Math.min(45, 5+Math.floor(S.lvl/4));   // aréna nesmí být mnohem výhodnější než výpravy
const exE = e => () => ({name:"x",hp:e.hp,max:e.hp,atk:e.atk,def:e.def,dex:8,crit:8});
const dnE = d => () => ({name:"x",hp:d.hp,max:d.hp,atk:d.atk,def:d.def,dex:10+d.lvl*.5,crit:10});
function towerEnemy(f){ const bs = f%10===0, k = bs?1.5:1, N = npcFor(f,"x"), hp = Math.round(Math.max(1500+f*700, N.hp*1.1)*k);
  return {name:bs?"Strážce patra "+f:"Stín patra "+f, ico:bs?"👹":"👤", hp, max:hp, atk:Math.max(100+f*14, N.atk)*k, def:Math.max(40+f*5, N.def)*k, dex:10+f, crit:10}; }
// v seznamu lokací ukazuj 5 nejvyšších odemčených a 3 nejbližší zamčené
const vis = (list,e) => { const lv = list.map(x=>x.lvl), up = lv.filter(l=>l<=S.lvl).sort((a,b)=>b-a).slice(0,8), nx = lv.filter(l=>l>S.lvl).sort((a,b)=>a-b).slice(0,2);
  return up.includes(e.lvl) || nx.includes(e.lvl); };
const hidNote = list => { const n = list.filter(e=>!vis(list,e)).length; return n ? `${n} snadnějších lokací skryto` : ""; };
Object.assign(NPC, {
  skills:{p:"Svitky dovedností",n:"Mistr cesty",k:"星",h:40,t:["Každé dva levely získáš bod dovednosti. Vlož ho do jedné ze tří cest své třídy.","Techniky se v boji spouštějí samy, když nastane jejich chvíle."]},
  trophy:{p:"Síň slávy",n:"Kronikář",k:"印",h:46,t:["Na stěnách síně visí pečeti hrdinů. Každá trofej odemkne titul, který můžeš nosit pod svým jménem.","Nošený titul dává malý trvalý bonus. Nosit můžeš jen jeden."]},
  gems:{p:"Klenotnictví",n:"Klenotník",k:"玉",h:290,t:["Za mřížovanými okny se třpytí rubíny, nefrity a safíry. Klenotník je vsadí do tvé výbavy.","Tři stejné kameny spojí v jeden vyššího stupně. Vybavení od levelu 30 má dva sloty, od levelu 60 tři."]},
  pet:{p:"Psinec a voliéra",n:"Chovatelka",k:"爪",h:95,t:["Liška, jestřáb, tanuki i věrná akita. Každý společník bojuje po tvém boku a roste s tebou.","Společník získává zkušenosti z každého vítězství."]},
  camp:{p:"Cesta černého lotosu",n:"Příběh",k:"巻",h:350,t:["Provincie pustoší stoupenci černého lotosu a jejich pán, šógun Akuma. V prvním dějství ukonči jeho vládu, ve druhém čelíš osmihlavému drakovi Oroči.","Každá kapitola končí bossem s bohatou kořistí a drahokamem."]},
  save:{p:"Archiv",n:"Písař",k:"庫",h:44,t:["Písař opisuje kroniku tvé cesty, aby se neztratila.","Kód zálohy si ulož do poznámek. Vložíš ho zpět kdykoli, i v jiném prohlížeči nebo v nové verzi hry."]},
  boss:{p:"Světový boss",n:"Věštkyně",k:"鬼",h:0,t:["Každý den se probouzí jiný mocný démon. Máš tři pokusy, abys mu vzal co nejvíc sil.","Za 25, 50, 75 a 100 % jeho síly získáš truhly s Rjō a drahokamy."]}
});
const seasonE = () => { const X = SEAS_EXP[env().se], E = npcFor(S.lvl+3, X.n); E.ico = X.i; E.hp = E.max = Math.round(E.max*1.3); return E; };
function seasonRow(){ const e = env(), X = SEAS_EXP[e.se], L = S.lvl+3, d = S.sxd && S.sxd.day===dayN() ? S.sxd.n : 0;
  return sh(`Sezónní výprava · ${SEASONS[e.se].n}`, `${d} / 5 dnes`)+rows([row({g:kj(X.i),t:X.n,s:`${X.t}<br>${oddsPill(odds("se"+e.se,seasonE,"exp"))}Level ${L} · energie 25 · šance na drahokam`,
    r:`${gold(Math.round(L*L*1.5),L*L*3)} · ${fmt(L*L*1.5)} XP`,b:btn("Vyrazit","G.seasonExp()",d>=5)})]); }
Object.assign(VIEWS, {
  save(){ const st = {ok:`Hra se ukládá na tvůj účet${CLOUD.t?`, naposledy v ${new Date(CLOUD.t).toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"})}`:""}. Nové verze hry i jiná zařízení postavu načtou samy.`,
      ro:"Na účet teď nelze ukládat. Hra se ukládá jen v tomto prohlížeči, proto si dělej zálohu kódem níže.",
      err:"Uložení na účet se teď nepodařilo, zkusí se znovu. Mezitím se hra ukládá v tomto prohlížeči.",
      off:"Hra se ukládá jen v tomto prohlížeči. Nová verze hry otevřená jinde postavu neuvidí, proto si dělej zálohu kódem níže."}[CLOUD.st];
    return banner("save")+sh("Kde je tvá postava")+`<div class="panel ttl"><b>${CLOUD.st==="ok"?"Uloženo na účtu":"Jen v tomto prohlížeči"}</b><span class="mut">${st}</span></div>`+
      sh("Záloha","kód tvé postavy")+`<div class="panel"><textarea id="expc" class="code" readonly rows="4">${exportCode()}</textarea><div class="macts">${btn("Zkopírovat kód","G.copyCode()")}</div></div>`+
      sh("Načíst zálohu")+`<div class="panel"><textarea id="impc" class="code" rows="4" placeholder="Sem vlož kód začínající SAKURA1:"></textarea><div class="macts">${btn("Načíst zálohu","G.importCode()",0,"alt")}</div></div>`; },
  skills(){ const free = skTot()-skSpent();
    return banner("skills")+sh("Body dovedností",`volné <b>${free}</b> z ${skTot()}`)+(skSpent()?`<div class="skbar">${btn("Zapomenout vše · 🔴 20","G.skReset()",0,"alt")}</div>`:"")+
      `<div class="sktree">`+skBranches().map(b=>`<div class="skbr"><div class="skbh"><div class="seal">${gl(b.k)}</div><b>${b.b}</b><span>${b.nodes.reduce((t,n)=>t+skR(n.id),0)} b.</span></div>`+
        b.nodes.map((n,i)=>{ const r = skR(n.id), lockL = n.lvl && S.lvl<n.lvl, lockP = !b.free && i>0 && !skR(b.nodes[i-1].id), can = free>0 && r<n.max && !lockL && !lockP;
          return `<div class="skn ${r?"has":""} ${lockL||lockP?"locked":""}"><div class="skh"><b>${n.n}</b>${n.tech?"<em>Technika</em>":""}<span class="skr">${r} / ${n.max}</span></div>`+
            `<div class="pips">${Array.from({length:n.max},(_,k)=>`<i class="${k<r?"on":""}"></i>`).join("")}</div><p>${n.d(Math.max(r,1))}</p>`+
            (r && r<n.max ? `<p class="nx">Další úroveň: ${n.d(r+1)}</p>` : "")+
            `<div class="skf"><small>${lockL?`Od levelu ${n.lvl}`:lockP?"Nejdřív předchozí dovednost":r>=n.max?"Mistrovství":""}</small>${r<n.max?(b.free?bq([btn(r?"+1":"Naučit",`G.skUp('${n.id}')`,!can),btn("+10",`G.skUpN('${n.id}',10)`,!can,"alt"),btn("Max",`G.skUpN('${n.id}',999)`,!can,"alt")]):btn(r?"Zlepšit":"Naučit",`G.skUp('${n.id}')`,!can)):""}</div></div>`; }).join("")+`</div>`).join("")+`</div>`; },
  trophy(){ const got = Object.keys(S.ach||{}).length, cur = S.title && ACH.find(a=>a.id===S.title);
    return banner("trophy")+sh("Nošený titul",cur?cur.n:"žádný")+`<div class="panel ttl">${cur?`<b>${cur.n}</b><span class="rp">${bonTxt(cur.b)}</span>`:`<span class="mut">Získej trofej a vyber si titul, který budeš nosit pod jménem.</span>`}</div>`+
      sh("Bestiář",`${bestKinds()} druhů`)+`<div class="panel" style="line-height:2">${Object.keys(S.best||{}).map(n=>`<span class="gq">${n}</span>`).join(" ")||"<span class='mut'>Zatím žádný záznam. Poraz yokai ve výpravách, dungeonech nebo kampani.</span>"}</div>`+sh("Trofeje",`${got} z ${ACH.length}`)+`<div class="achg">`+ACH.map(a=>{ const ok = S.ach && S.ach[a.id], c = Math.min(a.c(),a.need), on = S.title===a.id;
        return `<div class="ach ${ok?"ok":""} ${on?"on":""}"><div class="hanko">勲</div><div class="achb"><b>${a.n}</b><small>${a.d}</small>`+
          (ok?"":`<div class="achp">${mini(c/a.need*100)}<span>${fmt(c)} / ${fmt(a.need)}</span></div>`)+
          `<p class="rp">Titul: ${bonTxt(a.b)}</p>${ok?btn(on?"Sundat":"Nosit titul",`G.title('${a.id}')`,0,on?"alt":""):""}</div></div>`; }).join("")+`</div>`; },
  gems(){ const sum = [["atk","Útok"],["hp","Životy"],["def","Obrana"],["crit","Krit %"],["stat","Vlastnosti"]].map(([k,n])=>gemSum(k)?`${n} +${gemSum(k)}`:"").filter(Boolean).join(" · ");
    const eq = GEARSLOTS.map(slot=>{ const it = S.eq[slot];
      if(!it) return `<div class="lrow locked"><div class="seal">${gl(SLOTKJ[slot])}</div><div class="rmain"><b>${SLOTN[slot]}</b><small>Nic nenasazeno</small></div></div>`;
      const n = sockets(it);
      return `<div class="lrow gemrow"><div class="gcell">${cell(it,"eq",slot)}</div><div class="rmain"><b>${it.n}${it.u?" +"+it.u:""}</b><small>${SLOTN[slot]} · ${n} ${n===1?"slot":"sloty"}</small><div class="socks">`+
        Array.from({length:n},(_,i)=>{ const g = (it.g||[])[i];
          return g ? `<button class="sock on" onclick="G.gemOut('${slot}',${i})" title="Vyjmout">${gemIco(g)}<span>${gemName(g)}<small>${gemTxt(g)}</small></span></button>`
                   : `<button class="sock" onclick="G.gemPick('${slot}',${i})"><span class="plus">+</span><span>Prázdný slot<small>vložit drahokam</small></span></button>`; }).join("")+`</div></div></div>`; }).join("");
    const bag = Object.entries(GEMS).map(([t,X])=>{ const cnt = i => (S.gems||{})[t+":"+i]||0, mg = [1,2,3,4,5,6,7,8,9].find(i=>cnt(i)>=3), mc = mg ? mergeCost(mg) : 0;
      return `<div class="lrow"><div class="seal gs">${gemIco(t+":3")}</div><div class="rmain"><b>${X.n}</b><small>+${X.v[0]} až +${fmt(X.v[9])} ${X.u} (stupně I–X)</small>`+
        `<div class="gqs">${ROM.map((r,i)=>cnt(i+1)||i<5?`<span class="gq ${cnt(i+1)?"":"z"}">${r} · ${cnt(i+1)}×</span>`:"").join("")}</div></div><div class="rright"></div>`+
        `<div class="rbtn">${bq([btn("Koupit I · 🔴 4",`G.gemBuy('${t}')`,S.ryo<4,"alt"),btn("×10 · 🔴 40",`G.gemBuy('${t}',10)`,S.ryo<40,"alt"),btn("Max",`G.gemBuyMax('${t}')`,S.ryo<8,"alt")])}${mg?bq([btn(`Spojit 3× ${ROM[mg-1]} · 💰 ${fmt(mc)}`,`G.gemMerge('${t}:${mg}')`,S.gold<mc),btn("Spojit vše",`G.gemMergeAll('${t}')`,S.gold<mc,"alt")]):""}</div></div>`; }).join("");
    return banner("gems")+sh("Osazené vybavení",sum||"zatím bez drahokamů")+`<div class="list">${eq}</div>`+sh("Váček drahokamů","3 stejné = 1 vyšší")+`<div class="list">${bag}</div>`; },
  pet(){ const p = pet(), P = p && PETS[S.pet], own = Object.keys(S.pets||{}).length;
    return banner("pet")+(p?sh("Tvůj společník")+`<div class="panel petc"><div class="hanko">${P.k}</div><div class="rmain"><b>${petName()} · level ${p.lvl}</b><small>${P.a}: ${P.d(p.lvl)} · zasáhne v ${Math.round(petCh(p.lvl)*100)} % tahů</small>`+
        `${mini(p.lvl>=30?100:p.xp/(p.lvl*8)*100)}<small>${p.lvl>=30?"Nejvyšší level":`${p.xp} / ${p.lvl*8} zkušeností`}</small></div><div class="rbtn">${(pp=>bq([btn(`Nakrmit · 💰 ${fmtS(S.lvl*40)}`,"G.petFeed()",!pp),btn(`×10 · 💰 ${fmtS(S.lvl*400)}`,"G.petFeed(10)",pp<10,"alt"),btn(pp?`Max ×${pp}`:"Max","G.petFeed(1e5)",!pp,"alt")]))(petPlan())}</div></div>`:"")+
      (p?sh("Schopnosti společníka",`volné ${petAvail()}`)+rows([row({g:"力",t:"Moc",s:`+4 % síla za bod (nyní +${Math.round(((p.sp||{}).pow||0)*4)} %)`,r:`${(p.sp||{}).pow||0} b.`,b:btn("+1","G.petSkill('pow')",petAvail()<1)}),row({g:"守",t:"Spolehlivost",s:`+2 % šance zasáhnout za bod (nyní +${Math.round(((p.sp||{}).sup||0)*2)} %)`,r:`${(p.sp||{}).sup||0} b.`,b:btn("+1","G.petSkill('sup')",petAvail()<1)})]):"")+sh(p?"Všichni společníci":"Vyber si společníka",own?"adopce 🔴 15 · přepnutí zdarma":"první je zdarma")+`<div class="rgrid">`+Object.entries(PETS).map(([k,X])=>{ const o = S.pets && S.pets[k], on = S.pet===k, l = o?o.lvl:1;
        return `<div class="rc ${on?"on":""}"><div class="hanko">${X.k}</div><div class="rcb"><b>${X.n}</b><small>${o?`Level ${o.lvl}`:"Zatím neadoptován"}</small><p class="rs">${X.a}: ${X.d(l)}</p><p class="rp">Zasáhne v ${Math.round(petCh(l)*100)} % tvých tahů</p>`+
          (on?`<p class="rf u"><em>Bojuje s tebou</em></p>`:btn(o?"Vzít s sebou":own?"Adoptovat · 🔴 15":"Adoptovat zdarma",`G.petAdopt('${k}')`,!o&&own&&S.ryo<15))+`</div></div>`; }).join("")+`</div>`; },
  camp(){ const cp = S.camp||0;
    return banner("camp")+(cp>=CAMP.length*4?`<div class="panel ttl"><b>Kampaň dokončena</b><span class="rp">${CAMP[CAMP.length-1].end}</span></div>`:cp>=24&&cp<28?`<div class="panel ttl"><b>Druhé dějství</b><span class="rp">Akuma padl, ale jeho smrt zlomila prastarou pečeť. Příběh pokračuje kapitolou ${Math.floor(cp/4)+1}.</span></div>`:"")+`<div class="chaps">`+CAMP.map((C,c)=>{
      const done = cp>=(c+1)*4, cur = Math.floor(cp/4)===c, lock = S.lvl<C.lvl, s = cp%4;
      return `<div class="chap ${done?"done":cur?"cur":""} ${lock&&!done?"locked":""}"><div class="chh"><div class="hanko">${C.who[1]}</div><div><small>Kapitola ${c+1} · od levelu ${C.lvl}</small><b>${C.n}</b></div><span class="chs">${done?"Dokončeno":cur&&!lock?`${s} / 4`:lock?`Level ${C.lvl}`:""}</span></div>`+
        (cur && !done ? `<div class="stages">${C.st.map((x,k)=>`<div class="stg ${k<s?"done":k===s?"now":""} ${k===3?"boss":""}"><span class="dot"></span><div><b>${x[0]}</b><small>${k===3?"Boss kapitoly · ":""}level ${campLvl(c,k)}</small></div></div>`).join("")}</div>`+
          `<div class="chgo">${btn(s===3?"Postavit se bossovi":"Pokračovat v příběhu","G.camp()",lock)}${lock?"":oddsPill(odds("cp"+c+"-"+s,()=>campEnemy(c,s),"camp"))}<span class="mut">energie ${s===3?30:15}</span></div>` : done ? `<p class="chend">${C.end}</p>` : "")+`</div>`; }).join("")+`</div>`; },
  boss(){ const w = wbState(), b = WB[w.day%WB.length], left = Math.max(0,w.pool-w.dmg);
    return banner("boss")+sh(`Dnešní démon: ${b[0]}`,`pokusy ${w.tries} / 3`)+`<div class="panel wbp"><div class="wbh"><div class="seal">${gl(kj(b[1]))}</div><div><b>${b[0]}</b><small>Síla démona ${fmt(left)} / ${fmt(w.pool)}</small></div></div>`+
      `<div class="wbbar"><i style="width:${left/w.pool*100}%"></i>${[75,50,25].map(m=>`<span style="left:${m}%"></span>`).join("")}</div>`+
      `<div class="wbm">${[.25,.5,.75,1].map((m,i)=>`<div class="ms ${w.got[i]?"ok":""}"><b>${m*100} %</b><small>${[3,5,8,15][i]} Rjō${i===1||i===3?" + drahokam":""}</small></div>`).join("")}</div>`+
      `<div class="chgo">${btn(w.dmg>=w.pool?"Poražen":w.tries>=3?"Zítra znovu":"Zaútočit","G.wboss()",w.tries>=3||w.dmg>=w.pool)}<span class="mut">energie 20 · boj trvá 12 tvých úderů</span></div></div>`; }
});

// ---- horní panel, navigace ----
const PREV = {};
function animateNums(){ // plynulé počítání zlata a Rjō
  document.querySelectorAll(".num[data-k]").forEach(e=>{ const k = e.dataset.k, v = +e.dataset.v, p = PREV[k]; PREV[k] = v;
    if(p===undefined || p===v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t0 = performance.now(); e.classList.add(v>p?"up":"dn");
    const st = t => { const x = Math.min(1,(t-t0)/600); e.textContent = fmt(p+(v-p)*x); if(x<1) requestAnimationFrame(st); else e.classList.remove("up","dn"); };
    requestAnimationFrame(st); }); }
function hudbar(){
  const m = (c,l,v,t) => `<div class="meter ${c}"><div class="ml"><span>${l}</span><b>${t}</b></div><div class="mbar"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`;
  return `<div class="hud"><div class="hme"><button class="ava${frc()}" onclick="G.tab('look')" aria-label="Podoba a rod">${myPortrait()}</button><div class="hn"><b>${S.name}</b><small>${race()?race().n+" · ":""}${CLASSES[S.cls].n} · level ${S.lvl}${S.job?" · ve službě":""}</small></div></div>
    <div class="meters">${m("hp","Životy",S.hp/maxHp()*100,`${fmtS(S.hp)}<span class="mx"> / ${fmtS(maxHp())}</span>`)}${m("en","Energie",S.energy/maxEn()*100,`${fmtS(Math.floor(S.energy))}<span class="mx"> / ${fmtS(maxEn())}</span>`)}${m("xp","XP",S.xp/(xpNeed())*100,`${fmtS(S.xp)}<span class="mx"> / ${fmtS(xpNeed())}</span>`)}</div>
    <div class="coins"><div class="cn"><i class="coin"></i><b class="num" data-k="gold" data-v="${S.gold}">${fmt(S.gold)}</b></div><div class="cn"><i class="coin ryo"></i><b class="num" data-k="ryo" data-v="${S.ryo}">${fmt(S.ryo)}</b></div></div></div>`; }
// mobil: spodní lišta (5 sekcí) + posuvná lišta podstránek
const curNav = () => CHARM.some(m=>m[0]===tab)?"char":MORE.some(m=>m[0]===tab)?"more":tab==="quest"?"quest":(tab==="clan"||tab==="board")?"more":MENU.wild.some(m=>m[0]===tab)?"wild":"city";
function strip(){ const c = curNav(), it = c==="city"?MENU.city:c==="wild"?MENU.wild:c==="more"?MORE:c==="char"?CHARM:[];
  return it.length ? `<div class="strip">`+it.map(([k,g,n])=>`<button class="chip ${k===tab?"on":""}" onclick="G.tab('${k}')"><span class="mk">${gl(g)}</span>${n}</button>`).join("")+`</div>` : ""; }
function bnav(){ const c = curNav();
  return `<nav class="bnav">`+[["char","人","Postava"],["city","町","Město"],["wild","野","Divočina"],["quest","務","Úkoly"],["more","他","Více"]].map(([k,g,n])=>`<button class="${k===c?"on":""}" onclick="G.nav('${k}')"><span class="bk">${gl(g)}</span>${n}</button>`).join("")+`</nav>`; }
function centerChip(){ const st = document.querySelector(".strip"), on = st && st.querySelector(".on"); if(on) st.scrollLeft = on.offsetLeft-(st.clientWidth-on.offsetWidth)/2; }
function draw(){
  const app = $("#app"); $("#tip").style.display = "none"; document.body.classList.toggle("ingame",!!S);
  document.body.classList.toggle("lookv", (!S && !!CR) || (!!S && tab==="look"));
  if(!S && CR){ closeModal();
    app.innerHTML = deco(`<div class="crt"><div class="crh"><button class="btn alt" onclick="G.back()">Zpět</button><div><h1>Rod a podoba</h1><div class="sub">${CLASSES[CR.cls].n}</div></div></div>`+
      lookPage(CR, btn("Vstoupit na cestu","G.begin()"))+sh("Rod","bonusy k vlastnostem a pasivní schopnost")+raceCards(CR.race,CR.cls)+sh("Podoba")+lookEditor(CR.look)+
      `<div class="crgo">${btn("Vstoupit na cestu","G.begin()")}</div></div></div></div>`); return; }
  if(!S && BOOT){ app.innerHTML = `<div class="hero"><h1>Cesta Meče a Sakury</h1><div class="sub">武士道</div><p class="mut">Načítám tvou postavu…</p></div>`; return; }
  if(!S){ closeModal();
    app.innerHTML = deco(`<div class="hero"><div class="hero-wrap"><div class="hero-bg">${art(262)}</div><div class="petals">${Array.from({length:9},(_,i)=>`<i class="petal" style="left:${6+i*11}%;animation-delay:${(i*.9).toFixed(1)}s;animation-duration:${(9+(i%4)*1.6).toFixed(1)}s"></i>`).join("")}</div><div class="hero-in"><h1>Cesta Meče a Sakury</h1><div class="sub">武士道</div>${ornament()}<div class="namebox"><input id="nm" placeholder="Jméno bojovníka" maxlength="20" value="${NM.replace(/"/g,"&quot;")}"></div><div class="cgrid">`+
      Object.entries(CLASSES).map(([k,c])=>`<div class="cc">${crest(k)}<h3>${c.n}</h3><p>${c.d}</p><p class="st">Síla ${c.s.str} · Obratnost ${c.s.dex} · Duch ${c.s.spi}</p>${btn("Zvolit cestu",`G.create('${k}')`)}</div>`).join("")+`</div>`+
      `<details class="impbox"><summary>Mám zálohu postavy</summary><textarea id="impc" class="code" rows="4" placeholder="Sem vlož kód začínající SAKURA1:"></textarea><div class="macts">${btn("Načíst zálohu","G.importCode()")}</div></details></div></div></div>`); return; }
  regen();
  if(MENU.city.some(m=>m[0]===tab)) grp = "city"; if(MENU.wild.some(m=>m[0]===tab)) grp = "wild";
  const mi = ([k,g,n]) => `<button class="mi ${k===tab||(k==="char"&&tab==="look")?"on":""}" onclick="G.tab('${k}')"><span class="mk">${gl(g)}</span>${n}</button>`;
  const en = enter; enter = false;
  app.innerHTML = deco(`<div class="shell"><aside class="side"><div class="brand">${logoMark()}<div><b>Cesta Meče</b><span>a Sakury</span></div></div>
    <button class="me" onclick="G.tab('look')" aria-label="Podoba a rod"><div class="ava${frc()}">${myPortrait()}</div><div><b>${S.name}</b><span>${race()?race().n+" · ":""}${CLASSES[S.cls].n} · level ${S.lvl}</span></div></button>
    <nav class="menu">${MENU.top.map(mi).join("")}<div class="seg"><button class="${grp==="city"?"on":""}" onclick="G.grp('city')">Město</button><button class="${grp==="wild"?"on":""}" onclick="G.grp('wild')">Divočina</button></div>${MENU[grp].map(mi).join("")}</nav></aside>
    <main class="main">${hudbar()}${strip()}<section class="page ${en?"enter":""}">${VIEWS[tab]()}</section><section class="log" id="log">${deco(logText)}</section></main></div>${bnav()}`);
  centerChip(); animateNums();
}


/* =====================================================================
   MODUL 7: START – načtení uložené hry a pravidelná obnova HUD
   ===================================================================== */
document.addEventListener("mouseover",e=>{ const t = $("#tip"), c = e.target.closest && e.target.closest("[data-s]");   // tooltip předmětu při najetí myší
  if(!c || !S || !window.matchMedia("(hover:hover)").matches){ t.style.display = "none"; return; }
  const src = c.dataset.s, key = ["inv","gear","use"].includes(src) ? +c.dataset.k : c.dataset.k, it = resolve(src,key);
  if(!it){ t.style.display = "none"; return; } t.innerHTML = tipHTML(it,src); t.style.display = "block"; });
document.addEventListener("mousemove",e=>{ const t = $("#tip"); if(t.style.display==="block"){ t.style.left = Math.min(e.clientX+16,innerWidth-260)+"px"; t.style.top = Math.max(8,Math.min(e.clientY+16,innerHeight-t.offsetHeight-10))+"px"; } });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });
load();
try{ draw(); }catch(e){ $("#app").innerHTML = `<div class="hero"><h1>Něco se pokazilo</h1><p class="mut">${String(e&&e.message||e)}</p><p class="mut">Tvoje postava je v bezpečí. Pošli tuto zprávu autorovi hry.</p></div>`; }
if(BOOT) cloudInit();
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="hidden") cloudFlush(); });

let tk=0; setInterval(()=>{ tk++; const live = tab==="work" && S && S.job && S.job.end+1500>Date.now();
  if(S && !busy && document.activeElement.tagName!=="INPUT" && (tk%15===0 || live)){ const y=window.scrollY; draw(); window.scrollTo(0,y); } }, 1000);
