import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico.component.html',
  styleUrl: './grafico.component.scss'
})
export class GraficoComponent implements OnChanges {
  @Input() labelsOfIngresos?: string[];
  @Input() valuesOfIngresos?: number[];
  @Input() labelsOfGastos?: string[];
  @Input() valuesOfGastos?: number[];

  @Input() resultadoEnd?: number = 120;
  private chartCircle?: Chart | any;
  private chartBar?: Chart | any;

  ingressTotal?: number;
  gastossTotal?: number;

  // Detecta cambios en las propiedades de entrada 'labels' o 'values'
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['labelsOfIngresos'] ||
      changes['valuesOfIngresos'] ||
      changes['labelsOfGastos'] ||
      changes['valuesOfGastos']
    ) {
      this.updateChartCircle();
      this.updateChartBar();
    }
  }
  private updateChartCircle() {
    if (this.chartCircle) {
      this.chartCircle.destroy();
    }
    this.ingressTotal = this.valuesOfIngresos?.reduce((acml, x) => acml + x)
    this.gastossTotal = this.valuesOfGastos?.reduce((acml, x) => acml + x)

    const ctx = document.getElementById('graficoCircle') as HTMLCanvasElement;
    this.chartCircle = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['ingresos', 'gastos', 'ahorro'],
        datasets: [
          {
            label: 'general',
            data: [this.ingressTotal, this.gastossTotal, this.resultadoEnd],
            backgroundColor: [
              'rgb(19 78 74)',
              'rgb(239 68 68)',
              'rgb(37 99 235)',
            ],
            hoverOffset: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: 'right', // Coloca las etiquetas debajo del gráfico
          },
        },
      },
    });
  }
  private updateChartBar() {
    if (this.chartBar) {
      this.chartBar.destroy();
    }
    const ctx = document.getElementById('graficoBar') as HTMLCanvasElement;
    this.chartBar = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          ...(this.labelsOfIngresos ?? []),
          ...(this.labelsOfGastos ?? []),
          'Ahorro',
        ],
        datasets: [
          {
            label: 'Monto',
            data: [
              ...(this.valuesOfIngresos ?? []),
              ...(this.valuesOfGastos ?? []),
              this.resultadoEnd,
            ],
            backgroundColor: [
             'rgb(19 78 74)',
              'rgb(239 68 68)',
              'rgb(37 99 235)',
              'rgb(19 78 74)',
              'rgb(250 204 21)',
              'rgb(37 99 235)',
              'rgb(251 191 36))',
              'rgb(13 148 136)',
              'rgb(120 113 108)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Esto quita las etiquetas de ingreso y gasto
          },
        },
      },
    });
  }
}
