import { Suspense } from "react";
import ProfileClientPage from "./ProfileClientPage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { createServerSupabase } from "@/lib/supabase/server";
import { profileServerService } from "@/services/profile/profileServerService";
import { orderServerService } from "@/services/order/orderServerService";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createServerSupabase();

  // Check if user is authenticated via real Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If no real Supabase user, redirect to login
  if (!user) {
    redirect('/auth');
  }

  // Fetch initial data for real Supabase users
  const [profile, orders] = await Promise.all([
    profileServerService.getProfileById(user.id),
    orderServerService.getOrders(user.id),
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileClientPage
        initialProfile={profile}
        initialOrders={orders || []}
        user={user}
      />
    </Suspense>
  );
}
