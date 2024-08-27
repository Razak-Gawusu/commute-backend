import Joi from 'joi';

enum TripStatusEnum {
  ONGOING = 'ongoing',
  REQUESTED = 'requested',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  ARRIVED = 'arrived',
}

const requestTripSchema = Joi.object({
  parent_id: Joi.string(),
});

const changeTripStatus = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TripStatusEnum))
    .required(),
});

export { requestTripSchema, changeTripStatus };
