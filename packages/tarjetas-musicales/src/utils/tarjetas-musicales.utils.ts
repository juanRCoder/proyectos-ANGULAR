// Función para calcular el tiempo en minutos y segundos
export function calcularTiempo(tiempoEnSegundos: number): string {
  const minutos = Math.floor(tiempoEnSegundos / 60).toString();
  const segundos = Math.floor(tiempoEnSegundos % 60)
    .toString()
    .padStart(2, '0');
  return `${minutos}:${segundos}`;
}

// Función para actualizar el slider
export function updateSlider(
  slider: HTMLInputElement,
  tiempoActualSlider: number
) {
  slider.value = tiempoActualSlider.toString();
}
