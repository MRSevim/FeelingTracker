import { Card, CardContent } from "@/components/shadcn/card";
import GoogleSignIn from "./GoogleSignIn";
import { Lock } from "lucide-react"; // optional icon

export default function SignInCard() {
  return (
    <Card className="max-w-md mx-auto mb-30">
      <CardContent className="flex flex-col items-center gap-4">
        {/* Google Sign-In */}
        <div className="mb-4 w-full">
          <GoogleSignIn />
        </div>

        {/* Privacy Note */}
        <div className="flex items-center text-center text-sm text-muted-foreground gap-2">
          <Lock className="w-4 h-4" />
          <span>Your mood data is private and secure. Only you can see it.</span>
        </div>
      </CardContent>
    </Card>
  );