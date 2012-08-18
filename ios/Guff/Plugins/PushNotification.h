//
//  PushNotification.h
//  Guff
//
//  Created by Ben on 17/08/2012.
//
//

#import <Cordova/CDVPlugin.h>

@interface PushNotification : CDVPlugin
- (void) getToken:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
