# Strategie & Aanpak

In dit document leg ik kort uit hoe ik de Playwright-tests heb opgezet, welke risico’s ik heb gezien, en welke maatregelen ik heb genomen om flaky tests te voorkomen.

---

##  Testopzet

- **Playwright met TypeScript**  
  Het project is opgezet met Playwright in combinatie met TypeScript om typeveiligheid en betere ontwikkelervaring te garanderen.

- **Page Object Model (POM)**  
  Alle pagina-interacties zijn gecapsuleerd in aparte POM-klassen onder `e2e/pages/`. Dit zorgt voor herbruikbaarheid, overzicht en een duidelijke scheiding tussen testlogica en UI-interacties.

- **Robuuste locators**  
  Waar mogelijk zijn selectors gekozen op basis van `data-test`, `role` of herkenbare CSS-klassen. Ook is gebruikgemaakt van regex binnen `getByText()` voor flexibele matching van content.

- **Helpers & Utilities**  
  Voor herhaalde logica (zoals interceptie of extractie van URL’s) zijn aparte helperfuncties geschreven, om duplicatie te vermijden.

---

##  Risico’s

- **UI-wijzigingen op de live site van bol.com**  
  Omdat de tests draaien op een live publieke omgeving, kunnen wijzigingen in de structuur, styling of selectors van de site leiden tot falende tests.

- **Rate limiting / Blokkering**  
  Het uitvoeren van te veel verzoeken kan mogelijk triggers activeren zoals rate limiting of tijdelijke blokkering van het IP-adres. Daarom zijn de tests ontworpen met minimale impact.

---

##  Flaky Tests Voorkomen

- **Gebruik van `await expect(...)` in plaats van `waitForTimeout()`**  
  Vertragingen worden niet hard gecodeerd, maar vervangen door Playwright’s `expect(...).toBeVisible()` of `toHaveURL()` zodat tests wachten tot de juiste toestand is bereikt.

- **Expliete waits op belangrijke acties**  
  Bijvoorbeeld na het klikken op knoppen of het navigeren naar een nieuwe pagina wordt gewacht op URL-veranderingen of zichtbaarheid van content.

- **Interceptors gebruikt om calls te blokkeren (bijv. Add to Cart)**  
  Door API-calls te mocken of blokkeren wordt vermeden dat echte bestellingen worden geplaatst of redirects plaatsvinden naar de winkelwagen.

---

##  Resultaat

Deze aanpak zorgt voor een stabiel, onderhoudbaar testproject waarin UI-veranderingen zo goed mogelijk worden opgevangen. Bij wijzigingen in de website kan de impact snel gelokaliseerd en opgelost worden via updates in de POM-structuur.

