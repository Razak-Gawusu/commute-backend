import { ITrip } from '@/interfaces';
import { Trip } from '@/models/trip.model';
import { GenericHelpers } from '@/utils';

export class TripService {
  static async createTrip(trip: ITrip) {
    const new_trip = new Trip({
      ...trip,
      id: GenericHelpers.generateUUID(),
    });

    return new_trip.createTrip();
  }

  static async fetchTrips() {
    return Trip.getAllTrips();
  }

  static async fetchOneTrip(id: string) {
    return Trip.getOneTrip(id);
  }

  static async deleteTrip(id: string) {
    return Trip.deleteTrip(id);
  }
}
