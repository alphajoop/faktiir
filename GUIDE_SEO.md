# Guide SEO Complet pour Next.js

Ce guide couvre l'implémentation complète du SEO dans votre application Next.js en suivant les meilleures pratiques.

## 📁 Structure des fichiers créés

```
├── app/
│   ├── layout.tsx              # Layout racine avec métadonnées par défaut
│   ├── sitemap.ts              # Génération automatique du sitemap
│   ├── robots.ts               # Configuration robots.txt
│   ├── manifest.ts             # Manifest PWA
│   ├── about/
│   │   └── page.tsx           # Exemple de page avec SEO personnalisé
│   └── blog/
│       └── [slug]/
│           └── page.tsx       # Exemple d'article avec métadonnées dynamiques
├── lib/
│   └── seo.ts                 # Configuration SEO centralisée
└── next.config.js             # Configuration Next.js avec optimisations SEO
```

## 🎯 Fonctionnalités implémentées

### 1. **Metadata API (Next.js 13+)**

- ✅ Métadonnées par défaut pour toutes les pages
- ✅ Template de titre personnalisable
- ✅ Support Open Graph complet
- ✅ Twitter Cards
- ✅ Métadonnées dynamiques par page

### 2. **Données structurées (JSON-LD)**

- ✅ Schema Organization
- ✅ Schema WebSite avec SearchAction
- ✅ Schema Article pour les blogs
- ✅ Schema AboutPage
- ✅ Facile à étendre pour d'autres types de schema

### 3. **Fichiers SEO automatiques**

- ✅ `sitemap.xml` généré dynamiquement
- ✅ `robots.txt` configurable
- ✅ `manifest.json` pour PWA
- ✅ Support des pages dynamiques dans le sitemap

### 4. **Optimisations Next.js**

- ✅ Compression d'images (AVIF, WebP)
- ✅ Headers de sécurité
- ✅ Optimisation des polices
- ✅ Configuration de redirections et rewrites
- ✅ Compression activée

## 🚀 Utilisation

### Utiliser les métadonnées par défaut

Dans votre `page.tsx`:

```tsx
import { defaultMetadata } from '@/lib/seo';

export const metadata = defaultMetadata;
```

### Créer des métadonnées personnalisées

```tsx
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Ma page personnalisée',
  description: 'Description unique de ma page',
  image: 'https://www.faktiir.com/ma-page-og.jpg',
});
```

### Métadonnées dynamiques (pour pages avec paramètres)

```tsx
export async function generateMetadata({ params }) {
  const data = await fetchData(params.id);

  return constructMetadata({
    title: data.title,
    description: data.description,
    image: data.image,
  });
}
```

### Empêcher l'indexation d'une page

```tsx
export const metadata = constructMetadata({
  title: 'Page privée',
  noIndex: true,
});
```

### Ajouter des données structurées JSON-LD

```tsx
export default function MyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mon produit',
    description: 'Description du produit',
    // ... autres propriétés
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      {/* Votre contenu */}
    </>
  );
}
```

## ⚙️ Configuration requise

### 1. Mettre à jour `lib/seo.ts`

Personnalisez ces valeurs:

```typescript
export const siteConfig = {
  name: 'Nom de votre site', // ← Modifier
  description: 'Description de votre site', // ← Modifier
  url: 'https://www.faktiir.com', // ← Modifier
  ogImage: 'https://www.faktiir.com/og-image.jpg', // ← Modifier
  links: {
    twitter: 'https://twitter.com/votrecompte', // ← Modifier
    github: 'https://github.com/votrecompte', // ← Modifier
  },
};
```

### 2. Créer les images nécessaires

Placez ces fichiers dans votre dossier `public/`:

- `favicon.ico` (32×32px)
- `favicon-16x16.png` (16×16px)
- `apple-touch-icon.png` (180×180px)
- `android-chrome-192x192.png` (192×192px)
- `android-chrome-512x512.png` (512×512px)
- `og-image.jpg` (1200×630px - image Open Graph par défaut)
- `logo.png` (votre logo)

### 3. Mettre à jour le sitemap

Dans `app/sitemap.ts`, ajoutez vos pages:

