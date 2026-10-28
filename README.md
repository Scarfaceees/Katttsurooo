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
| `css/theme.css` | Grafický upgrade: tokeny, papírové zrno, úvodní obrazovka, banner, karty, arena |
| `js/game.js` | Veškerá herní logika, data, boj a vykreslování rozhraní |

Úpravy vzhledu patří hlavně do `css/theme.css`. `base.css` zůstává jako referenční základ.

## Ukládání

Postava se ukládá do `localStorage` tohoto prohlížeče. Na stránce **Uložení** lze vytvořit zálohu jako text (`SAKURA1:…`) a načíst ji kdykoli zpět. Pokud hra běží v prostředí, které nabízí účet (`window.claude`), ukládá se postava i na účet.
