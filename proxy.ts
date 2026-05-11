import { NextResponse, type NextRequest } from 'next/server'

// TODO: Re-enable Supabase auth guard when sign-in/sign-up is ready.
// Uncomment the block below and restore the imports:
//
// import { createServerClient } from '@supabase/ssr'
//
// export async function proxy(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request })
//
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() { return request.cookies.getAll() },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
//           supabaseResponse = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set(name, value, options)
//           )
//         },
//       },
//     }
//   )
//
//   // Must use getUser() not getSession() to avoid stale sessions
//   const { data: { user } } = await supabase.auth.getUser()
//   const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
//   if (!user && !isAuthRoute) return NextResponse.redirect(new URL('/auth/login', request.url))
//   if (user && request.nextUrl.pathname === '/auth/login') return NextResponse.redirect(new URL('/dashboard', request.url))
//   return supabaseResponse
// }

export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|.*\\.png|.*\\.svg).*)',
  ],
}
