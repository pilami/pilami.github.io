//
//  DefaultSettingsViewController.h
//  LogInAndSignUpDemo
//
//  Created by Mattieu Gamache-Asselin on 6/14/12.
//  Copyright (c) 2013 Parse. All rights reserved.
//

@interface DefaultSettingsViewController : UIViewController <PFLogInViewControllerDelegate, PFSignUpViewControllerDelegate, UITextFieldDelegate>
@property (weak, nonatomic) IBOutlet UITextField *mysearchfield;

@property (nonatomic, strong) IBOutlet UILabel *welcomeLabel;

- (IBAction)logOutButtonTapAction:(id)sender;
- (IBAction)listAllButtonTapAction:(id)sender;

@end
