# ADR 0002: Estrategia inicial de procesamiento de documentos

- **Estado:** Propuesto
- **Fecha:** 2026-10-27

## Contexto

El MVP necesita extraer contenido de PDF y conservar la correspondencia entre texto y páginas para fundamentar las respuestas de IA.

## Decisión propuesta

Comenzar con PDF que contengan texto seleccionable, extraer el texto por página y almacenar el texto y los metadatos necesarios para recuperar fragmentos con referencias a las páginas originales.

La biblioteca concreta, los límites de tamaño y el modo de ejecutar el procesamiento deben validarse antes de implementarlos.

## Alternativas consideradas

- **Extracción en TypeScript:** mantiene un único lenguaje y simplifica el despliegue.
- **Servicio Python separado:** puede ofrecer más opciones para procesamiento avanzado, pero añade otro entorno.
- **OCR desde el inicio:** amplía la compatibilidad con PDF escaneados, pero aumenta la complejidad y el costo de procesamiento.

## Consecuencias

- Los PDF escaneados quedan fuera del alcance inicial.
- La extracción debe conservar números de página.
- Se informarán fallos de extracción sin marcar el documento como listo.
- La decisión podrá revisarse si los documentos de prueba muestran limitaciones importantes.
