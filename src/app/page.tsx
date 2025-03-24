"use client";
import { Button } from "@/components/ui/button";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { useAuthActions } from "@convex-dev/auth/react";

const Home = () => {
  // return <AuthScreen />;
  const { signOut } = useAuthActions();
  return (
    <div>
      Home
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default Home;
