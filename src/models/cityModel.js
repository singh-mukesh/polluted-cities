import Joi from 'joi';

export const citySchema = Joi.object({
  name: Joi.string().min(2).required(),
  country: Joi.string().min(2).required(),
  pollutionIndex: Joi.number().required(),
});

export function validateAndNormalizeInput(city) {
  const { error, value } = cityInputSchema.validate(city);
  if (error) return null;
  return value;
}

export function validateOutput(city) {
  return citySchema.validate(city);
}

export const cityInputSchema = Joi.object({
  name: Joi.string().min(2).required(),
  pollution: Joi.string().min(2).required(),
});
