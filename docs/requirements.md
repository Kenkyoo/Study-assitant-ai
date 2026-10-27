# Requisitos del MVP

## 1. Objetivo

Permitir que una persona organice documentos de estudio en PDF, consulte su contenido mediante IA y compruebe lo aprendido con cuestionarios.

## 2. Usuarios y alcance

El MVP está pensado inicialmente para usuarios individuales con cuenta propia. La colaboración entre usuarios, las organizaciones y las funciones sociales quedan fuera del alcance inicial.

## 3. Requisitos funcionales

### RF-01 — Cuenta y sesión

- El usuario puede registrarse, iniciar sesión y cerrar sesión.
- Las operaciones privadas requieren una sesión válida.
- Un usuario no puede acceder a los recursos de otra cuenta.

### RF-02 — Importación de PDF

- El usuario puede subir un archivo PDF.
- El sistema valida el tipo y tamaño del archivo en el servidor.
- El sistema conserva el archivo en almacenamiento privado.
- El sistema registra el estado del procesamiento.
- Se informa si la extracción de texto falla o el PDF no es compatible.

**Pendiente de definir:** tamaño máximo, límites de páginas, tratamiento de PDF escaneados y política de eliminación.

### RF-03 — Biblioteca de documentos

- El usuario puede ver los documentos de su biblioteca.
- Puede consultar el estado de procesamiento de cada documento.
- Puede eliminar un documento propio.
- La eliminación debe contemplar tanto el archivo almacenado como los datos derivados.

### RF-04 — Extracción y organización del texto

- El sistema extrae texto de PDF que contengan texto seleccionable.
- Conserva la relación entre el texto extraído y el número de página de origen.
- El procesamiento se realiza en el servidor.
- Los errores se registran sin exponer secretos ni información innecesaria.

**Fuera del primer alcance:** OCR avanzado para documentos compuestos únicamente por imágenes, salvo que se decida incorporarlo posteriormente.

### RF-05 — Preguntas y respuestas con fuentes

- El usuario puede hacer preguntas sobre un documento procesado.
- El sistema recupera fragmentos relevantes del contenido.
- La respuesta incluye referencias a las páginas utilizadas.
- Las referencias permiten localizar el contenido original.
- Si no hay evidencia suficiente, el sistema comunica esa limitación en lugar de inventar una respuesta.

### RF-06 — Cuestionarios

- El usuario puede solicitar un cuestionario basado en un documento procesado.
- El cuestionario contiene preguntas y respuestas esperadas estructuradas.
- En la primera versión se priorizan preguntas de selección múltiple.
- El usuario puede responder y enviar sus respuestas.
- El sistema muestra la puntuación y una explicación respaldada por el material.
- Se conserva el resultado de la sesión.

## 4. Requisitos no funcionales

### RNF-01 — Seguridad

- Los secretos de proveedores externos permanecen en el servidor.
- Se aplican controles de autorización en servidor y políticas RLS de Supabase.
- Los archivos se almacenan de forma privada.
- Las entradas se validan antes de procesarse.

### RNF-02 — Privacidad

- Se documenta qué contenido se envía al proveedor de IA.
- Se revisan las condiciones de uso y privacidad del proveedor antes de elegirlo.
- Se evita enviar documentos completos cuando bastan fragmentos relevantes.

### RNF-03 — Fiabilidad

- Se contemplan errores de red, límites de la API, archivos inválidos y fallos de extracción.
- La interfaz muestra estados de carga, éxito y error.
- Las operaciones críticas tienen pruebas automatizadas.

### RNF-04 — Mantenibilidad

- TypeScript se utiliza de forma estricta.
- La lógica de negocio se mantiene separada de la presentación.
- Las decisiones arquitectónicas importantes se registran en ADR.
- Se documentan los pasos de instalación y ejecución.

### RNF-05 — Costos y límites

- Se priorizan servicios con niveles gratuitos.
- Se manejan los límites de uso y errores del proveedor de IA.
- Se evita asumir que una cuota gratuita es permanente o ilimitada.

### RNF-06 — Accesibilidad y experiencia

- La interfaz se adapta a pantallas habituales.
- Los controles principales se pueden utilizar con teclado.
- Los estados y errores se comunican con claridad.

## 5. Fuera del alcance del MVP

- Aplicación móvil nativa.
- Colaboración y bibliotecas compartidas.
- OCR avanzado.
- Repaso espaciado.
- Tarjetas de estudio independientes.
- Múltiples proveedores de IA activos simultáneamente.
- Procesamiento masivo o empresarial.

## 6. Criterios generales de aceptación

El MVP podrá considerarse funcional cuando un usuario pueda registrarse, subir un PDF de texto seleccionable, consultar preguntas con referencias correctas a páginas, completar un cuestionario generado a partir del documento y comprobar que sus datos están aislados de los de otros usuarios.

Este criterio deberá desglosarse en pruebas concretas durante cada especificación funcional.
