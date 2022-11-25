export default function SplashScreen() {


    return (
            <div id="splash-screen">
                <div id="playlister">
                PLAYLISTER
                </div>
                <div id="playlister-purpose-statement">
                    For all of your spotify needs! 
                </div>
                <div id="splash-screen-buttons">
                    <a href="/register/">
                        <button id="createAccount">
                        Create an Account
                        </button>
                    </a>
                    < a href="/login/">
                        <button id="continueAsGuest">
                        Continue as Guest
                        </button>
                    </a>
                    < a href="/login/">
                        <button id="login">
                        Login
                        </button>
                    </a>
                </div>
            </div>
    )
}