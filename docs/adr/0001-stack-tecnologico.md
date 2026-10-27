# ADR 0001: Stack tecnológico inicial

- **Estado:** Propuesto
- **Fecha:** 2026-10-27

## Contexto

Recall necesita una aplicación web para gestionar documentos de estudio, responder preguntas sobre su contenido y generar cuestionarios. El proyecto busca ser una experiencia de aprendizaje y una pieza de portfolio, con costos bajos y una cantidad reducida de servicios que mantener.

## Decisión propuesta

- Next.js y TypeScript para interfaz y lógica de servidor.
- Supabase para PostgreSQL, autenticación y almacenamiento de archivos.
- Una API externa de IA con nivel gratuito, elegida después de revisar límites y privacidad.
- Git y GitHub para control de versiones.
- Pruebas automatizadas incorporadas progresivamente.

No se añadirá un backend Python separado al MVP.

## Alternativas consideradas

### Next.js + Django + PostgreSQL

Ventaja: ecosistema Python amplio para procesamiento documental y servicios de IA.

Desventaja: dos entornos de aplicación, dos stacks y mayor mantenimiento inicial.

### Next.js + backend TypeScript + Supabase

Ventaja: lenguaje principal único, menor complejidad operativa y buena integración con el stack elegido.

Desventaja: algunas bibliotecas especializadas de procesamiento documental pueden ser más maduras en Python.

## Consecuencias

- Se priorizan bibliotecas TypeScript para las necesidades iniciales.
- El procesamiento documental se mantiene modular para permitir cambios futuros.
- Se podrá incorporar un servicio independiente si aparece una necesidad concreta que lo justifique.
- Esta decisión se revisará si las limitaciones técnicas reales lo requieren.
