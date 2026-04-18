---
sidebar_position: 3
title: TypeScript Types
---

# TypeScript Types

Types de referência para integração com o frontend.

## Assets

```typescript
interface ProductTypeAsset {
  id: string;
  productTypeId: string;
  key: string;       // "size", "finish", "material"
  value: string;     // "350ml", "glossy", "cotton"
  labelPt: string;
  labelEn?: string;
  isActive: boolean;
}
```

## Options

```typescript
type DisplayBehavior = 'filter' | 'show_all';

interface ProductTypeOption {
  id: string;
  productTypeId: string;
  key: string;
  labelPt: string;
  labelEn?: string;
  inputType: 'select' | 'radio' | 'color_picker';
  displayBehavior: DisplayBehavior;
  required: boolean;
  isActive: boolean;
  values: ProductTypeOptionValue[];
}

interface ProductTypeOptionValue {
  id: string;
  value: string;
  labelPt: string;
  labelEn?: string;
  hexColor?: string;   // só para cores: "#000000"
  imageUrl?: string;
  isActive: boolean;
}
```

## Product Variants

```typescript
interface ProductVariant {
  id: string;
  productTypeId: string;
  assets: Record<string, string>; // {"size": "350ml", "finish": "glossy"}
  baseCostCents: number;
  sku: string;
  isActive: boolean;
  productionDays: number;
  packagingDays: number;
}
```

## Templates

```typescript
interface Template {
  id: string;
  productTypeId: string;
  displayName: string;
  assets: Record<string, string>;           // obrigatório
  options: Record<string, string> | null;   // null = todas
  images: {
    baseUrl?: string;
    maskUrl?: string;
    outlineUrl?: string;
    shadowUrl?: string;
    highlightUrl?: string;
    previewUrl?: string;
  };
  configJson?: {
    printArea?: { x: number; y: number; width: number; height: number };
    sourceImage?: { width: number; height: number };
  };
  isActive: boolean;
}
```

## Seller Product

```typescript
interface SellerProductVariant {
  id: string;
  sellerProductId: string;
  productVariantId: string;
  assets: Record<string, string>;              // herdado do ProductVariant
  allowedOptions: Record<string, string[]>;    // {"color": ["black", "white"]}
  optionLabel?: string;
  priceCents: number;
  isActive: boolean;
  renders: SkuRender[];
}
```

## SKU Render

Existe uma variante **pública** (storefront) e uma **do seller** (dashboard). O frontend deve usar apenas a pública.

```typescript
// Público — retornado em GET /stores/{slug}/products/{slug}
interface SkuRender {
  templateId: string;                          // ex: "caneca-350ml-black-v1"
  url: string;                                 // URL do render no CDN
  options: Record<string, string> | null;      // options do template, null = genérico
}

// Seller dashboard — inclui placement para edição
interface SellerSkuRender extends SkuRender {
  placementX: number;          // coordenadas absolutas em pixels
  placementY: number;
  placementScale: number;      // 1.0 = tamanho original
  placementRotation: number;   // graus
}
```

## Public Product (Storefront)

```typescript
interface AssetDefinition {
  key: string;
  label: string;
  values: { value: string; label: string }[];
}

interface OptionDefinition {
  key: string;
  label: string;
  inputType: 'select' | 'radio' | 'color_picker';
  displayBehavior: DisplayBehavior;
  required: boolean;
  values: { value: string; label: string; hexColor?: string }[];
}

interface StoreProductStore {
  storeName: string;
  storeSlug: string;
  displayName?: string;
  avatarUrl?: string;
  isFollowing: boolean | null;  // null = visitante anônimo
}

interface StoreProductArtwork {
  id: string;
  title: string;
  previewUrl?: string;
  dominantColor?: string;       // hex — usado em fallback de fundo
}

interface StoreProductImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
}

interface RelatedProducts {
  sameArtwork: StoreProductResponse[];   // até 12
  sameArtist: StoreProductResponse[];    // até 12
  recommended: StoreProductResponse[];   // até 12
}

interface StoreProductResponse {
  id: string;
  title: string;
  description?: string;
  slug: string;
  tags: string[];
  backgroundColor?: string;

  productTypeId: string;
  productTypeName: string;
  productTypeSlug: string;

  assetDefinitions: AssetDefinition[];
  optionDefinitions: OptionDefinition[];
  skus: SellerProductVariant[];

  minPriceCents?: number;
  maxPriceCents?: number;

  store: StoreProductStore;
  artwork: StoreProductArtwork;
  images: StoreProductImage[];

  likesCount: number;
  isLiked: boolean | null;       // null = visitante anônimo

  relatedProducts?: RelatedProducts;   // só no endpoint de detalhe, não na listagem
}
```

:::info Related products = `StoreProductResponse` completo
Cada item em `sameArtwork[]`, `sameArtist[]` e `recommended[]` retorna **o mesmo formato** da response principal — com SKUs, renders, store, artwork, etc. Isso permite renderizar mockups reais nos cards do carousel (sem chamadas adicionais).
:::
