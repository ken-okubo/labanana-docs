---
sidebar_position: 2
title: Upload de Imagens
---

# Upload de Imagens (Presign Flow)

As imagens **não passam pelo servidor da API**. O upload vai direto do seu computador para o S3 da AWS via presigned URL.

:::info Quem usa este fluxo?
- **Admin** — upload de imagens base para templates (mockups)
- **Seller** — upload de artworks (artes)
:::

## Como funciona

```mermaid
sequenceDiagram
    participant Você
    participant API as API Server
    participant S3 as AWS S3

    Você->>API: 1. POST /presign (pedir URL)
    API-->>Você: uploadUrl + key

    Você->>S3: 2. PUT arquivo (direto, 15 min)
    S3-->>Você: 200 OK

    Você->>API: 3. POST /complete (confirmar)
    API-->>Você: cdnUrl + dimensões
```

### O que é uma Presigned URL?

Uma URL temporária gerada pelo servidor que dá permissão para upload direto no S3, **sem credenciais da AWS**:

1. Servidor gera URL com assinatura criptográfica
2. URL permite **exatamente uma operação** (PUT de um arquivo específico)
3. **Expira em 15 minutos**

---

## Upload de Template

### Etapa 1: Presign

```http
POST /products/templates/{templateId}/images/presign
```

```json
{
  "kind": "base",
  "contentType": "image/png",
  "sizeBytes": 1048576
}
```

| Campo | Descrição |
| --- | --- |
| `kind` | Tipo da imagem (ver tabela abaixo) |
| `contentType` | MIME type do arquivo |
| `sizeBytes` | Tamanho em bytes |

**Kinds disponíveis:**

| Kind | Obrigatório | Descrição |
| --- | --- | --- |
| `base` | **Sim** | Imagem principal do mockup |
| `mask` | Não | Máscara da área de impressão |
| `outline` | Não | Contorno do produto |
| `shadow` | Não | Sombra (blend multiply) |
| `highlight` | Não | Brilho/reflexo (blend screen) |
| `preview` | Não | Thumbnail |

**Formatos aceitos:**

| Extensão | Content-Type | Recomendado para |
| --- | --- | --- |
| `.png` | `image/png` | Imagens com transparência (RGBA) |
| `.jpg`/`.jpeg` | `image/jpeg` | Fotos sem transparência |
| `.webp` | `image/webp` | Fotos otimizadas |

**Tamanho máximo:** 25MB por arquivo.

<details>
<summary>Response</summary>

```json
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/templates/caneca-350ml-black-v1/base.png?X-Amz-Signature=...",
  "key": "templates/caneca-350ml-black-v1/base.png",
  "kind": "base",
  "headers": { "Content-Type": "image/png" }
}
```

</details>

:::warning
Guarde o `key` — você vai precisar na Etapa 3.
:::

### Etapa 2: Upload direto no S3

Envie a imagem **diretamente para o S3** usando a `uploadUrl`:

```bash
curl -X PUT \
  "COLE_A_UPLOAD_URL_AQUI" \
  -H "Content-Type: image/png" \
  --data-binary @~/Downloads/caneca-preta.png
```

:::danger Content-Type deve ser exatamente o mesmo do presign
Se no presign mandou `image/jpeg`, aqui tem que ser `image/jpeg`. Se divergir, o S3 retorna **403 Forbidden**.
:::

**Resposta esperada:** HTTP `200 OK` com body vazio.

**Erros comuns:**

| Erro | Causa | Solução |
| --- | --- | --- |
| `403 Forbidden` | URL expirou ou Content-Type diverge | Faça presign novamente |
| `405 Method Not Allowed` | Usou POST em vez de PUT | Mude para PUT |
| `400 Bad Request` | Content-Type duplicado no header | Deixe apenas um |

### Etapa 3: Complete

```http
POST /products/templates/{templateId}/images/complete
```

