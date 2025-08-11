import mongoose, { Document, Schema, Model } from "mongoose";

interface IRole extends Document {
  roleName: string;
  roleDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export { IRole };

const roleSchema = new Schema<IRole>(
  {
    roleName: { type: String, required: true },
    roleDescription: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Role: Model<IRole> = mongoose.model<IRole>("Role", roleSchema);

export default Role;
