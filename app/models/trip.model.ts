import { db } from '@/config';
import { ITrip, TripStatus } from '@/interfaces';
import { tripQuery } from '@/queries';

export class Trip implements ITrip {
  id?: string;
  parent_id: string;
  driver_id: string;
  school_id: string;
  status: TripStatus;

  constructor(trip: ITrip) {
    this.id = trip.id;
    this.school_id = trip.school_id;
    this.driver_id = trip.driver_id;
    this.parent_id = trip.parent_id;
    this.status = trip.status;
  }

  async createTrip() {
    return db.oneOrNone(tripQuery.create, [
      this.id,
      this.parent_id,
      this.driver_id,
      this.school_id,
      this.status,
    ]);
  }

  static async getAllTrips() {
    return db.manyOrNone(tripQuery.getTrips);
  }

  static async getOneTrip(id: string) {
    return db.oneOrNone(tripQuery.getOneTrip, [id]);
  }
  static async changeTripStatus(id: string, status: TripStatus) {
    return db.oneOrNone(tripQuery.changeTripStatus, [id, status]);
  }

  static async getOne(id: string): Promise<ITrip | null> {
    return db.oneOrNone(tripQuery.getOne, [id]);
  }

  static async deleteTrip(id: string) {
    return db.none(tripQuery.deleteTrip, [id]);
  }
}