```json
{
  "kind": "base",
  "key": "templates/caneca-350ml-black-v1/base.png"
}
```

<details>
<summary>Response</summary>

```json
{
  "kind": "base",
  "key": "templates/caneca-350ml-black-v1/base.png",
  "cdnUrl": "https://cdn.labanana.art/templates/caneca-350ml-black-v1/base.png",
  "widthPx": 1200,
  "heightPx": 1600
}
```

</details>

:::tip Auto-ativação
Quando você faz complete de uma imagem `base`, o template é **ativado automaticamente** (`isActive: true`).
:::

### Upload em lote (batch)

Para enviar várias imagens de uma vez:

```http
POST /products/templates/{templateId}/images/presign-batch
```

```json
{
  "images": [
    { "kind": "base", "contentType": "image/png", "sizeBytes": 1000000 },
    { "kind": "shadow", "contentType": "image/png", "sizeBytes": 500000 }
  ]
}
```

Confirmar todas de uma vez:

```http
POST /products/templates/{templateId}/images/complete-batch
```

```json
{
  "kinds": ["base", "shadow"]
}
```

---

## Upload de Artwork (Seller)

O fluxo é similar, com uma diferença: **o registro no banco só é criado no complete**.

:::info Diferença importante vs Template
- **Template**: registro criado **antes** do upload (via `POST .../templates`)
- **Artwork**: registro criado **no complete** (não existe no banco antes)
:::

### Etapa 1: Presign

```http
POST /uploads/artworks/presign
```

**Como seller:**

```json
{
  "contentType": "image/png",
  "sizeBytes": 2097152
}
```

**Como admin (criando para um seller):**

```json
{
  "contentType": "image/png",
  "sizeBytes": 2097152,
  "sellerProfileId": "uuid-do-seller"
}
```

<details>
<summary>Response</summary>

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "private/sellers/{sellerProfileId}/artworks/{artworkId}/original/v1.png",
  "artworkId": "uuid-gerado-automaticamente",
  "headers": { "Content-Type": "image/png" }
}
```

</details>

:::warning
Guarde o `key` **e** o `artworkId` — você precisa dos dois na Etapa 3.
:::

### Etapa 2: Upload direto no S3

Mesmo fluxo do template — PUT na `uploadUrl` com o mesmo `Content-Type` do presign.

### Etapa 3: Complete

```http
POST /uploads/artworks/{artworkId}/complete
```

**Como seller:**

```json
{
  "key": "private/sellers/{sellerProfileId}/artworks/{artworkId}/original/v1.png",
  "title": "Minha Arte Abstrata"
}
```

**Como admin** (deve repetir o mesmo `sellerProfileId` do presign):

```json
{
  "key": "private/sellers/{sellerProfileId}/artworks/{artworkId}/original/v1.png",
  "title": "Arte do Artista X",
  "sellerProfileId": "uuid-do-seller"
}
```

O servidor:
1. Verifica se o arquivo existe no S3
2. Extrai dimensões, formato e hash
3. Cria o registro `Artwork` no banco (vinculado ao seller)
4. Gera preview WebP (max 1200px) no bucket público

<details>
<summary>Response</summary>

```json
{
  "artworkId": "uuid",
  "artworkVersion": 1,
  "widthPx": 3000,
  "heightPx": 4000,
  "sizeBytes": 2097152,
  "mimeType": "image/png"
}
```

</details>

:::tip Transparência PNG
O arquivo vai **direto para o S3** sem processamento. Se estiver aparecendo com fundo branco em algum visualizador, pode ser:
- O **console do S3** não renderiza transparência (mostra branco)
- O PNG original pode já ter sido salvo com fundo sólido (verifique no Figma/Photoshop — se o fundo xadrez aparece, há transparência)

O preview WebP gerado mantém transparência.
:::

### Estrutura no S3

```
private/sellers/{sellerProfileId}/artworks/{artworkId}/
├── original/
│   └── v1.png          ← original (bucket privado)
├── meta/
│   └── v1.json         ← metadados

