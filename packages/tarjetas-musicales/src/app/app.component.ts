import { AfterViewInit, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { calcularTiempo, updateSlider } from '../utils/tarjetas-musicales.utils';
import { TarjetaMuscalService } from './tarjeta-muscal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  // Capturo un elemento mediante la directiva @ViewChild.
  audio!: HTMLAudioElement;
  slider!: HTMLInputElement;
  imagen!: HTMLImageElement;

  listaMusicas?: any[];
  musicaActual?: string;
  tiempoTotal?: number | string;
  tiempoActual: number | string = '0:00';
  tiempoActualSlider: number | string = 0;
  duracionTotal: number = 0;
  empezarMusica: boolean = true;
  imagenActual?: string;
  autor?: string;
  nameMusic?: string;

  // Inyectar servicios
  private musicas = inject(TarjetaMuscalService);

  // Cambiar de musica segun el indice
  private cargarMusica(indice: number) {
    if (this.listaMusicas) {
      const musica = this.listaMusicas[indice];
      this.musicaActual = `/music/${musica.music}`;
      this.imagenActual = `/images/${musica.img}`;
      this.autor = musica.author;
      this.nameMusic = musica.name;

      this.audio.src = this.musicaActual;
      this.imagen.src = this.imagenActual;
    }
  }

  // Evento para calcular el tiempo actual de la musica y el slider
  private updateTimeAndSlider(): void {
    this.audio.addEventListener('timeupdate', () => {
      const tiempoTotalEnSegundos = this.audio.currentTime;
      this.tiempoActual = calcularTiempo(tiempoTotalEnSegundos);
      // Tiempo Actual aplicado al slider
      this.tiempoActualSlider = this.audio.currentTime;
      updateSlider(this.slider, this.tiempoActualSlider);
    });
  }
  // Evento que se dispara cuando los metadatos del audio están cargados
  private loadedMetaData(): void {
    this.audio.addEventListener('loadedmetadata', () => {
      const tiempoTotalEnSegundos = this.audio.duration;
      this.tiempoTotal = calcularTiempo(tiempoTotalEnSegundos);
      this.duracionTotal = tiempoTotalEnSegundos;
    });
  }

  ngAfterViewInit(): void {
    // Inicializar el audio, imagen y slider
    this.audio = document.getElementById('audio') as HTMLAudioElement;
    this.imagen = document.getElementById('imagen') as HTMLImageElement;
    this.slider = document.getElementById('slider') as HTMLInputElement;

    this.updateTimeAndSlider();
    this.loadedMetaData();

    // Cambiar a la siguiente cancion cuando termine
    this.audio.addEventListener('ended', () => {
      this.NextMusic();
    });

    // Solicitamos los datos del servicio mediante una subcripcion
    this.musicas.getDatos().subscribe((data: any[]) => {
      // Agregando los datos a listaMusicas
      this.listaMusicas = data;
      this.cargarMusica(0);
    });
  }

  playSound() {
    // Este metodo disparara el evento "timeupdate"
    this.audio.play();
    this.empezarMusica = false;
  }
  stopSound() {
    // Este metodo detendra el evento "timeupdate"
    this.audio.pause();
    this.empezarMusica = true;
  }

  // Actualizar la musica mediante el slider de manera manual
  onSliderChange(event: Event) {
    this.audio.currentTime = Number(this.slider.value);
  }

  // Siguiente cancion
  NextMusic() {
    if (this.listaMusicas) {
      // Obtener el indice de la musica actual
      const musicaActual = this.musicaActual?.split('/').pop();
      const indiceActual = this.listaMusicas.findIndex(
        (m) => m.music === musicaActual
      );
      const siguienteIndice = (indiceActual + 1) % this.listaMusicas.length;
      this.cargarMusica(siguienteIndice);
    }
    this.playSound();
  }
  // Anterior cancion
  AfterMusic() {
    if (this.listaMusicas) {
      // Obtener el indice de la musica actual
      const musicaActual = this.musicaActual?.split('/').pop();
      const indiceActual = this.listaMusicas.findIndex(
        (m) => m.music === musicaActual
      );
      const indiceAnterior =
        (indiceActual + this.listaMusicas.length - 1) %
        this.listaMusicas.length;
      this.cargarMusica(indiceAnterior);
    }
    this.playSound();
  }
}
