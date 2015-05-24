//
//  AppDelegate.h
//  LogInAndSignUpDemo
//
//  Created by Mattieu Gamache-Asselin on 6/14/12.
//  Copyright (c) 2013 Parse. All rights reserved.
//

@interface AppDelegate : UIResponder <UIApplicationDelegate>{

    UIWindow *window;
    UINavigationController *navController;
}
@property (nonatomic, retain) UINavigationController *navController;
@property (nonatomic, retain) IBOutlet UIWindow *window;
@end
