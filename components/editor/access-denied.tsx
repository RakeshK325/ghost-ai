import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-base bg-[radial-gradient(rgba(42,42,48,0.45)_1px,transparent_1px)] [background-size:24px_24px] p-4 select-none">
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-state-error/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <Card className="w-full max-w-md relative z-10 border border-border-default bg-bg-surface/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-border-default bg-bg-elevated/80 text-state-error shadow-[0_8px_32px_rgba(0,0,0,0.4)] drop-shadow-[0_0_12px_rgba(255,77,79,0.12)]">
            <Lock className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight text-text-primary mb-1">
            Access Denied
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            You don't have permission to access this collaborative workspace, or the project does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-xs text-text-muted px-6 pb-4">
          Please verify the URL or ask the project owner to add you as a collaborator using your primary Clerk email.
        </CardContent>
        <CardFooter className="flex justify-center p-6 pt-0 mt-2">
          <Button asChild className="h-10 px-5 font-semibold gap-2 rounded-xl text-xs shadow-[0_0_16px_rgba(0,200,212,0.15)] hover:shadow-[0_0_24px_rgba(0,200,212,0.3)] hover:scale-102 transition-all duration-300 cursor-pointer">
            <Link href="/editor">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Editor Home</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
