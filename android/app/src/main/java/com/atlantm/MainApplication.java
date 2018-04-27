package com.atlantm;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.sudoplz.reactnativeamplitudeanalytics.RNAmplitudeSDKPackage;
import me.jhen.devsettings.DevSettingsPackage;
import io.sentry.RNSentryPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new GoogleAnalyticsBridgePackage(),
          new RNAmplitudeSDKPackage(MainApplication.this),
          new DevSettingsPackage(),
          new RNSentryPackage(MainApplication.this),
          new PickerPackage(),
          new FIRMessagingPackage(),
          new SplashScreenReactPackage(),
          new RNDeviceInfo(),
          new MapsPackage(),
          new VectorIconsPackage(),
          new RNFetchBlobPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
