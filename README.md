# Apps del Club de Conquistadores (HAE SYSTEMS)

| Carpeta | App | Identificador | Abre |
|---|---|---|---|
| `apps/codigocqs` | Código CQS | `net.haesystems.codigocqs` | https://clubdeconquistadores.com/codigocqs |
| `apps/clubcqs` | Reto RPSP | `net.haesystems.clubcqs` | https://clubdeconquistadores.com/rpsp |

- Hechas con Capacitor 8. Cada app muestra la web dentro de la app; los cambios en la web se ven al instante sin publicar otra versión.
- `www/offline.html`: pantalla cuando no hay internet (ES/EN/PT).
- Las carpetas `android/` e `ios/` **no** se guardan en el repositorio: Codemagic las genera en cada compilación.
- Para cambiar la dirección que abre una app: `server.url` en su `capacitor.config.json`.
- Íconos y pantalla de inicio: `assets/` de cada app (se generan con `@capacitor/assets`).
- La web reconoce la app por el agente de usuario: `CQSApp/codigocqs` o `CQSApp/clubcqs`.
- Compilación: `codemagic.yaml` (un flujo por app).
