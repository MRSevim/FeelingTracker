"use client";

import Link from "next/link";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn/card";
import { XCircle } from "lucide-react";
import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="mt-20">
      <Card className="w-xs text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <XCircle className="w-12 h-12 text-gray-500" />
          </div>
          <CardTitle>Not Found</CardTitle>
          <CardDescription>
            Could not find the requested resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </Container>
  );
}
