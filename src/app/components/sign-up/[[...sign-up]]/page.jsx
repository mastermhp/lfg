import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/"
      />
    </div>
  );
}

