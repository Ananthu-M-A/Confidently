"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/auth/AdminAuthContext";

const FormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      {
        message:
          "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
});

export default function LoginPage() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, admin } = useAdminAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await login(data.email, data.password);
      console.log("Admin logged in");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  useEffect(() => {
    if (admin) {
      router.push("/admin");
    } else {
      setIsLoading(false);
    }
  }, [admin, router]);

  return (
    <>
      {!isLoading && (
        <Card className="max-w-lg w-full mx-auto px-4 py-2 my-4 rounded-xl border-2 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <CardHeader>
                <CardTitle className="text-3xl text-center">
                  Confidently Admin Login
                </CardTitle>
                <h1 className="text-xs text-center">
                  Enter your credentials to access your account
                </h1>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold p-1">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eg:- ananthu@gmail.com"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold p-1">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Eg:- P@55word"
                          {...field}
                          type={isChecked ? "text" : "password"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardContent className="text-center">
                <CardContent className="flex justify-between text-center p-1">
                  <Label className="flex text-xs font-semibold p-1">
                    <Input
                      type="checkbox"
                      className="w-4"
                      checked={isChecked}
                      onChange={() => setIsChecked(!isChecked)}
                      aria-label="Show Password"
                    />
                    <Label className="py-3 px-1">Show Password</Label>
                  </Label>
                  <Button type="submit" className="font-bold">
                    Log In
                  </Button>
                </CardContent>
              </CardContent>
            </form>
          </Form>
        </Card>
      )}
    </>
  );
}
