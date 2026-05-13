import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseEnv, getSupabaseEnv } from "@/lib/env";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isEmployeeRoute = pathname.startsWith("/employee");
  const isCustomerRoute = pathname.startsWith("/dashboard");
  const isPrivateRoute = isAdminRoute || isEmployeeRoute || isCustomerRoute;

  if (!hasSupabaseEnv()) {
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabaseEnv();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (isPrivateRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPrivateRoute && user) {
    const { data: profile } = await supabase.from("users_profile").select("role").eq("auth_user_id", user.id).single();
    const role = profile?.role;

    if (isAdminRoute && !["admin", "manager"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isEmployeeRoute && !["employee", "admin", "manager"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
