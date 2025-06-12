"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RegistrationWizard } from "./components/RegistrationWizard";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <RegistrationWizard />
    </div>
  );
}
