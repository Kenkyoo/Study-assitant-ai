# Arquitectura propuesta

## 1. Enfoque

Se propone una aplicación web con Next.js y TypeScript, usando Supabase como plataforma de datos, autenticación y almacenamiento. El objetivo es evitar mantener un backend separado en Python durante el MVP.

La arquitectura es una propuesta inicial, no una implementación verificada.

## 2. Componentes

### Aplicación Next.js

- Interfaz de usuario.
- Rutas de servidor y operaciones privadas.
- Validación de solicitudes.
- Orquestación de extracción de texto, recuperación de fragmentos y llamadas a IA.
- Control de errores y límites de uso.

La lógica de negocio debe separarse en módulos para no concentrarla en componentes visuales ni en Route Handlers extensos.

### Supabase

- **PostgreSQL:** usuarios vinculados, metadatos de documentos, texto extraído, fragmentos, cuestionarios y resultados.
- **Supabase Auth:** registro y sesiones.
- **Supabase Storage:** archivos PDF privados.
- **Row Level Security (RLS):** restricciones de acceso a los datos.

### Proveedor de IA

Se elegirá una API externa con un nivel gratuito adecuado. La integración se encapsulará detrás de una interfaz interna para reducir el acoplamiento con un proveedor concreto.

La elección requiere verificar límites vigentes, condiciones de privacidad, disponibilidad regional y formatos de respuesta estructurada.

## 3. Flujo documental previsto

1. El usuario solicita subir un PDF.
2. El servidor valida la solicitud y el archivo.
3. El archivo se guarda en un bucket privado.
4. Se extrae texto conservando los números de página.
5. Se guarda el resultado y se marca el documento como procesado o fallido.
6. Para una pregunta, se recuperan fragmentos pertinentes.
7. El servidor envía a la API de IA la pregunta y el contexto necesario.
8. La respuesta se devuelve con referencias vinculadas a los fragmentos y páginas recuperados.

El procesamiento inicial se limitará a PDF con texto seleccionable. La estrategia de ejecución y recuperación ante tareas interrumpidas se definirá en la especificación de documentos.

## 4. Búsqueda

La primera versión puede comenzar con búsqueda textual en PostgreSQL. La búsqueda semántica mediante embeddings y pgvector se evaluará después de disponer de un flujo RAG básico y pruebas de calidad.

No se adopta una base vectorial externa por anticipado.

## 5. Seguridad

- Las claves privadas solo se utilizan en el servidor.
- La clave publicable de Supabase no sustituye las políticas de autorización.
- Las políticas RLS se diseñan y prueban para cada tabla expuesta.
- Los archivos se mantienen privados y se acceden mediante operaciones autorizadas.
- Las entradas, salidas del modelo y archivos se consideran datos no confiables.
- Los límites de tamaño, frecuencia y consumo se concretarán durante la implementación.

## 6. Decisiones pendientes

- Estructura del repositorio: aplicación en la raíz o dentro de `apps/web/`.
- Proveedor y modelo de IA.
- Biblioteca de extracción de PDF.
- Límites de tamaño y páginas.
- Estrategia de procesamiento síncrono o asíncrono.
- Búsqueda textual inicial y condiciones para incorporar pgvector.
- Herramientas finales de pruebas y automatización.

Cada decisión importante se registrará en `docs/adr/` cuando se resuelva.
