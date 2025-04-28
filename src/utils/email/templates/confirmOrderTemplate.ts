export function confirmOrderTemplate({
  customerName,
  orderId,
  language,
}: {
  customerName: string;
  orderId: number;
  language: "fa" | "en" | "zh";
}) {
  if (language === "fa") {
    return `
        <div>
          <h1>سلام ${customerName} عزیز،</h1>
          <p>سفارش شما با شماره <strong>#${orderId}</strong> با موفقیت ثبت شد ✅.</p>
          <p>در حال پردازش سفارش شما هستیم.</p>
          <br/>
          <p style="font-size:12px;color:gray;">با احترام، تیم خدمات مشتریان</p>
        </div>
      `;
  }
  if (language === "en") {
    return `
        <div>
          <h1>Hello ${customerName},</h1>
          <p>Your order with ID <strong>#${orderId}</strong> has been successfully placed ✅.</p>
          <p>We are processing your order and will contact you soon.</p>
          <br/>
          <p style="font-size:12px;color:gray;">Best regards, Customer Service Team</p>
        </div>
      `;
  }
  if (language === "zh") {
    return `
        <div>
          <h1>亲爱的 ${customerName},</h1>
          <p>您的订单编号为 <strong>#${orderId}</strong> 的订单已成功提交 ✅。</p>
          <p>我们正在处理您的订单，很快会与您联系。</p>
          <br/>
          <p style="font-size:12px;color:gray;">此致，客户服务团队</p>
        </div>
      `;
  }

  return "";
}
