import mongoose from "mongoose";

const spesaSchema = new mongoose.Schema(
  {
    importo: {
      type: Number,
      required: true,
    },
    pezzi: {
      type: Number,
      required: true,
    },
    articoli: {
      type: Array,
      required: true,
    },
    luogo: {
      type: String,
      required: true,
    },
    nucleo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Spesa = mongoose.model("Spesa", spesaSchema);

export default Spesa;
