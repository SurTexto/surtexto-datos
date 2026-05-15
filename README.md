# SurTexto — Periodismo de datos sobre América Latina

SurTexto es una revista semanal de periodismo de datos enfocada en América Latina. Cada viernes publicamos una edición que cubre 7 mercados — Chile, México, Argentina, Colombia, Perú, Brasil y Centroamérica — con visualizaciones de datos, narrativa editorial y rigor periodístico.

Este repositorio contiene todo lo necesario para verificar, replicar y reutilizar nuestro trabajo: artículos, código de visualizaciones, datos fuente y metodología.

---

## Por qué existe SurTexto

La prensa latinoamericana tiene un problema estructural: quien la financia, la controla. El 70-80% de los ingresos de los medios de la región proviene de un puñado de auspiciadores corporativos — banca, extractivas, retail, telecomunicaciones. Estos sectores no compran publicidad: compran silencio editorial.

SurTexto existe para demostrar que se puede hacer periodismo riguroso sobre América Latina sin publicidad corporativa, sin redacciones de 50 personas, y sin depender de nadie más que de sus lectores.

Usamos inteligencia artificial para curar y filtrar cientos de cables de agencia diariamente. Un humano — el fundador — selecciona los temas, investiga los datos, crea las visualizaciones y escribe los artículos. La IA es herramienta, no autor.

---

## Qué busca

1. **Hacer visible lo que los datos dicen** — América Latina produce datos. Institutos de estadística, organismos internacionales, registros públicos. Pero esos datos rara vez llegan al ciudadano en un formato que le permita entender lo que pasa. SurTexto traduce datos en historias visuales.

2. **Periodismo replicable** — Cada artículo que publicamos incluye los datos, el código de las visualizaciones y las fuentes. Si un lector quiere verificar una cifra, puede hacerlo. Si un investigador quiere reutilizar un gráfico, puede hacerlo. Si alguien quiere probar que nos equivocamos, tiene las herramientas para hacerlo.

3. **Cubrir América Latina como bloque** — La misma noticia afecta a Chile, Perú y Colombia de formas distintas. Los medios nacionales cubren su país. SurTexto cubre la región, mostrando patrones que solo se ven cuando miras el mapa completo.

---

## Quién lo crea

**Cristian Hernández Milla** — Fundador y editor. Geógrafo y desarrollador especializado en visualización de datos y sistemas de información geográfica. Trabaja en la intersección entre datos, tecnología y narrativa editorial.

- Web: [surtexto.com](https://surtexto.com)
- GitHub: [@SurTexto](https://github.com/SurTexto)

---

## Método

Cada artículo de SurTexto sigue un proceso riguroso:

### 1. Curación automática

Un sistema de IA (Wire Curator + Swarm Triage) filtra diariamente cables de Agencia EFE, seleccionando los más relevantes para cada mercado latinoamericano. De ~300 cables diarios, el sistema cura ~40-60 por relevancia editorial, descartando deportes, farándula y noticias fuera de la línea editorial.

### 2. Selección editorial humana

El fundador revisa el repositorio curado semanalmente y selecciona un tema por país. El criterio: ¿tiene datos? ¿permite comparación? ¿afecta la vida cotidiana? ¿dice algo que no se ha dicho?

### 3. Investigación de datos

Para cada tema seleccionado, se investigan fuentes de datos públicos:

- **APIs abiertas**: World Bank, CEPAL, FAO, NOAA
- **Institutos nacionales**: INE, INEGI, INDEC, DANE, IBGE
- **Organismos internacionales**: ONU, IDMC, ACNUR, OMS
- **Registros públicos**: presupuestos, censos, registros electorales

### 4. Verificación

Cada dato se verifica contra su fuente primaria antes de visualizarse:

- ¿La cifra tiene fuente identificada?
- ¿El periodo es correcto?
- ¿Las unidades son consistentes?
- ¿Las comparaciones son justas?
- ¿Las conclusiones están soportadas por los datos?

### 5. Narrativa + Visualización

El artículo se estructura en 5 actos (presentación, descripción, desarrollo, clímax, cierre) con visualizaciones D3.js integradas. Las visualizaciones no son gráficas decorativas — son piezas expresivas donde color, forma y posición comunican la emoción del dato.

### 6. Publicación abierta

Todo se publica aquí: el artículo, el código, los datos, las fuentes. Replicabilidad total.

---

## Vocación

SurTexto no es neutral. Tiene una línea editorial clara:

- **Perspectiva Sur Global** — Las noticias se cuentan desde América Latina, no desde Washington o Madrid.
- **Sin publicidad** — Ingresos 100% por suscripciones. Nadie nos paga por callar.
- **Datos sobre opiniones** — Preferimos un gráfico verificable a un párrafo de análisis especulativo.
- **Código abierto, datos abiertos** — El periodismo que no se puede verificar no es periodismo.

Cubrimos política, economía, sociedad y cultura. No cubrimos deportes ni farándula.

---

## Estructura del repositorio

```
surtexto-datos/
├── README.md                          ← Este archivo
├── METODOLOGIA.md                     ← Proceso editorial detallado
├── articulos/
│   └── 2026-05-16-chile-desplazados/  ← Una carpeta por artículo
│       ├── articulo.md                ← El artículo completo
│       ├── datos/                     ← Datasets usados (CSV, JSON)
│       ├── fuentes.md                 ← Tabla de fuentes verificadas
│       ├── visualizaciones/           ← Código D3.js de cada viz
│       └── img/                       ← Capturas de las viz (PNG)
└── ...
```

Cada carpeta de artículo es autocontenida: cualquier persona puede clonar el repo, abrir el artículo y verificar cada dato contra su fuente.

---

## Licencia

Los artículos y visualizaciones de SurTexto se publican bajo [Creative Commons BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Puedes reutilizar, adaptar y redistribuir el contenido siempre que cites la fuente y mantengas la misma licencia.

Los datos provienen de fuentes públicas y están sujetos a sus respectivas licencias.

---

## Suscríbete

Cada viernes, una edición con periodismo de datos sobre los 7 mercados de América Latina.

- **Free**: 1 artículo destacado + titulares
- **Premium** ($7 USD/mes): Edición completa + newsletter + archivo

→ [surtexto.com](https://surtexto.com)
