# Especificación: preguntas y respuestas con fuentes

- **Estado:** Borrador

## Objetivo

Permitir que un usuario consulte un documento y reciba respuestas fundamentadas en fragmentos recuperados del texto.

## Historias de usuario

- Como usuario, quiero preguntar sobre un documento para comprenderlo mejor.
- Como usuario, quiero ver las páginas que respaldan una respuesta.
- Como usuario, quiero saber cuándo el material no contiene evidencia suficiente.

## Criterios de aceptación iniciales

1. Solo se consulta un documento procesado y autorizado.
2. El sistema recupera fragmentos del documento antes de llamar al modelo.
3. La respuesta incluye referencias a las páginas utilizadas.
4. Las referencias corresponden a páginas existentes del documento.
5. Si la evidencia es insuficiente, el sistema expresa esa limitación.
6. Las claves del proveedor se mantienen en el servidor.
7. Se manejan límites de cuota, errores y tiempos de espera.

## Pendientes

- Elegir proveedor y modelo.
- Definir recuperación textual y criterios de relevancia.
- Definir estructura de la respuesta y validación de referencias.
- Definir límites de contexto y consumo.
- Diseñar un conjunto de preguntas de prueba con respuestas esperadas.
