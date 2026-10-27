# Flujo de desarrollo

## Principios

- Trabajar en etapas pequeñas.
- Mantener una tarea principal por vez.
- Revisar el resultado antes de iniciar la etapa siguiente.
- No declarar una prueba exitosa sin ejecutarla.
- Mantener documentación y decisiones actualizadas.

## Ciclo de una funcionalidad

1. Leer los requisitos relevantes.
2. Escribir o revisar `specs/<funcionalidad>/spec.md`.
3. Desglosar el trabajo en `tasks.md`.
4. Revisar con el usuario el alcance y las decisiones importantes.
5. Implementar una tarea acotada.
6. Ejecutar las pruebas pertinentes y revisar el diff.
7. Documentar resultados, limitaciones y decisiones.
8. Marcar la tarea como terminada solo después de verificarla.

## Git

- Crear el repositorio antes de implementar funcionalidades.
- Usar commits pequeños con mensajes descriptivos.
- No incluir secretos, archivos `.env` reales ni datos privados.
- Revisar `git status` y `git diff` antes de cada commit.
- Evitar cambios no relacionados con la tarea actual.

## Uso de IA

Antes de realizar cambios, el agente debe explicar brevemente el enfoque y los archivos afectados. Si hay una decisión importante no resuelta, debe preguntar antes de asumir. Al finalizar debe indicar qué cambió, qué verificó y qué queda pendiente.

## Definición de terminado

Una tarea está terminada cuando:
- cumple sus criterios de aceptación;
- las pruebas pertinentes se ejecutaron y sus resultados se informaron con precisión;
- no quedan errores conocidos que bloqueen el objetivo;
- la documentación afectada está actualizada;
- los cambios fueron revisados.
