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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import WithAuth from "@/components/auth-guards/WithAuth";

const FormSchema = z
  .object({
    fullname: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

function ViewUser() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/experts`,
        data
      );
      if (response) {
        console.log(response);
        router.push("/admin/experts");
        toast.success("New Expert Added Successfully");
      } else {
        toast.warning("New Expert Added Unsuccessfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Adding Expert Failed");
    }
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-6 rounded-xl border shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold">
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eg: Ananthu M A"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eg: ananthu@gmail.com"
                        {...field}
                        type="email"
                        className="w-full"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eg: P@55word"
                        {...field}
                        type="password"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Eg: P@55word"
                        {...field}
                        type="password"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardContent>
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>

      <Card className="w-full max-w-md mx-auto p-4 sm:p-6 my-6 rounded-xl border shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold">Account Actions</h2>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={() => router.push("")}
            variant="outline"
            className="w-full"
          >
            Clear Interview History
          </Button>
          <Button
            onClick={() => router.push("")}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </>
  );
}

export default WithAuth(ViewUser);