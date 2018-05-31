//
//  RNBridgeModuleManager.m
//  wmt
//
//  Created by fei ye on 06/07/2017.
//  Copyright © 2017 xianqu. All rights reserved.
//

#import "RNToastiOSManager.h"
#import "MLProgressHUD.h"

@implementation RNToastiOSManager

RCT_EXPORT_MODULE(ToastiOS);

RCT_EXPORT_METHOD(show:(NSString *)message duration:(nonnull NSNumber *)duration) {

   [MLProgressHUD showOnView:[UIApplication sharedApplication].delegate.window
                     message:nil
               detailMessage:message
                  customView:nil
      userInteractionEnabled:NO
                     yOffset:-50.0f
                   hideDelay:duration.floatValue];
}

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (NSDictionary<NSString *,id> *)constantsToExport {
    return @{
             @"SHORT": @(1.5f),
             @"LONG": @(3.0f)
             };
}

@end