public/sellers/{sellerProfileId}/artworks/{artworkId}/
├── preview/
│   └── v1.webp         ← preview (bucket público)
└── renders/
    └── {templateId}/
        └── v1/
            └── render.webp  ← render final
```

:::info Versionamento
O `v1` no path é a versão da arte. Se o seller atualizar, a nova versão vai para `v2.png` e novos renders para `v2/`.
:::

---

## Upload de Imagens de Perfil

Avatar (seller + customer) e banner (só seller). Mesmo pattern presign → PUT S3 → complete. Bucket **público** com CDN — a URL retornada é permanente.

### Limites

| Campo | Valor |
|---|---|
| MIME | `image/png`, `image/jpeg`, `image/webp` |
| Tamanho | **5 MB** |

### Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/profiles/seller/me/upload-url` | Presign seller (`imageType: "avatar"` ou `"banner"`) |
| `POST` | `/profiles/seller/me/upload-complete` | Completa e atualiza `avatar_key` / `banner_key` |
| `DELETE` | `/profiles/seller/me/image/{imageType}` | Remove do S3 e zera a key |
| `POST` | `/profiles/customer/me/upload-url` | Presign customer (só `avatar`) |
| `POST` | `/profiles/customer/me/upload-complete` | Completa |
| `DELETE` | `/profiles/customer/me/image/avatar` | Remove avatar |

### Fluxo

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant S3

    FE->>BE: 1. POST /profiles/seller/me/upload-url<br/>{ imageType, contentType, sizeBytes }
    BE-->>FE: { uploadUrl, key, headers }

    FE->>S3: 2. PUT uploadUrl (binary) com headers
    S3-->>FE: 200 OK

    FE->>BE: 3. POST /profiles/seller/me/upload-complete<br/>{ key, imageType }
    BE->>S3: HEAD (valida existência)
    S3-->>BE: 200
    Note over BE: UPDATE seller_profile<br/>.avatar_key = key
    BE-->>FE: { url (CDN permanente), key }
```

#### Etapa 1: Presign

```http
POST /profiles/seller/me/upload-url
```

```json
{
  "imageType": "avatar",
  "contentType": "image/png",
  "sizeBytes": 1048576
}
```

<details>
<summary>Response</summary>

```json
{
  "uploadUrl": "https://s3.amazonaws.com/...",
  "key": "public/sellers/{sellerProfileId}/avatar/v1.png",
  "headers": { "Content-Type": "image/png" }
}
```

</details>

#### Etapa 2: PUT no S3

Mesmo padrão dos outros uploads — `PUT uploadUrl` com o arquivo binário e o `Content-Type` exatamente igual ao do presign.

#### Etapa 3: Complete

```http
POST /profiles/seller/me/upload-complete
```

```json
{
  "key": "public/sellers/{sellerProfileId}/avatar/v1.png",
  "imageType": "avatar"
}
```

<details>
<summary>Response</summary>

```json
{
  "url": "https://cdn.labanana.art/public/sellers/.../avatar/v1.png",
  "key": "public/sellers/{sellerProfileId}/avatar/v1.png"
}
```

</details>

A `url` é **permanente** (CDN) — guarde e use diretamente. Não precisa refresh.

:::warning Validações
- A `key` no complete **deve ser igual** à retornada no presign — o backend valida que o prefix da key bate com o profile autenticado (não dá pra fazer upload "no lugar de outro")
- Se você chamar complete antes do PUT S3 completar, o backend retorna `404` (o HEAD no S3 falha). Só chame complete depois do PUT retornar `200`
:::

### Remover imagem

```http
DELETE /profiles/seller/me/image/avatar
```

Deleta do S3 e zera `avatar_key` no perfil. O endpoint equivalente de customer só aceita `avatar`.
