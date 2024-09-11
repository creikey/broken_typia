import { AuthenticatedUser, SignInWithGoogleRequest, SignInWithGoogleResponse } from "types";
import GoogleSignInButton from "./GoogleSignInButton";
import { API_URL } from './global';
import { useState } from "react";
import { json } from 'typia';
import logo from './assets/footer-logo.svg';
import { UserState } from './global.tsx';

function SignIn({ setUserState, back, userState }: { setUserState: (state: UserState) => void, back: () => void, userState: UserState }) {
    const [error, setError] = useState(false);

    const loginWithGoogle = async (credential: string) => {
        try {
            const response = await fetch(
                API_URL,
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            api: "sign_in_with_google",
                            encodedJwt: credential,
                        } as SignInWithGoogleRequest
                    ),
                }
            )
                .then((response) => response.text())
                .then((response) => json.assertParse<SignInWithGoogleResponse>(response));
            setUserState({ state: "logged_in", user: response.user });
            setError(false);
        } catch (error) {
            setUserState({ state: "no_account" });
            console.error(`Failed to sign into google: ${error}`);
            setError(true);
        }
    }

    return (
        <div className="flex flex-col h-full w-full justify-center items-center relative left-0 top-0">
            <button className="rounded-2xl bg-stone-100 p-2 pl-4 pr-4 absolute top-5 left-5 font-serif" onClick={back}>Back</button>
            <img src={logo} width={200} className="" />
            <hr className="text-black w-1/2 m-10" />
            {userState.state === "logged_in" ? (
                <p>Welcome, {userState.user.name}</p>
            ) : (
                <>
                    {userState.state === "indeterminate" ? (
                        <p>Loading...</p>
                    ) : (
                        <GoogleSignInButton onCredential={loginWithGoogle} />
                    )}
                    {error && (
                        <p>Failed to sign in, try again</p>
                    )}
                </>
            )
            }
        </div>
    )
}

export default SignIn;