/* tslint:disable:variable-name */
import { model as mongooseModel, Schema } from 'mongoose';

export const description = 'Stores document type and details';

export const definitions = {
  departmentName: { type: String, required: true, unique: true },
  isDelete: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
};

const departmentSchema: Schema = new Schema(definitions);

export const Department = mongooseModel('Department', departmentSchema);
