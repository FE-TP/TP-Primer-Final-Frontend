export type ReservaStatus = 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';

export interface Reserva {
  id: string;
  fecha: string;
  hora: string;
  horaFin: string;
  cantidadPersonas: number;
  mesaId: string | null;
  nombreCliente: string;
  apellidoCliente: string;
  telefono: string;
  restauranteId: string;
  zonaId: string;
  status: ReservaStatus;
}
