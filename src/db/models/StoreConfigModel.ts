import mongoose, { Schema } from 'mongoose';

export interface IStoreConfig {
  key: string;
  categories: string[];
  categoryThumbnails: Record<string, string>;
  heroSlides: any[];
  heroBannerConfig: any;
  homepageBanners: any[];
  customLogoUrl?: string | null;
  updatedAtTimestamp: number;
}

const StoreConfigSchema = new Schema<IStoreConfig>(
  {
    key: { type: String, required: true, unique: true, default: 'store_config' },
    categories: [{ type: String }],
    categoryThumbnails: { type: Schema.Types.Mixed, default: {} },
    heroSlides: [{ type: Schema.Types.Mixed }],
    heroBannerConfig: { type: Schema.Types.Mixed },
    homepageBanners: [{ type: Schema.Types.Mixed }],
    customLogoUrl: { type: String, default: null },
    updatedAtTimestamp: { type: Number, default: Date.now },
  },
  { timestamps: true }
);

export const StoreConfigModel =
  (mongoose.models.StoreConfig as mongoose.Model<IStoreConfig>) ||
  mongoose.model<IStoreConfig>('StoreConfig', StoreConfigSchema);