```typescript
// Exemple pour récupérer des articles de blog
const posts = await getPosts();
const postPages = posts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: new Date(post.updatedAt),
  changeFrequency: 'weekly' as const,
  priority: 0.7,
}));
```

### 4. Configurer robots.txt

Dans `app/robots.ts`, ajustez les règles:

```typescript
disallow: [
  '/api/',      // Routes API
  '/admin/',    // Panneau d'administration
  '/private/',  // Pages privées
],
```

## 📊 Vérification du SEO

### Outils de test recommandés:

1. **Google Search Console**
   - Soumettre votre sitemap
   - Vérifier l'indexation
   - Surveiller les performances

2. **Rich Results Test**
   - Tester vos données structurées
   - https://search.google.com/test/rich-results

3. **PageSpeed Insights**
   - Analyser les performances
   - Obtenir des recommandations Core Web Vitals

4. **Lighthouse (Chrome DevTools)**
   - Audit SEO complet
   - Vérification de l'accessibilité
   - Performance

### Checklist de vérification:

- [ ] Toutes les pages ont un titre unique
- [ ] Toutes les pages ont une meta description unique
- [ ] Images Open Graph présentes (1200×630px)
- [ ] Données structurées validées
- [ ] Sitemap accessible (`/sitemap.xml`)
- [ ] Robots.txt accessible (`/robots.txt`)
- [ ] Manifest accessible (`/site.webmanifest`)
- [ ] Toutes les images ont un attribut `alt`
- [ ] Headers de sécurité configurés
- [ ] URLs canoniques définies

## 🌍 Support multilingue (i18n)

Pour ajouter le support multilingue, décommentez dans `next.config.js`:

```javascript
i18n: {
  locales: ['fr', 'en', 'es'],
  defaultLocale: 'fr',
},
```

Puis créez des métadonnées par langue:

```tsx
export async function generateMetadata({ params }) {
  const { locale } = params;

  const translations = {
    fr: { title: 'Titre en français', description: '...' },
    en: { title: 'English title', description: '...' },
  };

  return constructMetadata({
    title: translations[locale].title,
    description: translations[locale].description,
  });
}
```

## 📈 Bonnes pratiques SEO supplémentaires

### 1. Optimisation des images

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description précise de l'image"
  width={800}
  height={600}
  priority // Pour les images above the fold
/>;
```

### 2. Liens internes

```tsx
import Link from 'next/link';

<Link href="/page" prefetch={false}>
  Texte descriptif du lien
</Link>;
```

### 3. Canonical URLs

Pour éviter le contenu dupliqué:

```tsx
export const metadata = {
  alternates: {
    canonical: 'https://www.faktiir.com/page-canonique',
  },
};
```

### 4. Pagination

```tsx
export const metadata = {
  alternates: {
    canonical: 'https://www.faktiir.com/blog',
  },
  other: {
    'og:url': 'https://www.faktiir.com/blog?page=2',
  },
};
```

## 🔧 Dépannage

### Le sitemap ne se génère pas

- Vérifiez que `app/sitemap.ts` est bien à la racine de `app/`
- Assurez-vous que la fonction est bien `export default`
- Redémarrez le serveur de développement

### Les métadonnées ne s'affichent pas

- Vérifiez l'ordre des `export` (metadata avant la fonction)
- Utilisez les DevTools pour inspecter les balises `<meta>`
- Vérifiez la console pour les erreurs

### Les données structurées ne sont pas reconnues

- Validez avec Google Rich Results Test
- Vérifiez la syntaxe JSON-LD
- Assurez-vous que le script est bien dans le composant

## 📚 Ressources utiles

- [Documentation Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO](https://web.dev/lighthouse-seo/)

## 🎓 Prochaines étapes

1. Installer Google Analytics ou votre outil d'analyse préféré
2. Configurer Google Search Console
3. Créer un compte Google Business Profile si pertinent
4. Mettre en place un blog pour le content marketing
5. Optimiser les Core Web Vitals
6. Créer une stratégie de backlinks

---

**Note**: N'oubliez pas de personnaliser toutes les valeurs par défaut avec vos propres informations avant de déployer en production!
