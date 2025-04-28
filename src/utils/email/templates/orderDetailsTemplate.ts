export function orderDetailsTemplate({
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
          <h1>جزئیات سفارش</h1>
          <p><strong>مشتری:</strong> ${customerName}</p>
          <p><strong>شماره سفارش:</strong> #${orderId}</p>
          <p><strong>مقدار یوان:</strong> ${amount} 元</p>
          <p><strong>مبلغ نهایی:</strong> ${finalAmount.toLocaleString()} تومان</p>
          <p><strong>وضعیت سفارش:</strong> ${status}</p>
          <br/>
          <p style="font-size:12px;color:gray;">با احترام، تیم مدیریت</p>
        </div>
      `;
  }
  if (language === "en") {
    return `
        <div>
          <h1>Order Details</h1>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Order ID:</strong> #${orderId}</p>
          <p><strong>Amount (RMB):</strong> ${amount}</p>
          <p><strong>Final Amount (IRR):</strong> ${finalAmount.toLocaleString()}</p>
          <p><strong>Status:</strong> ${status}</p>
          <br/>
          <p style="font-size:12px;color:gray;">Best regards, Management Team</p>
        </div>
      `;
  }
  if (language === "zh") {
    return `
        <div>
          <h1>订单详情</h1>
          <p><strong>客户:</strong> ${customerName}</p>
          <p><strong>订单编号:</strong> #${orderId}</p>
          <p><strong>金额 (元):</strong> ${amount}</p>
          <p><strong>最终金额 (里亚尔):</strong> ${finalAmount.toLocaleString()}</p>
          <p><strong>订单状态:</strong> ${status}</p>
          <br/>
          <p style="font-size:12px;color:gray;">此致，管理团队</p>
        </div>
      `;
  }

  return "";
}
