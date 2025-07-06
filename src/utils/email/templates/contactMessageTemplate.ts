export function contactMessageTemplate({
  id,
  name,
  email,
  subject,
  message,
  language,
}: {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  language: "fa" | "en" | "zh";
}) {
  if (language === "fa") {
    return `
                <div>
                  <h1>سلام مدیر گرامی</h1>
                  <p>یک پیام از صفحه ارتباط با ما با شماره پیگیری <strong>#${id}</strong> با موفقیت ثبت شد ✅.</p>
                  <p>جزئیات پیام به شرح ذیل میباشد</p>
                  <div>
                  <h1>نام و نام خانوادگی : ${name}</h1>
                  <h3>ایمیل : ${email}</h3>
                  <br/>
                  <b>عنوان : ${subject}</b>
                  <br/>
                  <p>${message}</p>
                  </div>
                  <br/>
                  <p style="font-size:12px;color:gray;">با احترام، تیم خدمات مشتریان</p>
                </div>
              `;
  }
  if (language === "en") {
    return `
            <div>
              <h1>Hello Dear Administrator</h1>
              <p>A new contact message with tracking number <strong>#${id}</strong> has been submitted✅.</p>
              <p>The details of message are follows</p>
              <div>
              <h1>Full Name : ${name}</h1>
              <h3>Email: ${email}</h3>
              <br/>
              <b>Subject : ${subject}</b>
              <br/>
              <p>${message}</p>
              </div>
              <br/>
              <p style="font-size:12px;color:gray;">Best regards</p>
            </div>
          `;
  }
  if (language === "zh") {
    return `
            <div>
              <h1>您好，尊敬的经理</h1>
              <p>一个带有跟踪号码1的消息已被注册。<strong>#${id}</strong>✅.</p>
              <p>消息的详细信息如下</p>
              <div>
              <h1>全名 : ${name}</h1>
              <h3>电子邮件 : ${email}</h3>
              <br/>
              <b>主题 : ${subject}</b>
              <br/>
              <p>${message}</p>
              </div>
              <br/>
              <p style="font-size:12px;color:gray;">此致敬意</p>
            </div>
          `;
  }
  return "";
}
