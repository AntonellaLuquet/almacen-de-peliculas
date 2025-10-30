# Guía de Burndown Chart para Equipos Ágiles

## ¿Qué es un Burndown Chart?

Un **Burndown Chart** (gráfico de trabajo pendiente) es una herramienta visual utilizada en metodologías ágiles como Scrum para medir el progreso del equipo durante un sprint o proyecto. Muestra la cantidad de trabajo restante en función del tiempo.

## Componentes del Burndown Chart

1. **Eje X (horizontal)**: Días del sprint o período de tiempo
2. **Eje Y (vertical)**: Cantidad de trabajo pendiente (puede ser en story points, horas, o tareas)
3. **Línea Ideal**: Muestra cómo debería disminuir el trabajo si se completara uniformemente
4. **Línea Real**: Muestra el progreso actual del equipo

## ¿Para qué sirve?

- **Visibilidad**: Permite ver rápidamente si el equipo va por buen camino
- **Predicción**: Ayuda a predecir si se completará el trabajo a tiempo
- **Identificación de problemas**: Detecta bloqueos o impedimentos tempranamente
- **Mejora continua**: Proporciona datos para retrospectivas

## Cómo Crear un Burndown Chart

### Opción 1: Herramienta Interactiva (Recomendada)

**Versión Simple** (burndown-chart-simple.html):
- 100% offline, sin dependencias externas
- Interfaz sencilla con entrada de datos separados por comas
- Ideal para equipos que necesitan una solución rápida

1. Abre el archivo `burndown-chart-simple.html` en tu navegador
2. Ingresa el nombre de tu sprint
3. Ingresa los datos de trabajo restante separados por comas
   - Ejemplo: `50, 48, 45, 40, 35, 28, 22, 15, 10, 5, 0`
4. Haz clic en "Generar Gráfico"

**Versión Avanzada** (burndown-chart.html):
- Usa Chart.js para gráficos profesionales
- Campos individuales para cada día del sprint
- Más opciones de personalización

1. Abre el archivo `burndown-chart.html` en tu navegador
2. Ingresa los datos de tu sprint:
   - Duración del sprint (días)
   - Trabajo total inicial (story points o horas)
3. Genera campos para datos diarios
4. Completa el trabajo completado cada día
5. El gráfico se generará automáticamente

### Opción 2: Herramienta Python

Usa el script `burndown_generator.py`:

```bash
python burndown_generator.py
```

Sigue las instrucciones para ingresar:
- Nombre del sprint
- Duración en días
- Trabajo total inicial
- Trabajo completado por día

El script generará un archivo PNG con tu burndown chart.

### Opción 3: Herramientas Online

Puedes usar herramientas gratuitas como:
- **Jira**: Incluye burndown charts automáticos
- **Trello** con Power-Ups: Burndown for Trello
- **GitHub Projects**: Con extensiones de terceros
- **Excel/Google Sheets**: Plantillas personalizadas

### Opción 4: Excel/Google Sheets Manual

1. Crea una hoja de cálculo con estas columnas:
   - Día
   - Trabajo Restante
   - Línea Ideal

2. Fórmulas:
   - Línea Ideal: `=Trabajo_Inicial - (Trabajo_Inicial / Días_Sprint) * Día`
   - Trabajo Restante: Actualizar manualmente cada día

3. Crea un gráfico de líneas con ambas series

## Mejores Prácticas

### 1. Actualización Diaria
- Actualiza el burndown al final de cada día
- Usa el daily standup como recordatorio

### 2. Unidades Consistentes
- Usa siempre las mismas unidades (story points preferiblemente)
- No mezcles horas con story points

### 3. Interpretación

**El gráfico está arriba de la línea ideal:**
- El equipo va más lento de lo esperado
- Puede haber impedimentos o subestimación
- Acción: Identificar y resolver bloqueos

**El gráfico está debajo de la línea ideal:**
- El equipo va más rápido de lo esperado
- Buena velocidad o sobrestimación
- Acción: Considerar agregar más trabajo o celebrar

**El gráfico es plano:**
- No hay progreso
- Posibles bloqueos serios
- Acción urgente: Daily para identificar problemas

### 4. No usar como herramienta de presión
- El burndown es para visibilidad, no para presionar al equipo
- Enfócate en resolver impedimentos, no en culpar

### 5. Complementar con otros métricas
- **Velocity**: Trabajo completado por sprint
- **Cumulative Flow Diagram**: Vista más completa del flujo
- **Sprint Goal**: El burndown debe alinearse con el objetivo

## Ejemplo Práctico

### Sprint de 10 días, 50 story points

| Día | Línea Ideal | Trabajo Real Restante |
|-----|-------------|----------------------|
| 0   | 50          | 50                   |
| 1   | 45          | 48                   |
| 2   | 40          | 45                   |
| 3   | 35          | 40                   |
| 4   | 30          | 35                   |
| 5   | 25          | 28                   |
| 6   | 20          | 22                   |
| 7   | 15          | 15                   |
| 8   | 10          | 10                   |
| 9   | 5           | 5                    |
| 10  | 0           | 0                    |

## Recomendaciones Finales

1. **Para equipos nuevos**: Comienza con `burndown-chart-simple.html` - es simple, visual y funciona offline
2. **Para equipos establecidos**: Considera `burndown-chart.html` para una interfaz más detallada, o integra con tu herramienta de gestión (Jira, Azure DevOps)
3. **Para análisis profundo**: Usa el script Python para generar reportes históricos
4. **Para presentaciones**: Exporta los gráficos como imágenes

## Recursos Adicionales

- [Scrum Guide](https://scrumguides.org/)
- [Agile Alliance - Burndown Chart](https://www.agilealliance.org/glossary/burndown-chart/)
- Plantillas en este repositorio: `burndown-chart.html` y `burndown_generator.py`

## Soporte

Si tienes preguntas o necesitas ayuda para implementar el burndown chart en tu equipo, revisa la documentación o consulta con tu Scrum Master.
