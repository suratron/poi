(function() {
    // Configuration: Both set to "hi"
    const FAKE_USERNAME = "hi";
    const FAKE_DISPLAY_NAME = "hi";

    const interval = setInterval(() => {
        if (window.metro && window.metro.findByProps) {
            clearInterval(interval);
            try {
                const UserStore = window.metro.findByProps("getCurrentUser");
                if (UserStore && UserStore.getCurrentUser) {
                    const originalGetCurrentUser = UserStore.getCurrentUser;
                    UserStore.getCurrentUser = function(...args) {
                        const user = originalGetCurrentUser.apply(this, args);
                        if (user) {
                            user.username = FAKE_USERNAME;
                            user.globalName = FAKE_DISPLAY_NAME;
                        }
                        return user;
                    };
                }

                const UserModule = window.metro.findByProps("getUser") || UserStore;
                if (UserModule && UserModule.getCurrentUser) {
                    const myUser = UserModule.getCurrentUser();
                    if (myUser && myUser.id) {
                        const myId = myUser.id;
                        const originalGetUser = UserModule.getUser;
                        UserModule.getUser = function(id, ...args) {
                            const user = originalGetUser.apply(this, [id, ...args]);
                            if (user && user.id === myId) {
                                user.username = FAKE_USERNAME;
                                user.globalName = FAKE_DISPLAY_NAME;
                            }
                            return user;
                        };
                    }
                }
                console.log("[KettuTweak] Identity forced to 'hi' successfully!");
            } catch (e) {
                console.error("[KettuTweak] Injection error: ", e);
            }
        }
    }, 100);
})();
