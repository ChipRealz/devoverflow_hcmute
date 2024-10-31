import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Page = () => {
  return (
    <>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardDescription>
              Home of the managers!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to the manager dashboard. Here, you can manage content, review reports, and perform other moderation tasks specific to your role.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Alert>
          <Terminal className="size-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Keep up the great work, managers! Your efforts make our community a better place every day!
          </AlertDescription>
        </Alert>
        <div className="mt-8 flex justify-center space-x-10 max-sm:w-full">
          <Link href="/dashboard/admin" className="flex max-sm:w-full">
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
              Admin Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/moderator" className="flex max-sm:w-full">
            <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
              Moderator Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Page;
