type TemplateTypes =
  | "confirmOrder"
  | "rejectOrder"
  | "reviewNeeded"
  | "resetPassword"
  | "orderDetails"
  | "contactMessage"
  | "newOrderNotification";

type LanguageTypes = "fa" | "en" | "zh";

export function generateEmailSubject(
  templateType: TemplateTypes,
  language: LanguageTypes
): string {
  switch (templateType) {
    case "confirmOrder":
      if (language === "fa") return "تایید سفارش شما ✅";
      if (language === "en") return "Order Confirmation ✅";
      if (language === "zh") return "订单确认 ✅";
      break;
    case "rejectOrder":
      if (language === "fa") return "سفارش شما رد شد ❌";
      if (language === "en") return "Order Rejected ❌";
      if (language === "zh") return "订单被拒绝 ❌";
      break;
    case "reviewNeeded":
      if (language === "fa") return "سفارش شما نیاز به بررسی دارد 🧐";
      if (language === "en") return "Order Requires Review 🧐";
      if (language === "zh") return "订单需要审核 🧐";
      break;
    case "resetPassword":
      if (language === "fa") return "درخواست تغییر رمز عبور 🔑";
      if (language === "en") return "Password Reset Request 🔑";
      if (language === "zh") return "密码重置请求 🔑";
      break;
    case "orderDetails":
      if (language === "fa") return "جزئیات سفارش شما 📦";
      if (language === "en") return "Your Order Details 📦";
      if (language === "zh") return "您的订单详情 📦";
      break;
    case "newOrderNotification":
      if (language === "fa") return "سفارش جدید ثبت شد 📦";
      if (language === "en") return "New Order Submited 📦";
      if (language === "zh") return "新订单已提交 📦";
      break;
    case "contactMessage":
      if (language === "fa") return "جزئیات پیام 📧";
      if (language === "en") return "Message Details 📧";
      if (language === "zh") return "消息详细信息 📧";
      break;
    default:
      return "";
  }

  return "";
}
