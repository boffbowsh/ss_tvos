//
//  AppDelegate.swift
//  SmoothStreams
//
//  Created by Paul Bowsher on 07/01/2016.
//  Copyright © 2016 Boffbowsh. All rights reserved.
//

import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

    var window: UIWindow?
    var appController: TVApplicationController?
    //    static let TVBootURL = "http://127.0.0.1:8000/dist/index.js"
    static let TVBootURL = "https://s3-eu-west-1.amazonaws.com/ss-tvos/index.js"

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        window = UIWindow(frame: UIScreen.main.bounds)
        
        // 1
        let appControllerContext = TVApplicationControllerContext()
        
        // 2
        guard let javaScriptURL = URL(string: AppDelegate.TVBootURL) else {
            fatalError("unable to create NSURL")
        }
        appControllerContext.javaScriptApplicationURL = javaScriptURL
        
        // 3
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        return true
    }

}

