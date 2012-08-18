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
        
        NSString *errorDesc = nil;
        
        NSPropertyListFormat format;
        
        NSString *plistPath;
        
       /* NSString *rootPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,
                                                                  
                                                                  NSUserDomainMask, YES) objectAtIndex:0];
        */
        NSString *rootPath = [[NSBundle mainBundle] bundlePath];
        
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
                
    }
    
    return self;
    
}

- (void) save {
    
}

@end
