# BigShort

Deux simulateurs statiques, sans dépendances ni collecte de données :

- `index.html` : PER, PEA et CTO.
- `enfant.html` : assurance-vie et CTO ouverts au nom d’un enfant mineur.

Le second module distingue expressément la détention par l’enfant de la donation ultérieure des titres d’un CTO parental. Cette donation est expliquée, pas intégrée au classement. Les frais, sources, limites d’éligibilité et hypothèses fiscales sont affichés dans l’interface.

## Vérification

Avec Node.js : `node tests.js`. Les tests de calcul ne nécessitent aucun paquet externe. Le premier module conserve également `EpargneCalculator.runSelfTests()` dans la console du navigateur.

Pour consulter le site, ouvrir les fichiers HTML ou servir ce dossier avec un serveur HTTP statique. GitHub Pages publie la racine de la branche `main`.

Les taux du module enfant sont centralisés dans `enfant.js` (`TAX`), les fonds dans `FUNDS` et les tarifs dans `OFFERS`. Données consultées le 24 octobre 2026. Les règles fiscales et les tarifs peuvent évoluer : ce projet est une simulation indicative, pas un conseil financier ou fiscal.
