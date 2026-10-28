# Cesta Meče a Sakury

Tahové RPG ze světa samurajů, yokai a černého lotosu. Hra běží celá v prohlížeči, bez build kroku a bez závislostí.

## Spuštění

Stačí otevřít `index.html` v prohlížeči, nebo spustit libovolný statický server, například:

```bash
python3 -m http.server 8000
# pak otevři http://localhost:8000
```

## Struktura

| Soubor | Obsah |
| --- | --- |
| `index.html` | Kostra stránky, načtení stylů a skriptu |
| `css/base.css` | Původní design systém (Sumi, Washi, Shu, Kin) a rozvržení |
| `css/theme.css` | Nový vizuál: noční paleta, odříznuté panely, seigaiha vlny, úvodní obrazovka, banner, karty, arena |
| `js/art.js` | Vlastní SVG grafika: znaky tříd, logo, ornamenty |
| `js/game.js` | Veškerá herní logika, data, boj a vykreslování rozhraní |

Úpravy vzhledu patří hlavně do `css/theme.css`. `base.css` zůstává jako referenční základ.

## Ukládání

Postava se ukládá do `localStorage` tohoto prohlížeče. Na stránce **Uložení** lze vytvořit zálohu jako text (`SAKURA1:…`) a načíst ji kdykoli zpět. Pokud hra běží v prostředí, které nabízí účet (`window.claude`), ukládá se postava i na účet.

## Kredity

**Grafika a ikony**

- **Vlastní SVG** (`js/art.js`): znaky tříd, logo, ornamenty a krajiny. Autor: projekt, bez externí licence.
- **game-icons.net** (plánováno pro ikony předmětů a příšer): licence [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). Každá použitá ikona bude uvedena s autorem a odkazem na zdroj. Zatím žádná ikona z tohoto zdroje v repozitáři není.
- **Kenney** (plánováno pro UI prvky a sprity): licence [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/), uvedení autora se nevyžaduje. Zatím žádný asset z tohoto zdroje v repozitáři není.

**Písma**

- **Inter** a **Shippori Mincho** z Google Fonts, licence [SIL Open Font License 1.1](https://openfontlicense.org/).
