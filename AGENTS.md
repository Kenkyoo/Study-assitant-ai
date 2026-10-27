# Instrucciones para agentes de IA

## Contexto del proyecto

Recall es un asistente de estudio basado en documentos propios. El MVP contempla importar PDF, responder preguntas con referencias a las fuentes y generar cuestionarios.

## Forma de trabajo

- Trabajá en una sola tarea acotada por vez.
- Antes de implementar, resumí el objetivo, el enfoque y los archivos que esperás modificar.
- Si falta una decisión de producto o arquitectura importante, preguntá antes de asumir.
- No avances a la siguiente etapa importante sin revisión humana.
- Preferí soluciones simples y explícitas antes que abstracciones prematuras.
- No reescribas archivos ni cambies dependencias sin necesidad justificada.
- No afirmes que ejecutaste pruebas, comandos o verificaciones si no lo hiciste.
- Al terminar, resumí los cambios, las verificaciones realizadas y los pendientes.

## Calidad y tipado

- Usá TypeScript y evitá `any` salvo que exista una justificación clara.
- Validá en el servidor los datos recibidos del cliente.
- Separá la lógica de negocio de los componentes visuales.
- Escribí pruebas para lógica importante y casos límite.
- Actualizá la documentación cuando cambien decisiones o comportamientos relevantes.

## Seguridad y privacidad

- Nunca expongas claves privadas, tokens ni secretos al navegador.
- No incluyas archivos `.env` reales en Git.
- Aplicá autorización en el servidor y políticas RLS de Supabase cuando corresponda.
- No confíes en que ocultar botones en la interfaz sea suficiente para proteger recursos.
- Tratá los documentos importados y las respuestas de IA como datos no confiables.
- No envíes contenido a un proveedor externo sin que el comportamiento y sus implicaciones de privacidad estén documentados.

## Git

- Usá cambios pequeños y commits con mensajes descriptivos.
- No hagas `push`, publiques secretos ni ejecutes operaciones destructivas sin autorización explícita.
- Revisá `git diff` antes de dar una tarea por terminada.

## Alcance

- No implementes funcionalidades fuera del alcance acordado sin proponerlas primero.
- No agregues infraestructura, agentes autónomos ni servicios adicionales sin una necesidad concreta.
- Las instrucciones de este archivo no reemplazan la revisión humana.
