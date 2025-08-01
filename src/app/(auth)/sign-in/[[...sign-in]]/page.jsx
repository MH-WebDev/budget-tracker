import { SignIn } from "@clerk/nextjs";
// This page is used to render the sign-in component from Clerk
// It is wrapped in a div to center it on the page
export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
