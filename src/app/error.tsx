"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn/card";
import { AlertTriangle } from "lucide-react";
import Container from "@/components/Container";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container>
      <Card className="w-xs mt-20 text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <CardTitle>Something went wrong!</CardTitle>
          <CardDescription>
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button variant="destructive" onClick={() => reset()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
