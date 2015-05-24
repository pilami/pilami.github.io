//
//  mynavigationcontroller.h
//  LogInAndSignUpDemo
//
//  Created by Sai Chaitanya Manchikatla on 03/04/15.
//
//

#ifndef LogInAndSignUpDemo_mynavigationcontroller_h
#define LogInAndSignUpDemo_mynavigationcontroller_h

@interface NavTestAppDelegate : NSObject <UIApplicationDelegate> {
    UIWindow *window;
    
    UINavigationController *navController;
}

@property (nonatomic, retain) UINavigationController *navController;
@property (nonatomic, retain) IBOutlet UIWindow *window;

@end

#endif
