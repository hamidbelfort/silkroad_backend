export function reviewNeededTemplate({
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
            <p>سفارش شماره <strong>#${orderId}</strong> شما نیاز به بررسی اپراتور دارد 🧐.</p>
            <p>اپراتور ما به زودی با شما تماس خواهد گرفت.</p>
            <br/>
            <p style="font-size:12px;color:gray;">با احترام، تیم پشتیبانی</p>
          </div>
        `;
  }
  if (language === "en") {
    return `
          <div>
            <h1>Hello ${customerName},</h1>
            <p>Your order with ID <strong>#${orderId}</strong> requires operator review 🧐.</p>
            <p>Our operator will contact you shortly.</p>
            <br/>
            <p style="font-size:12px;color:gray;">Best regards, Support Team</p>
          </div>
        `;
  }
  if (language === "zh") {
    return `
          <div>
            <h1>亲爱的 ${customerName},</h1>
            <p>您的订单编号 <strong>#${orderId}</strong> 需要运营人员审核 🧐。</p>
            <p>我们的客服人员将尽快与您联系。</p>
            <br/>
            <p style="font-size:12px;color:gray;">此致，支持团队</p>
          </div>
        `;
  }

  return "";
}
