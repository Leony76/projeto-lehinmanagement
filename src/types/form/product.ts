import { CategoryTranslatedValue } from "@/src/constants/generalConfigs";

export type ProductFormState = {
  image: string;
  name: string;
  category: CategoryTranslatedValue;
  description?: string;
  price: number;
  quantity: number;
};

