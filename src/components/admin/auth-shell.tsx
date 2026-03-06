import type { ReactNode } from "react";
import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminAuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AdminAuthShell({ title, description, children }: AdminAuthShellProps) {
  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#F6F3EA] px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(254,191,4,0.18),_transparent_42%),linear-gradient(180deg,_rgba(6,43,104,0.06),_transparent_36%)]" />
      <div className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.1fr)_28rem]">
          <div className="hidden rounded-[2rem] border border-white/70 bg-[#062B68] p-10 text-white shadow-[0_32px_80px_rgba(6,43,104,0.18)] lg:block">
            <SiteLogo variant="navbar" />
            <div className="mt-16 max-w-md space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FEBF04]">Admin Portal</p>
              <h1 className="text-4xl font-semibold leading-tight">Private access for TrustEdge operations.</h1>
              <p className="text-base leading-7 text-white/78">
                Sign in with the private admin credentials to review leads, clients, and booking activity.
              </p>
            </div>
          </div>

          <Card className="border-slate-200 bg-white/95 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <CardHeader className="space-y-3">
              <div className="lg:hidden">
                <SiteLogo variant="icon" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#062B68]">TrustEdge Admin</p>
                <CardTitle className="mt-3 text-2xl text-[#062B68]">{title}</CardTitle>
                <CardDescription className="mt-2 text-sm leading-6 text-slate-600">{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">{children}</CardContent>
          </Card>
        </div>
      </div>
      <div className="relative mx-auto mt-6 max-w-5xl text-center text-sm text-slate-500">
        <Link className="underline decoration-slate-300 underline-offset-4 hover:text-slate-700" href="/">
          Return to site
        </Link>
      </div>
    </section>
  );
}
