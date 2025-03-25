import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 bg-surface border border-gray-800">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-text-primary">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-text-secondary mb-6">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link href="/">
            <Button className="w-full">
              <i className="fas fa-home mr-2"></i> Return to Homepage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
