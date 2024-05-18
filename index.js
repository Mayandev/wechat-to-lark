"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var wechaty_1 = require("wechaty");
var lark = require("@larksuiteoapi/node-sdk");
var XMLParser = require("fast-xml-parser").XMLParser;
var appId = process.env.APP_ID;
var appSecret = process.env.APP_SECRET;
var parser = new XMLParser();
var client = new lark.Client({
    appId: appId,
    appSecret: appSecret,
});
var appToken = process.env.APP_TOKEN;
var tableId = process.env.TABLE_ID;
var createNewRecord = function (nickName, title, link) { return __awaiter(void 0, void 0, void 0, function () {
    var data, accessToken;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, client.auth.appAccessToken.internal({
                    data: {
                        app_id: appId,
                        app_secret: appSecret,
                    },
                }, lark.withTenantToken(""))];
            case 1:
                data = _b.sent();
                accessToken = (_a = data === null || data === void 0 ? void 0 : data.app_access_token) !== null && _a !== void 0 ? _a : "";
                console.log("accessToken: ", accessToken);
                client.bitable.appTableRecord
                    .create({
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
                }, lark.withTenantToken(accessToken))
                    .then(function (res) {
                    var _a, _b;
                    console.log("time: ", new Date(), "create table result: ", JSON.stringify((_b = (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.record) === null || _b === void 0 ? void 0 : _b.fields));
                });
                return [2 /*return*/];
        }
    });
}); };
var wechaty = wechaty_1.WechatyBuilder.build(); // get a Wechaty instance
wechaty
    .on("scan", function (qrcode, status) {
    return console.log("Scan QR Code to login: ".concat(status, "\nhttps://wechaty.js.org/qrcode/").concat(encodeURIComponent(qrcode)));
})
    .on("login", function (user) { return console.log("User ".concat(user, " logged in")); })
    .on("message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var messageObject, appname, room, contact, _a, url, title;
    var _b, _c;
    return __generator(this, function (_d) {
        if (message.type() === wechaty.Message.Type.Url) {
            console.log("current time: ", new Date());
            messageObject = parser.parse(message.text());
            appname = ((_b = messageObject === null || messageObject === void 0 ? void 0 : messageObject.msg) === null || _b === void 0 ? void 0 : _b.appinfo).appname;
            if (appname !== "全民K歌") {
                return [2 /*return*/];
            }
            room = message.room();
            contact = message.talker();
            if (!contact) {
                return [2 /*return*/];
            }
            _a = (_c = messageObject === null || messageObject === void 0 ? void 0 : messageObject.msg) === null || _c === void 0 ? void 0 : _c.appmsg, url = _a.url, title = _a.title;
            console.log("contact: ", contact, "msg: ", messageObject);
            createNewRecord(contact === null || contact === void 0 ? void 0 : contact.name(), title, url);
        }
        return [2 /*return*/];
    });
}); })
    .on("error", function (error) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.error("time:", new Date(), "error: ", error);
        return [2 /*return*/];
    });
}); });
wechaty.start();
