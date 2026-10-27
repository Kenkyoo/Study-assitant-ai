# Especificación: importación y biblioteca de documentos

- **Estado:** Borrador

## Objetivo

Permitir que un usuario autenticado suba, consulte y elimine documentos PDF propios.

## Historias de usuario

- Como usuario, quiero subir un PDF para utilizarlo como material de estudio.
- Como usuario, quiero ver si un documento está procesado o falló.
- Como usuario, quiero eliminar un documento que ya no necesito.

## Reglas y criterios de aceptación iniciales

1. Solo usuarios autenticados pueden gestionar documentos.
2. El servidor valida el tipo y tamaño del archivo.
3. Los archivos se guardan en almacenamiento privado.
4. Cada documento pertenece a un usuario.
5. El documento tiene un estado de procesamiento explícito.
6. Un error de extracción se muestra al usuario y no se presenta el documento como listo.
7. La eliminación contempla el archivo y los datos derivados.
8. Las páginas extraídas conservan su número de página original.

## Casos límite por resolver

- Archivo vacío, corrupto o con contraseña.
- PDF sin texto seleccionable.
- Archivo demasiado grande o con demasiadas páginas.
- Interrupción durante la extracción.
- Dos solicitudes de subida simultáneas.
- Eliminación mientras el documento se procesa.

## Pendientes

- Definir límites de tamaño y páginas.
- Seleccionar la biblioteca de extracción.
- Definir estados y transiciones de procesamiento.
- Definir estrategia de reintentos y limpieza de datos.
- Convertir los criterios en pruebas concretas.
