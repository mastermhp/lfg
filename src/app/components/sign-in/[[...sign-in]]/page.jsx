import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
      />
    </div>
  );
}

