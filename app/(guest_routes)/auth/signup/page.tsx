"use client";
import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Button, Input } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@app/utils/formikHelpers";
import { toast } from "react-toastify";
import Link from "next/link";

const validationSchema = yup.object().shape({
  name: yup.string().required("Your name is required."),
  email: yup
    .string()
    .email("Invalid email.")
    .required("A valid email is required."),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters.")
    .required("A password is required."),
});

export default function SignUp() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values, action) => {
      action.setSubmitting(true);
      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      }).then(async (res) => {
        if (res.ok) {
          const { message } = (await res.json()) as { message: string };
          toast.success(message);
        }
        action.setSubmitting(false);
      });
    },
  });

  const touchedKeys = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });
  const finalErrors: string[] = [];

  Object.entries(errors).forEach(([key, value]) => {
    if (touchedKeys.includes(key) && value) finalErrors.push(value);
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  const { email, name, password } = values;

  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Register a New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onBlur={handleBlur}
        onChange={handleChange}
        value={name}
        error={error("name")}
        crossOrigin=""
      />
      <Input
        name="email"
        label="Email"
        onBlur={handleBlur}
        onChange={handleChange}
        value={email}
        error={error("email")}
        crossOrigin=""
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
        error={error("password")}
        crossOrigin=""
      />
      <Button disabled={isSubmitting} type="submit" className="w-full">
        Sign up
      </Button>

      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Sign In</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>

      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
