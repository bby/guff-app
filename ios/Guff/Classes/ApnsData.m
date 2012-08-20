//
//  ApnsData.m
//  Guff
//
//  Created by Ben on 17/08/2012.
//
//

#import "ApnsData.h"

@implementation ApnsData

@synthesize devToken;

- (id) init {
    
    
    
    self = [super init];
    
    if (self) {
        
        /*NSString *errorDesc = nil;
        
        NSPropertyListFormat format;
        
        NSString *plistPath;
        
       /* NSString *rootPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,
                                                                  
                                                                  NSUserDomainMask, YES) objectAtIndex:0];
        */
        /*NSString *rootPath = [[NSBundle mainBundle] bundlePath];
        
        //plistPath = [rootPath stringByAppendingPathComponent:@"Apns.plist"];
        plistPath = [rootPath stringByAppendingPathComponent:@"Info.plist"];
        
        if (![[NSFileManager defaultManager] fileExistsAtPath:plistPath]) {
            
            plistPath = [[NSBundle mainBundle] pathForResource:@"Data" ofType:@"plist"];
            
        }
        
        NSData *plistXML = [[NSFileManager defaultManager] contentsAtPath:plistPath];
        
        NSDictionary *temp = (NSDictionary *)[NSPropertyListSerialization
                                              
                                              propertyListFromData:plistXML
                                              
                                              mutabilityOption:NSPropertyListMutableContainersAndLeaves
                                              
                                              format:&format
                                              
                                              errorDescription:&errorDesc];
        
        if (!temp) {
            
            NSLog(@"Error reading plist: %@, format: %d", errorDesc, format);
            
        }
        
        self.devToken = [temp objectForKey:@"devToken"];
                
    }*/
        
       /* NSError *error;
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES); //1
        NSString *documentsDirectory = [paths objectAtIndex:0]; //2
        NSString *path = [documentsDirectory stringByAppendingPathComponent:@"Guff-Apns.plist"]; //3
        
        NSFileManager *fileManager = [NSFileManager defaultManager];
        
        if (![fileManager fileExistsAtPath: path]) //4
        {
            NSString *bundle = [[NSBundle mainBundle] pathForResource:@"data" ofType:@"plist"];

            [fileManager copyItemAtPath:bundle toPath: path error:&error]; //6
        }
        
        NSMutableDictionary *data = [[NSMutableDictionary alloc] initWithContentsOfFile: path];
        
        //here add elements to data file and write data to file
        NSString *value = @"1234567890";

        
//        [data setValue:[NSString stringWithFormat:@value] forKey:@”devToken”];
        [data setValue:value forKey:@"devToken"];
        [data writeToFile: path atomically:YES];
        [data release];
        
        
        NSMutableDictionary *savedStock = [[NSMutableDictionary alloc] initWithContentsOfFile: path];
        
        //load from savedStock example int value
        self.devToken = [savedStock objectForKey:@"devToken"] ;
        
        [savedStock release];*/
        
        NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString *documentsDirectory = [paths objectAtIndex:0];
        NSString *path = [documentsDirectory stringByAppendingPathComponent:@"plist.plist"];
        NSFileManager *fileManager = [NSFileManager defaultManager];
        
        if (![fileManager fileExistsAtPath: path])
        {
            path = [documentsDirectory stringByAppendingPathComponent: [NSString stringWithFormat: @"plist.plist"] ];
        }
        
        NSMutableDictionary *data = [[NSMutableDictionary alloc] initWithContentsOfFile: path];
        
        
        //NSFileManager *fileManager = [NSFileManager defaultManager];
        //NSMutableDictionary *data;
        
        if ([fileManager fileExistsAtPath: path])
        {
            data = [[NSMutableDictionary alloc] initWithContentsOfFile: path];
        }
        else
        {
            // If the file doesn’t exist, create an empty dictionary
            data = [[NSMutableDictionary alloc] init];
        }
        
        //To insert the data into the plist
        /*[data setValue:@"1234567890" forKey:@"devToken"];
        [data writeToFile: path atomically:YES];
        [data release];*/
        
        //To reterive the data from the plist
        NSMutableDictionary *savedStock = [[NSMutableDictionary alloc] initWithContentsOfFile: path];

        self.devToken = [savedStock objectForKey:@"devToken"];
        
        [savedStock release];
        

    }
    
    return self;
    
}



@end