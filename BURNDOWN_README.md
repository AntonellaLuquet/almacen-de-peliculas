# 📊 Herramientas de Burndown Chart

Este directorio contiene herramientas para medir y visualizar el burndown de tu equipo ágil.

## 🎯 ¿Qué encontrarás aquí?

### 1. **Guía Completa** (`BURNDOWN_GUIDE.md`)
- Explicación detallada de qué es un burndown chart
- Cómo interpretarlo
- Mejores prácticas
- Recomendaciones para equipos

### 2. **Herramienta Web Interactiva** (`burndown-chart.html`)
- **Recomendado para la mayoría de equipos**
- Sin instalación necesaria
- Interfaz visual intuitiva
- Gráficos en tiempo real
- Estadísticas automáticas

**Cómo usar:**
```bash
# Simplemente abre el archivo en tu navegador
open burndown-chart.html
# o
firefox burndown-chart.html
# o doble clic en el archivo
```

### 3. **Generador Python** (`burndown_generator.py`)
- Para equipos que prefieren línea de comandos
- Genera imágenes PNG de alta calidad
- Ideal para reportes y presentaciones

**Cómo usar:**
```bash
# Instalar dependencia
pip install matplotlib

# Ejecutar
python burndown_generator.py
```

## 🚀 Inicio Rápido

### Opción 1: Herramienta Web (Más Fácil)

1. Abre `burndown-chart.html` en tu navegador
2. Ingresa el nombre de tu sprint
3. Ingresa la duración (ej: 10 días)
4. Ingresa el trabajo total (ej: 50 story points)
5. Haz clic en "Generar Campos para Datos Diarios"
6. Completa el trabajo restante cada día
7. Haz clic en "Generar Gráfico"

### Opción 2: Script Python

1. Instala matplotlib: `pip install matplotlib`
2. Ejecuta: `python burndown_generator.py`
3. Selecciona opción 1 (modo interactivo)
4. Sigue las instrucciones
5. El gráfico se guardará automáticamente

### Opción 3: Generar Ejemplo

Para ver cómo funciona, ejecuta:
```bash
python burndown_generator.py
# Selecciona opción 2
```

Esto generará un ejemplo con datos de muestra.

## 📈 Interpretación del Gráfico

### Línea Ideal (Verde, Punteada)
- Muestra cómo debería bajar el trabajo si se completa uniformemente
- Es una referencia, no una meta estricta

### Línea Real (Púrpura, Sólida)
- Muestra el progreso real del equipo
- Se actualiza diariamente

### Estados Posibles

**🎯 Por debajo de la línea ideal**
- El equipo va adelantado
- Buen progreso

**⚠️ Por encima de la línea ideal**
- El equipo va atrasado
- Revisar impedimentos en el daily

**📊 Línea plana**
- Sin progreso
- Acción inmediata requerida

## 💡 Tips para Equipos

1. **Actualiza Diariamente**: Hazlo parte de tu daily standup
2. **No es para Presión**: Úsalo para visibilidad, no para culpar
3. **Detecta Patrones**: Busca tendencias en múltiples sprints
4. **Combina con Retrospectiva**: Analiza el burndown en cada retro
5. **Mantén Consistencia**: Usa siempre las mismas unidades (story points recomendado)

## 🔧 Requisitos Técnicos

### Herramienta Web
- Cualquier navegador moderno (Chrome, Firefox, Safari, Edge)
- No requiere conexión a internet (usa CDN para Chart.js pero funciona offline si se descarga)

### Script Python
- Python 3.6+
- matplotlib: `pip install matplotlib`

## 📚 Recursos Adicionales

- Lee la guía completa en `BURNDOWN_GUIDE.md`
- [Scrum Guide](https://scrumguides.org/)
- [Agile Alliance - Burndown Chart](https://www.agilealliance.org/glossary/burndown-chart/)

## 🤝 Contribuciones

Si tienes sugerencias para mejorar estas herramientas:
1. Abre un issue en el repositorio
2. Describe tu mejora propuesta
3. Si es posible, incluye un ejemplo

## 📝 Ejemplo de Uso

### Datos de Ejemplo
- Sprint: 10 días
- Trabajo Total: 50 story points
- Equipo: 5 personas

| Día | Trabajo Restante | Estado |
|-----|------------------|---------|
| 0   | 50              | Inicio |
| 1   | 48              | ✓ |
| 2   | 45              | ✓ |
| 3   | 40              | ✓ |
| 4   | 35              | ✓ |
| 5   | 28              | ✓ |
| 6   | 22              | ✓ |
| 7   | 15              | ✓ |
| 8   | 10              | ✓ |
| 9   | 5               | ✓ |
| 10  | 0               | 🎉 Completado |

Este ejemplo muestra un sprint exitoso donde el equipo completó todo el trabajo planificado.

## ❓ Preguntas Frecuentes

**P: ¿Qué unidad debo usar, story points u horas?**
R: Se recomienda story points porque representan mejor el esfuerzo relativo y evitan micromanagement.

**P: ¿Qué hago si el gráfico muestra que vamos atrasados?**
R: 
1. Identifica impedimentos en el daily
2. Considera reducir el scope del sprint
3. Pide ayuda si es necesario
4. NO presiones al equipo, enfócate en resolver problemas

**P: ¿Con qué frecuencia debo actualizar el burndown?**
R: Idealmente una vez al día, al final de la jornada o durante el daily standup.

**P: ¿Puedo usar esto para múltiples equipos?**
R: Sí, pero mantén un burndown separado para cada equipo.

## 📞 Soporte

Si necesitas ayuda:
1. Revisa la guía completa en `BURNDOWN_GUIDE.md`
2. Consulta con tu Scrum Master
3. Abre un issue en el repositorio

---

**Hecho con ❤️ para equipos ágiles**
