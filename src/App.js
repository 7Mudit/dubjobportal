import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  useUser
} from "@clerk/clerk-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function PublicPage() {
  const { isSignedIn } = useUser();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <h1 className="text-[80px] text-white font-bold mb-5">
        Job Portal Apply For Jobs Now!!!
      </h1>
      <a
        href="/protected"
        className="text-white underline hover:text-purple-200"
      >
      <button className="self-end text-[#D33852] bg-white items-center px-[16px] py-[13px] gap-[8px] font-semibold rounded-[8px]">
        {!isSignedIn ? "Wanna create an account?": "Dashboard"}
      </button>
      </a>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path="/" element={<PublicPage />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="flex w-screen h-screen items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex w-screen h-screen items-center justify-center">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />
        <Route
          path="/protected"
          element={
            <>
              <SignedIn>
                <HomePage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return <ClerkProviderWithRoutes />;
}

export default App;
