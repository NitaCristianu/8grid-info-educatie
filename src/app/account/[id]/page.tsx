"use client"
import { redirect } from "next/navigation";
import ExitButton from "../../login/components/upperTab";
import AccountPageClient from "./components/AccountPageClient";
import { useEffect, useState } from "react";

export default function Home(props: { params: { id: string } }) {
  const userId = props.params.id;
  const [isClient, setIsClient] = useState(false);
  // the container of necessary account elements
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  // only render client wise

  return (
    <>
      <AccountPageClient
        UserId={userId}
      />
      <ExitButton />
    </>
  );
}
