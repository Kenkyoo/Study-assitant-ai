# Especificación: cuestionarios

- **Estado:** Borrador

## Objetivo

Generar un cuestionario a partir de un documento procesado y permitir que el usuario lo complete y consulte su resultado.

## Historias de usuario

- Como usuario, quiero generar preguntas sobre un documento para practicar.
- Como usuario, quiero responder preguntas y recibir una corrección.
- Como usuario, quiero consultar la puntuación de una sesión.

## Criterios de aceptación iniciales

1. Solo se generan cuestionarios a partir de documentos autorizados y procesados.
2. La generación devuelve datos estructurados que el servidor valida.
3. La primera versión prioriza selección múltiple.
4. Cada pregunta tiene una respuesta correcta definida.
5. El resultado se calcula y valida en el servidor.
6. El usuario recibe puntuación y explicación basada en el material.
7. Los resultados quedan asociados al usuario y a la sesión.

## Pendientes

- Definir cantidad de preguntas y opciones.
- Definir cómo se conservan las referencias de las explicaciones.
- Definir qué ocurre si la IA devuelve preguntas inválidas.
- Definir el modelo de datos para intentos y resultados.
- Crear ejemplos de cuestionarios para pruebas.
