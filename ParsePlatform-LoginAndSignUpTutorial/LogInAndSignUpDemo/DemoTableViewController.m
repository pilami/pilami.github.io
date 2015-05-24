//
//  DemoTableViewController.m
//  LogInAndSignUpDemo
//
//  Created by Mattieu Gamache-Asselin on 6/14/12.
//  Copyright (c) 2013 Parse. All rights reserved.
//

#import "DemoTableViewController.h"


@implementation DemoTableViewController

- (id)initWithStyle:(UITableViewStyle)style {
    self = [super initWithStyle:style];
    if (self) {
        // This table displays items in the Todo class
//        self.className = @"Todo";
//        self.pullToRefreshEnabled = YES;
//        self.paginationEnabled = NO;
//        self.objectsPerPage = 25;
    }
    return self;
}


- (UITableViewCell *)tableView:(UITableView *)tableView
cellForRowAtIndexPath:(NSIndexPath *)indexPath
object:(PFObject *)object {
    static NSString *CellIdentifier = @"Cell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier];
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle
                                      reuseIdentifier:CellIdentifier];
    }
    
    // Configure the cell to show todo item with a priority at the bottom
    cell.textLabel.text = [object objectForKey:@"Title"];
    cell.detailTextLabel.text = [NSString stringWithFormat:@"Priority: %@",
                                 [object objectForKey:@"priority"]];
    
    return cell;
}
@end