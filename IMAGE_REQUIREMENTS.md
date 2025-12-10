# MyMental Image Requirements

## Current Status: Using Unsplash Free Images

All images are currently loaded from Unsplash (free to use). To replace with custom images, update the URLs in `/src/app/page.tsx`.

---

## Current Unsplash Images in Use

### Hero & General Images
| Location | Current Unsplash URL | Description |
|----------|---------------------|-------------|
| Hero | photo-1544367567-0f2fcb009e0b | Yoga/meditation pose |
| Video Thumbnail | photo-1573497019940-1c28c88b4f3e | Professional portrait |
| CTA | photo-1529156069898-49953e39b3ac | Group of friends |

### Condition Cards
| Condition | Unsplash Photo ID | Description |
|-----------|------------------|-------------|
| Anxiety | photo-1493836512294-502baa1986e2 | Worried expression |
| Marital Distress | photo-1516589178581-6cd7833ae3b2 | Couple silhouette |
| OCD | photo-1558618666-fcd25c85cd64 | Patterns/order |
| Psychosis | photo-1518241353330-0f7941c2d9b5 | Abstract/dreamlike |
| Insomnia | photo-1541781774459-bb2af2f05b55 | Night/sleepless |
| Sexual Addiction | photo-1507003211169-0a1dd7228f2d | Abstract portrait |
| Depression | photo-1474540412665-1cdae210ae6b | Solitude |
| PTSD | photo-1509909756405-be0199881695 | Contemplation |
| Suicidal | photo-1499209974431-9dddcece7f88 | Sunrise/hope |

---

## Animated Infographic

The statistics infographic is now **animated** instead of using a static image.

Component: `/src/components/landing/stats-infographic.tsx`

Features:
- Animated circular progress charts (50% statistics)
- Counter animation for 150,000+ surveyed
- Counter animation for Malaysia 29% statistic
- Smooth scroll-triggered animations
- Dark mode support

---

## If You Want Custom Images

To replace Unsplash images with your own:

1. Place images in `/public/images/` or `/public/conditions/`
2. Update the `IMAGES` and `CONDITIONS` constants in `/src/app/page.tsx`

### Recommended Dimensions
| Type | Dimensions |
|------|------------|
| Hero | 800x600px (4:3) |
| Video Thumbnail | 1280x720px (16:9) |
| CTA | 800x600px (4:3) |
| Condition Cards | 800x600px (4:3) |

### Image Optimization
- Compress using [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)
- Keep under 200KB per image
- Use JPG for photos, PNG for logos

---

## Partner Logos (Optional)

If you have actual partner logos:

| File Path | Partner |
|-----------|---------|
| `/public/logos/az-zahrah.png` | Az-Zahrah |
| `/public/logos/mqa.png` | MQA |

---

## Free Image Sources

- [Unsplash](https://unsplash.com) - High quality, free to use
- [Pexels](https://pexels.com) - Free stock photos
- [Freepik](https://freepik.com) - Free vectors and photos
- [Pixabay](https://pixabay.com) - Free images
