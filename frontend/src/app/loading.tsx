import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <Card className="flex justify-center text-center border-0 shadow-none">
      <CardHeader className="my-20 p-20">
        <CardTitle className="text-4xl" aria-live="polite">
          Loading...
        </CardTitle>
      </CardHeader>
    </Card>
  );
}