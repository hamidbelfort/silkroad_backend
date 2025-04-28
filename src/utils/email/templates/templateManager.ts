import { confirmOrderTemplate } from "./confirmOrderTemplate";
import { rejectOrderTemplate } from "./rejectOrderTemplate";
import { reviewNeededTemplate } from "./reviewNeededTemplate";
import { resetPasswordTemplate } from "./resetPasswordTemplate";
import { orderDetailsTemplate } from "./orderDetailsTemplate";

type TemplateTypes =
  | "confirmOrder"
  | "rejectOrder"
  | "reviewNeeded"
  | "resetPassword"
  | "orderDetails";

type LanguageTypes = "fa" | "en" | "zh";

interface ConfirmOrderOptions {
  customerName: string;
  orderId: number;
  language: LanguageTypes;
}

interface RejectOrderOptions {
  customerName: string;
  orderId: number;
  reason: string;
  language: LanguageTypes;
}

interface ReviewNeededOptions {
  customerName: string;
  orderId: number;
  language: LanguageTypes;
}

interface ResetPasswordOptions {
  verificationCode: string;
  language: LanguageTypes;
}

interface OrderDetailsOptions {
  customerName: string;
  orderId: number;
  amount: number;
  finalAmount: number;
  status: string;
  language: LanguageTypes;
}

type TemplateOptions =
  | ConfirmOrderOptions
  | RejectOrderOptions
  | ReviewNeededOptions
  | ResetPasswordOptions
  | OrderDetailsOptions;

export function generateEmailTemplate(
  templateType: TemplateTypes,
  options: TemplateOptions
): string {
  switch (templateType) {
    case "confirmOrder":
      return confirmOrderTemplate(
        options as ConfirmOrderOptions
      );
    case "rejectOrder":
      return rejectOrderTemplate(
        options as RejectOrderOptions
      );
    case "reviewNeeded":
      return reviewNeededTemplate(
        options as ReviewNeededOptions
      );
    case "resetPassword":
      return resetPasswordTemplate(
        options as ResetPasswordOptions
      );
    case "orderDetails":
      return orderDetailsTemplate(
        options as OrderDetailsOptions
      );
    default:
      return "";
  }
}
