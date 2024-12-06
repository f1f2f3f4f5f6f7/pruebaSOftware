import { Component, OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../usuario';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, AfterViewInit {
  title = 'Proyecto';
  private activeContainer: HTMLElement | null = null;
  user!: Usuario;

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(this.actualizarReloj.bind(this), 1000);
      setInterval(this.actualizarHoraDigital.bind(this), 1000);
      this.obtenerUsuarioDeLocalStorage();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupEventListeners();
      this.actualizarReloj(); // Llamar una vez al inicio
      this.actualizarHoraDigital(); // Llamar para mostrar la hora inmediatamente
    }
  }

  private setupEventListeners(): void {
    const btnToggle = document.getElementById('toggleButton');
    const btnNotification = document.getElementById('notificationButton');
    const btnProfile = document.getElementById('profileButton');
    const infoContainer = document.getElementById('infoContainer');
    const notificationContainer = document.getElementById('notificationContainer');
    const profileContainer = document.getElementById('profileContainer');

    const closeModalButton = document.getElementById('closeModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    const btnMisCompras = document.getElementById('btnMisCompras');

    const btnComprarCombo = document.getElementById('btnComprarCombo');
    const modalOverlayCompra = document.getElementById('modalOverlayCompra');
    const confirmarCompraButton = document.getElementById('confirmarCompraButton');
    const cancelarCompraButton = document.getElementById('cancelarCompraButton');

    if (btnToggle) this.renderer.listen(btnToggle, 'click', (event) => {
      if (infoContainer) this.toggleContainer(event, infoContainer);
    });
    if (btnNotification) this.renderer.listen(btnNotification, 'click', (event) => {
      if (notificationContainer) this.toggleContainer(event, notificationContainer);
    });
    if (btnProfile) this.renderer.listen(btnProfile, 'click', (event) => {
      if (profileContainer) this.toggleContainer(event, profileContainer);
    });

    this.renderer.listen(document, 'click', () => this.closeActiveContainer());
    if (infoContainer) this.renderer.listen(infoContainer, 'click', (event) => event.stopPropagation());
    if (notificationContainer) this.renderer.listen(notificationContainer, 'click', (event) => event.stopPropagation());
    if (profileContainer) this.renderer.listen(profileContainer, 'click', (event) => event.stopPropagation());

    if (btnCerrarSesion) this.renderer.listen(btnCerrarSesion, 'click', () => this.showModal('Comprar Combo', 'Aquí puedes proceder con la compra del combo.'));
    if (btnMisCompras) this.renderer.listen(btnMisCompras, 'click', () => this.showModal('Mis Compras', 'Aquí se mostrarán tus compras realizadas.'));
    if (closeModalButton) this.renderer.listen(closeModalButton, 'click', () => this.closeModal());
    if (modalOverlay) this.renderer.listen(modalOverlay, 'click', (event) => {
      if (event.target === modalOverlay) {
        this.closeModal();
      }
    });

    if (btnComprarCombo) this.renderer.listen(btnComprarCombo, 'click', () => {
      if (modalOverlayCompra) this.showModalCompra(modalOverlayCompra);
    });
    if (confirmarCompraButton) this.renderer.listen(confirmarCompraButton, 'click', () => {
      alert('¡Compra confirmada!');
      if (modalOverlayCompra) this.closeModalCompra(modalOverlayCompra);
    });
    if (cancelarCompraButton) this.renderer.listen(cancelarCompraButton, 'click', () => {
      if (modalOverlayCompra) this.closeModalCompra(modalOverlayCompra);
    });
    if (modalOverlayCompra) this.renderer.listen(modalOverlayCompra, 'click', (event) => {
      if (event.target === modalOverlayCompra) {
        this.closeModalCompra(modalOverlayCompra);
      }
    });

    const lunchUIS = document.getElementById('lunchUIS');
    if (lunchUIS) lunchUIS.addEventListener('click', () => location.reload());
  }

  private toggleContainer(event: MouseEvent, container: HTMLElement): void {
    event.stopPropagation();
    if (this.activeContainer && this.activeContainer !== container) {
      this.closeActiveContainer();
    }

    if (container.style.display === 'none' || container.style.display === '') {
      container.style.display = 'block';
      this.activeContainer = container;
    } else {
      this.closeActiveContainer();
    }
  }

  private closeActiveContainer(): void {
    if (this.activeContainer) {
      this.activeContainer.style.display = 'none';
      this.activeContainer = null;
    }
  }

  private actualizarReloj(): void {
    const ahora = new Date();
    const segundos = ahora.getSeconds();
    const minutos = ahora.getMinutes();
    const horas = ahora.getHours();

    const segundosGrados = (segundos / 60) * 360;
    const minutosGrados = (minutos / 60) * 360 + (segundos / 60) * 6;
    const horasGrados = (horas / 12) * 360 + (minutos / 60) * 30;

    const segundo = document.getElementById('segundo');
    const minuto = document.getElementById('minuto');
    const hora = document.getElementById('hora');

    if (segundo) segundo.style.transform = `rotate(${segundosGrados}deg)`;
    if (minuto) minuto.style.transform = `rotate(${minutosGrados}deg)`;
    if (hora) hora.style.transform = `rotate(${horasGrados}deg)`;
  }

  private actualizarHoraDigital(): void {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');

    const horaDigital = document.getElementById('horaDigital');
    if (horaDigital) horaDigital.textContent = `${horas}:${minutos}:${segundos}`;
  }

  private showModal(title: string, message: string): void {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');

    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    if (modalOverlay) modalOverlay.style.display = 'flex';
  }

  private closeModal(): void {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.style.display = 'none';
  }

  private showModalCompra(modalOverlayCompra: HTMLElement): void {
    modalOverlayCompra.style.display = 'flex';
  }

  private closeModalCompra(modalOverlayCompra: HTMLElement): void {
    modalOverlayCompra.style.display = 'none';
  }
  obtenerUsuarioDeLocalStorage(this: any): void {
    const usuarioString = localStorage.getItem('usuarioRegistrado');
    if (usuarioString) {
      this.user = JSON.parse(usuarioString);
      console.log('Usuario cargado desde localStorage:', this.user);

    } else {
      console.log('No se encontró usuario en localStorage');
    }

  }
}



