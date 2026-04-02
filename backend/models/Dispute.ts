// models/Dispute.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "config/database";// adjust path if needed

/**
 * Attributes
 */
interface DisputeAttributes {
  id: string;
  escrowId: string;
  raisedBy: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
}

/**
 * Optional fields for creation
 */
interface DisputeCreationAttributes
  extends Optional<DisputeAttributes, "id" | "status"> {}

/**
 * Model Class
 */
export class Dispute
  extends Model<DisputeAttributes, DisputeCreationAttributes>
  implements DisputeAttributes
{
  public id!: string;
  public escrowId!: string;
  public raisedBy!: string;
  public reason!: string;
  public status!: "pending" | "resolved" | "rejected";
}

/**
 * Initialize Model
 */
Dispute.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    escrowId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    raisedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Dispute",
    tableName: "disputes",
    timestamps: true,
  }
);