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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "./ui/label";
import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

const FormSchema = z
  .object({
    fullname: z.string().min(1, { message: "Name is required" }),
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
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        {
          message:
            "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export function SignupForm() {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit() {}

  return (
    <Card className="w-2/5 mx-auto px-4 py-2 my-4 rounded-xl border-2 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Sign Up for Confidently
            </CardTitle>
            <h1 className="text-xs text-center">
              Create your account to start improving your interview skills
            </h1>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold p-1">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Eg:- Ananthu M A"
                      {...field}
                      type="text"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold p-1">
                    Confirm Password
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
                Sign Up
              </Button>
            </CardContent>
          </CardContent>
        </form>
      </Form>
      <h1 className="text-sm text-center">Or sign up with</h1>
      <CardContent className="flex gap-10 justify-center pt-3">
        <Button variant="outline" className="border border-black font-semibold">
          <FaGoogle className="text-red-600" />
          Google
        </Button>
        <Button variant="outline" className="border border-black font-semibold">
          <FaLinkedinIn className="text-blue-600" />
          LinkedIn
        </Button>
      </CardContent>
      <CardContent className="text-center">
        <CardDescription>
          Already have an account ?
          <Link
            className="font-semibold hover:text-black hover:underline"
            href="/login"
          >
            Login Now
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
}