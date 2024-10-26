import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

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
      </div>
    </>
  );
};

export default Page;
