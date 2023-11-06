import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

export function Login(){
    // const onSuccess = (res:string) =>{
    //     return(res);
    // }
    return(
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <GoogleOAuthProvider clientId={"714705534835-hrd7qt2vn5uhf0ljddbjrgpjbivpbhog.apps.googleusercontent.com"}>
                <InnerOAuth />
            </GoogleOAuthProvider>
        </div>
    );
}

function InnerOAuth(){
    const useLogin =  useGoogleLogin({
        onSuccess: (codeResponse) => console.log(codeResponse),
        flow: 'auth-code',
        redirect_uri: `${window.location.origin}/auth/callback`,
        ux_mode: 'redirect',
      });
    return(
        <button onClick={() => useLogin()}>Google Login</button>
    );
}