# Sección ANEXOS — Informe de cumplimiento Palenke

Documento dedicado únicamente a **qué anexar**, **cómo nombrar archivos** y **cómo citarlos** en el informe institucional.

**Informe principal:** [INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md](./INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO.md)  
**Guía por partes:** [INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO-PARTES.md](./INFORME-CUMPLIMIENTO-OBLIGACIONES-CONTRATO-PARTES.md)

---

## 1. Reglas generales

1. **Numerar** los anexos con letras mayúsculas: Anexo A, Anexo B, etc. (o I, II, III si la entidad lo exige).
2. **Citar en el cuerpo** del informe al menos una vez cada anexo usado, por ejemplo: “como se muestra en el **Anexo A, figura 2**”.
3. **Nombrar archivos** de forma estable: `Anexo-A-01-inicio-escritorio.png`, `Anexo-A-02-inicio-movil.png`.
4. **Separar** lo que es *soporte en texto* (rutas `src/...`) de lo que es *anexo* (PDF, PNG, Excel): el código va en la tabla del informe; las capturas van aquí como carpetas/archivos adjuntos.

---

## 2. Catálogo sugerido de anexos

| Código | Título | Qué incluye |
|--------|--------|-------------|
| **A** | Evidencia visual de pantallas (capturas) | PNG o PDF con capturas móvil y escritorio de las rutas del periodo reportado. |
| **B** | Listado de entregables del periodo | Tabla (Excel/PDF): entregable, fecha, responsable, archivo principal en repo, observación. |
| **C** | Identidad visual y piezas gráficas | Paleta, tipografías, logos, exports de imágenes o storyboards de video aprobados o en uso. |
| **D** | Comunicación y validación | Actas, correos, minutas o constancia de recibo/revisión (si aplica contractualmente). |
| **E** | Ambiente de demostración | URL de staging o producción, nota de que es validación, acceso de prueba solo si procede. |
| **F** | Repositorio y versión del código | URL del repositorio, rama, commit o tag que congela el estado del periodo. |

Puede añadir **G, H…** si la entidad pide otros documentos (certificaciones, RUT, pólizas, etc.).

---

## 3. Anexo A — Inventario de capturas (plantilla)

Use esta tabla como índice del Anexo A (puede ir en la primera página del PDF del Anexo A).

| Fig. | Ruta web | Vista | Archivo físico (nombre sugerido) |
|------|-----------|--------|----------------------------------|
| 1 | `/` | Escritorio | `Anexo-A-01-inicio-desktop.png` |
| 2 | `/` | Móvil | `Anexo-A-02-inicio-mobile.png` |
| 3 | `/noticias` | Escritorio | `Anexo-A-03-noticias-desktop.png` |
| 4 | `/memoria-afroterritorial` | Escritorio | `Anexo-A-04-memoria-desktop.png` |
| 5 | `/biblioteca` | Escritorio | `Anexo-A-05-biblioteca-desktop.png` |
| 6 | `/scita` | Escritorio | `Anexo-A-06-scita-desktop.png` |
| 7 | `/scita/formulario` | Escritorio | `Anexo-A-07-scita-formulario-desktop.png` |
| 8 | `/gobierno-propio` | Escritorio | `Anexo-A-08-gobierno-propio-desktop.png` |
| 9 | `/admin/contenido-visual` | Escritorio | `Anexo-A-09-contenido-visual-desktop.png` |

Ajuste las filas según lo realmente trabajado en el mes. Si no aplica una ruta, elimíne la fila.

---

## 4. Anexo B — Entregables técnicos (plantilla)

| # | Entregable | Fecha | Responsable | Evidencia en repo | Anexo / nota |
|---|------------|-------|-------------|-------------------|--------------|
| 1 | | | | `src/app/...` | |
| 2 | | | | | |

---

## 5. Anexo E — Ficha de ambiente (plantilla)

- **Nombre del ambiente:** (ej. staging / producción / local demo)  
- **URL base:**  
- **Periodo válido de la URL:** (si expira)  
- **Credenciales:** (solo si las exige el supervisor; de no ser obligatorio, escribir “no se adjuntan por política de seguridad”).  
- **Observación:** entorno de validación, datos de prueba, etc.

---

## 6. Anexo F — Versión de código (plantilla)

- **Repositorio:**  
- **Rama:**  
- **Commit (hash corto):**  
- **Etiqueta (tag), si existe:**  
- **Fecha del commit:**  

---

## 7. Cómo integrar en el Word/PDF final

1. Al final del documento institucional, insertar página **“ANEXOS”** con lista: Anexo A … Anexo F.  
2. Después, cada anexo en hoja separada o archivo separado según norma del contratante.  
3. En la tabla “Actividades realizadas…” del informe, columna Soportes, puede escribirse: **“Anexo A, fig. 1–4”** en lugar de repetir rutas largas.
