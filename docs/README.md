# Bol.com Playwright Testproject

Dit project bevat UI-tests geschreven in Playwright (TypeScript) voor de live website van bol.com.

---

##  Installatie-instructies

1. **Zorg dat Node.js versie 22 is geïnstalleerd**

   Controleer dit met:
   ```bash
   node -v
   ```

2. **Clone deze repository**
```bash
git clone <REPO-URL>
cd <projectmap>
```

3. **Open het project met Visual Studio Code, installeer dependencies en Playwright**
```bash
code .
npm install
npx playwright install
```

4. **Voer de tests uit met HTML-rapportage**
```bash
npx playwright test --reporter=html
```
```bash
npx playwright show-report
```

## Projectstructuur
- `e2e/tests/` – Bevat de testscenario’s

- `e2e/pages/` – Page Object Model - - - bestanden (POM)

- `playwright.config.ts` – Playwright configuratie

- `docs/README.md` – Installatie-instructies

- `docs/strategy.md` – Strategie en aanpak

