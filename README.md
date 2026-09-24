# Grandmont Group Website

Новый многостраничный сайт Grandmont Group (строительство/монтаж, Chemnitz/Sachsen, в дальнейшем — другие виды услуг).

Project documentation: `docs/`

Стек: Next.js/TypeScript. Runtime and hosting details are configured outside the public repository.

## Status

Phase 1 foundation is complete. Phase 3 public site structure is in progress:

- `/[locale]` homepage
- `/[locale]/leistungen`
- `/[locale]/leistungen/[slug]` for approved services only
- `/[locale]/kontakt`
- `/[locale]/projekte`
- `/[locale]/ratgeber`
- `/[locale]/ueber-uns`
- `/[locale]/unternehmen`
- `/[locale]/impressum`
- `/[locale]/datenschutz`
- `/api/leads`

Approved service pages currently published:

- Küchenmontage
- Möbelmontage
- Demontage
- Umzug/Möbeltransport
- Entrümpelung
- Reinigung

Regulated or pending services are intentionally not published until `docs/SERVICE_MATRIX.md` is approved.

## Commands

```bash
npm run dev
npm run lint
npm run build
```

## Runtime env

See `docs/ENVIRONMENT.md`.
