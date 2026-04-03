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

## SKU Render (público)

```typescript
interface SkuRender {
  templateId: string;                          // ex: "caneca-350ml-black-v1"
  url: string;                                 // URL do render no CDN
  options: Record<string, string> | null;      // options do template, null = genérico
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

interface StoreProduct {
  id: string;
  title: string;
  description?: string;
  slug: string;
  productTypeId: string;
  productTypeName: string;
  assetDefinitions: AssetDefinition[];
  optionDefinitions: OptionDefinition[];
  skus: SellerProductVariant[];
  minPriceCents?: number;
  maxPriceCents?: number;
  store: { storeName: string; storeSlug: string };
  artwork: { id: string; title: string; previewUrl?: string };
  images: { url: string; altText?: string; isPrimary: boolean }[];
}
```

## Related Products

```typescript
interface RelatedProductCard {
  id: string;
  title: string;
  slug: string | null;
  minPriceCents: number | null;
  thumbnailUrl: string | null;
  productTypeName: string;
  productTypeSlug: string;
  storeSlug: string;
  artistName: string;
}
```
