import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IQueryHistory } from "../../interface/query/queryInterface";

const QueryHistorySchema = new Schema<IQueryHistory>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    query: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    parsedQuery: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (value: any) => {
          try {
            JSON.stringify(value);
            return true;
          } catch {
            return false;
          }
        },
        message: "parsedQuery must be JSON-serializable"
      }
    },
    response: {
      type: String,
      required: true
    },
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    type: {
      type: String,
      required: true,
      enum: ["attendance", "employee", "task", "project", "organization", "combined"],
      index: true
    }
  },
  {
    timestamps: true
  }
);

QueryHistorySchema.index({ timestamp: -1 });

QueryHistorySchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

export const QueryHistory = mongoose.model<IQueryHistory>("QueryHistory", QueryHistorySchema);
