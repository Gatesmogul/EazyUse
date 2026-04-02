import { sequelize } from "../config/database"; // ✅ FIXED
import { Escrow } from "backend/models/Escrow";
import { Wallet } from "../models/Wallet";

export const releaseEscrow = async (escrowId: string) => {
  if (!escrowId) {
    throw new Error("Escrow ID is required");
  }

  try {
    const escrow = await Escrow.findByPk(escrowId);

    if (!escrow) {
      throw new Error("Escrow not found");
    }

    if (escrow.status !== "held") {
      throw new Error("Escrow is not in a releasable state");
    }

    await sequelize.transaction(async (transaction) => {
      await Wallet.increment(
        { balance: escrow.amount },
        {
          where: { userId: escrow.professionalId },
          transaction,
        }
      );

      escrow.status = "released";
      await escrow.save({ transaction });
    });

    return {
      success: true,
      message: "Escrow released successfully",
    };

  } catch (error: any) {
    console.error("Release Escrow Error:", error.message);
    throw new Error(error.message || "Failed to release escrow");
  }
};