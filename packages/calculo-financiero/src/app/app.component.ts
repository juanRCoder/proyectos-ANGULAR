import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
} from '@angular/forms';
import { GraficoComponent } from './grafico/grafico.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface typeData {
  ingresos: {
    label: string[];
    value: number[];
    suma: number
  };
  gastos: {
    label: string[];
    value: number[];
    suma: number
  };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink ,ReactiveFormsModule, CommonModule, GraficoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private fb = inject(FormBuilder);
  data: typeData = {
    ingresos: { label: [], value: [], suma: 0},
    gastos: { label: [], value: [], suma: 0 },
  };
  resultEnd?: number;
  showChart?: boolean = false;

  formulario: FormGroup = this.fb.group({
    mensual: [''],
    ingresos: this.fb.array([]),
    insumoDiario: [''],
    gastos: this.fb.array([]),
  });

  ingresos(): FormArray {
    return this.formulario.get('ingresos') as FormArray;
  }
  gastos(): FormArray {
    return this.formulario.get('gastos') as FormArray;
  }

  addIngreso() {
    const addIngreso = this.fb.group({
      newIngreso: '',
      newValor: '',
    });
    this.ingresos().push(addIngreso);
  }
  addGasto() {
    const addGasto = this.fb.group({
      newGasto: '',
      newValor: '',
    });
    this.gastos().push(addGasto);
  }

  private process(array: FormArray, newLabel: string, newValue: string, labelStatic: string) {
    let labels: string[] = [];
    let values: number[] = [];

    array.controls.forEach((ingresoGroup) => {
      let label = ingresoGroup.get(newLabel);
      let value = ingresoGroup.get(newValue);

      labels.push(label?.value);
      values.push(parseFloat(value?.value));
    });

    values.push(this.formulario.get(labelStatic)?.value);
    labels.push(labelStatic);
    return { labels, values };
  }
  onSubmit() {
    // INGRESOS
    const ingresosArray = this.formulario.get('ingresos') as FormArray;
    const gastosArray = this.formulario.get('gastos') as FormArray;

    const ingreso = this.process(ingresosArray,'newIngreso','newValor','mensual');
    this.data.ingresos.label = ingreso.labels;
    this.data.ingresos.value = ingreso.values;
    this.data.ingresos.suma = ingreso.values.reduce((acml, x) => acml + x)

    const gasto = this.process(gastosArray,'newGasto','newValor','insumoDiario');
    this.data.gastos.label = gasto.labels;
    this.data.gastos.value = gasto.values;
    this.data.gastos.suma = gasto.values.reduce((acml, x) => acml + x)

    this.resultEnd = this.data.ingresos.suma - this.data.gastos.suma;

    this.showChart = true;
  }

  removeIngreso(i: number) {
    this.ingresos().removeAt(i);
    this.onSubmit();
  }
  removeGasto(i: number) {
    this.gastos().removeAt(i);
    this.onSubmit();
  }
}
