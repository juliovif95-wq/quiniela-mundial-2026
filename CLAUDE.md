# CLAUDE.md — Quiniela Mundial 2026

## Qué es este proyecto

Una plataforma web de quiniela del Mundial de Fútbol 2026 dirigida a alumnos de escuelas de educación básica. Los alumnos se registran, hacen predicciones de marcador por fase del torneo, acumulan puntos según sus aciertos, y compiten en un ranking dentro de su propia escuela.

## Ubicación del proyecto

**Carpeta local:** `D:\Code\quiniela-mundial` (con guión, sin espacio)
**URL en producción:** https://quiniela-mundial-alpha.vercel.app
**Repositorio GitHub:** juliovif95-wq/quiniela-mundial-2026
**Base de datos:** Supabase — https://cxrpflexrcriihfkfxiq.supabase.co

## Para quién es

- **Usuarios principales:** Alumnos y maestros de educación básica (primaria y secundaria)
- **Usuario administrador:** Una sola persona — usuario: juliovif95
- **Escala esperada:** 10 escuelas, entre 400 y 600 alumnos por escuela (4,000 a 6,000 usuarios en total)

## Stack tecnológico

- **Frontend:** Next.js con React, Tailwind CSS, tipografía Oswald
- **Base de datos y autenticación:** Supabase
- **Hospedaje:** Vercel (plan gratuito)
- **Control de versiones:** GitHub

## Lo que ya está construido y funcionando

1. **Registro de alumnos y maestros:** nombre completo, grado, escuela, celular, usuario y contraseña. Campo "¿Eres alumno o maestro?" con badge morado para maestros en el ranking
2. **Autenticación:** inicio y cierre de sesión para alumnos y administrador
3. **Panel del alumno:**
   - Ver partidos organizados grupo por grupo (A hasta L)
   - Indicador de progreso por grupos
   - Ingresar predicciones antes de que empiece la fase
   - Ver puntos acumulados y posición en el ranking de su escuela
4. **Sistema de puntos automático:** 1 punto por resultado correcto, 3 por marcador exacto, 0 por error
5. **Panel del administrador:** capturar resultados, gestionar escuelas, ver alumnos, gestionar fases
6. **Reset de contraseña:** el administrador puede resetear la contraseña de cualquier alumno desde "Ver alumnos"
7. **WhatsApp en login:** cuadro verde con botón que abre WhatsApp al número +52 6673183438
8. **Dashboard de resultados:** partidos organizados por grupo
9. **Ranking por escuela:** tabla de posiciones con distinción alumno/maestro
10. **Logo de escuela:** aparece en el panel del alumno según su escuela
11. **Diseño:** estilo Mundial 2026, fondo oscuro tipo estadio nocturno, siluetas SVG vectoriales de jugadores, tipografía Oswald deportiva, colores azul marino, rojo y dorado
12. **Banderas:** se intento con emojis y con flagcdn.com — pendiente de resolver en Windows/Chrome

## Pendiente antes del lanzamiento

- [x] Banderas de países — RESUELTO
- [ ] Agregar las 10 escuelas reales con sus logos
- [ ] Verificar que todos los partidos de la Fase de Grupos estén cargados con horarios correctos en UTC-7 (Sinaloa)
- [ ] Prueba completa desde celular con un alumno real
- [ ] Decidir si se conecta dominio de Hostinger

## Sistema de puntos

- 1 punto por acertar el resultado (quién gana o empate)
- 3 puntos por acertar el marcador exacto
- 0 puntos si la predicción es incorrecta

## Decisiones ya tomadas

- Predicciones por fase completa (no partido por partido)
- Un solo administrador global
- Rankings solo dentro de cada escuela (no ranking global)
- Registro abierto sin códigos de acceso
- Maestros compiten en el mismo ranking que alumnos con badge morado
- Horarios en UTC-7 (Mountain Time / Sinaloa México)
- Navegación grupo por grupo en predicciones y captura de resultados

## Estructura de datos

- **escuelas:** id, nombre, logo_url
- **perfiles:** id, nombre_completo, grado, escuela_id, celular, usuario, rol (alumno/admin), tipo_usuario (alumno/maestro)
- **partidos:** id, fase, grupo, equipo_local, equipo_visitante, fecha, goles_local_real, goles_visitante_real, cerrado
- **predicciones:** id, usuario_id, partido_id, goles_local_predicho, goles_visitante_predicho, puntos_obtenidos
- **fases:** id, nombre, estado (abierta/cerrada)

## Fases del Mundial 2026

1. Fase de grupos (48 partidos, 12 grupos A-L, inician 11 junio 2026)
2. Ronda de 32
3. Octavos de final
4. Cuartos de final
5. Semifinales
6. Tercer lugar
7. Final (19 julio 2026)

## Reglas para Claude Code

- El proyecto está en `D:\Code\quiniela-mundial` (con guión, sin espacio)
- Sin jerga técnica. Si usas un término técnico, explícalo en una línea
- Muestra el plan completo antes de hacer cualquier cambio
- No cambies funcionalidad que ya esté funcionando
- Prioriza que funcione bien en móvil
- Sesiones cortas y enfocadas — un tema por sesión para no agotar el contexto
- Al publicar: hacer commit y push a GitHub master, Vercel despliega automáticamente
