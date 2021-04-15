#include "PluginOneSignalJSHelper.h"
#include "PluginOneSignal/PluginOneSignal.h"
#include "SDKBoxJSHelper.h"

#ifdef SDKBOX_JSBINDING_CC3
#include "cocos/bindings/jswrapper/SeApi.h"
#include "cocos/bindings/manual/jsb_conversions.h"

namespace cocos2d = cc;
#else
#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
#include "cocos/scripting/js-bindings/manual/jsb_conversions.hpp"
#endif

class OneSignalListenerJS : public sdkbox::OneSignalListener, public sdkbox::JSListenerBase
{
public:
    OneSignalListenerJS() : sdkbox::JSListenerBase() {
    }

    void onSendTag(bool success, const std::string& key, const std::string& message) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(success));
        args.push_back(se::Value(key));
        args.push_back(se::Value(message));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onGetTags(const std::string& jsonString) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(jsonString));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onIdsAvailable(const std::string& userId, const std::string& pushToken) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(userId));
        args.push_back(se::Value(pushToken));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onPostNotification(bool success, const std::string& message) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(success));
        args.push_back(se::Value(message));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onNotification(bool isActive, const std::string& message, const std::string& additionalData) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(isActive));
        args.push_back(se::Value(message));
        args.push_back(se::Value(additionalData));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onNotificationOpened(const std::string& message) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(message));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
    void onNotificationReceived(const std::string& message) {
        RUN_ON_MAIN_THREAD_BEGIN
        MAKE_V8_HAPPY
        se::ValueArray args;
        args.push_back(se::Value(message));
        invokeJSFun(funcName, args);
        RUN_ON_MAIN_THREAD_END
    }
};

void onesignal_register_constants(se::Object* onesignal)
{
    cocos2d::ValueMap enums;
    enums.clear();
    enums["None"] = sdkbox::OneSignalLogNone;
    enums["Fatal"] = sdkbox::OneSignalLogFatal;
    enums["Error"] = sdkbox::OneSignalLogError;
    enums["Warn"] = sdkbox::OneSignalLogWarn;
    enums["Info"] = sdkbox::OneSignalLogInfo;
    enums["Debug"] = sdkbox::OneSignalLogDebug;
    enums["Verbose"] = sdkbox::OneSignalLogVerbose;

    se::Value v;
    ccvaluemap_to_seval(enums, &v);
    onesignal->setProperty("LogLevel", v);
}

static bool js_PluginOneSignalJS_setListener(se::State& s)
{
    const auto& args = s.args();
    int argc = (int)args.size();
    if (argc == 1)
    {
        OneSignalListenerJS* nativeDelegate = dynamic_cast<OneSignalListenerJS*>(sdkbox::PluginOneSignal::getListener());
        if (!nativeDelegate) {
            nativeDelegate = new (std::nothrow) OneSignalListenerJS();
            sdkbox::PluginOneSignal::setListener(nativeDelegate);
        }
        nativeDelegate->setJSDelegate(args[0]);


        return true;
    }

    SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
SE_BIND_FUNC(js_PluginOneSignalJS_setListener)

extern se::Object* __jsb_sdkbox_PluginOneSignal_proto;
extern se::Class* __jsb_sdkbox_PluginOneSignal_class;
bool register_all_PluginOneSignalJS_helper(se::Object* obj)
{
    auto pluginValue = sdkbox::getPluginValue(obj, "sdkbox.PluginOneSignal");
    auto plugin = pluginValue.toObject();
    plugin->defineFunction("setListener", _SE(js_PluginOneSignalJS_setListener));
    onesignal_register_constants(plugin);

    se::ScriptEngine::getInstance()->clearException();
    return true;
}


