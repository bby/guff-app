package com.label.guff;

import java.io.FileOutputStream;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import android.content.Context;
import android.content.SharedPreferences;

public class PushNotificationPlugin extends Plugin {

	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		// TODO Auto-generated method stub
		//try {
            if (action.equals("getToken")) {
            	
            	SharedPreferences settings = ctx.getSharedPreferences("guffPref", 0);
                String regID = settings.getString("tokenID", "");

            	/*FileOutputStream fos = openFileOutput(FILENAME, Context.MODE_PRIVATE);
            	fos.write(string.getBytes());
            	fos.close();*/
            	
                String echo = regID; 
                if (echo != null && echo.length() > 0) { 
                    return new PluginResult(PluginResult.Status.OK, echo);
                } else {
                    return new PluginResult(PluginResult.Status.ERROR);
                }
            } else {
                return new PluginResult(PluginResult.Status.INVALID_ACTION);
            }
		//}
	}

}
