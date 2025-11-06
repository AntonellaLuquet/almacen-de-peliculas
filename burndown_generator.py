#!/usr/bin/env python3
"""
Generador de Burndown Chart
============================

Este script genera un gráfico de burndown para equipos ágiles.
Permite visualizar el progreso del sprint comparando el trabajo real vs ideal.

Uso:
    python burndown_generator.py

Requisitos:
    pip install matplotlib

Autor: Sistema de Gestión Ágil
"""

import sys
from datetime import datetime, timedelta

try:
    import matplotlib.pyplot as plt
    import matplotlib.dates as mdates
except ImportError:
    print("Error: Se requiere matplotlib para generar gráficos.")
    print("Instala con: pip install matplotlib")
    sys.exit(1)


class BurndownChart:
    """Clase para generar y visualizar burndown charts"""
    
    def __init__(self, sprint_name, total_work, sprint_days):
        self.sprint_name = sprint_name
        self.total_work = total_work
        self.sprint_days = sprint_days
        self.actual_work = []
        self.dates = []
        
    def add_daily_work(self, day, remaining_work):
        """Agrega el trabajo restante para un día específico"""
        self.actual_work.append(remaining_work)
        
    def calculate_ideal_line(self):
        """Calcula la línea ideal de burndown"""
        ideal_line = []
        work_per_day = self.total_work / self.sprint_days
        
        for day in range(self.sprint_days + 1):
            remaining = self.total_work - (work_per_day * day)
            ideal_line.append(max(0, remaining))
            
        return ideal_line
    
    def generate_chart(self, filename=None):
        """Genera el gráfico de burndown"""
        if not self.actual_work:
            print("Error: No hay datos de trabajo real para graficar")
            return False
            
        # Preparar datos
        days = list(range(len(self.actual_work)))
        ideal_line = self.calculate_ideal_line()[:len(self.actual_work)]
        
        # Crear figura
        plt.figure(figsize=(12, 7))
        
        # Graficar líneas
        plt.plot(days, ideal_line, 
                label='Línea Ideal', 
                linestyle='--', 
                color='#4BC0C0',
                linewidth=2,
                marker='o',
                markersize=6,
                alpha=0.7)
        
        plt.plot(days, self.actual_work, 
                label='Progreso Real', 
                linestyle='-', 
                color='#9966FF',
                linewidth=3,
                marker='s',
                markersize=7)
        
        # Configuración del gráfico
        plt.title(f'{self.sprint_name} - Burndown Chart', 
                 fontsize=18, 
                 fontweight='bold',
                 pad=20)
        plt.xlabel('Días del Sprint', fontsize=14, fontweight='bold')
        plt.ylabel('Trabajo Restante (Story Points / Horas)', fontsize=14, fontweight='bold')
        plt.legend(loc='upper right', fontsize=12, framealpha=0.9)
        plt.grid(True, alpha=0.3, linestyle=':', linewidth=1)
        
        # Configurar ejes
        plt.xlim(-0.5, len(self.actual_work) - 0.5)
        plt.ylim(0, self.total_work * 1.1)
        
        # Añadir anotaciones
        last_actual = self.actual_work[-1]
        last_ideal = ideal_line[-1]
        
        if last_actual < last_ideal:
            status = "Adelantado 🎯"
            color = 'green'
        elif last_actual > last_ideal:
            status = "Atrasado ⚠️"
            color = 'orange'
        else:
            status = "En Tiempo ✓"
            color = 'blue'
            
        plt.text(0.02, 0.98, f'Estado: {status}', 
                transform=plt.gca().transAxes,
                fontsize=12,
                verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor=color, alpha=0.3))
        
        # Estadísticas
        work_completed = self.total_work - last_actual
        percent_complete = (work_completed / self.total_work) * 100
        
        stats_text = f'Completado: {work_completed}/{self.total_work} ({percent_complete:.1f}%)\n'
        stats_text += f'Restante: {last_actual}'
        
        plt.text(0.02, 0.88, stats_text,
                transform=plt.gca().transAxes,
                fontsize=11,
                verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))
        
        # Ajustar layout
        plt.tight_layout()
        
        # Guardar o mostrar
        if filename:
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            print(f"✓ Gráfico guardado como: {filename}")
        else:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"burndown_{timestamp}.png"
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            print(f"✓ Gráfico guardado como: {filename}")
            
        plt.show()
        return True
    
    def print_statistics(self):
        """Imprime estadísticas del sprint"""
        if not self.actual_work:
            return
            
        print("\n" + "="*60)
        print("ESTADÍSTICAS DEL SPRINT")
        print("="*60)
        
        work_completed = self.total_work - self.actual_work[-1]
        percent_complete = (work_completed / self.total_work) * 100
        
        print(f"Sprint: {self.sprint_name}")
        print(f"Trabajo Total: {self.total_work}")
        print(f"Trabajo Completado: {work_completed}")
        print(f"Trabajo Restante: {self.actual_work[-1]}")
        print(f"Porcentaje Completado: {percent_complete:.1f}%")
        
        if len(self.actual_work) > 1:
            velocity = (self.actual_work[0] - self.actual_work[-1]) / (len(self.actual_work) - 1)
            print(f"Velocidad Promedio: {velocity:.2f} puntos/día")
            
            if self.actual_work[-1] > 0:
                days_to_complete = self.actual_work[-1] / velocity if velocity > 0 else float('inf')
                print(f"Días estimados para completar: {days_to_complete:.1f}")
        
        print("="*60 + "\n")


