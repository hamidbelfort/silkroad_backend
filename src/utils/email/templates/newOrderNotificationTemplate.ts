export function newOrderNotificationTemplate({
  customerName,
  orderId,
  amount,
  finalAmount,
  status,
  language,
}: {
  customerName: string;
  orderId: number;
  amount: number;
  finalAmount: number;
  status: string;
  language: "fa" | "en" | "zh";
}) {
  if (language === "fa") {
    return `
      <div>
        <h1>اطلاعیه سفارش جدید</h1>
        <p><strong>سفارشی جدید ثبت شده است.</strong></p>
        <p><strong>نام مشتری:</strong> ${customerName}</p>
        <p><strong>شماره سفارش:</strong> #${orderId}</p>
        <p><strong>مقدار یوان:</strong> ${amount} 元</p>
        <p><strong>مبلغ نهایی:</strong> ${finalAmount.toLocaleString()} تومان</p>
        <p><strong>وضعیت:</strong> ${status}</p>
        <br/>
        <p style="font-size:12px;color:gray;">لطفاً بررسی فرمایید. با احترام، سیستم سفارشات</p>
      </div>
    `;
  }

  if (language === "en") {
    return `
      <div>
        <h1>New Order Notification</h1>
        <p><strong>A new order has been placed.</strong></p>
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Order ID:</strong> #${orderId}</p>
        <p><strong>Amount (RMB):</strong> ${amount}</p>
        <p><strong>Final Amount (IRR):</strong> ${finalAmount.toLocaleString()}</p>
        <p><strong>Status:</strong> ${status}</p>
        <br/>
        <p style="font-size:12px;color:gray;">Please review the order. Regards, Order System</p>
      </div>
    `;
  }

  if (language === "zh") {
    return `
      <div>
        <h1>新订单通知</h1>
        <p><strong>一个新订单已被创建。</strong></p>
        <p><strong>客户名称:</strong> ${customerName}</p>
        <p><strong>订单编号:</strong> #${orderId}</p>
        <p><strong>金额 (元):</strong> ${amount}</p>
        <p><strong>最终金额 (里亚尔):</strong> ${finalAmount.toLocaleString()}</p>
        <p><strong>订单状态:</strong> ${status}</p>
        <br/>
        <p style="font-size:12px;color:gray;">请尽快处理。此致，订单系统</p>
      </div>
    `;
  }

  return "";
}
