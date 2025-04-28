export function rejectOrderTemplate({
  customerName,
  orderId,
  reason,
  language,
}: {
  customerName: string;
  orderId: number;
  reason: string;
  language: "fa" | "en" | "zh";
}) {
  if (language === "fa") {
    return `
        <div>
          <h1>سلام ${customerName} عزیز،</h1>
          <p>متاسفیم! سفارش شماره <strong>#${orderId}</strong> شما به دلیل زیر رد شد ❌:</p>
          <p style="color:red;"><em>${reason}</em></p>
          <p>در صورت نیاز به اطلاعات بیشتر لطفاً با پشتیبانی تماس بگیرید.</p>
          <br/>
          <p style="font-size:12px;color:gray;">با احترام، تیم پشتیبانی</p>
        </div>
      `;
  }
  if (language === "en") {
    return `
        <div>
          <h1>Hello ${customerName},</h1>
          <p>Unfortunately, your order with ID <strong>#${orderId}</strong> was rejected ❌ for the following reason:</p>
          <p style="color:red;"><em>${reason}</em></p>
          <p>Please contact support if you need more information.</p>
          <br/>
          <p style="font-size:12px;color:gray;">Best regards, Support Team</p>
        </div>
      `;
  }
  if (language === "zh") {
    return `
        <div>
          <h1>亲爱的 ${customerName},</h1>
          <p>很遗憾，您的订单编号 <strong>#${orderId}</strong> 因以下原因被拒绝 ❌：</p>
          <p style="color:red;"><em>${reason}</em></p>
          <p>如需更多信息，请联系客户支持。</p>
          <br/>
          <p style="font-size:12px;color:gray;">此致，支持团队</p>
        </div>
      `;
  }

  return "";
}