def interactive_mode():
    """Modo interactivo para crear un burndown chart"""
    print("\n" + "="*60)
    print("GENERADOR DE BURNDOWN CHART")
    print("="*60 + "\n")
    
    # Solicitar datos básicos
    sprint_name = input("Nombre del Sprint (ej: Sprint 1): ").strip()
    if not sprint_name:
        sprint_name = f"Sprint {datetime.now().strftime('%Y-%m-%d')}"
    
    while True:
        try:
            sprint_days = int(input("Duración del sprint (días, ej: 10): "))
            if sprint_days > 0:
                break
            print("Por favor ingresa un número mayor a 0")
        except ValueError:
            print("Por favor ingresa un número válido")
    
    while True:
        try:
            total_work = int(input("Trabajo total inicial (story points/horas, ej: 50): "))
            if total_work > 0:
                break
            print("Por favor ingresa un número mayor a 0")
        except ValueError:
            print("Por favor ingresa un número válido")
    
    # Crear burndown chart
    burndown = BurndownChart(sprint_name, total_work, sprint_days)
    
    # Solicitar datos diarios
    print(f"\n📊 Ingresa el trabajo RESTANTE al final de cada día")
    print(f"   (Presiona Enter para dejar en blanco días futuros)")
    print(f"   Día 0 = {total_work} (inicio del sprint)\n")
    
    burndown.actual_work.append(total_work)  # Día 0
    
    for day in range(1, sprint_days + 1):
        while True:
            work_input = input(f"Día {day}: ").strip()
            
            if not work_input:
                # Si no hay más datos, terminar
                if day > 1:
                    break
                else:
                    print("Debes ingresar al menos el día 1")
                    continue
                    
            try:
                remaining = int(work_input)
                if 0 <= remaining <= total_work:
                    burndown.actual_work.append(remaining)
                    break
                else:
                    print(f"Por favor ingresa un número entre 0 y {total_work}")
            except ValueError:
                print("Por favor ingresa un número válido")
        
        if not work_input:
            break
    
    # Generar estadísticas
    burndown.print_statistics()
    
    # Generar gráfico
    print("Generando gráfico...")
    burndown.generate_chart()
    
    return burndown


def example_mode():
    """Genera un ejemplo de burndown chart"""
    print("\n📊 Generando ejemplo de Burndown Chart...\n")
    
    burndown = BurndownChart("Sprint Ejemplo - Almacén de Películas", 50, 10)
    
    # Datos de ejemplo (sprint progresando bien)
    example_data = [50, 48, 45, 40, 35, 28, 22, 15, 10, 5, 0]
    burndown.actual_work = example_data
    
    burndown.print_statistics()
    burndown.generate_chart("burndown_ejemplo.png")
    
    return burndown


def main():
    """Función principal"""
    print("\n🎯 GENERADOR DE BURNDOWN CHART PARA EQUIPOS ÁGILES")
    print("   Herramienta para medir y visualizar el progreso del sprint\n")
    
    print("Selecciona una opción:")
    print("1. Crear burndown chart (modo interactivo)")
    print("2. Generar ejemplo")
    print("3. Salir")
    
    choice = input("\nOpción (1-3): ").strip()
    
    if choice == "1":
        interactive_mode()
    elif choice == "2":
        example_mode()
    elif choice == "3":
        print("¡Hasta pronto!")
        return
    else:
        print("Opción no válida")
        return
    
    print("\n✅ ¡Proceso completado!")
    print("💡 Tip: Puedes usar el gráfico en tus retrospectivas y daily standups")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Operación cancelada por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
