import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Escrow extends Model {
  public id!: number;
  public amount!: number;
  public status!: string;
  public professionalId!: string;
}

Escrow.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "held",
    },
    professionalId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Escrow",
  }
);