# Gap Analysis Fase 1: 15 · Política de tratamiento de datos personales

**Módulo:** 15 · Política de tratamiento de datos personales  
**Fecha:** 11 de marzo de 2026  
**Fuente principal:** `docs/Plataforma Palenke_ Propuesta_fases_final.pdf`  
**Base de comparación:** implementación actual del mock en Next.js

## 1. Requisitos MVP extraídos del PDF

El PDF de Fase 1 **no define de forma explícita** un módulo autónomo de “Política de tratamiento de datos personales”.

Lo único directamente relacionado es:

- habrá autenticación y usuarios internos/admin
- la plataforma debe atender seguridad y control de acceso
- el proyecto incluye documentación técnica, no una política legal detallada

Por tanto, este módulo debe tratarse como:

- una necesidad razonable derivada del uso de datos personales, pero
- **no un alcance funcional explícitamente cerrado por el PDF**

## 2. Estado actual del repo

- existe la ruta `/politica-de-datos`
- el footer enlaza a esa página desde `SiteFooter`
- el login menciona la política de tratamiento de datos
- el contenido actual es una lista corta de bullets mock en `policyItems`

## 3. Cobertura actual

### Ya cubierto

- existe una página legal mínima
- existe acceso desde el footer
- existe referencia desde login

### Parcial

- el contenido es claramente mock y no está validado jurídicamente
- no hay control de versión, fecha de vigencia formal ni owner legal fuera de texto hardcodeado
- al no existir requisito explícito en el PDF, todavía falta cerrar si esta página forma parte del MVP contractual o es un complemento prudente

### No cubierto

- validación legal real
- fuente de contenido/versionado fuera de mock data

## 4. Qué ajustar o no ampliar en Fase 1

- no construir centro de consentimiento, cookies banner, portal de derechos ARCO/Habeas Data o automatizaciones legales
- documentar explícitamente que este módulo hoy es un complemento mock, no un entregable detallado del PDF

## 5. Propuesta docs/

```text
docs/politica-tratamiento-datos-personales/
  requirements.md
  legal-source.md
  technical-design.md
  content-model.md
  open-questions.md
```

- `requirements.md`: aclarar si la página entra o no en el alcance formal de Fase 1.
- `legal-source.md`: fuente jurídica, owner y proceso de validación del texto final.
- `technical-design.md`: ubicación en footer/login y estrategia de publicación.
- `content-model.md`: versión, vigencia, responsable, derechos del titular y canal de contacto.
- `open-questions.md`: validar con coordinación/legal si basta una página estática mínima en Fase 1.

## 6. Resumen

- OK: el repo ya tiene una página mínima coherente con el mock.
- Ajustar: no tratarla como requisito explícito del PDF si aún no está validada.
- Crear desde cero: texto legal final y fuente/versionado reales, si se confirma dentro del MVP.
