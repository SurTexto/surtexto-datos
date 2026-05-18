# Colombia: violencia LGBTIQ+ — datos, visualizaciones y fuentes

**Artículo:** [Colombia: 270 personas LGBTIQ+ asesinadas en 2025](https://surtexto.com/ediciones/colombia-violencia-lgbtiq)  
**Publicación:** 17 de mayo de 2026  
**Categoría:** Sociedad · Derechos Humanos

---

## Hallazgos principales

- **270 personas LGBTIQ+** fueron asesinadas en Colombia en 2025 — un homicidio cada 32 horas.
- La cifra representa un **aumento del 63%** respecto a 2024 (165 homicidios).
- **Valle del Cauca (46), Antioquia (41) y Bogotá (40)** concentran el 47% de los casos.
- El **86%** de los casos permanece en etapa de indagación preliminar, sin avances judiciales.
- Colombia lidera la violencia contra personas LGBTIQ+ en América Latina.

---

## Datos disponibles

| Archivo | Descripción | Tipo de dato |
|---------|-------------|--------------|
| `datos/homicidios-colombia-2021-2025.csv` | Serie temporal homicidios LGBTIQ+ 2021-2025 | Real |
| `datos/violencias-colombia-2025.csv` | Tipos de violencia documentados en 2025 | Real |
| `datos/impunidad-homicidios-colombia.csv` | Estado judicial de los casos | Real |
| `datos/homicidios-por-departamento-2025.csv` | Distribución departamental 2025 | Real (top 6) + Estimado (resto) |

Los datos de los 6 departamentos con mayor número de casos (Valle del Cauca, Antioquia, Bogotá, Bolívar, Atlántico, Magdalena) son cifras reales del informe de Caribe Afirmativo. Los restantes son estimaciones basadas en la distribución proporcional del informe.

---

## Visualizaciones

El artículo incluye 5 visualizaciones construidas con D3.js v7:

1. **Serie temporal** — Homicidios LGBTIQ+ en Colombia, 2021-2025
2. **Muro interactivo** — Estructura de la violencia: 7 tipos de agresión como muros que sortear
3. **Treemap de impunidad** — Distribución del estado judicial de los 270 casos
4. **Mapa coroplético** — Distribución departamental de homicidios, 2025
5. **Sierra colombiana** — Metáfora visual: derechos reconocidos vs. violencia documentada

---

## Fuentes

- **Caribe Afirmativo** — Informe "Un sistema que falla: prejuicio, violencia e impunidad contra las personas LGBTIQ+ en Colombia", mayo 2026. 270 homicidios en 2025. [caribeafirmativo.lgbt](https://caribeafirmativo.lgbt)
- **Caribe Afirmativo** — Informe anual DDHH 2024: 165 personas LGBTIQ+ asesinadas.
- **Sin Violencia LGBTIQ+** — Informe anual 2024: 361 homicidios LGBTIQ+ en América Latina y el Caribe. Colombia: 175 (48% del total). 9 condenas. [sinviolencia.lgbt](https://sinviolencia.lgbt)
- **Colombia Diversa / Cerosetenta (Uniandes)** — Boletín de homicidios: 86% en indagación preliminar, 6,5% avanza. [colombiadiversa.org](https://colombiadiversa.org) / [cerosetenta.uniandes.edu.co](https://cerosetenta.uniandes.edu.co)
- **CIDH** — Comunicado 093/2025 urgiendo a Colombia reforzar medidas contra violencia LGBTI. [oas.org/es/cidh](https://www.oas.org/en/IACHR/jsForm/?File=/es/cidh/prensa/comunicados/2025/093.asp)
- **Vanguardia** — Santander, epicentro de violencia contra personas LGBTIQ+ en el oriente colombiano, mayo 2026.

---

## Metodología

### Datos departamentales
Los datos por departamento del informe de Caribe Afirmativo 2026 incluyen cifras verificadas para los departamentos con mayor registro. Los valores de los demás departamentos son estimaciones proporcionales basadas en la distribución histórica documentada por la organización. Todos los archivos CSV indican en la columna `tipo_dato` si el valor es `real` o `estimado`.

### Visualización de impunidad
Los valores del treemap (232, 20, 18) se calcularon aplicando los porcentajes reportados por Colombia Diversa (86%, 7,5%, 6,5%) a los 270 homicidios de 2025. Los porcentajes del informe original pueden referirse a datos históricos; los aplicamos proporcionalmente a 2025 siguiendo la misma metodología.

---

## Código

El código fuente completo de las visualizaciones está en:  
[github.com/SurTexto/surtexto/blob/main/frontend/src/pages/ediciones/colombia-violencia-lgbtiq.astro](https://github.com/SurTexto/surtexto/blob/main/frontend/src/pages/ediciones/colombia-violencia-lgbtiq.astro)

---

*SurTexto — Periodismo de datos sobre América Latina. Todo el código y los datos son abiertos y replicables.*
