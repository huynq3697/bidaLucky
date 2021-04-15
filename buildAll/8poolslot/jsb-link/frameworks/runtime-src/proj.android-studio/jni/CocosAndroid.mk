LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := hellojavascript/main.cpp \
../../Classes/AppDelegate.cpp \
../../Classes/jsb_module_register.cpp \
../../Classes/PluginIAPJS.cpp \
../../Classes/PluginIAPJSHelper.cpp \
../../Classes/SDKBoxJSHelper.cpp \
../../Classes/PluginSdkboxPlayJS.cpp \
../../Classes/PluginSdkboxPlayJSHelper.cpp \
../../Classes/PluginFirebaseJS.cpp \
../../Classes/PluginFirebaseJSHelper.cpp \
../../Classes/PluginSdkboxAdsJS.cpp \
../../Classes/PluginSdkboxAdsJSHelper.cpp \
../../Classes/PluginAdMobJS.cpp \
../../Classes/PluginAdMobJSHelper.cpp \
../../Classes/PluginOneSignalJS.cpp \
../../Classes/PluginOneSignalJSHelper.cpp
LOCAL_CPPFLAGS := -DSDKBOX_ENABLED \
-DSDKBOX_COCOS_CREATOR
LOCAL_LDLIBS := -landroid \
-llog
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes
LOCAL_WHOLE_STATIC_LIBRARIES += PluginIAP
LOCAL_WHOLE_STATIC_LIBRARIES += sdkbox
LOCAL_WHOLE_STATIC_LIBRARIES += PluginSdkboxPlay
LOCAL_WHOLE_STATIC_LIBRARIES += PluginFirebase
LOCAL_WHOLE_STATIC_LIBRARIES += PluginSdkboxAds
LOCAL_WHOLE_STATIC_LIBRARIES += PluginAdMob
LOCAL_WHOLE_STATIC_LIBRARIES += PluginOneSignal

LOCAL_STATIC_LIBRARIES := cocos2dx_static

include $(BUILD_SHARED_LIBRARY)
$(call import-add-path, $(LOCAL_PATH))

$(call import-module, cocos)
$(call import-module, ./sdkbox)
$(call import-module, ./PluginIAP)
$(call import-module, ./PluginSdkboxPlay)
$(call import-module, ./PluginFirebase)
$(call import-module, ./PluginSdkboxAds)
$(call import-module, ./PluginAdMob)
$(call import-module, ./PluginOneSignal)
