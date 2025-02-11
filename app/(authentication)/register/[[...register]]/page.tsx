// app/register/page.tsx
import SignupWizard from './SignupWizard';


export default function RegisterPage() {
  return (
    // <div className="relative min-h-screen">
    //   <div className="absolute top-1/4 w-full max-w-full px-3 text-center flex-0">
    //     <p className="mt-12 text-3xl">Build Your Profile</p>
    //     <p className="text-xl font-normal dark:text-white text-slate-400">
    //       This information will let us know more about you.
    //     </p>
        
    //   </div>
    // </div>

    <SignupWizard />
  );
}
