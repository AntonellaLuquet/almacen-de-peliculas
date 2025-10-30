# Ejemplo de Uso - Burndown Chart

## Escenario: Sprint 1 del Proyecto Almacén de Películas

### Configuración del Sprint
- **Nombre**: Sprint 1 - Desarrollo de Catálogo
- **Duración**: 10 días laborales (2 semanas)
- **Trabajo Total**: 50 story points
- **Equipo**: 5 desarrolladores

### Historias de Usuario Planificadas
1. Como usuario, quiero ver el catálogo de películas (13 pts)
2. Como usuario, quiero buscar películas por título (8 pts)
3. Como usuario, quiero filtrar por género (8 pts)
4. Como admin, quiero agregar nuevas películas (13 pts)
5. Como usuario, quiero ver detalles de una película (8 pts)

### Datos del Sprint (Trabajo Restante por Día)

| Día | Fecha | Trabajo Restante | Notas |
|-----|-------|------------------|-------|
| 0 | Lunes 01/11 | 50 | Sprint Planning completado |
| 1 | Martes 02/11 | 48 | Historia 5 en progreso |
| 2 | Miércoles 03/11 | 45 | Bloqueado por revisión de API |
| 3 | Jueves 04/11 | 40 | Historia 5 completada, comenzó Historia 3 |
| 4 | Viernes 05/11 | 35 | Historia 3 completada |
| 5 | Lunes 08/11 | 28 | Mitad de Historia 1 completada |
| 6 | Martes 09/11 | 22 | Historia 1 completada, comenzó Historia 2 |
| 7 | Miércoles 10/11 | 15 | Historia 2 completada, comenzó Historia 4 |
| 8 | Jueves 11/11 | 10 | Progreso en Historia 4 |
| 9 | Viernes 12/11 | 5 | Casi terminada Historia 4 |
| 10 | Lunes 15/11 | 0 | ¡Sprint completado! 🎉 |

### Análisis del Sprint

#### Resultados
- ✅ **100% del trabajo completado**
- ✅ Todas las historias entregadas
- ✅ Velocity: 5 puntos/día
- ✅ Sprint goal alcanzado

#### Observaciones
1. **Día 2-3**: Pequeño retraso por bloqueo en revisión de API
   - Acción tomada: Escalado al tech lead
   - Resultado: Resuelto en 1 día

2. **Día 5-6**: Aceleración del progreso
   - El equipo se adaptó al ritmo del sprint
   - Mejora en la colaboración

3. **Día 7-10**: Progreso constante
   - Buen ritmo sostenible
   - Sin burnout

#### Retrospectiva
**Lo que funcionó bien:**
- Daily standups efectivos para identificar bloqueos temprano
- Pair programming aceleró la resolución de problemas
- Historias bien estimadas

**Lo que mejorar:**
- Revisar APIs antes del sprint planning
- Mejorar documentación técnica

**Acciones para el próximo sprint:**
- Incluir tiempo para revisión de dependencias en planning
- Crear checklist de preparación de sprint

### Cómo Usar Este Ejemplo

#### Con la Herramienta Web (burndown-chart.html)
1. Abre `burndown-chart.html` en tu navegador
2. Ingresa:
   - Nombre: "Sprint 1 - Desarrollo de Catálogo"
   - Duración: 10 días
   - Trabajo Total: 50
3. Genera campos y completa:
   - Día 0: 50
   - Día 1: 48
   - Día 2: 45
   - Día 3: 40
   - Día 4: 35
   - Día 5: 28
   - Día 6: 22
   - Día 7: 15
   - Día 8: 10
   - Día 9: 5
   - Día 10: 0
4. Haz clic en "Generar Gráfico"

#### Con el Script Python
```bash
python burndown_generator.py
# Selecciona opción 1
# Ingresa los datos cuando se te pida
```

### Interpretación del Gráfico Resultante

El gráfico mostrará:
- **Línea ideal**: Descenso uniforme de 50 a 0 en 10 días
- **Línea real**: 
  - Días 0-2: Ligeramente por encima (inicio más lento)
  - Días 3-5: Alcanza la línea ideal
  - Días 6-10: Se mantiene en la línea ideal

**Conclusión**: Sprint exitoso con buen ritmo de trabajo y entrega completa.

### Métricas del Sprint
- **Commitment**: 50 story points
- **Completed**: 50 story points
- **Velocity**: 50 story points en 10 días = 5 pts/día
- **Success Rate**: 100%

### Próximos Pasos
1. Usar esta velocity (50 pts) como referencia para Sprint 2
2. Considerar similar capacidad para próximos sprints
3. Continuar con mejora continua basada en retrospectiva
