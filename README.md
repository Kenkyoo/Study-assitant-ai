# Recall

Recall es un asistente de estudio inteligente que permite trabajar con documentos propios, hacer preguntas sobre su contenido y practicar mediante cuestionarios.

## Objetivo del MVP

Construir una aplicación web que permita:

1. Importar y organizar documentos PDF.
2. Hacer preguntas sobre el contenido de un documento y recibir respuestas con referencias a las páginas fuente.
3. Generar y completar cuestionarios basados en el material importado.

## Stack propuesto

- **Aplicación web:** Next.js + TypeScript.
- **Estilos y componentes:** Tailwind CSS + shadcn/ui.
- **Validación:** Zod.
- **Backend y lógica de servidor:** Route Handlers y módulos de servidor de Next.js.
- **Base de datos, autenticación y almacenamiento:** Supabase (PostgreSQL, Supabase Auth y Supabase Storage).
- **IA:** API externa con nivel gratuito, seleccionada tras verificar sus límites y condiciones de privacidad.
- **Pruebas:** Vitest, React Testing Library y Playwright; herramientas finales por confirmar durante la configuración.
- **Control de versiones:** Git y GitHub.

## Estado del proyecto

El proyecto está en fase de definición. Todavía no se ha implementado la aplicación ni se ha verificado una configuración técnica.

## Documentación

- [Requisitos](docs/requirements.md)
- [Arquitectura propuesta](docs/architecture.md)
- [Flujo de desarrollo](docs/development-workflow.md)
- [Registro de decisiones arquitectónicas](docs/adr/)

## Principios de desarrollo

- Construir en etapas pequeñas y revisables.
- No afirmar que una prueba pasó sin haberla ejecutado.
- Priorizar seguridad, tipado, mantenibilidad y pruebas.
- Evitar dependencias y servicios pagos innecesarios.
- Mantener las claves y secretos fuera del cliente y del repositorio.
- Revisar los cambios antes de integrarlos.

## Estado de las decisiones

La arquitectura descrita es una propuesta inicial. Las decisiones que afecten significativamente al diseño deben revisarse y registrarse antes de implementar la funcionalidad correspondiente.
