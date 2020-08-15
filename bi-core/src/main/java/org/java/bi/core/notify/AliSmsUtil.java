package org.java.bi.core.notify;


import com.alibaba.fastjson.JSONObject;
import com.taobao.api.DefaultTaobaoClient;
import com.taobao.api.TaobaoClient;
import com.taobao.api.request.AlibabaAliqinFcSmsNumSendRequest;
import com.taobao.api.response.AlibabaAliqinFcSmsNumSendResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Created by lizeng on 2017/1/13.
 */
public class AliSmsUtil {
    private final static Log logger = LogFactory.getLog(AliSmsUtil.class);

//    private static String smsURL = "http://gw.api.taobao.com/router/rest";
//    private static String appKey = "23700096";
//    private static String appSecret = "5d19e859c08b1baef68db3497f833bcb";

    private static String smsURL = "http://gw.api.taobao.com/router/rest";
    private static String appKey = "LTAIaHQJdRS5ZzDr";
    private static String appSecret = "DkcmcE5rcutEf6sWVFzdQcSSYCp3t3";



    public enum SmsConfig{
        placeholder("",""),
        register("SMS_14265297","注册验证"),
        forgetPassword("SMS_14265295","变更验证"),
        login("SMS_14265299","登录验证"),
        bindPhone("SMS_14265301","身份验证"),
        huodong("SMS_90965071","活动验证");
        private String template;
        private String sign;

        private SmsConfig(String template, String sign) {
            this.template = template;
            this.sign = sign;
        }

        public String getTemplate() {
            return template;
        }

        public String getSign() {
            return sign;
        }
    }

    public static void sendSms(String phone, SmsConfig smsConfig, JSONObject param) throws Exception {
        //调用阿里大鱼api发短信
        TaobaoClient client = new DefaultTaobaoClient(smsURL, appKey, appSecret);
        AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
        req.setExtend("123456");
        req.setSmsType("normal");
        req.setSmsFreeSignName(smsConfig.getSign());
        req.setSmsParamString(param.toString());
        req.setRecNum(phone);
        req.setSmsTemplateCode(smsConfig.getTemplate());
        AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
        JSONObject smsResp = JSONObject.parseObject(rsp.getBody());

        JSONObject errorObj = smsResp.getJSONObject("error_response");
        if (errorObj != null) {
//            throw new Exception(errorObj.optString("sub_msg"));
            logger.error("短信发送失败:{}" );
            throw new Exception("短信发送失败");

        }

        if (!smsResp.getJSONObject("alibaba_aliqin_fc_sms_num_send_response").getJSONObject("result").getBoolean("success")) {
            logger.error(rsp.getBody());
            throw new Exception("短信发送失败");
        }
    }
}
