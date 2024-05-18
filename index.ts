import { WechatyBuilder } from "wechaty";
const lark = require("@larksuiteoapi/node-sdk");
const { XMLParser } = require("fast-xml-parser");

const appId = process.env.APP_ID;
const appSecret = process.env.APP_SECRET;
const parser = new XMLParser();
const client = new lark.Client({
  appId: appId,
  appSecret: appSecret,
});

const appToken = process.env.APP_TOKEN;
const tableId = process.env.TABLE_ID;

const createNewRecord = async (
  nickName: string,
  title: string,
  link: string
) => {
  const data = await client.auth.appAccessToken.internal(
    {
      data: {
        app_id: appId,
        app_secret: appSecret,
      },
    },
    lark.withTenantToken("")
  );

  const accessToken = data?.app_access_token ?? "";

  console.log("accessToken: ", accessToken);

  client.bitable.appTableRecord
    .create(
      {
        path: {
          app_token: appToken,
          table_id: tableId,
        },
        data: {
          fields: {
            昵称: nickName,
            作品名称: title,
            "全民 K 歌": {
              text: link,
              link: link,
            },
            时间: new Date().valueOf(),
          },
        },
      },
      lark.withTenantToken(accessToken)
    )
    .then((res) => {
      console.log(
        "time: ",
        new Date(),
        "create table result: ",
        JSON.stringify(res?.data?.record?.fields)
      );
    });
};

const wechaty = WechatyBuilder.build(); // get a Wechaty instance
wechaty
  .on("scan", (qrcode, status) =>
    console.log(
      `Scan QR Code to login: ${status}\nhttps://wechaty.js.org/qrcode/${encodeURIComponent(
        qrcode
      )}`
    )
  )
  .on("login", (user) => console.log(`User ${user} logged in`))
  .on("message", async (message) => {
    if (message.type() === wechaty.Message.Type.Url) {
      console.log("current time: ", new Date());
      const messageObject = parser.parse(message.text());
      const { appname } = messageObject?.msg?.appinfo;

      if (appname !== "全民K歌") {
        return;
      }

      const room = message.room();
      const contact = message.talker();

      if (!contact) {
        return;
      }

      // console.log('contact', contact);
      // const alias = await room?.alias(contact);
      // if (!alias) {
      //   return;
      // }

      const { url, title } = messageObject?.msg?.appmsg;
      console.log("contact: ", contact, "msg: ", messageObject);
      createNewRecord(contact?.name(), title, url);
    }
  })
  .on("error", async (error) => {
    console.error("time:", new Date(), "error: ", error);
  });

wechaty.start();
